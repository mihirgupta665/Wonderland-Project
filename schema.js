const Joi = require("joi"); // npm i joi is used to validate our schema

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        category: Joi.string().valid('Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Pools', 'Camping', 'Farms', 'Arctic').default('Trending'),
        availability: Joi.string().valid('Available', 'Booked', 'Rented', 'Unavailable').default('Available'),
        amenities: Joi.array().items(Joi.string()).optional(),
        image: Joi.object({
            filename: Joi.string().allow("", null).optional(),
            url: Joi.string().allow("", null).optional()
        }).optional().allow(null, "")
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        ratings: Joi.number().required().min(1).max(5)
    }).required(),
});