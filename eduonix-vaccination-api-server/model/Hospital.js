const mongoose = require('mongoose');
const { Schema } = mongoose;

const HospitalSchema = new Schema({
    name: String,
    city: String,
    available_vaccines: [String]
});

const Hospital = mongoose.model('Hospital', HospitalSchema);

module.exports = {
    addNewHospital: function (hospitalData) {
        return new Promise((resolve, reject) => {
            const hospital = new Hospital({
                ...hospitalData
            });
            hospital.save(function (error, data) {
                if (error) {
                    return reject(error);
                }
                return resolve(data);
            })
        })

    },
    getAllHospitals: function () {
        return new Promise((resolve, reject) => {
            Hospital.find(function (error, data) {
                if (error) {
                    return reject(error);
                }
                return resolve(data);
            });
        })
    }
}