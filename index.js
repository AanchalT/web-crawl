var kue = require('kue')
var express = require('express') 
var bodyParser = require('body-parser');

var connection=require('./util/connection')
var createJob=require('./util/create-job')
var processJob=require('./util/process-job')

var queue = kue.createQueue();
var pagesVisited={};
var count=0
var db;

var app = express();
app.use(bodyParser.urlencoded({ extended: false}));

app.listen(3000);

app.get('/',function(req,res){
    res.json({'status':'up'})
})


connection('mongodb://localhost:27017/test',function(error,dbObj) {
    if (error)
      console.log(error)
    else
    {
      db=dbObj;
      queue.process('web crawler',3,function(job,done){
        processJob(queue,job,db,done)
      })
    }
  })
queue.watchStuckJobs(500)

queue.on('error',function(err){
  console.log(err)
})

process.on('uncaughtException',function(err){
  console.log(err)
})
  
job=createJob(queue,'http://www.example.com')
