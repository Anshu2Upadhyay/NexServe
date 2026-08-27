const mongoose = require("mongoose");

const Notification = require("../models/Notification");


// ======================================================
// GET MY NOTIFICATIONS
// ======================================================

const getMyNotifications = async (req, res) => {
    try {
        const notifications =
            await Notification.find({
                recipient: req.user.id
            })
                .populate(
                    "job",
                    "title status finalPrice paymentStatus"
                )
                .sort({
                    createdAt: -1
                });

        const unreadCount =
            notifications.filter(
                notification =>
                    !notification.isRead
            ).length;

        res.status(200).json({
            success: true,
            count: notifications.length,
            unreadCount,
            notifications
        });

    } catch (error) {
        console.error(
            "Get notifications error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while fetching notifications"
        });
    }
};


// ======================================================
// MARK ONE NOTIFICATION AS READ
// ======================================================

const markAsRead = async (req, res) => {
    try {
        const {
            notificationId
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                notificationId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid notification ID"
            });
        }

        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: notificationId,
                    recipient: req.user.id
                },
                {
                    $set: {
                        isRead: true
                    }
                },
                {
                    new: true
                }
            );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message:
                    "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Notification marked as read",
            notification
        });

    } catch (error) {
        console.error(
            "Mark notification read error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while updating notification"
        });
    }
};


// ======================================================
// MARK ALL AS READ
// ======================================================

const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipient: req.user.id,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        res.status(200).json({
            success: true,
            message:
                "All notifications marked as read"
        });

    } catch (error) {
        console.error(
            "Mark all notifications error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while updating notifications"
        });
    }
};


module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead
};