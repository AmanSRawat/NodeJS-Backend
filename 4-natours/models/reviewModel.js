const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review:{
        type: String,
        maxlength: [250,'A review must not be greater than 250 words'],
        trim: true
    },
    rating:{
        type: Number,
        min: [0,'A rating must be positive'],
        max: [5,'A rating must be below 5.0']
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    user:[
        {
            type: mongoose.Schema.ObjectId,
            ref:'User'
        }
    ],
    tour:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour'
        }
    ]
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
}
)

reviewSchema.pre(['save' ,/^find/],function(){
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    // .populate({
    //     path:'tour',
    //     select: 'name '
    // })
})

const review = mongoose.model('Review',reviewSchema);

module.exports = review;