const crypto = require('crypto'); // passwrdresttoken eke random string ekk gen krnnonine
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter the name']
        },

        email: {
            type: String,
            required: [true, 'please enter your email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },

        photo: {
            type: String
        },

        role: {
            type: String,
            enum: ['user', 'guide', 'lead-guide', 'admin'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minLength: 8,
            select: false
        },

        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                //only works on CREATE and SAVE 
                validator: function (el) { //apita methana arrow function use krnna beri this keyword eka ekath ekka compatable nathi nisa
                    return el === this.password; //el walin methana kiynnne passwordConfim kiyna eka
                },
                message: 'Passwords are not the same'
            },

        },
        passwordChanged: {
            type: Date,
            default: Date.now
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false
        }

    }
)

userSchema.pre('save', function (next) { // this function here is going to run before a new document is saved
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChanged = Date.now() - 1000; //1000 adu krnn hetuwa thama  mew practically weda krddi welw hithanwt wada wedi wenn puluwan e nisa gap ekak hdl denw
    next();
})

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
})

//instance method
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) { //candidate eka thama aluhtn dila balana eka
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChanged) {
        const changedTimestamp = parseInt(this.passwordChanged.getTime() / 1000, 10); //to get bothin the same form.the passwordchanged is converted to timestamp form
        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp; //if the user has changed the password after the token 
    }
    //false means not changed 
    return false;
}


userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;//meka me return krl thiyenne mokd kiynwnnm meka user email ekkin ywl itpsse user ek apita aphu ewwhm apita puluwn hash wela thiyna e parsword ekai mekai samanda balann compare krla
}

//If the password has not been modified (e.g., when updating other fields like email or username), it skips the hashing process to avoid unnecessary re-hashing.
userSchema.pre('save', async function (next) {

    //only run this function if password was acctually modified
    if (!this.isModified('password')) return next();

    //hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // deleting the data insidde the variable passWordConfirm
    this.passwordConfirm = undefined;
    next();

})



const User = mongoose.model('User', userSchema);

module.exports = User;