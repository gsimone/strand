export const initialState = `
{
  "nodes": {
    "353": {
      "name": 353,
      "fields": [
        711
      ],
      "position": [
        100,
        100
      ]
    },
    "481": {
      "name": 481,
      "fields": [
        785,
        616
      ],
      "position": [
        404,
        447
      ]
    },
    "783": {
      "name": 783,
      "fields": [
        631,
        659
      ],
      "position": [
        636,
        103
      ]
    }
  },
  "fields": {
    "616": {
      "name": 616,
      "value": "Field"
    },
    "631": {
      "name": 631,
      "value": "Field"
    },
    "659": {
      "name": 659,
      "value": "Field"
    },
    "711": {
      "name": 711,
      "value": "Field"
    },
    "785": {
      "name": 785,
      "value": "Field"
    }
  },
  "connections": [
    [
      "353_711_OUTPUT",
      "783_631_INPUT"
    ],
    [
      "783_631_OUTPUT",
      "481_785_INPUT"
    ],
    [
      "353_711_INPUT",
      "481_616_OUTPUT"
    ]
  ]
}
    `