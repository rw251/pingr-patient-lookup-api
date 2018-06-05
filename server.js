const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const mongoose = require('mongoose');

const config = require('./server/config.js');

const routes = require('./server/routes');
const http = require('http');

const DEBUG = false;

mongoose.set('debug', DEBUG);
mongoose.Promise = global.Promise;
mongoose.connect(config.db.url);

const app = express();

// add gzip
app.use(compression());

app.use(cors({ origin: ['https://pingr.srft.nhs.uk'] }));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('pages/error.jade', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('pages/error.jade', {
    message: err.message,
    error: {},
  });
});

/**
 * Get port from config or environment and store in Express.
 */

let { port } = config.server;
if (!config.server.port) port = process.env.PORT || '5500';
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    `pipe ${addr}` :
    `port ${addr.port}`;
  console.log(`Server listening on ${bind}`);
}

server.on('error', onError);
server.on('listening', onListening);
