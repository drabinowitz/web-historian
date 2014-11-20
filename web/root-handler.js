var _ = require('underscore');
var http = require('./http-helpers');
var post = require('../helpers/post-helpers');
var response = require('../helpers/response-helpers');

var root = {};

root.handleRequest = function(req,res){

  if (req.method === 'GET'){
    http.serveIndex(res);
  } else if (req.method === 'POST'){
    post.addUrl(req);
    response.send(response.redirect(res,'/loading'),'Adding to Queue');
  }

};

_(exports).extend(root);
