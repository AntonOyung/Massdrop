var http = require('http');
var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var job = require('./db/app/job-schema');
var queue = require('queue');


//Create Queue
var queue = new queue();
var Job = mongoose.model('Job', job);

app.use(morgan('dev'));
app.use(bodyParser.json());

var router = express.Router();

router.use(function(req, res, next){
  console.log("...");
  next();
})

//Connect to db
mongoose.connect('mongodb://localhost:27017/db', function(err){
  if (err) {
    console.log("Not connected to the database: " + err);
  } else {
    console.log("Successfully connected to db");
  }
});

// -----HELPER FUNCTIONS----- //

// Complete html retrieval
var CompleteJob = function(job) {
  var id = job.data.id;
  var url = job.data.url;
  var text = '';
  var request = http.request(url, function(response) {
    response.on('data', function (chunk) {
      text += chunk;
    });
  });
  console.log("Job " + id + " is COMPLETE.");
  job.data.output = text;
  job.data.is_done = true;
  job.save();
};

// Get HTML and pop from Queue
var fetch = function(url, id) {
  job = queue.pop(id);
  console.log("Job " + id + " is removed.");
  console.log("Job " + id + " data: " + job.data.output);
}

// Add job to Queue
var addJob = function(inp_url) {
  var job = new Job();
  job.url = inp_url;
  queue.push({url: job.url, id: job._id});
  job.save();
}

// Get specific job's status
var getJob = function(id) {
  var is_done = job.findOne(session.get('is_done'));
  if (is_done) {
    console.log("Job " + id + " status: COMPLETE");
  } else {
    console.log("Job " + id + " status: INCOMPLETE");
  }
}

// -----ROUTES----- //

//Get job status like 'localhost:8080/status/id'
router.route('/jobs/:id')
  .get(function(req, res) {
    var id = req.params.id;
    getJob(id);
  });
  app.use('/MassDrop', router);

  // Update and complete job.
  .put(function(req, res) {
    var id = req.params.id;
    CompleteJob(job.findOne(id));
  });
  app.use('/MassDrop', router);

//Submit jobs like 'localhost:8080/jobs/url'
router.route('/jobs/:url')
  .post(function(req, res) {
    url = req.params.url;
    addJob(url);
    res.render()
    console.log("Your request has been added.");
  });
  app.use('/MassDrop', router);

//Pop item from queue and view results like 'localhost:8080/jobs/view'
router.route('/jobs/view')
  .delete(function(req, res) {
    if (job[0].is_done) {
      response.json({"id": job[0].id, "data": job[0].output});
      fetch(req.params.url, req.params.id);
    } else {
      console.log("Job is not ready.");
    }
  });




app.listen(8080, function() {console.log("running server...")});
