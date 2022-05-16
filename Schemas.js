const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        tittle: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        Image: Joi.string().required(),
        description:Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        body : Joi.string().required(),
        rating : Joi.number().required().min(0).max(5)
    }).required()
})