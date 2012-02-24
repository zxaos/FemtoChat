var http = require('http');
var fs = require('fs');
var url = require('url');

function start(){
  var template = fs.readFileSync('page.html');
  var log = [];
  var counter = 0;
  var listens = [];
  function handleRequest(req, res){
    parts = url.parse(req.url, true);
    if (parts.pathname === '/' || parts.pathname === '/index'){
      console.log('index');
      res.writeHead(200, {'Content-Type': 'application/xhtml+xml'});
      res.write(template);
      res.end();
    } else if (parts.pathname === '/talk'){
      console.log('talk');
      if (parts.query.input.length > 0){
        log.push(parts.query.input);
      }
      res.end();
      var l;
      while(listens.length > 0){
        l = listens.pop();
        l.write(parts.query.input.toString());
        l.end();
      }
    } else if (parts.pathname === '/listen'){
      console.log('got listen req');
      res.writeHead(200, {'Content-Type': 'text/plain'});
      listens.push(res);
    } else {
      console.log('404: ' + parts.pathname);
      res.writeHead(404);
      res.write("Not Found");
      res.end();
    }
}
  http.createServer(handleRequest).listen(8888);
}

start();


