# Anonymous Zether Smart Contracts

## Run The Unit Tests

```console
$ npm i
$ npm t

  ZSC
CashToken deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
ZSC deployed to:       0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
    ✔ should allow minting and approving
    ✔ should allow account registration (60ms)
    ✔ should allow funding
The block timestamp is ahead of the wall clock, waiting 7856 ms to align
Setting the next block timestamp to 6 seconds in the future: 1697041834
Waiting until the next epoch (ms): 2993.99995803833
Retrieved encrypted balance:  [
  [
    [
      '0x169a5c0703dae7f7a1fbe849ec60c6f1394c63bdd13b57bbb44eaf897c627ade',
      '0x0cceb0f7540ad2ff60ecd1eb682fced012ea88f1ba71e4a0b53c3e8db6125969',
      x: '0x169a5c0703dae7f7a1fbe849ec60c6f1394c63bdd13b57bbb44eaf897c627ade',
      y: '0x0cceb0f7540ad2ff60ecd1eb682fced012ea88f1ba71e4a0b53c3e8db6125969'
    ],
    [
      '0x077da99d806abd13c9f15ece5398525119d11e11e9836b2ee7d23f6159ad87d4',
      '0x01485efa927f2ad41bff567eec88f32fb0a0f706588b4e41a8d587d008b7f875',
      x: '0x077da99d806abd13c9f15ece5398525119d11e11e9836b2ee7d23f6159ad87d4',
      y: '0x01485efa927f2ad41bff567eec88f32fb0a0f706588b4e41a8d587d008b7f875'
    ]
  ]
]
Proof epoch (used by the prover): 282840305
Statement epoch (use by the verifier)
0x0000000000000000000000000000000000000000000000000000000010dbccf1
    ✔ should allow withdrawing (12451ms)
The block timestamp is ahead of the wall clock, waiting 7301 ms to align
Setting the next block timestamp to 6 seconds in the future: 1697041846
Waiting until the next epoch (ms): 2996.000051498413
Retrieved encrypted balance:  [
  [
    [
      '0x27577a1a742f6db6fb8b3b16b75e4b2502ea6e07968371127fed117617f23a37',
      '0x14f94b3e424d8aab96416ff0af61a208027e573eeea1ac3e7941af4ffd333a28',
      x: '0x27577a1a742f6db6fb8b3b16b75e4b2502ea6e07968371127fed117617f23a37',
      y: '0x14f94b3e424d8aab96416ff0af61a208027e573eeea1ac3e7941af4ffd333a28'
    ],
    [
      '0x077da99d806abd13c9f15ece5398525119d11e11e9836b2ee7d23f6159ad87d4',
      '0x01485efa927f2ad41bff567eec88f32fb0a0f706588b4e41a8d587d008b7f875',
      x: '0x077da99d806abd13c9f15ece5398525119d11e11e9836b2ee7d23f6159ad87d4',
      y: '0x01485efa927f2ad41bff567eec88f32fb0a0f706588b4e41a8d587d008b7f875'
    ]
  ],
  [
    [
      '0x2d1d1df0a1bde99a88c32c6fb0ea15b3b4b48f33ddcf4880388a986feadbc7bc',
      '0x2556f7333825c778c8d937360919b2e17a328c556f82ce334f05ce63d62877c6',
      x: '0x2d1d1df0a1bde99a88c32c6fb0ea15b3b4b48f33ddcf4880388a986feadbc7bc',
      y: '0x2556f7333825c778c8d937360919b2e17a328c556f82ce334f05ce63d62877c6'
    ],
    [
      '0x077da99d806abd13c9f15ece5398525119d11e11e9836b2ee7d23f6159ad87d4',
      '0x01485efa927f2ad41bff567eec88f32fb0a0f706588b4e41a8d587d008b7f875',
      x: '0x077da99d806abd13c9f15ece5398525119d11e11e9836b2ee7d23f6159ad87d4',
      y: '0x01485efa927f2ad41bff567eec88f32fb0a0f706588b4e41a8d587d008b7f875'
    ]
  ],
  [
    [
      '0x191d4254269dad5d1ebff2d3170415fffdc6339bb9192dd583864fd57509b264',
      '0x0f7dacd457787e4eab62152c409c3c7bb4b783eea98ccd6569a9f90a01f7ead3',
      x: '0x191d4254269dad5d1ebff2d3170415fffdc6339bb9192dd583864fd57509b264',
      y: '0x0f7dacd457787e4eab62152c409c3c7bb4b783eea98ccd6569a9f90a01f7ead3'
    ],
    [
      '0x077da99d806abd13c9f15ece5398525119d11e11e9836b2ee7d23f6159ad87d4',
      '0x01485efa927f2ad41bff567eec88f32fb0a0f706588b4e41a8d587d008b7f875',
      x: '0x077da99d806abd13c9f15ece5398525119d11e11e9836b2ee7d23f6159ad87d4',
      y: '0x01485efa927f2ad41bff567eec88f32fb0a0f706588b4e41a8d587d008b7f875'
    ]
  ],
  [
    [
      '0x02e37637c51276b14dbbeb77a823199886db8757bb8eea235f86483c18cdbc8a',
      '0x0981ad0a08457acccb1e86d0976fec6617da1d3644b264c0c0e0f29c7c0a1dcf',
      x: '0x02e37637c51276b14dbbeb77a823199886db8757bb8eea235f86483c18cdbc8a',
      y: '0x0981ad0a08457acccb1e86d0976fec6617da1d3644b264c0c0e0f29c7c0a1dcf'
    ],
    [
      '0x077da99d806abd13c9f15ece5398525119d11e11e9836b2ee7d23f6159ad87d4',
      '0x01485efa927f2ad41bff567eec88f32fb0a0f706588b4e41a8d587d008b7f875',
      x: '0x077da99d806abd13c9f15ece5398525119d11e11e9836b2ee7d23f6159ad87d4',
      y: '0x01485efa927f2ad41bff567eec88f32fb0a0f706588b4e41a8d587d008b7f875'
    ]
  ]
]
Proof epoch (used by the prover): 282840307
Statement epoch
0x0000000000000000000000000000000000000000000000000000000010dbccf3
    ✔ should allow transferring (2 decoys and no miner) (13766ms)


  5 passing (27s)

```
