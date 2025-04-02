//define userSchema and userModel
//step 8 define user and schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        username: String,
        hashedPassword: String, 
    
});

//step 14 removes the hashed PW from response with a special hook
//14b go to postman to sign up another user on the sign up page, see how postman
//removes it from the object in server memory
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;