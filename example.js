// include packages & models //
var mongoose = require ('mongoose');
var Team = require('./models/team.js');
var converter = require('json-2-csv');
var fs = require('fs');

// Callback funtion to write data to a CSV file

var json2csvCallback = function (err, csv) {
    if (err) throw err;

    fs.writeFile('test.csv', csv, function(err){
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
   },
    trimHeaderFields: true,
      keys: ['_id', 'MLBAMID', 'Idext', 'DateCreated', 'DateModified', 'MDateModified',
      'RosterDateModified','Info.Name','Info.ShortName','Info.IsActive','Info.Level',
      'Info.League','Info.Organization','Info.PrimaryLocation','Players.0._id','Players.0.Name',
      'Players.0.Number','Players.0.Dexterity.Throwing','Players.0.Dexterity.Batting','Players.0.Position']
  };



// Connect to mongoDB //

var db_local = 'mongodb://localhost/baseball2'; //connection string
mongoose.connect(db_local, function(error){console.log(error)});

//Example query//

Team.find({'_id':'f5bc6df2-781e-49bf-bbfb-b857f0c57f4d'},function(err,doc) {
if(err) {return handleError(err);}
else{
  //console.log(doc);
  converter.json2csv(doc, json2csvCallback,options);


};

  });
