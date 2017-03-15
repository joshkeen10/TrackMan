
    // include packages & models //
    var mongoose = require ('mongoose');
    var game = require('./models/game.js');
    var Deliveredgames = require('./models/deliveredgames.js');
    var converter = require('json-2-csv');
    var fs = require('fs');

    //Set datetime and 24 hours ago == yesterday
    var date = new Date(2017, 1, 18);
    var yesterday = date.setDate(date.getDate()-1);

    //Callback funtion to write tracked data to a CSV.
    var TrackedCallback = function (err, csv) {
      if (err) throw err;
      //Fix filename
      fs.writeFile('//TMSERVER/cleaning/Tracked/Tracked-'+date.toDateString()+'.csv', csv, function(err){
        if (err) throw err;
        console.log('Tracked-'+date.toDateString()+'.csv is saved!');
      });
    };

    //Callback function to write delivered games data to a CSV.
    var DeliveredCallback = function (err, csv) {
        if (err) throw err;
        //Fix filename
        fs.writeFile('//TMSERVER/cleaning/Deliveries/Delivery-'+date.toDateString()+'.csv', csv, function(err){
          if (err) throw err;
          console.log('Delivery-'+date.toDateString()+'.csv is saved!');
        });
      };

    var options = {
        delimiter : {
        wrap  : '"', // Double Quote (") character
        field : ',', // Comma field delimiter
        array : ';', // Semicolon array value delimiter
        eol   : '\n' // Newline delimiter
        }
    };

    // Connect to mongoDB //
    var db_local = 'mongodb://localhost/baseball2'; //connection string
    mongoose.connect(db_local, function(err){
      if(err)throw err
      else {console.log("Connection to local db!")}
    });

    //Query to get tracked games from the past day.
    game.aggregate(
      [
    	   {$match: {"DateCreated" : {$gte: yesterday}}},
    	    {$project: {Date: {$dateToString: {format: "%Y-%m-%d", date: "$DateCreated"}},
           HomeTeam: "$Info.Teams.Home.ShortName", AwayTeam: "$Info.Teams.Away.ShortName",
    	     GameReference: true, _id: true}}
      ],function(err,doc) {
        if(err) {throw err;}
        else{
          converter.json2csv(doc, TrackedCallback,options);
        };
      }
    );

    //Query to get delivered games from the past day.
    Deliveredgames.aggregate(
      [
      {$match: {"Time": {$gte : yesterday}}},
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
      function(err,doc) {
        if(err) {throw err;}
        else{
          converter.json2csv(doc, DeliveredCallback,options);
        };
      }
    );
