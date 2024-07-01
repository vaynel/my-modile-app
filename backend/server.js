const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./middleware/passport');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const User = require('./models/user');
const jwtSecret = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 쿠키 파서 추가
app.use(cookieParser());

// express-session 설정
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // MongoDB를 세션 저장소로 사용
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1시간
  }
}));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// CSRF 보호 설정
const csrfProtection = csurf({ cookie: true });

// CSRF 토큰을 클라이언트로 전달하는 엔드포인트
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// User Registration
app.post('/api/register', csrfProtection, async (req, res) => {
  const { email, password } = req.body;
  console.log('Registration request:', email);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, role: 'user' });

  try {
    await user.save();
    console.log('User registered successfully:', email);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// User Login
app.post('/api/login', csrfProtection, async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', email);
  const user = await User.findOne({ email });

  if (!user) {
    console.error('Invalid email:', email);
    return res.status(400).json({ message: 'Invalid email' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    console.error('Invalid password for email:', email);
    return res.status(400).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '1h' });
  console.log('Login successful, token generated:', token);
  req.session.token = token;  // 세션에 토큰 저장
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Login successful' });
});

// Google OAuth routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = req.user.token;
    console.log('Google OAuth login successful, token generated:', token);
    req.session.token = token;  // 세션에 토큰 저장
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.redirect('http://localhost:3000/');
  });

// Endpoint to get the token from session
app.get('/api/auth/token', csrfProtection, (req, res) => {
  const token = req.session.token;
  console.log('Token retrieved from session:', token);
  res.json({ token });
});

const dataRoutes = require('./routes/dataRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/api/data', dataRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
