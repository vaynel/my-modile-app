const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true },
  name: { type: String, required: true },
  role: { type: String, default: 'user' }
}, {
  autoIndex: true // 이 옵션을 추가하여 자동으로 인덱스를 생성하도록 설정합니다.
});

const User = mongoose.model('User', userSchema);

module.exports = User;
