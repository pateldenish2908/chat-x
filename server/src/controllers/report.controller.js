const Report = require('../models/report.model');

const createReport = async (req, res) => {
    try {
        const { reportedId, reason, description } = req.body;
        const reporterId = req.user.id;

        const report = await Report.create({
            reporter: reporterId,
            reported: reportedId,
            reason,
            description,
        });

        res.status(201).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReport };
