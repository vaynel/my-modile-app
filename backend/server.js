const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const User = require('./models/user');
const Post = require('./models/post');
const jwtSecret = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// User Registration
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword ,role: 'user'});
  

  try {
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });  // 이메일로 유저를 찾음

  if (!user) {
    return res.status(400).json({ message: 'Invalid email ' });
  }

  const isMatch = await bcrypt.compare(password, user.password); // 비밀번호 비교 

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password' });
  }
  // console.log(user)

  const token = jwt.sign({ id: user._id, email :user.email, role: user.role}, jwtSecret, { expiresIn: '1h' }); // jwt토큰 발급 
  res.json({ message: 'Login successful', token });
});

const dataRoutes = require('./routes/dataRoutes');
const postRoutes = require('./routes/postRoutes');
app.use('/api/data', dataRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
