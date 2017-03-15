//Include packages and models.
var mongoose = require ('mongoose'),
    tracked = require('./tracked.js'),
    delivered = require('./delivery.js');

//Create variables for counter and scheduled tasks.
var counter = 0,
    schedule = require('node-schedule'),
    taskSchedule = new schedule.RecurrenceRule();

//Schedule task to run once a day at 6 am.
//taskSchedule.hour = 6;
taskSchedule.minute = [51];

// Connect to mongoDB //
var db_local = 'mongodb://localhost/baseball2'; //connection string
var db_pro = 'mongodb://ec2-52-91-50-221.compute-1.amazonaws.com:27000,ec2-54-172-1-84.compute-1.amazonaws.com:27000/?readPreference=primary'
mongoose.connect(db_local, function(err){
  if(err)throw err
  else {console.log("Connection to db_pro!")}
});

//Tasks to run.
function reportOnSchedule() {

  //Set datetime and 24 hours ago == yesterday
  var date = new Date(),
      yesterday = new Date() - 1000 * 3600 * 24,
      year = (date.getFullYear()).toString(),
      month = (date.getMonth() + 1).toString(),
      month = month.length > 1 ? month : '0' + month,
      day = (date.getDate()).toString(),
      day = day.length > 1 ? day : '0' + day,
      filename = year + month + day;

  //Call functions for csvs.
  tracked(yesterday, filename);
  delivered(yesterday, filename);

  //Increment counter.
  counter++;

  //Report that scheduled task ran.
  console.log('The scheduled task ran. This is iteration #: '+ counter);
}

//Initialize schedule.
schedule.scheduleJob(taskSchedule, reportOnSchedule);

//Report that the schedule has been initialized.
console.log('The schedule has been initialized.');
