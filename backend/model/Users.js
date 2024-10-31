const mongoose = require('mongoose');       
const jwt = require('jsonwebtoken');        

const Schema = mongoose.Schema;

const userSchema = new Schema({
    myImage: {
        type: String,
        default: '' // Add default if not required
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: Number,
        unique:true,
        sparse: true, // This allows multiple documents with a null phone
    },
    gender:{
        type: String,
        enum:['Male', 'Female', 'Not Specified']
    },
    linkedin:{
        type: String,
    },
    password: {
        type: String,
    },
    tokens: [
        {
            token: {
                type: String,
            }
        }
    ]
});

// Generation of token
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
        throw new Error('Token generation Failed');
    }
}

module.exports = mongoose.model("User", userSchema);