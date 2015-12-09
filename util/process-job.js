var request = require('request');
var cheerio = require('cheerio');
var URL     = require('url-parse')
var createJob=require('./create-job')

var addToDb=require('./add-to-db')

var pagesVisited={};

module.exports=function (queue,job,db,done){
  var url=job.data.url;
  if(pagesVisited[url] && !job.data.reattempt)
    return;
  var parsedUrl = new URL(url);
  var baseUrl = parsedUrl.protocol + "//" + parsedUrl.hostname;
  pagesVisited[url]=true;
  request(url, function(error, response, body) {
    if(error)
      console.log(error)
     // Check status code (200 is HTTP OK)
     if(response.statusCode === 200) {
      
      var $ = cheerio.load(body);
      var relativeLinks = $("a[href^='/']");
      relativeLinks.each(function() {
        createJob(queue,baseUrl+$(this).attr('href'));
      });

      var absoluteLinks = $("a[href^='http']");
      absoluteLinks.each(function() {
        createJob(queue,$(this).attr('href'));
      });

      var totalLinks=relativeLinks.length + absoluteLinks.length;

      $('meta').each(function(element) {
        var obj={
        url:url,
        name:$(this).attr('name'),
        content:$(this).attr('content')
      };
      addToDb(db,obj,function(err,doc){
        if(err)
          console.log(err)
      });
    })
      
    
          return done(null,totalLinks)
      }

    return done('Status Code  '+response.statusCode)
    
})
}