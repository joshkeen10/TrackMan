var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var deliveredgamesSchema = new Schema ({
  _id: String,
  GameReference: String,
  GameId: String,
  Level: String,
  LastModified: Date,
  MostRecentFile: String,
  Time: Date,
  Organization: String,
  GameDate: Date
},{collection:'deliveredgames'});

module.exports = mongoose.model('Deliveredgames', deliveredgamesSchema);
