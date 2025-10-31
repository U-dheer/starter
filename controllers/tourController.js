const express = require('express');
const Tour = require('../models/tourModel');
const mongoose = require('mongoose')
const APIFeatures = require('../utils/apiFeatures')
const catchAsnc = require('../utils/catchAsync')
const factory = require('../controllers/handlerFactory');
const AppError = require('../utils/appError');
exports.router = express.Router();


exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = factory.getAll(Tour)
// exports.getAllTours = catchAsnc(async (req, res, next) => {

//     // //  BULD QUERY
//     // // 1)A) FILTERING
//     // const queryObj = { ...req.query };
//     // const excludeFields = ['page', 'sort', 'limit', 'page'];
//     // excludeFields.forEach(el => delete queryObj[el]);

//     // // 1)B) ADVANCED FILTRTING
//     // let queryStr = JSON.stringify(queryObj)
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); //match kiyla gnn eka callbak ekak eken wenne replce wenn oni ewa replace wela eka aluth string rkakt dl dena eka
//     // console.log(JSON.parse(queryStr));


//     // console.log(req.query);
//     // let query = Tour.find(JSON.parse(queryStr));

//     // { duration: { $gte: '5' }, difficulty: 'easy' }
//     // { duration: { gte: '5' }, difficulty: 'easy' }
//     // gte,gt,lte,lt


//     // const allTours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
//     // res.status(201).json({
//     //     status: "succsess..",
//     //     data: {
//     //         tour: allTours
//     //     }
//     // })


//     // // 2) SORTING
//     // if (this.queryString.sort) {
//     //     const sortBy = this.queryString.sort.split(',').join(' ');
//     //     console.log(sortBy)
//     //     query = query.sort(sortBy)
//     // } else {
//     //     query = query.sort('-createdAt');
//     // }

//     // // 3)FIELD LIMITING
//     // if (this.queryString.fields) {
//     //     console.log("Fields from query:", this.queryString.fields);
//     //     const fields = this.queryString.fields.split(',').join(' ');
//     //     console.log("Requested Fields:", fields);
//     //     query = query.select(fields);
//     // } else {
//     //     query = query.select('-__v');
//     // }

//     // // 4) PAGINATION
//     // const page = this.queryString.page * 1 || 1;
//     // const limit = this.queryString.limit * 1 || 100;
//     // const skip = (page - 1) * limit;

//     // query = query.skip(skip).limit(limit);

//     // if (this.queryString.page) {
//     //     const numTours = await Tour.countDocuments();
//     //     if (skip >= numTours) throw new Error('This page does not exsists')
//     // }



//     // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .pagination();
//     const tours = await features.query;


//     // const tours = await Tour.find().select("name duration difficulty price");
//     // console.log("Manually Queried Tours:", tours);


//     //SEND RESPONSE
//     res.status(200).json({
//         status: 'succsess..',
//         results: tours.length,
//         data: {
//             tour: tours
//         }
//     }
//     );

//     // const allTours = await Tour.find({
//     //     duration: 5,
//     //     difficulty: 'easy'
//     // })

// });


exports.createTour = factory.createOne(Tour);

// exports.createTour = catchAsnc(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//         status: "succsess..",
//         data: {
//             tour: newTour
//         }
//     })
// });


exports.getTour = factory.getOne(Tour, { path: 'reviews' })
// exports.getTour = catchAsnc(async (req, res, next) => {
//     const selectedTour = await Tour.findById(req.params.id).populate('reviews')

//     if (!selectedTour) {
//         return next(new AppError("No tour found with that ID", 404));
//     }

//     res.status(201).json({
//         status: "succsess..",
//         data: {
//             tour: selectedTour
//         }
//     })

// })

exports.updateTour = factory.updateOne(Tour);
// exports.updateTour = catchAsnc(async (req, res, next) => {
//     const selectedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: "true", runValidators: "true" })

//     if (!selectedTour) {
//         return next(new AppError("No tour found with that ID", 404));
//     }

//     res.status(201).json({
//         status: "sucess..",
//         data: {
//             tour: selectedTour
//         }
//     })

// })


exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsnc(async (req, res, next) => {
//     const selectedTour = await Tour.findByIdAndDelete(req.params.id);

//     if (!selectedTour) {
//         return next(new AppError("No tour found with that ID", 404));
//     }

//     res.status(201).json({
//         status: "sucess..",
//         data: {
//             tour: null
//         }
//     })

// })



exports.getTourStats = catchAsnc(async (req, res, next) => {
    const stats = await Tour.aggregate(
        [
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: { $sum: 1 }, // this will add 1 for each document goes thorough the pipeline
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            }
        ]);
    res.status(200).json({
        status: 'sucess',
        data: {
            stats
        }
    })

})


exports.getMonthPlan = catchAsnc(async (req, res, next) => {
    const year = req.params.year * 1; //2021
    const plan = await Tour.aggregate(
        [
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$startDates" }, //statart dates wla month eka glwl id eka widihat dagnnw
                    numTours: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project:
                {
                    _id: 0
                }
            },
            {
                $sort:
                {
                    numTourStarts: 1
                }
            },
            {
                $limit: 12
            }
        ])
    res.status(200).json({
        status: 'sucess',
        data: {
            plan
        }
    })

})

// /tours-within/:distance/center/:lating/unit/:unit
// /tours-within/200/center/20,40/unit/mi
exports.getToursWithin = catchAsnc(async (req, res, next) => {
    const { distance, lating, unit } = req.params;
    const [lat, lng] = lating.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        return next(new AppError('Please provide latitude and longtitude in the format lat,lng', 400));
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })


    res.status(200).json({
        status: 'sucess',
        results: tours.length,
        data: {
            data: tours
        }
    })

})

exports.getDistances = catchAsnc(async (req, res, next) => {
    const { lating, unit } = req.params;
    const [lat, lng] = lating.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    if (!lat || !lng) {
        return next(new AppError('Please provide latitude and longtitude in the format lat,lng', 400));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: { // meken wennw apita ena data tiken koi data tikd oni kiyala specify karana eka
                distance: 1,
                name: 1
            }
        }
    ])


    res.status(200).json({
        status: 'sucess',
        data: {
            data: distances
        }
    })
})