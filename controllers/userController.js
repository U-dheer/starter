const express = require('express');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {   //Object.keys(obj). makes an array
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error is user POSTs passwords data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update. Please use /updateMyPassword.', 400));
    }

    // 2) Filtered out unwanted fields name that  are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // console.log('filterd body', filteredBody)

    // 2) Update the user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true })

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

//mekenn iuser kenk deleteme unt pora DB eken ain wenne na porage activer status eka false wenw witarai
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined!  please use /signup insted'
    })
}

exports.getAllUsers = factory.getAll(User)
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//     const users = await User.find({ active: true });
//     res.status(200).json({
//         status: 'success',
//         results: users.length,
//         data: {
//             users: users
//         }
//     })
// })

// meken adminta puluwan DB ekenm user kenekw delete krla daanna
exports.deleteUser = factory.deleteOne(User);

//Do not update passwords whith this
exports.updateUser = factory.updateOne(User);


exports.getUser = factory.getOne(User);

// exports.createUser = factory.createOne(User);