//mongoose Schema for game collection//

var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema ({
  _id: String,
  GameReference: String,
  DateCreated: Date,
  DateModified: Date,
  MDateModified: Date,
  DateVerified: Date,
  LastExportTime: Date,
  Flags: {
    Active: Boolean,
    Cleaned: Boolean,
    Verified: Boolean,
    Hidden: Boolean,
    Ended: Boolean,
    UploadValid: Boolean
  },
  Info: {
    Teams: {
      Away: {
      _id: String,
      Name: String,
      ShortName: String
      },
      Home: {
        _id: String,
        Name: String,
        ShortName: String
      }
    },
    Location: {
      _id: String,
      Name: String,
      ShortName: String
    },
    Level: String,
    League: {
      _id: String,
      Name: String,
      ShortName: String,
      DH: Boolean
    },
    BallType: String,
    ApplicationType: String,
    CalibrationId: String,
    DateTimeOffset: Number,
    Cleaner: String,
    Verifier: String
  },
  Cleaning: {
    Cleaner: String,
    Corrections: Number,
    CleaningLog: String
  },
  Stats: {
    FirstPitch: Date,
    LastPitch: Date,
    Pitches: Number,
    Hits: Number,
    Completeness: Number,
    PickupRate: {
      Hit: {
        flyball: {
          SampleSize: Number,
          Percent: Number
          },
        groundball: {
          SampleSize: Number,
          Percent: Number
          },
        popup: {
          SampleSize: Number,
          Percent: Number
          },
        linedrive: {
          SampleSize: Number,
          Percent: Number
          },
        bunt: {
          SampleSize: Number,
          Percent: Number
          }
      },
      SpinRate: {
        fastball: {
          SampleSize: Number,
          Percent: Number
          },
        cutter: {
          SampleSize: Number,
          Percent: Number
          },
        slider: {
          SampleSize: Number,
          Percent: Number
          },
        curveball: {
          SampleSize: Number,
          Percent: Number
          },
        sinker: {
          SampleSize: Number,
          Percent: Number
          },
        changeup: {
          SampleSize: Number,
          Percent: Number
          },
        other: {
          SampleSize: Number,
          Percent: Number
          }
      },
      Pitch: {
        R: {
          SampleSize: Number,
          Percent: Number
          },
        L: {
          SampleSize: Number,
          Percent: Number
          }
      }
    }
  },
  //   BallFlightBreakdown: {
  //     count: Number,
  //     p: [
  //         [
  //           [
  //               0: Number,
  //               1: Number,
  //               2: Number
  //           ]
  //         ],
  //         [
  //           0: Number
  //             }
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // },
//    Diagnostics: {
//      Trajectory: {},
//      AmbreSolving: {},
//      HarmonicNoice: {},
//      Chennel: {},
//      TrackRcs: {},
//      NumSensors: Number
//    }
//  },
//  Periods: {
//    [
//
//    ]
//  },
  MLBAMID: String,
  Notes: String
},{collection:'game'});

module.exports = mongoose.model('game', gameSchema);
