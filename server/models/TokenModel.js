const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema(
    {
        refreshToken:
        {
            type:String,
            required:true
        }
    }
)

const TokenModel = mongoose.model('tokens',TokenSchema);

module.exports=TokenModel;