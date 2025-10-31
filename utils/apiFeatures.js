class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }


    filter() {
        //  BULD QUERY
        // 1)A) FILTERING
        const queryObj = { ...this.queryString };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);

        // 1)B) ADVANCED FILTRTING
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); //match kiyla gnn eka callbak ekak eken wenne replce wenn oni ewa replace wela eka aluth string rkakt dl dena eka
        console.log(JSON.parse(queryStr));
        this.query = this.query.find(JSON.parse(queryStr));

        return this; // this means the entire object
    }

    sort() {
        // 2) SORTING
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        // 3)FIELD LIMITING
        if (this.queryString.fields) {
            console.log("Fields from query:", this.query.fields);
            const fields = this.queryString.fields.split(',').join(' ');
            console.log("Requested Fields:", fields);

            this.query = this.query.select(fields);
            // console.log('qqqqqqqqqqqqqqqqqqqqqqqqqq', typeof (fields));
            // console.log('dddddddddddddddddddddddddddddddddd', this.query);
            // console.log(first);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    pagination() {
        // 4) PAGINATION
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }


    // pagination() {
    //     // Ensure page and limit are valid numbers
    //     const page = parseInt(this.queryString.page, 10) || 1;
    //     const limit = parseInt(this.queryString.limit, 10) || 100;

    //     // console.log('pageeeeeeeeeeeeee', this.queryString.page)
    //     // Ensure page is not negative
    //     if (page < 1) page = 1;

    //     const skip = (page - 1) * limit;

    //     // console.log(`📌 Pagination - Page: ${page}, Limit: ${limit}, Skip: ${skip}`);

    //     this.query = this.query.skip(skip).limit(limit);
    //     // console.log('rrrrrrrrrrrrrrrrrr', this.query);
    //     // console.log('jjjjjjjjjjjjjjjjjjjjj', this.query.skip);
    //     return this;
    // }


}

module.exports = APIFeatures;