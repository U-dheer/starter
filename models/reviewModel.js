const mongoose = require("mongoose");
const Tour = require("../models/tourModel")

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }

},
    {//this does is making sure that when we have a virtual property (a field that is not storef in the database but calculated using some other value)show up whenever there is an output
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // })

    this.populate({
        path: 'user',
        select: 'name photo'
    })

    next();
})


// reviewSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'user',
//         select: 'name photo'
//     }).populate({
//         path: 'tour',
//         select: 'name'
//     })

//     next();
// })


//Dev 01
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])
    console.log(stats)

    if (stats.length > 0) {
        //Dev 3
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }


}

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })// methna krla thiyenne compond index eka gahala ekat option ekak dila thiyana eka

//Dev 2
reviewSchema.post('save', function () {
    //this.constructer = Model             this case the medel review
    //this points to current review
    this.constructor.calcAverageRatings(this.tour);
})


//Dev 4
// findByIdUpdate
// findByIDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.clone().findOne();
    // console.log(this.r);
    next();
})


reviewSchema.post(/^findOneAnd/, async function () {
    if (this.r) {
        // await this.findOne() use krnn beri mokd me post middlware ekat eddi query eka alredy execute wela iwaraine
        await this.r.constructor.calcAverageRatings(this.r.tour)
    }

})
// reviewSchema.post(/^save|findOneAndUpdate/, function (doc, next) {
//     this.constructor.calcAverageRatings(doc.tour)
//     next();
// })

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review; 