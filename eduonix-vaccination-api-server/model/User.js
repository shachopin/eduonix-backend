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
UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hashedPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

//We use this on login to validate password
UserSchema.methods.validPassword = function (password) {
    const currentHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hashedPassword === currentHash;
}

UserSchema.methods.checkDuplicate = function (email) {
    return new Promise((resolve, reject) => {
        User.count({ email }, function (error, count) {
            if (error) {
                return reject(error);
            }
            return resolve(count > 0 ? true : false);
        })
    });
}

UserSchema.methods.findByEmail = function (email) {
    return new Promise((resolve, reject) => {
        User.findOne({ email }, function (error, data) {
            if (error) {
                return reject(error);
            }
            return resolve(data);
        })
    })
}

const User = mongoose.model("User", UserSchema);

module.exports = {
    validateLogin: function (userData) {
        return new Promise(async function (resolve, reject) {
            try {
                const user = await UserSchema.methods.findByEmail(userData.email);
                if (user?.validPassword(userData.password)) {
                    return resolve(user);
                }
                return reject(new Error('Invalid Credentials!!!'));
            } catch (error) {
                console.error(error);
                return reject(error);
            }

        })
    },
    userSignUp: function (userData) {
        return new Promise(async (resolve, reject) => {
            try {
                const duplicate = await UserSchema.methods.checkDuplicate(userData.email);
                if (!duplicate) {
                    const user = new User({
                        ...userData
                    });
                    user.setPassword(userData.password);
                    user.save(function (error, data) {
                        if (error) {
                            return reject(error);
                        }
                        return resolve(data);
                    });
                }
                return reject(new Error(`User Already Exists with provided Details email: ${userData.email}`))
            } catch (error) {
                console.error(error);
                reject(error);
            }
        })
    },
    editUser: function (id, userData) {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ id }, { ...userData }, function (error, data) {
                if (error) {
                    return reject(error);
                }
                return resolve(data);
            })
        })
    },
    getUserDetailsByEmail: async function (email) {
        try {
            const userDetails = await UserSchema.methods.findByEmail(email);
            return Promise.resolve(userDetails);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
}
//All the async by default return a promise