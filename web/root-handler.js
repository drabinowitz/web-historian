var _ = require('underscore');
var http = require('./http-helpers');
var post = require('../helpers/post-helpers');
var response = require('../helpers/response-helpers');
var archive = require('../helpers/response-helpers');

var root = {};

root.handleRequest = function(req,res){

  if (req.method === 'GET'){
    http.serveIndex(res);
  } else if (req.method === 'POST'){
    post.addUrl(req,function(sendToLoading,uri){
      if (sendToLoading){
        response.redirect.send(res,'/loading');
      } else {
        response.redirect.send(res,'/'+uri);
      }
    });
  }

};

_(exports).extend(root);
