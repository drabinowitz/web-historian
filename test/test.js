var expect = require('chai').expect;
var handler = require("../web/request-handler");
var stubs = require("./stubs/stubs");
var fs = require('fs');
var archive = require("../helpers/archive-helpers");
var path = require('path');
var res;

archive.initialize({
  list : path.join(__dirname, "/testdata/sites.txt"),
  archivedSites : path.join(__dirname, '/testdata/sites')
});

// Conditional async testing, akin to Jasmine's waitsFor()
var waitForThen = function(test, cb) {
  setTimeout(function() {
    test() ? cb.apply(this) : waitForThen(test, cb);
  }, 5);
};

beforeEach(function(){
  res = new stubs.Response();
});

describe("Node Server Request Listener Function", function() {

  it("Should answer GET requests for /", function(done) {
    var req = new stubs.Request("/", "GET");

    handler.handleRequest(req, res);

    waitForThen(
      function() { return res._ended; },
      function(){
        expect(res._responseCode).to.equal(200);
        expect(res._data.toString().match(/<input/)).to.be.ok; // the resulting html should have an input tag
        done();
    });
  });

  it("Should answer GET requests for archived websites", function(done) {
    var fixtureName = "www.google.com";
    var req = new stubs.Request("/" + fixtureName, "GET");

    handler.handleRequest(req, res);

    waitForThen(
      function() { return res._ended; },
      function(){
        expect(res._responseCode).to.equal(200);
        expect(res._data.toString().match(/google/)).to.be.ok; // the resulting html should have the text "google"
        done();
    });
  });

  it("Should append submitted sites to 'sites.txt'", function(done) {
    var url = "www.example.com";
    var req = new stubs.Request("/", "POST", {url: url});

    // Reset the test file and process request
    fs.writeFileSync(archive.paths.list, "");
    handler.handleRequest(req, res);

    waitForThen(
      function() { return res._ended; },
      function(){
        var fileContents = fs.readFileSync(archive.paths.list, 'utf8');
        expect(res._responseCode).to.equal(302);
        expect(fileContents).to.equal("\n" + url);
        done();
    });
  });

  it("Should 404 when asked for a nonexistent file", function(done) {
    var req = new stubs.Request("/arglebargle", "GET");

    handler.handleRequest(req, res);

    waitForThen(
      function() { return res._ended; },
      function(){
        expect(res._responseCode).to.equal(404);
        done();
    });
  });

});

describe("html fetcher helpers", function(){

  it("should have a 'readListOfUrls' function", function(done){
    var urlArray = ["example1.com", "example2.com"];
    var resultArray;

    fs.writeFileSync(archive.paths.list, urlArray.join("\n"));
    archive.readListOfUrls(function(urls){
      resultArray = urls;
    });

    waitForThen(
      function() { return resultArray; },
      function(){
        console.log('readListOfUrls result');
        expect(resultArray).to.deep.equal(urlArray);
        done();
    });
  });

  it("should have a 'isUrlInList' function", function(done){
    var urlArray = ["example1.com", "example2.com"];
    var resultArray = [];

    fs.writeFileSync(archive.paths.list, urlArray.join("\n"));
    archive.isUrlInList("example1.com",function(exists){
      resultArray.push(exists);
    });

    archive.isUrlInList("example2.com",function(exists){
      resultArray.push(exists);
    });

    archive.isUrlInList("example3.com",function(exists){
      resultArray.push(exists);
    });

    waitForThen(
      function() { return resultArray; },
      function(){
        console.log('isUrlInList result');
        expect(resultArray).to.deep.equal([true,true,false]);
        done();
    });
  });

  it("should have a 'addUrlToList' function", function(done){
    var urlArray = ["example1.com", "example2.com"];
    var resultArray;

    fs.writeFileSync(archive.paths.list, urlArray.join("\n"));
    archive.addUrlToList('example3.com',function(success){
      if (success){
        archive.readListOfUrls(function(urls){
          resultArray = urls;
          urlArray.push('example3.com');
        });
      }
    });


    waitForThen(
      function() { return resultArray; },
      function(){
        console.log('addUrlToList result');
        expect(resultArray).to.deep.equal(urlArray);
        done();
    });
  });

  it("should have a 'isURLArchived' function", function(done){
    var realWebsite = 'www.google.com';
    var fakeWebsite = 'www.example.com';
    var resultArray;
    var placeholder = [];
    archive.isURLArchived(realWebsite,function(isURLArchived){
      placeholder.push(isURLArchived);
      archive.isURLArchived(fakeWebsite,function(isURLArchived){
        placeholder.push(isURLArchived);
        resultArray = placeholder;
      });
    });
    waitForThen(
      function() {
        return resultArray;
      },
      function() {
        console.log('isURLArchived result');
        expect(resultArray).to.deep.equal([true,false]);
        done();
      }
    );
  });

  it("should have a 'downloadUrls' function", function(done){
    var fbweb = 'www.facebook.com';
    var gweb = 'www.google.com';
    urlArray = [fbweb,gweb];
    fs.writeFileSync(archive.paths.list, urlArray.join("\n"));
    var resultObj;
    archive.downloadUrls(function(url){
      archive.isURLArchived(url,function(isURLArchived){
        resultObj = {};
        resultObj[url] = isURLArchived;
      });
    });
    waitForThen(
      function() {return resultObj; },
      function() {
        console.log('downloadUrls result');
        expect(resultObj[fbweb]).to.equal(true);
        done();
      }
    );
  });

});
