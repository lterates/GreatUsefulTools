const mongoose = require('mongoose')

const toolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    courses: {
        type: String,
        required: true
    },
    tags: {
        type: String
    }
})

module.exports = mongoose.model('Tool', toolSchema);