const mongoose = require("mongoose");

const studentInfoSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true, // make required if necessary
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"], // optional restriction
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model("StudentInfo", studentInfoSchema);
