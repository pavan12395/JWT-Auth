const mongoose = require('mongoose')

mongooseuri = "mongodb+srv://Pavan5883:190905112@mongo5883.gddcj.mongodb.net/Mongo5883?retryWrites=true&w=majority"

const connectDB=async ()=>
{
    await mongoose.connect(mongooseuri);
}

module.exports=connectDB