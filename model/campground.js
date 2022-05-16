const mongoose = require("mongoose");
const Review = require('./review');
const Schema = mongoose.Schema ; 

const campgroundSchema = new Schema({
    tittle : String , 
    price : Number , 
    description : String , 
    location : String ,
    Image : String , 
    author : {
        type : Schema.Types.ObjectId , 
        ref : 'User'
    } , 
    reviews : [{
        type : Schema.Types.ObjectId , 
        ref : "Review"
    }]
});

campgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id : {
                $in: doc.reviews 
            }
        })
    }
})

module.exports = mongoose.model('Campground' , campgroundSchema); 

// const express = require('express'); 
// const app = express(); 
// const router = express.Router() ; 

// router.get('/', (req,res)=>{
//     res.send('THIS IS DOGS PAGE')
// })
// router.get('/:id',(req,res)=>{
//     res.send("LOOKING AT ONE DOG")
// })
// router.post('/',(req,res)=>{
//     res.send("CREATING A NEW DOG")
// })

// module.exports = router ; 