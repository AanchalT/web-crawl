'use strict'
var chai = require('chai')
var expect = chai.expect
var fs = require('fs')
var path = require('path')
var kue = require('kue');
var connection=require('../util/connection')
var addToDb=require('../util/add-to-db')
var createJob=require('../util/create-job')
var processJob=require('../util/process-job')
describe('Connection',function(){
  it('Should be a function',function(){
    expect(typeof connection).to .equal('function');
  })

  it('Should connect to mongodb',function(done){
    connection('mongodb://localhost:27017/test',function(error,db) {
      expect(error).to.equal(null);
      db.close()
      done();
    })
  })
})

describe('addToDb',function(){
  it('Should be a function',function(){
    expect(typeof addToDb).to .equal('function');
  })

  it('Should store object in database',function(done){
    var obj={
      url:'http://www.example.com',
      name:'viewport',
      content:'initial-scale=1, minimum-scale=1, width=device-width'
    }
    connection('mongodb://localhost:27017/test',function(error,db) {
      addToDb(db,obj,function(err,doc){
        expect(err).to.equal(null);
        expect(doc.ops[0].url).to.equal('http://www.example.com');
        expect(doc.ops[0].name).to.equal('viewport');
        expect(doc.ops[0].content).to.equal('initial-scale=1, minimum-scale=1, width=device-width');
        done()
      });
    });
  });
})

describe('Project folder',function(){
  it('Should contain create-job.js in util folder',function(done){
    fs.lstat(path.join(__dirname, '../util/create-job.js'),function(err,obj){
        expect(obj).to.not.equal(undefined);
        done();
    })
  })
  it('Should contain process-job.js in util folder',function(done){
    fs.lstat(path.join(__dirname, '../util/process-job.js'),function(err,obj){
      expect(obj).to.not.equal(undefined);
      done();
    })
  })
})
describe('createJob',function () {
  it('Should be a function',function(){
    expect(typeof createJob).to.equal('function');
  })

  it('Should create job for url',function(done){
    var queue = kue.createQueue();
    var job=createJob(queue,'http://www.example.com')
    expect(job.data.url).to.equal('http://www.example.com')
    done();
  })
})

describe('processJob',function () {
  var db;
  before(function(done){
    connection('mongodb://localhost:27017/test',function(error,dbObj) {
      db=dbObj;
      done();
    });
  })

  it('Should be a function',function(){
    expect(typeof processJob).to.equal('function');
  })

  it('Should process the job',function(doneIt){
    var queue = kue.createQueue();
    var noOfJobs;
    var job=createJob(queue,'http://www.example.com')
    queue.process('web crawler',3,function(job,done){
      processJob(queue,job,db,done)
    })
    doneIt()
  })
  })