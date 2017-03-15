//Include packages & models.
var Deliveredgames = require('./models/deliveredgames.js'),
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

//Function to generate CSV for delivered games.
var deliveredQuery = function(yesterday, filename){

  //Call variables.
  yesterday;
  filename;
  console.log(yesterday);
  //Callback function to write delivered games data to a CSV.
  var DeliveredCallback = function (err, csv) {
      if (err) throw err;
      //Fix filename
      fs.writeFile('//TMSERVER/cleaning/Deliveries/Delivery-'+filename+'.csv', csv, function(err){
        if (err) throw err;
        console.log('Delivery-'+filename+'.csv is saved!');
      });
    };

  //Query to get delivered games from the past day.
  Deliveredgames.aggregate(
    [
    {$match: {"Time": {$gte : new Date('2017-01-01')}}},
  	{$group: {_id: "$GameId", Deliveries: {$sum: 1}, GameReference: {$addToSet: "$GameReference"},
     Time: {$first: "$Time"}}},
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
  	{$project: {DateDelivered : {$dateToString: {format: "%Y-%m-%d", date: "$Time"}}, _id: true,
     Deliveries: true, GameReference: true, HomeTeam: "$Games.Info.Teams.Home.ShortName",
     AwayTeam: "$Games.Info.Teams.Away.ShortName"}}
    ],
    function(err, deliver) {
      if(err) {throw err;}
      else{
        converter.json2csv(deliver, DeliveredCallback, options);
        console.log(deliver);
      };
    }
  )
};

//Export function.
module.exports = deliveredQuery
