const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


//Model kiyala dena eken thama meka thawth function ekak return krnw kiyla describe krnne
exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError("No document found with that ID", 404));
        }

        res.status(201).json({
            status: "sucess..",
            data: {
                data: null
            }
        })

    })



exports.updateOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: "true", runValidators: "true" })

        if (!doc) {
            return next(new AppError("No document found with that ID", 404));
        }

        res.status(201).json({
            status: "sucess..",
            data: {
                data: doc
            }
        })

    })

exports.createOne = Model => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: "success..",
            data: {
                data: doc
            }
        })
    });
}


exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        // console.log("Fetching document by ID:", req.params.id);

        let query = Model.findById(req.params.id);

        if (popOptions) {
            query = query.populate(popOptions)
        }

        const doc = await query;
        // const doc = await Model.findById(req.params.id).populate('reviews')

        if (!doc) {
            return next(new AppError("No document found with that ID", 404));
        }

        res.status(201).json({
            status: "succsess..",
            data: {
                data: doc
            },
        });

    })

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {

        //to allow for nested GET reviews on tour(hack)
        let filter = {}
        if (req.params.tourId) filter = { tour: req.params.tourId }


        // EXECUTE QUERY
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();
        // const doc = await features.query.explain();
        const doc = await features.query

        //SEND RESPONSE
        res.status(200).json({
            status: 'succsess..',
            results: doc.length,
            data: {
                data: doc
            }
        }
        );

    });





