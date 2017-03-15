//Include packages & models.
var game = require('./models/game.js'),
    fs = require('fs'),
    converter = require('json-2-csv');

//Include options.
var options = {
      delimiter : {
      wrap  : '"', // Double Quote (") character
      field : ',', // Comma field delimiter
      array : ';', // Semicolon array value delimiter
      eol   : '\n' // Newline delimiter
      }
  };

//Function to generate CSV for tracked games.
var trackedQuery = function (yesterday, filename){

  //Call variables.
  yesterday;
  filename;

  //Callback function to write tracked data to a CSV.
  var TrackedCallback = function (err, csv) {
    if (err) throw err;
    //Fix filename
    fs.writeFile('//TMSERVER/cleaning/Tracked/Tracked-'+filename+'.csv', csv, function(err){
      if (err) throw err;
      console.log('Tracked-'+filename+'.csv is saved!');
    });
  };

  //Query to get tracked games from the past day.
  game.aggregate(
    [
      {$match: {"DateCreated" : {$gte: yesterday}}},
      {$project: {Date: {$dateToString: {format: "%Y-%m-%d", date: "$DateCreated"}},
      HomeTeam: "$Info.Teams.Home.ShortName", AwayTeam: "$Info.Teams.Away.ShortName",
      GameReference: true, _id: true}}
    ],function(err, track) {
      if(err) {throw err;}
      else{
        converter.json2csv(track, TrackedCallback, options);
        console.log(track);
      };
    }
  )
};

//Export function.
module.exports = trackedQuery
