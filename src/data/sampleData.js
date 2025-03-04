// This file provides a fallback data structure for static site generation
// It's used when the actual data file can't be loaded

export const fallbackData = {
  export_date: "2025-02-28T02:26:56.886527",
  total_conversations: 33,
  conversations: [
    {
      conversation_id: "sample_conversation_1",
      character1: "character1",
      character2: "character2",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "character1",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "character1",
          filename: "sample_audio_1.mp3",
          transcription: "This is a sample conversation.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:38:50"
        },
        {
          part: 2,
          variation: 1,
          speaker: "character2",
          filename: "sample_audio_2.mp3",
          transcription: "Yes, this is just placeholder data.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:38:52"
        }
      ],
      summary: "Sample conversation for fallback data."
    },
    {
      conversation_id: "sample_conversation_2",
      character1: "character3",
      character2: "character4",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "character3",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "character3",
          filename: "sample_audio_3.mp3",
          transcription: "Another sample conversation.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:38:54"
        },
        {
          part: 2,
          variation: 1,
          speaker: "character4",
          filename: "sample_audio_4.mp3",
          transcription: "This is used when real data can't be loaded.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:38:56"
        }
      ],
      summary: "Another sample conversation for fallback data."
    },
    {
      conversation_id: "sample_conversation_3",
      character1: "bebop",
      character2: "character1",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "bebop",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "bebop",
          filename: "sample_audio_5.mp3",
          transcription: "Hello, I'm Bebop! This is a sample conversation.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:38:58"
        },
        {
          part: 2,
          variation: 1,
          speaker: "character1",
          filename: "sample_audio_6.mp3",
          transcription: "Nice to meet you, Bebop!",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:00"
        }
      ],
      summary: "Bebop introduces himself in this sample conversation."
    },
    // Additional sample conversations with characters from Sample.json
    {
      conversation_id: "sample_conversation_holliday",
      character1: "holliday",
      character2: "paradox",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "holliday",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "holliday",
          filename: "sample_audio_7.mp3",
          transcription: "Sample conversation with Holliday and Paradox.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:02"
        },
        {
          part: 2,
          variation: 1,
          speaker: "paradox",
          filename: "sample_audio_8.mp3",
          transcription: "This is just placeholder data for Holliday and Paradox.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:04"
        }
      ],
      summary: "Sample conversation between Holliday and Paradox."
    },
    {
      conversation_id: "sample_conversation_abrams",
      character1: "abrams",
      character2: "calico",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "abrams",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "abrams",
          filename: "sample_audio_9.mp3",
          transcription: "Sample conversation with Abrams and Calico.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:06"
        },
        {
          part: 2,
          variation: 1,
          speaker: "calico",
          filename: "sample_audio_10.mp3",
          transcription: "This is just placeholder data for Abrams and Calico.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:08"
        }
      ],
      summary: "Sample conversation between Abrams and Calico."
    },
    {
      conversation_id: "sample_conversation_dynamo",
      character1: "dynamo",
      character2: "fathom",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "dynamo",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "dynamo",
          filename: "sample_audio_11.mp3",
          transcription: "Sample conversation with Dynamo and Fathom.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:10"
        },
        {
          part: 2,
          variation: 1,
          speaker: "fathom",
          filename: "sample_audio_12.mp3",
          transcription: "This is just placeholder data for Dynamo and Fathom.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:12"
        }
      ],
      summary: "Sample conversation between Dynamo and Fathom."
    },
    {
      conversation_id: "sample_conversation_grey_talon",
      character1: "grey talon",
      character2: "haze",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "grey talon",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "grey talon",
          filename: "sample_audio_13.mp3",
          transcription: "Sample conversation with Grey Talon and Haze.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:14"
        },
        {
          part: 2,
          variation: 1,
          speaker: "haze",
          filename: "sample_audio_14.mp3",
          transcription: "This is just placeholder data for Grey Talon and Haze.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:16"
        }
      ],
      summary: "Sample conversation between Grey Talon and Haze."
    },
    {
      conversation_id: "sample_conversation_infernus",
      character1: "infernus",
      character2: "ivy",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "infernus",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "infernus",
          filename: "sample_audio_15.mp3",
          transcription: "Sample conversation with Infernus and Ivy.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:18"
        },
        {
          part: 2,
          variation: 1,
          speaker: "ivy",
          filename: "sample_audio_16.mp3",
          transcription: "This is just placeholder data for Infernus and Ivy.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:20"
        }
      ],
      summary: "Sample conversation between Infernus and Ivy."
    },
    {
      conversation_id: "sample_conversation_kelvin",
      character1: "kelvin",
      character2: "lady geist",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "kelvin",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "kelvin",
          filename: "sample_audio_17.mp3",
          transcription: "Sample conversation with Kelvin and Lady Geist.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:22"
        },
        {
          part: 2,
          variation: 1,
          speaker: "lady geist",
          filename: "sample_audio_18.mp3",
          transcription: "This is just placeholder data for Kelvin and Lady Geist.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:24"
        }
      ],
      summary: "Sample conversation between Kelvin and Lady Geist."
    },
    {
      conversation_id: "sample_conversation_lash",
      character1: "lash",
      character2: "magician",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "lash",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "lash",
          filename: "sample_audio_19.mp3",
          transcription: "Sample conversation with Lash and Magician.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:26"
        },
        {
          part: 2,
          variation: 1,
          speaker: "magician",
          filename: "sample_audio_20.mp3",
          transcription: "This is just placeholder data for Lash and Magician.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:28"
        }
      ],
      summary: "Sample conversation between Lash and Magician."
    },
    {
      conversation_id: "sample_conversation_mcginnis",
      character1: "mcginnis",
      character2: "mirage",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "mcginnis",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "mcginnis",
          filename: "sample_audio_21.mp3",
          transcription: "Sample conversation with McGinnis and Mirage.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:30"
        },
        {
          part: 2,
          variation: 1,
          speaker: "mirage",
          filename: "sample_audio_22.mp3",
          transcription: "This is just placeholder data for McGinnis and Mirage.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:32"
        }
      ],
      summary: "Sample conversation between McGinnis and Mirage."
    },
    {
      conversation_id: "sample_conversation_mo_and_krill",
      character1: "mo and krill",
      character2: "operative",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "mo and krill",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "mo and krill",
          filename: "sample_audio_23.mp3",
          transcription: "Sample conversation with Mo and Krill and Operative.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:34"
        },
        {
          part: 2,
          variation: 1,
          speaker: "operative",
          filename: "sample_audio_24.mp3",
          transcription: "This is just placeholder data for Mo and Krill and Operative.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:36"
        }
      ],
      summary: "Sample conversation between Mo and Krill and Operative."
    },
    {
      conversation_id: "sample_conversation_pocket",
      character1: "pocket",
      character2: "seven",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "pocket",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "pocket",
          filename: "sample_audio_25.mp3",
          transcription: "Sample conversation with Pocket and Seven.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:38"
        },
        {
          part: 2,
          variation: 1,
          speaker: "seven",
          filename: "sample_audio_26.mp3",
          transcription: "This is just placeholder data for Pocket and Seven.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:40"
        }
      ],
      summary: "Sample conversation between Pocket and Seven."
    },
    {
      conversation_id: "sample_conversation_shiv",
      character1: "shiv",
      character2: "trapper",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "shiv",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "shiv",
          filename: "sample_audio_27.mp3",
          transcription: "Sample conversation with Shiv and Trapper.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:42"
        },
        {
          part: 2,
          variation: 1,
          speaker: "trapper",
          filename: "sample_audio_28.mp3",
          transcription: "This is just placeholder data for Shiv and Trapper.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:44"
        }
      ],
      summary: "Sample conversation between Shiv and Trapper."
    },
    {
      conversation_id: "sample_conversation_vindicta",
      character1: "vindicta",
      character2: "viper",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "vindicta",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "vindicta",
          filename: "sample_audio_29.mp3",
          transcription: "Sample conversation with Vindicta and Viper.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:46"
        },
        {
          part: 2,
          variation: 1,
          speaker: "viper",
          filename: "sample_audio_30.mp3",
          transcription: "This is just placeholder data for Vindicta and Viper.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:48"
        }
      ],
      summary: "Sample conversation between Vindicta and Viper."
    },
    {
      conversation_id: "sample_conversation_viscous",
      character1: "viscous",
      character2: "warden",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "viscous",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "viscous",
          filename: "sample_audio_31.mp3",
          transcription: "Sample conversation with Viscous and Warden.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:50"
        },
        {
          part: 2,
          variation: 1,
          speaker: "warden",
          filename: "sample_audio_32.mp3",
          transcription: "This is just placeholder data for Viscous and Warden.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:52"
        }
      ],
      summary: "Sample conversation between Viscous and Warden."
    },
    {
      conversation_id: "sample_conversation_wraith",
      character1: "wraith",
      character2: "wrecker",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "wraith",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "wraith",
          filename: "sample_audio_33.mp3",
          transcription: "Sample conversation with Wraith and Wrecker.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:54"
        },
        {
          part: 2,
          variation: 1,
          speaker: "wrecker",
          filename: "sample_audio_34.mp3",
          transcription: "This is just placeholder data for Wraith and Wrecker.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:56"
        }
      ],
      summary: "Sample conversation between Wraith and Wrecker."
    },
    {
      conversation_id: "sample_conversation_yamato",
      character1: "yamato",
      character2: "bebop",
      conversation_number: "01",
      topic: null,
      is_complete: true,
      missing_parts: [],
      starter: "yamato",
      lines: [
        {
          part: 1,
          variation: 1,
          speaker: "yamato",
          filename: "sample_audio_35.mp3",
          transcription: "Sample conversation with Yamato and Bebop.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:39:58"
        },
        {
          part: 2,
          variation: 1,
          speaker: "bebop",
          filename: "sample_audio_36.mp3",
          transcription: "This is just placeholder data for Yamato and Bebop.",
          has_transcription: true,
          file_creation_date: "2025-02-27T17:40:00"
        }
      ],
      summary: "Sample conversation between Yamato and Bebop."
    }
  ]
};

export default fallbackData; 