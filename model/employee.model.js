const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { validateEmail } = require("../utils/validators")
const { UserRegisterType } = require("../utils/constants")
const EmployeeSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: {
            validator: validateEmail,
            message: props => `${props.value} is not a valid email`
        },
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    number: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    uid: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    image: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
        required: true,
    },
    city: {
        type: String,
        trim: true,
        required: true,
    },
    role: {
        type: String,
        trim: true,
        validate: {
            validator: function (role) {
                return UserRegisterType.has(role)
            },
            message: props => `${props.value} is not a valid role`
        },
        required: true
    },
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'User'
    },
    approved: {
        type: Boolean,
        required: false,
        default: false
    }
    
}, { timestamps: true })

module.exports = {
    EmployeeModel: mongoose.model('Employee', EmployeeSchema),
}