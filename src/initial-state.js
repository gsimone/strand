export const initialState = `
    {
      "nodes": [
        {
          "id": 53,
          "name": 53,
          "fields": [
            111,
            301,
            233
          ]
        },
        {
          "id": 52,
          "name": 52,
          "fields": [
            77,
            355
          ]
        },
        {
          "id": 445,
          "name": 445,
          "fields": [
            618,
            854
          ]
        },
        {
          "id": 885,
          "name": 885,
          "fields": [
            562,
            459,
            10
          ]
        },
        {
          "id": 290,
          "name": 290,
          "fields": [
            809
          ]
        }
      ],
      "positions": [
        [
          53,
          [
            98,
            83
          ]
        ],
        [
          52,
          [
            306,
            393
          ]
        ],
        [
          445,
          [
            991,
            565
          ]
        ],
        [
          885,
          [
            271,
            690
          ]
        ],
        [
          290,
          [
            839,
            91
          ]
        ]
      ],
      "fields": [
        {
          "id": 111,
          "name": "123",
          "value": "Field"
        },
        {
          "id": 301,
          "name": 301,
          "value": "Field"
        },
        {
          "id": 233,
          "name": 233,
          "value": "Field"
        },
        {
          "id": 77,
          "name": 77,
          "value": "Field"
        },
        {
          "id": 355,
          "name": 355,
          "value": "Field"
        },
        {
          "id": 809,
          "name": 809,
          "value": "Field"
        },
        {
          "id": 618,
          "name": 618,
          "value": "Field"
        },
        {
          "id": 854,
          "name": 854,
          "value": "Field"
        },
        {
          "id": 562,
          "name": 562,
          "value": "Field"
        },
        {
          "id": 459,
          "name": 459,
          "value": "Field"
        },
        {
          "id": 10,
          "name": 10,
          "value": "Field"
        }
      ],
      "connections": [
        [
          "53_111_OUTPUT",
          "52_77_INPUT"
        ],
        [
          "290_809_INPUT",
          "445_618_OUTPUT"
        ],
        [
          "290_809_OUTPUT",
          "52_355_INPUT"
        ],
        [
          "52_355_OUTPUT",
          "885_562_INPUT"
        ],
        [
          "885_10_OUTPUT",
          "445_854_INPUT"
        ],
        [
          "53_233_OUTPUT",
          "445_618_INPUT"
        ],
        [
          "290_809_OUTPUT",
          "445_618_INPUT"
        ],
        [
          "52_355_INPUT",
          "290_809_OUTPUT"
        ]
      ]
    }
    `