// load http module
var http = require('http');
var fs = require('fs');
var url = require('url');

// create http server
http.createServer(function (req, res) {
	var request = url.parse(req.url, true);
	var action = request.pathname;
	var img;

	//console.log('spacetruckin:Hello!');

	var contentType = action.substr(action.lastIndexOf('.') + 1);
	switch(contentType) {
	case 'png':
		img = fs.readFileSync('.' + action);
		res.writeHead(200, {'Content-Type':'image/png'});
		res.end(img, 'binary');
		break;
	case 'jpg':
		img = fs.readFileSync('.' + action);
		res.writeHead(200, {'Content-Type':'image/jpeg'});
		res.end(img, 'binary');
		break;
	case 'ico':
		img = fs.readFileSync('.' + action);
		res.writeHead(200, {'Content-Type':'image/vnd.microsoft.icon'});
		res.end(img, 'binary');
		break;
	case 'mp3':
		var sound = fs.readFileSync('.' + action);
		res.writeHead(200, {'Content-Type':'audio/mpeg'});
		res.end(sound, 'binary');
		break;
	case 'css':
		fs.readFile('.' + action, 'utf8', function(err, data) {
			res.writeHead(200, {'Content-Type':'text/css'});
			res.write(data);
			res.end();
		});
		break;
	case 'js':
		fs.readFile('.' + action, 'utf8', function(err, data) {
			res.writeHead(200, {'Content-Type':'text/javascript'});
			res.write(data);
			res.end();
		});
		break;
	default:
		fs.readFile('main.html', 'utf8', function(err, data) {
			res.writeHead(200, {'Content-Type':'text/html'});
			res.write(data);
			res.end();
		});
	}
}).listen(162, function() { console.log('orbygraph.com server on'); });
