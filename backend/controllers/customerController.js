const mongoose = require("mongoose");
const Job = require("../models/Job");


// ======================================================
// CUSTOMER DASHBOARD
// ======================================================

const getCustomerDashboard = async (req, res) => {
    try {
        const customerId = new mongoose.Types.ObjectId(req.user.id);

        const [
            totalJobs,
            activeJobs,
            completedJobs,
            cancelledJobs,
            pendingPayments
        ] = await Promise.all([

            // Total jobs
            Job.countDocuments({
                customer: customerId
            }),

            // Active jobs
            Job.countDocuments({
                customer: customerId,
                status: {
                    $in: [
                        "posted",
                        "searching",
                        "accepted",
                        "on_the_way",
                        "in_progress"
                    ]
                }
            }),

            // Completed jobs
            Job.countDocuments({
                customer: customerId,
                status: "completed"
            }),

            // Cancelled jobs
            Job.countDocuments({
                customer: customerId,
                status: "cancelled"
            }),

            // Jobs where payment is still pending
            Job.countDocuments({
                customer: customerId,
                status: {
                    $in: [
                        "in_progress"
                    ]
                },
                paymentStatus: "pending"
            })
        ]);


        // ==================================================
        // TOTAL SPENDING
        // ==================================================

        const spendingResult =
            await Job.aggregate([
                {
                    $match: {
                        customer: customerId,
                        status: "completed",
                        paymentStatus: "paid"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total:
                            {
                                $sum:
                                    "$finalPrice"
                            }
                    }
                }
            ]);


        const totalSpending =
            spendingResult.length > 0
                ? Number(
                    spendingResult[0].total || 0
                )
                : 0;


        // ==================================================
        // RECENT JOBS
        // ==================================================

        const recentJobs =
            await Job.find({
                customer: customerId
            })
                .populate(
                    "assignedWorker",
                    "name phone skills rating completedJobs"
                )
                .sort({
                    createdAt: -1
                })
                .limit(10);


        res.status(200).json({
            success: true,

            dashboard: {
                statistics: {
                    totalJobs,
                    activeJobs,
                    completedJobs,
                    cancelledJobs,
                    pendingPayments,
                    totalSpending
                },

                recentJobs
            }
        });

    } catch (error) {
        console.error(
            "Customer dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while loading customer dashboard"
        });
    }
};


module.exports = {
    getCustomerDashboard
};