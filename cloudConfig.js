const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({     // while configuration we need cloud_name, api_key adn api_secret
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// see documentation
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'WonderLand_DEV',
        allowedFormats: ["png", "jpg", "jpeg"],   
    },
});

module.exports = {
    cloudinary,
    storage
}

// we created cloud web service and wrote credentials in .enc file then
// we created a configed our cloudinary through process.env
// then we created storage for uplaoding 
// as multer requires direct storage so pas the storage in multer upload property
// upload.single will now upload each thing in the storage only