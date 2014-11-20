var _ = require('underscore');
var http = require('./http-helpers');
var response = require('../helpers/response-helpers');

var loading = {};

loading.handleRequest = function(req,res){

  if (req.method === 'GET'){
    http.serveLoading(res);
  } else {
    response.notFound.send(res);
  }

};

_(exports).extend(loading);
