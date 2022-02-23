const mongoose = require('mongoose');
const { Schema } = mongoose;

const AppointmentSchema = new Schema({
    userId: { //fk
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    hospitalId: { //fk
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    },
    appointmentTime: Date,
    vaccine: {
        type: String,
        enum: ["covaxin", "covishield"]
    },
    bookingTime: {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        enum: ["BOOKED", "COMPLETED", "CANCELLED", "REJECTED"]
    }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = {
    newAppointment: function (appointmentData) {
        return new Promise((resolve, reject) => { //use moongoose callback but within the outter promise wrapper
            const appointment = new Appointment({
                ...appointmentData
            });
            appointment.save(function (error, data) {
                if (error) {
                    return reject(error);
                }
                return resolve(data);
            })
        })
    },
    updateAppointmentStatus: function (id, status) {
        return new Promise(function (resolve, reject) { //use moongoose callback but within the outter promise wrapper
            Appointment.findByIdAndUpdate(id, { status }, function (error, data) {
                if (error) {
                    return reject(error);
                }
                return resolve(data); //not finding id also resolve(null)
            })
        })
    },
    getAllAppointments: function () {
        return new Promise((resolve, reject) => { //use moongoose callback but within the outter promise wrapper
            Appointment.find(function (error, data) {
                if (error) {
                    return reject(error);
                }
                return resolve(data);
            })
        })
    },
    getAppointmentDetailsById: function (appointmentId) {
        return new Promise((resolve, reject) => { //use moongoose callback but within the outter promise wrapper
            Appointment.findById(appointmentId, function (error, data) {
                if (error) {
                    return reject(error);
                }
                return resolve(data); //not finding id also resolve(null)
            })
        })
    },
    getAllAppointmentByUser: function (userId) {
        return new Promise((resolve, reject) => { //use moongoose callback but within the outter promise wrapper
            Appointment.find({ userId }).populate('userId').populate('hospitalId').exec(function (error, data) { //notice using populate to server-side js memory join
                if (error) { //db issue
                    return reject(error);
                }
                return resolve(data);  //if not finding userId, also resolve(null)
            });
        });
    }
}
