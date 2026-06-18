const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('./logger');
const { formatDateIST } = require('../utils/dateHelper');

const BRAND_NAME = config.mail_from_name;

const getFromAddress = () => `"${BRAND_NAME}" <${config.mail_from_email}>`;

const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port),
    secure: config.smtp_secure,
    auth: {
        user: config.smtp_user,
        pass: config.smtp_pass,
    },
});

transporter.verify((error) => {
    if (error) {
        logger.error('Email server connection failed:', error.message);
    } else {
        logger.info('Email server is ready to send messages');
    }
});

const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const buildDataTableHtml = (rows) => {
    const tableRows = rows
        .map(
            ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:35%;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;">${escapeHtml(value)}</td>
        </tr>`,
        )
        .join('');

    return `
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;color:#111827;">
      <tbody>${tableRows}</tbody>
    </table>`;
};

const SERVICE_LABELS = {
    'chakra-therapy': 'Chakra Therapy',
    'ocean-therapy': 'Ocean Therapy',
    'clinical-protocols': 'Clinical Protocols',
    'corporate-wellness': 'Corporate Wellness',
    'retreats-and-festivals': 'Retreats & Festivals',
    'new-moon-full-moon-sound-bath': 'New Moon / Full Moon Sound Bath',
    'beginner-sound-healing-workshop': "Beginners' Sound Healing Workshop",
    'gong-and-bowl-learning-modules': 'Gong and Bowl Learning Modules',
};

const buildContactTableHtml = (contact) => {
    const doc = contact.toObject ? contact.toObject() : contact;
    const name = doc.name ?? doc.fullName;
    const message = doc.message ?? doc.help;
    const serviceLabel = SERVICE_LABELS[doc.service] ?? doc.service;

    return buildDataTableHtml([
        ['Name', name],
        ['Phone', doc.phone],
        ['Email', doc.email],
        ['Service', serviceLabel || '—'],
        ['Message', message || '—'],
        ['Status', doc.status || 'new'],
        ['Submitted At', doc.createdAt ? formatDateIST(doc.createdAt) : '—'],
    ]);
};

const RETREAT_LOCATION_LABELS = {
    rishikesh: 'Rishikesh',
    jaisalmer: 'Jaisalmer',
    'sri-lanka': 'Sri Lanka',
    gangtok: 'Gangtok',
};

const formatRetreatLocation = (location) =>
    RETREAT_LOCATION_LABELS[location] ?? capitalizeWords(String(location || '').replace(/-/g, ' '));

const buildRetreatTableHtml = (retreat) => {
    const doc = retreat.toObject ? retreat.toObject() : retreat;
    const details = doc.details ?? '';

    return buildDataTableHtml([
        ['Name', doc.name],
        ['Phone', doc.phone],
        ['Email', doc.email],
        ['Destination', formatRetreatLocation(doc.location)],
        ['Status', doc.status || 'inquiry'],
        ['Submitted At', doc.createdAt ? formatDateIST(doc.createdAt) : '—'],
    ]) + (details
        ? `
        <div style="margin-top:20px;font-family:Arial,sans-serif;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.04em;">Guest message</p>
          <p style="margin:0;font-size:14px;line-height:1.65;color:#111827;white-space:pre-wrap;">${escapeHtml(details)}</p>
        </div>`
        : '');
};

const loadTemplate = (filename) => {
    try {
        const templatePath = path.join(__dirname, '../templates', filename);
        return fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
        logger.error(`Error loading email template "${filename}":`, error);
        return null;
    }
};

const capitalizeWords = (str) => {
    if (!str || typeof str !== 'string') return str;
    const trimmed = str.trim();

    if (!trimmed || /^(not provided|none|n\/a|na)$/i.test(trimmed)) {
        return str;
    }

    if (
        /^\d+$/.test(trimmed) ||
        trimmed.includes('@') ||
        /^\d{4}[-/]\d{2}[-/]\d{2}/.test(trimmed) ||
        (trimmed.length > 20 && /^[a-f0-9]{24}$/i.test(trimmed))
    ) {
        return str;
    }

    return trimmed
        .split(/\s+/)
        .map((word) => {
            if (!word) return word;
            const firstChar = word.charAt(0);
            if (/[^a-zA-Z]/.test(firstChar)) {
                return (
                    firstChar +
                    (word.length > 1 ? word.charAt(1).toUpperCase() + word.slice(2).toLowerCase() : '')
                );
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
};

const renderTemplate = (filename, data) => {
    const template = loadTemplate(filename);
    if (!template) return null;

    const dateFields = ['createdAt', 'updatedAt', 'dateOfBirth', 'date', 'timestamp', 'submittedAt'];

    return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
        const pathParts = key.trim().split('.');
        let value = data;
        const lastPart = pathParts[pathParts.length - 1];

        for (const part of pathParts) {
            if (value == null) break;
            value = value[part];
        }

        if (value === undefined || value === null) return '';

        if (
            dateFields.includes(lastPart) ||
            value instanceof Date ||
            (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))
        ) {
            try {
                return formatDateIST(value);
            } catch (error) {
                logger.warn(`Failed to format date field ${key}:`, error);
            }
        }

        if (Array.isArray(value)) {
            return value.map((v) => capitalizeWords(String(v))).join(', ');
        }
        return capitalizeWords(String(value));
    });
};

const emailTemplates = {
    confirmation: (data) => {
        const html = renderTemplate('confirmation-email.html', {
            name: data.name,
        });

        if (!html) {
            return {
                subject: `Thank you for reaching out to ${BRAND_NAME} - ${data.name}`,
                html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#1f2937;">Thank You for Reaching Out!</h2>
            <p style="color:#4b5563;">Dear ${escapeHtml(data.name)},</p>
            <p style="color:#4b5563;">Thank you for contacting ${BRAND_NAME}. We have safely received your message and will connect with you shortly to assist on your wellness path.</p>
          </div>
        `,
            };
        }

        return {
            subject: `Thank you for reaching out to ${BRAND_NAME} - ${data.name}`,
            html,
        };
    },

    adminNotification: (data) => {
        const contact = data.contact;
        const tableHtml = buildContactTableHtml(contact);
        const displayName = contact?.name ?? contact?.fullName ?? 'New message';

        return {
            subject: `New Contact Form Submission - ${displayName}`,
            html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:20px;">
          <h2 style="color:#1f2937;margin:0 0 8px;">New Contact Form Submission</h2>
          <p style="color:#4b5563;margin:0 0 20px;">A new message was submitted on ${BRAND_NAME}.</p>
          ${tableHtml}
        </div>
      `,
        };
    },

    retreatAdminNotification: (data) => {
        const retreat = data.retreat;
        const tableHtml = buildRetreatTableHtml(retreat);
        const displayName = retreat?.name ?? 'New retreat inquiry';
        const destination = formatRetreatLocation(retreat?.location);

        return {
            subject: `New Retreat Inquiry — ${destination} — ${displayName}`,
            html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:20px;">
          <h2 style="color:#1f2937;margin:0 0 8px;">New Retreat Booking Inquiry</h2>
          <p style="color:#4b5563;margin:0 0 20px;">A guest submitted a retreat reservation request on ${BRAND_NAME}.</p>
          ${tableHtml}
        </div>
      `,
        };
    },
};

