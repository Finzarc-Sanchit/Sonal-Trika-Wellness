const Contact = require("../models/contactModel");
const logger = require("../config/logger");
const mailer = require("../config/mailer");
const config = require("../config/config");

const devError = (error) =>
    config.node_env === "development" ? error.message : "Something went wrong";

const handleValidationError = (res, error) => {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
    });
};

// Create a new contact (public form submission)
const createContact = async (req, res) => {
    try {
        // Aligned perfectly with our updated mongoose schema properties
        const { name, phone, email, message } = req.body;

        const contact = new Contact({
            name,
            phone,
            email,
            message,
        });

        await contact.save();

        try {
            await mailer.sendConfirmationEmail({
                to: email,
                name: name,
                // Using fallback since 'subject' is no longer a distinct field in the schema
                subject: "Thank you for contacting us",
            });
            logger.info(`Confirmation email sent to: ${email}`);
        } catch (emailError) {
            logger.error(
                `Failed to send confirmation email to ${email}:`,
                emailError,
            );
        }

        try {
            await mailer.sendAdminNotification({ contact });
            logger.info(`Admin notification sent for contact: ${contact._id}`);
        } catch (emailError) {
            logger.error(
                `Failed to send admin notification for contact ${contact._id}:`,
                emailError,
            );
        }

        logger.info(`New contact created: ${contact._id} - ${contact.name}`);

        res.status(201).json({
            success: true,
            message: "Thank you for reaching out. We will get back to you shortly.",
            data: contact,
        });
    } catch (error) {
        logger.error("Error creating contact:", error);

        if (error.name === "ValidationError") {
            return handleValidationError(res, error);
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: devError(error),
        });
    }
};

// Get all contacts with pagination and filtering
const getContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.email) {
            filter.email = { $regex: req.query.email, $options: "i" };
        }

        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: "i" };
        }

        if (req.query.startDate && req.query.endDate) {
            filter.createdAt = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate),
            };
        }

        const contacts = await Contact.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Contact.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        logger.info(
            `Retrieved ${contacts.length} contacts (page ${page}/${totalPages})`,
        );

        res.status(200).json({
            success: true,
            message: "Contacts retrieved successfully",
            data: {
                contacts,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalContacts: total,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            },
        });
    } catch (error) {
        logger.error("Error retrieving contacts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: devError(error),
        });
    }
};

// Get contact by ID
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        logger.info(`Retrieved contact: ${contact._id}`);

        res.status(200).json({
            success: true,
            message: "Contact retrieved successfully",
            data: contact,
        });
    } catch (error) {
        logger.error("Error retrieving contact:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: devError(error),
        });
    }
};

// Update contact (e.g. status for admin workflow)
const updateContact = async (req, res) => {
    try {
        const { status } = req.body;

        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        if (status) {
            contact.status = status;
        }

        await contact.save();

        logger.info(`Contact updated: ${contact._id}`);

        res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            data: contact,
        });
    } catch (error) {
        logger.error("Error updating contact:", error);

        if (error.name === "ValidationError") {
            return handleValidationError(res, error);
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: devError(error),
        });
    }
};

// Delete contact
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        logger.info(`Contact deleted: ${contact._id}`);

        res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
        });
    } catch (error) {
        logger.error("Error deleting contact:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: devError(error),
        });
    }
};

// Get contact statistics
const getContactStats = async (req, res) => {
    try {
        const stats = await Contact.aggregate([
            {
                $group: {
                    _id: null,
                    totalContacts: { $sum: 1 },
                    newContacts: {
                        $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] },
                    },
                    contactedContacts: {
                        $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] },
                    },
                    inProgressContacts: {
                        $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] },
                    },
                    completedContacts: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                    },
                },
            },
        ]);

        const monthlyStats = await Contact.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 12 },
        ]);

        res.status(200).json({
            success: true,
            message: "Statistics retrieved successfully",
            data: {
                overview: stats[0] || {},
                monthly: monthlyStats,
            },
        });
    } catch (error) {
        logger.error("Error retrieving contact statistics:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: devError(error),
        });
    }
};

module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
    getContactStats,
};