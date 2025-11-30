module.exports = (fn) => {      // arrow function do not need a name 
    return (req, res, next) => {    // arrow function do not need a name 
        fn(req, res, next).catch(next);     //  catch do nee to pass next(err) always the next inside the catch will work hin a way  as if it has the  the err parameter
    }
}