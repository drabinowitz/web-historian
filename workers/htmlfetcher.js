// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var _ = require('underscore');
var archive = require('../helpers/archive-helpers');

var CronJob = require('cron').CronJob;

var htmlfetcher = {};

htmlfetcher.startCronJob = function(){
  if (!htmlfetcher.cronJob){
    htmlfetcher.cronJob = new CronJob('00 * * * * *', function(){
      archive.downloadUrls();
    }, null, true, "America/Philadelphia");

  }
};

_(exports).extend(htmlfetcher);
