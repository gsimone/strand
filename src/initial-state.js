export const initialState = `
{
  "nodes": {
    "fat-sloth-35": {
      "name": "fat-sloth-35",
      "fields": [
        "wise-horse-48",
        "sour-falcon-16"
      ],
      "position": [
        53,
        299
      ]
    },
    "dull-dragonfly-95": {
      "name": "dull-dragonfly-95",
      "fields": [
        "tame-gecko-25",
        "polite-lizard-84"
      ],
      "position": [
        607,
        469
      ]
    },
    "serious-zebra-36": {
      "name": "serious-zebra-36",
      "fields": [
        "mighty-rabbit-70"
      ],
      "position": [
        414,
        87
      ]
    }
  },
  "fields": {
    "wise-horse-48": {
      "name": "wise-horse-48",
      "value": "Field"
    },
    "sour-falcon-16": {
      "name": "sour-falcon-16",
      "value": "Field"
    },
    "mighty-rabbit-70": {
      "name": "mighty-rabbit-70",
      "value": "Field"
    },
    "tame-gecko-25": {
      "name": "tame-gecko-25",
      "value": "Field"
    },
    "polite-lizard-84": {
      "name": "polite-lizard-84",
      "value": "Field"
    }
  },
  "connections": [
    [
      "serious-zebra-36_mighty-rabbit-70_OUTPUT",
      "dull-dragonfly-95_tame-gecko-25_INPUT"
    ],
    [
      "fat-sloth-35_wise-horse-48_OUTPUT",
      "serious-zebra-36_mighty-rabbit-70_INPUT"
    ],
    [
      "fat-sloth-35_sour-falcon-16_OUTPUT",
      "dull-dragonfly-95_polite-lizard-84_INPUT"
    ]
  ]
}
    `;
