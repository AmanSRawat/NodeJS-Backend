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
    }
})

userSchema.pre('save',async function(){
    if(!this.isModified('password')) return;
    this.password =await bcrypt.hash(this.password,12);

    this.confirmPassword = undefined;
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

const User = mongoose.model('User',userSchema);

module.exports = User