const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const jsdom = require('jsdom');
app.use(bodyParser.text());
const { JSDOM } = jsdom;

app.post('/', function(req, res) {
	try {
		var jscode = req.body;
		jscode = jscode.replace(' max-age=3600; SameSite=None; Secure;', '');
		jscode = jscode.replace('/aes.min.js', 'https://sso.garena.com/aes.min.js');
		jscode = jscode.replace("location.href", "var lequocanh");
		jscode = new JSDOM(jscode, { runScripts: 'dangerously', resources: 'usable' });
		setTimeout(function() {
			if (jscode.window.document.cookie === null) {
				res.status(400).json({
				  statusCode: 400,
				  status: 'cannot get cookies'
				});
				return;
			}
			res.status(200).json({
			  statusCode: 200,
			  cookie: jscode.window.document.cookie ? jscode.window.document.cookie : null
			});
		}, 2500);
		return;
	}
	catch (e) {
		res.status(400).json({
		  statusCode: 400,
		  status: 'cannot get cookies: ' + e
		});
		return;
	}
});

app.all('*', function(req, res) {
	res.status(404).json({
	  statusCode: 404,
	  stauts: "wrong api"
	});
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});