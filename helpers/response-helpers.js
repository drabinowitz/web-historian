var _ = require('underscore');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

var attachHeaders = function(res,status,additionalHeaders){
  var headersToAttach = headers;
  if (additionalHeaders !== null && typeof additionalHeaders==="object"){
    headersToAttach = _(_(headers).clone()).extend(additionalHeaders);
  }
  res.writeHead(status,headersToAttach);
  return res;
};

var response = {};

response.success = function(res){
  return attachHeaders(res,200);
};

response.redirect = function(res,redirectTo){
  return attachHeaders(res,302,{Location:redirectTo});
};

response.notFound = function(res){
  return attachHeaders(res,404);
};

response.notFound.send = function(res){
  response.send(response.notFound(res),'page not found');
};

response.send = function(res,message){
  return res.end(message);
};

_(exports).extend(response);
