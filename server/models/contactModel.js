const mongoose = require('mongoose');

/**
 * Mirrors the contact form in client/src/components/contact/ContactForm.tsx
 * Fields: fullName, phone, email, subject, help (optional)
 */
const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [120, 'Name cannot exceed 120 characters'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            maxlength: [30, 'Phone number cannot exceed 30 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            maxlength: [254, 'Email cannot exceed 254 characters'],
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        message: {
            type: String,
            trim: true,
            maxlength: [5000, 'Message cannot exceed 5000 characters'],
            required: [true, 'Message is required'],
        },
        status: {
            type: String,
            enum: ['new', 'contacted', 'in_progress', 'completed'],
            default: 'new',
        },
    },
    {
        timestamps: true,
    },
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });

module.exports = mongoose.model('Contact', contactSchema);
