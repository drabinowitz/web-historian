var url = require('url');
var root = require('./root-handler');
var archiveHandler = require('./archive-handler');
var loading = require('./loading-handler');
// require more modules/folders here!

//router object
var router = {
  '/':root.handleRequest,
  '/loading':loading.handleRequest,
  '/styles.css':root.sendCss
};

exports.handleRequest = function (req, res) {
  //parse incoming from request
  var uri = url.parse(req.url).pathname;
  //use router to lookup the request
  if (router[uri]){
    //serve static content to root get
    router[uri](req,res);
  } else {
    archiveHandler.handleRequest(req,res);
  }

    //on any post

      //use archive helpers to check data

      //use response.writehead to redirect to loading page

    //on get to not root

      //redirect to archived page if it exists

      //404 if it does not

  // res.end(archive.paths.list);
};
