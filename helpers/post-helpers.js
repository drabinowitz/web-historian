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
    url = url.substr(4);
    archive.isURLArchived(url,function(alreadyArchived){
      if (!alreadyArchived){
        archive.addUrlToList(url,function(success){
          callback(!alreadyArchived,url);
        });
      } else {
        callback(!alreadyArchived,url);
      }

    });
  });
};

_(exports).extend(post);
