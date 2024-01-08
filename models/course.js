const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  id: { type: String },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  instructor: {
    // 這個 type 會連結到 user 的 model
    // 新增時填入 user_id 會把整個 user 存進來
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  students: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('Course', courseSchema);
