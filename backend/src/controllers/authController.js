const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXIPRE_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.accountAddress);
  const cookieOption = {
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token, cookieOption);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = async (req,res) => {
  const newUser = await User.create(req.body);
  
  createSendToken(newUser, 201, res);
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Invalid email Id"
      })
    }
  
    const user = await User.findOne({email}).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: "Incorrect email or password"
      });
    }
  
    createSendToken(user, 200, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong"
    });
  }
}


exports.protect = async (req, res, next) => {
  try {

  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({
      message: "Your are not logged in! Please log in to get access"
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findOne({accountAddress: decoded.id});
  if (!currentUser) {
    return res.status(401).json({
      message: "The user belonging to this token does no longer exist"
    });
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      message: "User recently changed password!Please log in Again."
    });
  }

  req.user = currentUser;

  next();
} catch(err) {
  console.log(err);
  return res.status(500).json({
    message: "Something went wrong"
  });
}
};

exports.getMe = async (req, res, next) => {
  try {

  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({
      message: "Your are not logged in! Please log in to get access"
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findOne({accountAddress: decoded.id});
  if (!currentUser) {
    return res.status(401).json({
      message: "The user belonging to this token does no longer exist"
    });
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      message: "User recently changed password!Please log in Again."
    });
  }



  return res.status(200).json({
    name: currentUser.name,
    role: currentUser.role,
    email: currentUser.email
  });

} catch(err) {
  console.log(err);
  return res.status(500).json({
    message: "Something went wrong"
  });
}
};