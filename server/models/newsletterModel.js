const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            unique: true,
            maxlength: [254, 'Email cannot exceed 254 characters'],
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        status: {
            type: String,
            enum: ['active', 'unsubscribed'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    },
);

newsletterSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);
