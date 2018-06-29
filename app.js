var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist/public')));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/dist/index.html'));
    //__dirname : It will resolve to your project folder.
  });

app.listen(process.env.PORT || 3000);