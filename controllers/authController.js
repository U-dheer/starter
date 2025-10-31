const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), // convert to miliseconds
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; //using https

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; //meka krnna hethuwa thma postman eken apita password eka pennana nisa,eka secure na....meken krnne response eken password eka undefine krna eka

  res.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password !', 400));
  }

  // 2) check if the user && password is correct
  const user = await User.findOne({ email: email }).select('+password');
  // const correct = await user.correctPassword(password, user.password);  //user. use krnn puluwan wenne api model eke hadnne instace method ekak nisa

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  console.log(user);
  // 3) if everything is okay, send token to the client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token and  check of its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in ! please log in to get access', 401)
    );
  }

  // 2) verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // we need to proviede the secret bcz to create the test signature
  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id); //meka balanne user thatmt innwd kiyla,issraha process eka krnna,,,,,,dn me req eka ghnna klin log wla idpu user kenk logout wela hri account delete krl hri wenn puuwnne
  if (!currentUser) {
    return next(
      new AppError(
        'The User belonging to this token does no longer exists',
        401
      )
    );
  }

  // 4) check is the user changed the password after the token was issued
  const hasThePasswordChanged = currentUser.changedPasswordAfter(decoded.iat);
  if (hasThePasswordChanged) {
    return next(
      new AppError('User recently changed password ! please log in again', 401)
    );
  }

  //grant acces to protected route
  req.user = currentUser; //for future
  next(); //next() function is used to call the next middleware function in the stack
});

exports.restrictTo = (...roles) => {
  //mehem krnn hethuwa une middlware fcn wla thaawt aggument ekak daanna ba,e nisa wenma fcn ekak aran eke return eka widihat middlware eka denwa
  return (req, res, next) => {
    //roles is an array [''admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      //req.user.role kiynne protect fcn eke api for future kiyla dal thiyna eka
      return next(
        new AppError(
          'You do not have the permission to perform this action.',
          403
        )
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address..', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`; //not the encripted token just the origial one

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordCconfirm to: ${resetURL}.\nIf you didn't forget your password,please ignore this email ! `;

  try {
    await sendEmail({
      email: req.body.email, //req.body.email or user.email
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!', //never send the token beacase then anyone can reset passwrds
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email, Try again later ! ',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in,send the JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password'); // req.user.id comming form protect middleware

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong ', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
