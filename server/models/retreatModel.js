const mongoose = require('mongoose');

/**
 * Schema for Retreat Bookings / Inquiries (e.g., Wellness, Yoga, and Meditation retreats)
 * Fields: name, phone, email, location, message, status
 */
const retreatSchema = new mongoose.Schema(
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
        location: {
            type: String,
            required: [true, 'Retreat location/destination is required'],
            trim: true,
            maxlength: [200, 'Location name cannot exceed 200 characters'], // e.g., "Bali, Indonesia" or "Rishikesh, India"
        },
        message: {
            type: String,
            trim: true,
            maxlength: [5000, 'Message cannot exceed 5000 characters'],
            required: [true, 'Message or special requirements description is required'],
        },
        status: {
            type: String,
            enum: [
                'inquiry',          // Initial contact / requesting details
                'waitlisted',       // Retreat is full, client is on hold
                'deposit_pending',  // Approved, waiting for deposit payment
                'confirmed',        // Deposit/Full payment received, spot secured
                'cancelled'         // Booking cancelled
            ],
            default: 'inquiry',
        },
    },
    {
        timestamps: true,
    },
);

// High-performance query indexing for administrative overview filters
retreatSchema.index({ createdAt: -1 });
retreatSchema.index({ email: 1 });
retreatSchema.index({ location: 1 }); // Optimized for filtering retreat rosters by specific destinations

module.exports = mongoose.model('Retreat', retreatSchema);