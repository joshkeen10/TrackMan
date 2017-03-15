//Create variables for counter and scheduled tasks.
var counter = 0,
    schedule = require('node-schedule'),
    taskSchedule = new schedule.RecurrenceRule();

//Schedule task to run once a day at 6 am.
//taskSchedule.hour = 6;
taskSchedule.minute = 11;

//Tasks to run.
function reportOnSchedule() {

    // include packages & models //
    var mongoose = require ('mongoose'),
        game = require('./models/game.js'),
        Deliveredgames = require('./models/deliveredgames.js'),
        converter = require('json-2-csv'),
        fs = require('fs');

    //Set datetime and 24 hours ago == yesterday
    var date = new Date(),
        yesterday = new Date() - 1000 * 3600 * 24,
        year = (date.getFullYear()).toString();
        month = (date.getMonth() + 1).toString();
        month = month.length > 1 ? month : '0' + month;
    var day = (date.getDate()).toString();
        day = day.length > 1 ? day : '0' + day;
    var filename = year + month + day;

    //Callback funtion to write tracked data to a CSV.
    var TrackedCallback = function (err, csv) {
      if (err) throw err;
      //Fix filename
      fs.writeFile('//TMSERVER/cleaning/Tracked/Tracked-'+year+'0'+'.csv', csv, function(err){
        if (err) throw err;
        console.log('Tracked-'+filename+'.csv is saved!');
      });
    };

    //Callback function to write delivered games data to a CSV.
    var DeliveredCallback = function (err, csv) {
        if (err) throw err;
        //Fix filename
        fs.writeFile('//TMSERVER/cleaning/Deliveries/Delivery-'+filename+'.csv', csv, function(err){
          if (err) throw err;
          console.log('Delivery-'+filename+'.csv is saved!');
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
      ],function(err, track) {
        if(err) {throw err;}
        else{
          console.log(track);
          converter.json2csv(track, TrackedCallback, options);
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
      function(err, deliver) {
        if(err) {throw err;}
        else{
          console.log(deliver);
          converter.json2csv(deliver, DeliveredCallback, options);
        };
      }
    );

  //Increment counter.
  counter++;

  //Report that scheduled task ran.
  console.log('The scheduled task ran. This is iteration #: '+ counter);
}

//Initialize schedule.
schedule.scheduleJob(taskSchedule, reportOnSchedule);

//Report that the schedule has been initialized.
console.log('The schedule has been initialized.');
