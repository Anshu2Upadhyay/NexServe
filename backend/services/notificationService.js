const Notification = require("../models/Notification");


// ======================================================
// CREATE NOTIFICATION
// ======================================================

const createNotification = async ({
    recipient,
    recipientRole,
    type,
    title,
    message,
    job = null
}) => {
    try {
        if (!recipient) {
            return null;
        }

        const notification =
            await Notification.create({
                recipient,
                recipientRole,
                type,
                title,
                message,
                job
            });

        return notification;

    } catch (error) {
        console.error(
            "Notification creation error:",
            error
        );

        // Notification failure should NOT break job flow
        return null;
    }
};


module.exports = {
    createNotification
};