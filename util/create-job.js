var count=0;
module.exports=function (queue,url){
 if(count>=10)
    return;
  count++

  var job = queue.create('web crawler', {
    title: 'crawlling',
    url:url,
    reattempt:false
  }).removeOnComplete( true ).attempts(3).ttl(1000*20).save();

  job.on('complete', function(result){
    console.log('Successfully crawled '+job.data.url+'  TotalLinks '+result);
  })

  job.on('failed attempt', function(errorMessage, doneAttempts){
    job.data.reattempt=true;
    job.state('inactive').save();
    console.log('Job failed: Retry '+job.data.url);
  })

  job.on('failed', function(errorMessage){
    console.log('Failed  ' +job.data.url+' '+errorMessage);
  })

  job.on('progress',function(progress, data){
  console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );
  });

  return job;
}