
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const animalsSchema = new Schema(
    {
        species: String,
        extinct: Boolean,
        location: String,
        lifeExpectancy: Number
    },
    { timestamps: true }
)

const Animal = mongoose.model('Animal', animalsSchema)

module.exports = Animal;

