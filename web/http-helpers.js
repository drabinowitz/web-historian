var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var error = require('../helpers/error-helpers');
var response = require('../helpers/response-helpers');

var http = {};

var serveAssets;

http.serveAssets = serveAssets = function(res, asset, callback) {

  fs.readFile(asset,function(err,data){
    if (err){
      return error.handle(err);
    }
    callback(data);
  });

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
};



// As you progress, keep thinking about what helper functions you can put here!

// serve index for root
http.serveIndex = function(res) {
   serveAssets(response.success(res),archive.paths.index,function(data){
     response.send(res,data);
   });
};

// serve loading on POST
http.serveLoading = function(res){
  serveAssets(response.success(res),archive.paths.loading,function(data){
    response.send(res,data);
  });
};

http.serveCss = function(res){
  serveAssets(response.success(res),archive.paths.css,function(data){
    response.send(res,data);
  });
};

// serve archived page if it exists
http.serveArchived = function(res,uri){
  serveAssets(response.success(res),path.join(archive.paths.archivedSites,uri),function(data){
    response.send(res,data);
  });
};

_(exports).extend(http);
