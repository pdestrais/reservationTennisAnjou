import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as path from 'path';

import { loginRouter } from './routes/login';
import { protectedRouter } from './routes/protected';
import { userRouter } from "./routes/users";
import { eventsRouter } from "./routes/events";

var dotenv = require('dotenv')

const app: express.Application = express();

app.disable('x-powered-by');

app.use(json());
app.use(urlencoded({ extended: true }));

// api routes
app.use('/api/secure', protectedRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/events', eventsRouter);

if (app.get('env') === 'production') {

  // in production mode run application from dist folder
  app.use(express.static(path.join(__dirname, '/../client')));
}

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next) {
  let err = new Error('Not Found');
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {

  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message
  });
});

export { app }
