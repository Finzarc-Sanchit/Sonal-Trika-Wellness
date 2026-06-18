const mongoose = require("mongoose");

/**
 * Mirrors the contact form in client/src/components/contact/ContactForm.tsx
 * Fields: name, phone, email, service, message, status
 */
const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [120, "Name cannot exceed 120 characters"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            maxlength: [30, "Phone number cannot exceed 30 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            maxlength: [254, "Email cannot exceed 254 characters"],
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        service: {
            type: String,
            required: [true, "Service selection is required"],
            trim: true,
            enum: {
                // Alphanumeric slug values to protect against HTML escaping issues
                values: [
                    "chakra-therapy",
                    "ocean-therapy",
                    "clinical-protocols",
                    "corporate-wellness",
                    "retreats-and-festivals", // Replaced '&' with 'and'
                    "new-moon-full-moon-sound-bath", // Replaced '/' with a hyphen
                    "beginner-sound-healing-workshop",
                    "gong-and-bowl-learning-modules", // Replaced '&' with 'and'
                ],
                message: "{VALUE} is not a valid recognized service type"
            }
        },
        message: {
            type: String,
            trim: true,
            maxlength: [5000, "Message cannot exceed 5000 characters"],
            required: [true, "Message is required"],
        },
        status: {
            type: String,
            enum: ["new", "contacted", "in_progress", "completed"],
            default: "new",
        },
    },
    {
        timestamps: true,
    },
);

// High-performance query indexing
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ service: 1 }); // New index added for speedy dashboard sorting/filtering!

module.exports = mongoose.model("Contact", contactSchema);