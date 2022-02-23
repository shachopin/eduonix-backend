const mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = mongoose;
const UserSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    salt: String,
    hashedPassword: String,
    mobile: String,
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHER"]
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"]
    }
});

//We use this on SignUp to hash password
UserSchema.methods.setPassword = function (password) { //model instance's method defined in prototype, "this" refers to that model instance
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hashedPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); //every model instance has a unique and randomly generated this.salt, stored in DB
} //not returning Promise because there is no async operation like interacting with MongoDB

//We use this on login to validate password
UserSchema.methods.validPassword = function (password) {
    const currentHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); //every model instance has a unique and randomly generated this.salt, stored in DB
    return this.hashedPassword === currentHash;
} //not returning Promise because there is no async operation like interacting with MongoDB

UserSchema.methods.checkDuplicate = function (email) { //return promise
    return new Promise((resolve, reject) => {
        User.count({ email }, function (error, count) { //using mongoose callback, not mongoose promise, but use outter promise wrapper
            if (error) { //db issue
                return reject(error);
            }
            return resolve(count > 0 ? true : false);
        })
    });
} //因为里面没有this, 所以call的时候是UserSchema.methods.checkDuplicate 而不是用model instance

UserSchema.methods.findByEmail = function (email) {
    return new Promise((resolve, reject) => {
        User.findOne({ email }, function (error, data) { //using mongoose callback, not mongoose promise, but use outter promise wrapper
            if (error) { //db issue
                return reject(error);
            }
            return resolve(data); //if not found, data is null, resolve(null)
        })
    })
}//因为里面没有this, 所以call的时候是UserSchema.methods.findByEmail 而不是用model instance

const User = mongoose.model("User", UserSchema);

module.exports = {
    validateLogin: function (userData) {
        return new Promise(async function (resolve, reject) { //return Promise wrapper for async function
            try {
                const user = await UserSchema.methods.findByEmail(userData.email);  //findByEmail returns Promise, therefore can be used as in await statement
                //如果above Promise got rejected, will jump to catch block
                if (user?.validPassword(userData.password)) { //user can be null
                    return resolve(user);
                }
                return reject(new Error('Invalid Credentials!!!')); //if email not found(user being null) or if password doesn't match
            } catch (error) { //db issue
                console.error(error);
                return reject(error);
            }

        })
    },
    userSignUp: function (userData) {
        return new Promise(async (resolve, reject) => { //return Promise wrapper for async function
            try {
                const duplicate = await UserSchema.methods.checkDuplicate(userData.email); //checkDuplicate returns Promise, therefore can be used as in await statement
                if (!duplicate) {
                    const user = new User({
                        ...userData
                    });
                    user.setPassword(userData.password); //will popluate this.salt and this.hashedPassword before saving them to mongoDB
                    user.save(function (error, data) {
                        if (error) {
                            return reject(error);
                        }
                        return resolve(data);
                    });
                }
                return reject(new Error(`User Already Exists with provided Details email: ${userData.email}`))  //db no issue, but user already exist
            } catch (error) { //db issue
                console.error(error);
                reject(error);
            }
        })
    },
    editUser: function (id, userData) {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ id }, { ...userData }, function (error, data) {
                if (error) { //db issue
                    return reject(error);
                }
                return resolve(data);
            })
        })
    },
    getUserDetailsByEmail: async function (email) { //another format but does same as above silings, no need to use Promise wrapper for async, but use Promise.resolve or Promise.reject inside
        try {
            const userDetails = await UserSchema.methods.findByEmail(email);
            return Promise.resolve(userDetails);
        } catch (error) { //db issue
            console.error(error);
            return Promise.reject(error);
        }
    }
}
//All the async by default return a promise
//good code pattern here is being used: move business logic to model, closer to DB, so called "thin controller, fat model"