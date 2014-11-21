var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var error = require('./error-helpers');
var httpRequest = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */
var archive = {};

archive.paths = {
  'index' : path.join(__dirname, '../web/public/index.html'),
  'loading' : path.join(__dirname, '../web/public/loading.html'),
  'css' : path.join(__dirname, '../web/public/styles.css'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
archive.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    archive.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

//functions will need to handle callbacks because we need to read them asynchronously

archive.readListOfUrls = function(callback){
  //fs read file asynch, convert to array and execute callback passing in array
  fs.readFile(archive.paths.list,'utf-8',function(err,data){
    if (err){
      return error.handle(err);
    }
    callback(data.split('\n'));
  });
};

archive.isUrlInList = function(url,callback){
  //check if url is in list and return boolean
  var result;
  archive.readListOfUrls(function(data){
    result = _(data).contains(url);
    callback(result);
  });
};

archive.addUrlToList = function(url,callback){
  //check if url is in list and then write fall asynch and execute callback with boolean
  var result = false;
  archive.isUrlInList(url,function(isInList){
    if (!isInList){
      fs.appendFile(archive.paths.list,'\n'+url,'utf-8',function(err){
        if (err){
          return error.handle(err);
        }
        result = true;
        callback(result);
      });
    } else {
      callback(true);
    }
  });

};

archive.isURLArchived = function(url,callback){
  //asynch read from file sync and execute callback with boolean
  fs.exists(path.join(archive.paths.archivedSites,url),function(exists){
    callback(exists);
  });
};

archive.downloadUrls = function(callback){
  //
  archive.readListOfUrls(function(list){
    _(list).each(function(url){
      archive.isURLArchived(url,function(isUrlArchived){
        if (!isUrlArchived){
          archive.download(url,callback);
        }
      });
    });
  });
};

archive.download = function(url,callback){
  callback = callback || function(){};
  httpRequest.get('http://'+url,path.join(archive.paths.archivedSites,url),function(err){
    if (err){
      return error.handle(err);
    }
    callback(url);
  });

};

_(exports).extend(archive);
