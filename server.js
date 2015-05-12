var express = require( 'express' );
var path = require( 'path' );
var app = express();

app.use( '/assets/', express.static( './assets' ) );
app.use( '/resources/', express.static( './resources' ) );
app.use( '/bower_components/', express.static( './bower_components' ) );

app.get( '/', function (req, res) {
  res.sendFile( path.join( __dirname, '/de/dist/index.html' ) );
});

var server = app.listen( 3000 );
