const mongoose = require("mongoose");

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wonderland");
}
main();

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment : String,
    ratings : {
        type : number,
        min : 0,
        max : 5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
});

module.exports = new mongoose.model("Review", reviewSchema);
