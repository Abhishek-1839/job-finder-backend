const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    companyName: { type: String, required: true },
    logoURL: { type: String },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], required: true },
    remote: { type: String, enum: ['Remote', 'Office'] },
    location: { type: String, required: true },
    description: { type: String },
    about: { type: String, required: true },
    skillsRequired: [{ type: String }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Job", schema);