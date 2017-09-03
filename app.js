var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cache = require('./modules/filedrop');

var routes = require('./routes/index');
var users = require('./routes/user');
var tests = require('./routes/test');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/test', tests);

/* using file drop test - start*/

cache.on('error', (error) => {
    console.log('Something unexpected happened');
    console.log(error.stack);
});
 
cache.on('ready', (cache) => { // The event which triggers the provided callback 
    console.log('Cache ready !!!');
 
    // cache.read(...); 
});
 
cache.on('update', (cache) => {
    console.log('Cache updated !');
 
    // cache.read(...); 
});
 
cache.on('directory', (directory) => {
    console.log('new directory added: "' + directory.location + '"');
});
 
cache.on('file', (file) => {
    console.log('new file added: "' + file.location + '"');
    console.log('name: ', file);
});
 
cache.on('change', (element) => {
    if (element.stats.isDirectory()) {
        console.log('directory "' + element.location + '" changed');        
    } else {
        console.log('file "' + element.location + '" changed');
    }
});
 
cache.on('unlink', (element) => {
    if (element.stats.isDirectory()) {
        console.log('directory "' + element.location + '" removed');
    } else {
        console.log('file "' + element.location + '" removed');
    }
});
 
/* List */
cache.list();
/*
File
=> ['']
 
Directory
=> ['', '1.txt', '2.txt', '3.txt', ...]
*/
 
/* Read */
cache.read();
/*
File
=>  {
        content: Buffer<00 01 02 ...>   // content of the file
        data: {},                       // metadata of the file, you fill it
        location: '',                   // location of the file
        stats: {                        // stats of the file
            atime: ...
            ctime: ...
            mtime: ...
            ...
        }
    }
 
Directory
=>  {
        content: ['1.txt', '2.txt', '3.txt', ...],  // content of the directory
        data: {},                                   // metadata of the directory, you fill it
        location: '',                               // location of the directory
        stats: {                                    // stats of the directory
            atime: ...
            ctime: ...
            mtime: ...
            ...
        }
    }
*/

/* using file drop test - end*/


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
