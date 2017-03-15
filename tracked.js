var game = require('./models/game.js'),
    fs = require('fs'),
    converter = require('json-2-csv');

//options
var options = {
      delimiter : {
      wrap  : '"', // Double Quote (") character
      field : ',', // Comma field delimiter
      array : ';', // Semicolon array value delimiter
      eol   : '\n' // Newline delimiter
      }
  };


var trackedQuery = function (){

  var date = new Date(),
      yesterday = new Date() - 1000 * 3600 * 24,
      year = (date.getFullYear()).toString(),
      month = (date.getMonth() + 1).toString(),
      month = month.length > 1 ? month : '0' + month,
      day = (date.getDate()).toString(),
      day = day.length > 1 ? day : '0' + day,
      filename = year + month + day;

  //Callback funtion to write tracked data to a CSV.
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
      };
    }
  )
};

module.exports = trackedQuery
