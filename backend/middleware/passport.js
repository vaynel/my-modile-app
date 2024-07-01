const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // 경로를 올바르게 설정합니다.
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// 환경 변수 로드
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  const { id, emails, displayName } = profile;
  let user = await User.findOne({ googleId: id });

  if (!user) {
    user = new User({
      googleId: id,
      email: emails[0].value,
      name: displayName,
      role: 'user',
      password: 'google-oauth' // Google OAuth 사용자는 비밀번호가 필요 없음
    });
    await user.save();
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return done(null, { token });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
