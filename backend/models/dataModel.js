const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // 추가 필드 필요시 여기에 작성
});

module.exports = mongoose.model('Data', dataSchema);
