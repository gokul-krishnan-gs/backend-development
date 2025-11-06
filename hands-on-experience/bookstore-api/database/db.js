const mongoose  = require('mongoose');
async function connectToDb(){
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/bookstore');
        console.log("MONGO DB 🍀 is connected Successfully");
    }catch(error){
        console.error("MongoDB CONNECTION Failed❌",error);
        process.exit(1);
    }
}

module.exports = connectToDb;