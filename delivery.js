// include packages & models //
var mongoose = require ('mongoose');
var Deliveredgames = require('./models/deliveredgames.js');
var game = require('./models/game.js');
var converter = require('json-2-csv');
var fs = require('fs');
//Set datetime, month, day, year, and 24 hours ago == yesterday
var date = new Date();
//var month = date.getUTCMonth()+1;
//var day = date.getDate();
//var year = date.getFullYear();
var yesterday = new Date() - 1000 * 3600 * 24;

// Callback funtion to write data to a CSV file

var json2csvCallback = function (err, csv) {
    if (err) throw err;
    //Fix filename
    fs.writeFile('//TMSERVER/cleaning/Deliveries/Delivery-'+date.toDateString()+'.csv', csv, function(err){
      if (err) throw err;
      console.log('It\'s saved!');
    });
  };

var options = {
    delimiter : {
       wrap  : '"', // Double Quote (") character
       field : ',', // Comma field delimiter
       array : ';', // Semicolon array value delimiter
       eol   : '\n' // Newline delimiter
   }
    // trimHeaderFields: true,
    //   keys: ['_id', 'MLBAMID', 'Idext', 'DateCreated', 'DateModified', 'MDateModified',
    //   'RosterDateModified','Info.Name','Info.ShortName','Info.IsActive','Info.Level',
    //   'Info.League','Info.Organization','Info.PrimaryLocation','Players.0._id','Players.0.Name',
    //   'Players.0.Number','Players.0.Dexterity.Throwing','Players.0.Dexterity.Batting','Players.0.Position']
  };



// Connect to mongoDB //

var db_local = 'mongodb://localhost/baseball2'; //connection string
mongoose.connect(db_local, function(err){
  if(err)throw err
  else {console.log("Connection to local db!")}
});

//Example query//

Deliveredgames.aggregate(
  [
  {$match: {"Time": {$gte : date}}},
	{$group: {_id: "$GameId", Deliveries: {$sum: 1}, GameReference: {$addToSet: "$GameReference"}, Time: {$first: "$Time"}}},
	{$unwind: "$GameReference"},
	{$unwind: "$Time"},
	{$lookup: {
	  	"from" : "game",
	  	"localField" : "_id",
	  	"foreignField" : "_id",
	  	"as" : "Games"
	    }
	},
	{$unwind: "$Games"},
	{$project: {DateDelivered : {$dateToString: {format: "%Y-%m-%d", date: "$Time"}}, _id: true, Deliveries: true, GameReference: true, HomeTeam: "$Games.Info.Teams.Home.ShortName", AwayTeam: "$Games.Info.Teams.Away.ShortName"}}
  ],function(err,doc) {
if(err) {throw err;}
else{
  //console.log(doc);
 converter.json2csv(doc, json2csvCallback,options);

};

}
);
