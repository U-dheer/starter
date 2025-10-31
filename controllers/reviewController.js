// const catchAsync = require("../utils/catchAsync");
const Review = require('../models/reviewModel');
const factory = require('../controllers/handlerFactory');

// for creatingn reviews as a middlware fcn
exports.setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }

    if (!req.body.user) {
        req.body.user = req.user.id; //req.user kiyna eka ennne protected middleware eken
    }
    next();
}


exports.getAllReviews = factory.getAll(Review);
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {}
//     if (req.params.tourId) filter = { tour: req.params.tourId }

//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: 'success',
//         resluts: reviews.length,
//         data: {
//             reviews
//         }
//     })
// })

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);

