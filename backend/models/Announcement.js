const mongoose = require('mongoose');
const announcementSchema = new mongoose.Schema({ image: String }, { timestamps: true });
module.exports = mongoose.model('Announcement', announcementSchema);