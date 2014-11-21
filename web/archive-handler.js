var url = require('url');
var path = require('path');
var _ = require('underscore');
var http = require('./http-helpers');
var response = require('../helpers/response-helpers');
var archive = require('../helpers/archive-helpers');

var archiveHandler = {};

archiveHandler.handleRequest = function(req,res){

  var uri = url.parse(req.url).pathname;

  uri = uri.substr(1);

  if (req.method === 'GET'){

    archive.isURLArchived(uri,function(exists){
      if (exists){
        http.serveArchived(res,uri);
      } else {
        archive.isUrlInList(uri,function(listed){
          if (listed){
            response.redirect.send(res,'/loading');
          } else {
            response.notFound.send(res);
          }
        });
      }
    });

  } else {
    response.notFound.send(res);
  }
};

_(exports).extend(archiveHandler);
