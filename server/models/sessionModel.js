const mongoose = require('mongoose');

/**
 * Schema for Client Booking Sessions (Yoga classes, Private sessions, Workshops)
 * Fields: name, phone, email, service, date, time, numberOfPeople, totalAmount, paymentStatus, status
 */
const bookingSessionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Client name is required'],
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
            required: [true, 'Email address is required'],
            trim: true,
            lowercase: true,
            maxlength: [254, 'Email cannot exceed 254 characters'],
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        service: {
            type: String,
            required: [true, 'Service selection is required'],
            trim: true,
            maxlength: [150, 'Service name cannot exceed 150 characters'],
        },
        date: {
            type: Date,
            required: [true, 'Booking date is required'],
        },
        time: {
            type: String,
            required: [true, 'Booking time slot is required'],
            trim: true, // e.g., "09:00 AM" or "18:30"
        },
        numberOfPeople: {
            type: Number,
            required: [true, 'Number of attendees is required'],
            min: [1, 'Booking must include at least 1 person'],
            max: [50, 'Individual booking limit is 50 people'],
            default: 1,
        },
        message: {
            type: String,
            trim: true,
            maxlength: [2000, 'Notes cannot exceed 2000 characters'],
        },
        status: {
            type: String,
            enum: ['confirmed', 'pending_approval', 'cancelled', 'attended'],
            default: 'pending_approval',
        },
    },
    {
        timestamps: true,
    },
);

// High-performance query optimization indexes for the booking admin engine
bookingSessionSchema.index({ date: 1, time: 1 }); // Quick checking for schedule availability/conflicts
bookingSessionSchema.index({ email: 1 });        // Speeds up client purchase history generation
bookingSessionSchema.index({ status: 1 });       // Filters dashboard schedules effortlessly
bookingSessionSchema.index({ createdAt: -1 });   // Organizes latest submissions chronologically

module.exports = mongoose.model('BookingSession', bookingSessionSchema);