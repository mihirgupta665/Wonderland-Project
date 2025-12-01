const Joi = require("joi"); // nom i joi is used to validate are schema


module.exports.listingSchema = Joi.object({     // object should containt listing
    listing : Joi.object({
        title : Joi.string().required(),        // title must be string tyoe and required too.
        description : Joi.string().required(),
        image : Joi.string().allow("", null),       // string could be empty or null     .allow() : is used ot allow certain limitations
        price : Joi.number().required().min(0),     // min price could only be 0.       .min(x) : is used to set some minimum value for the field
        location : Joi.string().required(),
        country : Joi.string().required()
    }).required(),                  // listing object must be present
});

// image dekh lena ek baar