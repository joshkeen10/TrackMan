// include packages & models //
var mongoose = require ('mongoose');
var game = require('./models/game.js');
var converter = require('json-2-csv');
var fs = require('fs');

//Set datetime, month, day, year, and 24 hours ago == yesterday
var date = new Date(2017,2,5);
// var month = date.getUTCMonth()+1;
// var day = date.getDate();
// var year = date.getFullYear();
var yesterday = date.setDate(date.getDate()-1);

console.log(yesterday);

// Callback funtion to write data to a CSV file

var json2csvCallback = function (err, csv) {
    if (err) throw err;
    //Fix filename
    fs.writeFile('C:/Users/JK/Desktop/Deliveries/Tracked-'+date.toDateString()+'.csv', csv, function(err){
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

game.aggregate(
  [
  	{$match: {"DateCreated" : {$gte: yesterday}}},
  	{$project: {Date: {$dateToString: {format: "%Y-%m-%d", date: "$DateCreated"}}, HomeTeam: "$Info.Teams.Home.ShortName", AwayTeam: "$Info.Teams.Away.ShortName",
  	   GameReference: true, _id: true}}
  ],function(err,doc) {
if(err) {throw err;}
else{
  //console.log(doc);
 converter.json2csv(doc, json2csvCallback,options);

};

}
);
