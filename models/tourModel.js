const mongoose = require("mongoose");
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less than or equal to 40 characters'],
        minlength: [10, 'A tour name must have more than or equal to 10 characters'],
        validate: {
            validator: function (val) {
                return validator.isAlpha(val, 'en-US', { ignore: ' ' });
            }
        }
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']

    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']

    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either : easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10  //example     4.66666, 46.6666 ,47,4.7
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    // guides: Array,// USED TO EMBED DATA
    guides: [
        {
            type: mongoose.Schema.ObjectId,//this means we expect a type of the elements in the guides  array to be a mongodb ID
            ref: 'User'
        }
    ],
    price: {
        type: Number,
        required: [true, 'A tour must have a price']

    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                //THIS ONLY POINTS TO CURRENT DOC ON NEW DOCUMENT CREATION
                return val < this.price  // 100 < 200  ==>  true
            },
            message: 'Discount price ({VALUE}) be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,  //meken wenne api dena eke white spaces okkom ain krna eka string eka gaddi
        required: [true, 'A tour must have a summery']

    },
    description: {
        type: String,
        trim: true  //meken wenne api dena eke white spaces okkom ain krna eka string eka gaddi
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        //GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//indexing
// tourSchema.index({ price: 1 }) //indexing according on the price in assending oder 
tourSchema.index({ price: 1, ratingsAverage: -1 }) //compound indexing according on the price and ratingsAverage  
tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' }) //indexing for geospatial 


tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});


// virtual populate
tourSchema.virtual('reviews', { //me review kiyla dila thyana field ekat thama phala ewa wetenne
    ref: 'Review',
    foreignField: 'tour',//this is the name of the field in the other model,so in the review model in this case where the reference to the current model is stored kotin kiwoth anith model eke mona field ekemd mekat connect krnn puluwan
    localField: '_id',//where that ID is ctually stored here in this current tour model
})

// DOCUMENT MIDDLEWARE : runs before .save() and .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});


//EMBEDED DATA in users and tours
// tourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id))//dn meken eka tour ekakt dl thiyna guide la gana anuwa e gant samana promises gnk ewnwne eka saave sakr gnn thama guidesPromises kiyl ekak argnne.eke ena data okkom array ekka object widiht thiyenne
//     this.guides = await Promise.all(guidesPromises);//e object okkom promises ekapr run thma me all ghnne
//     next();
// })

// tourSchema.pre('save', function (next) {
//     console.log('Will save document...')
//     next();
// })

// // DOCUMENT MIDDLEWARE : runs after .save() and .create()
// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// })

//QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
})

tourSchema.pre(/^find/, function (next) {
    this.populate({ //me populate kiyl dan eken wenne tourmodel eke hduwa guides giyana eka populate krns eka (kotinm purwl dana eka adala id eke datawlain)
        path: 'guides',
        select: '-__v -passwordChanged'
    })
    next();
})

tourSchema.post(/^find/, function (doc, next) {
    console.log(doc);
    console.log(`The query took ${Date.now() - this.start} miliseconds...`);
    next();
})

// // AGGEGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     next();
// })

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;