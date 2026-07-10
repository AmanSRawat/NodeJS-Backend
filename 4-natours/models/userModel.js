const crypto = require('crypto')
const mongoose  = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please provide your name']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'Please provide your email'],
        lowercase: true,
        validate: [validator.isEmail,'Provide a valid email']
    },
    photo:{
        type: String,

    },
    role:{
        type: String,
        enum: ['user','guide','lead-guide','admin'],
        default: 'user'
    },
    password:{
        type: String,
        required: [true,'Please provide a password'],
        minlength: 8,
        select: false
    },
    confirmPassword:{
        type: String,
        required: [true,'Please confirm your password'],
        validate: {
            // This only work for create and save 
            validator: function(el){
                return el === this.password;
            },
            message:'Password are not same!'
        }
    },
    passwordChangedAt: {
        type: Date,
        required: false
    },
    passwordResetToken: String,
    passwordResetExpier: Date
})

userSchema.pre('save',function(){
    if(!this.isModified('password') || this.isNew) return;
    this.passwordChangedAt = Date.now()-1000;
})

userSchema.pre('save',async function(){
    if(!this.isModified('password')) return;
    this.password =await bcrypt.hash(this.password,12);

    this.confirmPassword = undefined;
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        console.log(changedTimeStamp,JWTTimestamp);
        return JWTTimestamp<changedTimeStamp;
    }
    
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    console.log({resetToken}, this.passwordResetToken);
    this.passwordResetExpier = Date.now() + 10*60*1000

    return resetToken;
}

const User = mongoose.model('User',userSchema);

module.exports = User