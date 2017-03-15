//mongoose Schema for team collection//
//Team data model will be use in example.js//

var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema ({
  _id: String,
  MLBAMID: String,
  DateCreated: Date,
  DateModified: Date,
  MDateModified: Date,
  RosterDateModified: Date,
  Info:{
    Name: String,
    ShortName: String,
    IsActive: Boolean,
    Level: String,
    League: String,
    Organization: String,
    PrimaryLocation: String,
  },
  Players: [{_id: String, Name: String, Number: String, Dexterity:{Throwing: String, Batting: String}, Position: String}],
},{collection:'team'});

module.exports = mongoose.model('Team', teamSchema);
