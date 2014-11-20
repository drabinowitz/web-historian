var _ = require('underscore');
var archive = require('../helpers/archive-helpers');

var post = {};

post.addUrl = function(req,callback){
  callback = callback || function(){};
  var url = '';
  req.on('data',function(data){
    url += data;
  });
  req.on('end',function(){
    archive.addUrlToList(url.substr(4),function(success){
      callback(success);
    });
  });
};

_(exports).extend(post);
