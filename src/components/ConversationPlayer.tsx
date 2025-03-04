import React, { useState, useEffect, useRef } from 'react';
import { Conversation, ConversationLine } from '../types';
import AudioPlayer, { AudioPlayerRef } from './AudioPlayer';
import Image from 'next/image';
import { getProperCharacterName } from '@/utils/characterNames';
import { getPortraitFileName } from '@/utils/portraitMapping';

// Declare the webkitAudioContext for Safari support
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface ConversationPlayerProps {
  conversation: Conversation;
}

const ConversationPlayer: React.FC<ConversationPlayerProps> = ({ conversation }) => {
  const [selectedVariations, setSelectedVariations] = useState<Record<number, number>>({});
  const [playingLineIndex, setPlayingLineIndex] = useState<number | null>(null);
  const [playingAll, setPlayingAll] = useState(false);
  const [sortedLines, setSortedLines] = useState<ConversationLine[]>([]);
  const [isGeneratingDownload, setIsGeneratingDownload] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioPlayerRefs = useRef<(AudioPlayerRef | null)[]>([]);

  // Get proper display names for characters
  const char1DisplayName = getProperCharacterName(conversation.character1);
  const char2DisplayName = getProperCharacterName(conversation.character2);

  // Group lines by part and select default variations
  useEffect(() => {
    const linesByPart: Record<number, ConversationLine[]> = {};
    
    // Group lines by part
    conversation.lines.forEach(line => {
      if (!linesByPart[line.part]) {
        linesByPart[line.part] = [];
      }
      linesByPart[line.part].push(line);
    });
    
    // Select default variations (first one for each part)
    const defaultVariations: Record<number, number> = {};
    Object.entries(linesByPart).forEach(([part, lines]) => {
      defaultVariations[parseInt(part)] = lines[0].variation;
    });
    
    setSelectedVariations(defaultVariations);
  }, [conversation]);

  // Sort lines by part number and filter to only show selected variations
  useEffect(() => {
    const selected = conversation.lines
      .filter(line => line.variation === selectedVariations[line.part])
      .sort((a, b) => a.part - b.part);
    
    setSortedLines(selected);
  }, [conversation, selectedVariations]);

  // Handle playing all lines in sequence
  useEffect(() => {
    if (!playingAll) {
      return;
    }

    if (playingLineIndex === null && sortedLines.length > 0) {
      // Start playing from the first line
      setPlayingLineIndex(0);
    }
  }, [playingAll, playingLineIndex, sortedLines]);

  const handleLinePlayStateChange = (index: number, isPlaying: boolean) => {
    if (isPlaying) {
      setPlayingLineIndex(index);
    } else if (playingLineIndex === index) {
      // If we're playing all lines and the current line finished
      if (playingAll && index < sortedLines.length - 1) {
        // Move to the next line
        setPlayingLineIndex(index + 1);
      } else if (playingAll) {
        // End of conversation
        setPlayingAll(false);
        setPlayingLineIndex(null);
      } else {
        // Just stop the current line
        setPlayingLineIndex(null);
      }
    }
  };

  const handlePlayAll = () => {
    if (playingAll) {
      // Stop playing
      setPlayingAll(false);
      setPlayingLineIndex(null);
    } else {
      // Start playing from the beginning
      setPlayingAll(true);
      setPlayingLineIndex(0);
      
      // Reset all audio players to 0 progress using refs
      audioPlayerRefs.current.forEach(ref => {
        if (ref) {
          ref.reset();
        }
      });
    }
  };

  const handleVariationChange = (part: number, variation: number) => {
    setSelectedVariations(prev => ({
      ...prev,
      [part]: variation
    }));
  };

  // Function to fetch an audio file and decode it
  const fetchAndDecodeAudio = async (url: string, audioContext: AudioContext): Promise<AudioBuffer> => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  };

  // Function to download the stitched conversation
  const handleDownloadConversation = async () => {
    if (sortedLines.length === 0 || isGeneratingDownload) return;
    
    setIsGeneratingDownload(true);
    setDownloadProgress(0);
    
    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const audioBuffers: AudioBuffer[] = [];
      
      // Fetch and decode all audio files
      for (let i = 0; i < sortedLines.length; i++) {
        const line = sortedLines[i];
        const audioUrl = `/audioFiles/${line.filename}`;
        
        try {
          const buffer = await fetchAndDecodeAudio(audioUrl, audioContext);
          audioBuffers.push(buffer);
        } catch (error) {
          console.error(`Error loading audio for line ${i}:`, error);
        }
        
        // Update progress
        setDownloadProgress(Math.round(((i + 1) / sortedLines.length) * 100));
      }
      
      // Calculate total duration
      const totalDuration = audioBuffers.reduce((acc, buffer) => acc + buffer.duration, 0);
      
      // Create a new buffer for the combined audio
      const combinedBuffer = audioContext.createBuffer(
        audioBuffers[0].numberOfChannels,
        audioContext.sampleRate * totalDuration,
        audioContext.sampleRate
      );
      
      // Copy each buffer into the combined buffer
      let offset = 0;
      for (const buffer of audioBuffers) {
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          const channelData = buffer.getChannelData(channel);
          combinedBuffer.copyToChannel(channelData, channel, Math.floor(offset * audioContext.sampleRate));
        }
        offset += buffer.duration;
      }
      
      // Convert the combined buffer to a WAV file
      const wavBlob = bufferToWav(combinedBuffer, audioContext.sampleRate);
      
      // Create a download link
      const url = URL.createObjectURL(wavBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${conversation.character1}_${conversation.character2}_conversation.wav`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      setIsGeneratingDownload(false);
      setDownloadProgress(0);
      
    } catch (error) {
      console.error('Error generating download:', error);
      setIsGeneratingDownload(false);
      setDownloadProgress(0);
      alert('Error generating download. Please try again.');
    }
  };
  
  // Function to convert AudioBuffer to WAV format
  const bufferToWav = (buffer: AudioBuffer, sampleRate: number): Blob => {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2;
    const outputBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(outputBuffer);
    
    // Write WAV header
    // "RIFF" chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, 'WAVE');
    
    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // audio format (1 for PCM)
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChannels * 2, true); // byte rate
    view.setUint16(32, numOfChannels * 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    
    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, length, true);
    
    // Write audio data
    const offset = 44;
    let pos = offset;
    
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(pos, int16, true);
        pos += 2;
      }
    }
    
    return new Blob([outputBuffer], { type: 'audio/wav' });
  };
  
  // Helper function to write strings to DataView
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // Group lines by part to show variation options
  const linesByPart: Record<number, ConversationLine[]> = {};
  conversation.lines.forEach(line => {
    if (!linesByPart[line.part]) {
      linesByPart[line.part] = [];
    }
    linesByPart[line.part].push(line);
  });

  // Check if there are multiple variations for any part
  const hasMultipleVariations = Object.values(linesByPart).some(lines => lines.length > 1);

  // Helper function to get the correct minimap icon path
  const getIconPath = (characterName: string) => {
    // Get the correct portrait file name
    const portraitName = getPortraitFileName(characterName);
    return `/minimapIcons/${portraitName}_mm_psd.png`;
  };

  // Initialize refs array when sorted lines change
  useEffect(() => {
    // Initialize the refs array with the correct length
    audioPlayerRefs.current = Array(sortedLines.length).fill(null);
  }, [sortedLines.length]);

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <h2 className="text-xl font-bold text-white">
          Conversation: {char1DisplayName} & {char2DisplayName}
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={handlePlayAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none flex items-center"
          >
            {playingAll ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Stop Playing
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play All
              </>
            )}
          </button>
          
          <button
            onClick={handleDownloadConversation}
            disabled={isGeneratingDownload || sortedLines.length === 0}
            className={`px-4 py-2 rounded-lg focus:outline-none flex items-center ${
              isGeneratingDownload || sortedLines.length === 0
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isGeneratingDownload ? (
              <>
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {downloadProgress}%
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Status indicators */}
      <div className="flex flex-wrap gap-2 mb-4">
        {!conversation.is_complete && (
          <span className="px-3 py-1 bg-yellow-800 text-yellow-100 rounded-full text-sm">
            Incomplete Conversation
          </span>
        )}
        
        {conversation.missing_parts.length > 0 && (
          <span className="px-3 py-1 bg-red-800 text-red-100 rounded-full text-sm">
            Missing Parts: {conversation.missing_parts.join(', ')}
          </span>
        )}
      </div>
      
      {/* Variation selectors - only show if there are multiple variations */}
      {hasMultipleVariations && (
        <div className="mb-6 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Select Variations</h3>
          <div className="space-y-3">
            {Object.entries(linesByPart).map(([part, lines]) => (
              // Wrap the logical expression in a fragment with a key
              <React.Fragment key={`part-container-${part}`}>
                {/* Only show variation selector if there are multiple variations for this part */}
                {lines.length > 1 && (
                  <div key={`part-${part}`} className="flex items-center">
                    <span className="text-gray-300 w-24">Part {part}:</span>
                    <div className="flex flex-wrap gap-2">
                      {lines.map(line => (
                        <button
                          key={`var-btn-${line.part}-${line.variation}`}
                          onClick={() => handleVariationChange(line.part, line.variation)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedVariations[line.part] === line.variation
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Variation {line.variation}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      
      {/* Conversation lines */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {sortedLines.map((line, index) => {
          // Get the proper display name for the speaker
          const speakerDisplayName = getProperCharacterName(line.speaker);
          
          return (
            <div 
              key={`line-${line.part}-${line.variation}-${index}`}
              className={`flex ${line.speaker === conversation.character1 ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`flex max-w-[80%] ${
                  line.speaker === conversation.character1 
                    ? 'flex-row' 
                    : 'flex-row-reverse'
                }`}
              >
                <div className="flex-shrink-0 mx-2">
                  <div className="relative w-10 h-10">
                    <Image
                      src={getIconPath(line.speaker)}
                      alt={`${speakerDisplayName} portrait`}
                      fill
                      sizes="40px"
                      className="object-cover rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/minimapIcons/genericperson_mm_psd.png';
                      }}
                    />
                  </div>
                </div>
                
                <div 
                  className={`rounded-lg p-3 ${
                    line.speaker === conversation.character1 
                      ? 'bg-blue-800 rounded-tl-none' 
                      : 'bg-green-800 rounded-tr-none'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-white">{speakerDisplayName}</span>
                    <span className="text-xs text-gray-300 ml-2">Part {line.part}</span>
                  </div>
                  
                  <p className="text-white mb-2">{line.transcription}</p>
                  
                  <div className="mt-2">
                    <AudioPlayer 
                      ref={(el) => { audioPlayerRefs.current[index] = el; }}
                      audioSrc={`/audioFiles/${line.filename}`}
                      isPlaying={playingLineIndex === index}
                      onPlayStateChange={(isPlaying) => handleLinePlayStateChange(index, isPlaying)}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Missing parts indicators */}
      {conversation.missing_parts.map(part => (
        <div key={`missing-${part}`} className="my-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-center">
          <p className="text-red-300">
            <svg className="w-5 h-5 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Missing dialogue part {part}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ConversationPlayer; 