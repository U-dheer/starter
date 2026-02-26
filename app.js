const express = require('express');
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan'); //login middlewere
const helmet = require('helmet'); //security middleware
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Natours API',
      version: '1.0.0',
      description: 'API for Natours application',
    },
    servers: [
      {
        url: 'https://natours-rho-self.vercel.app',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // api data ena thana hoayagnna amru welawt meka use krnw,methndi wenne path module eken adala directory eka join krnw api awsane deka views kiyna  ekat

//serving static files
app.use(express.static(path.join(__dirname, 'public'))); //This serves static files like images, CSS, JavaScript, etc., from a folder named public.That means anything in the /public folder will be available directly in the browser.

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

//  1) GLOBAL MIDDLEWARES
//middlewere for the post method

// Enable CORS
app.use(
  cors({
    origin: ['https://starter.udheer.me', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  }),
);

// set Security HTTP heders
app.use(helmet());

//Body parser ,reading data from body to req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // meken wenne query wladi use krnn wena $ sign eka reqest eken ain krnw

//Data sanitization aginst XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    //meken wenne request ekedi attaker kenek ekam flid name ekam reqest ekedi ekaprkat wada use krla query eka ghn eka nwttna eka.ekawage filed names ain krla dnw
    whitelist: [
      //WHITE LIST EKA KIYNNE EHEM DUPLICATE WLA THYENNA INU LIST EKA ARRAY EKKIN DENA EKA
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// development login
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit requests form same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //meken krnne ekam IP eken enn puluwan request gaana 100k krnwa peyak athulata(miliseconds wlin thma danoni)
  message: 'Too many request form this IP, please try again in an hour!',
});

app.use('/api', limiter); //api kiyala thiyna hama route ekakatam meka apply wenw

//middlwhere
app.use((req, res, next) => {
  console.log('Hello from the middleware.....');
  next();
});

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour)
// app.get('/api/v1/tours/:id', getTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //     status: 'failed',
  //     message: `${req.originalUrl} does not exist in this server`
  // })

  // const err = new Error(`${req.originalUrl} does not exist in this server`);
  // err.status = 'fail'
  // err.statusCode = 404;

  next(new AppError(`${req.originalUrl} does not exist in this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
