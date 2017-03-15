// include packages & models //
var mongoose = require ('mongoose'),
    t = require('./tracked.js'),
    d = require('./delivery.js');

//Create variables for counter and scheduled tasks.
var counter = 0,
    schedule = require('node-schedule'),
    taskSchedule = new schedule.RecurrenceRule();

//Schedule task to run once a day at 6 am.
//taskSchedule.hour = 6;
taskSchedule.minute = [10];

// Connect to mongoDB //
var db_local = 'mongodb://localhost/baseball2'; //connection string
mongoose.connect(db_local, function(err){
  if(err)throw err
  else {console.log("Connection to local db!")}
});

//Tasks to run.
function reportOnSchedule() {

  //Set datetime and 24 hours ago == yesterday
  t();
  d();

  //Increment counter.
  counter++;

  //Report that scheduled task ran.
  console.log('The scheduled task ran. This is iteration #: '+ counter);
}

//Initialize schedule.
schedule.scheduleJob(taskSchedule, reportOnSchedule);

//Report that the schedule has been initialized.
console.log('The schedule has been initialized.');