const sendConfirmationEmail = async (data) => {
    try {
        const template = emailTemplates.confirmation(data);

        const mailOptions = {
            from: getFromAddress(),
            to: data.to,
            subject: template.subject,
            html: template.html,
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info(`Confirmation email sent successfully to ${data.to}`);
        return result;
    } catch (error) {
        logger.error('Error sending confirmation email:', error);
        throw error;
    }
};

const buildUnsubscribeFooter = (email) => {
    const baseUrl = (config.app_url || '').replace(/\/$/, '');
    const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

    return `
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;" />
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#6b7280;text-align:center;margin:0;">
      You received this email because you subscribed to ${escapeHtml(BRAND_NAME)}.
      <br />
      <a href="${escapeHtml(unsubscribeUrl)}" style="color:#6b7280;text-decoration:underline;">
        Unsubscribe
      </a>
    </p>
  `;
};

const buildNewsletterHtml = (content, email) => `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827;">
    <div style="font-size:16px;line-height:1.6;">
      ${content}
    </div>
    ${buildUnsubscribeFooter(email)}
  </div>
`;

const sendNewsletterCampaign = async ({ to, subject, content }) => {
    const mailOptions = {
        from: getFromAddress(),
        to,
        subject,
        html: buildNewsletterHtml(content, to),
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Newsletter campaign email sent to ${to}`);
    return result;
};

const sendAdminNotification = async (data) => {
    try {
        const template = emailTemplates.adminNotification(data);

        const mailOptions = {
            from: getFromAddress(),
            to: config.admin_email || config.smtp_user,
            subject: template.subject,
            html: template.html,
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info('Admin notification sent successfully');
        return result;
    } catch (error) {
        logger.error('Error sending admin notification:', error);
        throw error;
    }
};

const sendRetreatAdminNotification = async (data) => {
    try {
        const template = emailTemplates.retreatAdminNotification(data);

        const mailOptions = {
            from: getFromAddress(),
            to: config.admin_email || config.smtp_user,
            subject: template.subject,
            html: template.html,
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info('Retreat admin notification sent successfully');
        return result;
    } catch (error) {
        logger.error('Error sending retreat admin notification:', error);
        throw error;
    }
};

module.exports = {
    transporter,
    sendConfirmationEmail,
    sendAdminNotification,
    sendRetreatAdminNotification,
    sendNewsletterCampaign,
    buildNewsletterHtml,
};
