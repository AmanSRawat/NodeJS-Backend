const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require( 'validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [50,'A tour must have less or equal to 50 character'],
        minlength: [10,'A tour must have more than 10 character'],
        // validate: [validator.isAlpha,'Tour name should contain only character']
    },
    slug:String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty:{
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum:{
            values: ['easy','medium','difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage:{
        type: Number,
        default: 4.5,
        min: [1.0,'Rating must be above 1.0'],
        max: [5.0, 'Rating must be below 5.0']
    },
    ratingsQuantity:{
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate:{
            validator: function(val){
                return val<this.price
            },
            message: 'Discount should be less then regular price'
        }
    },
    summary:{
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description:{
        type: String,
        trim: true
    },
    imageCover:{
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour:{
        type:Boolean,
        default: false
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
});

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})

tourSchema.pre('save',function(){
    this.slug = slugify(this.name,{lower: true});
});

// tourSchema.pre('save',function(){
//     console.log('Saving the document...');
// })

// tourSchema.post('save',function(doc){
//     console.log(doc);
// })

// Query Middleware
tourSchema.pre(/^find/, function() {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
});

tourSchema.post(/^find/,function(){
    console.log(`Query took ${Date.now()-this.start} milliseconds.`);
})

tourSchema.pre('aggregate',function(){
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
})
const Tour = mongoose.model('Tour',tourSchema);

module.exports = Tour;