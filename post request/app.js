const mongoose = require('mongoose');
const User = require('./user.js');
const express = require('express');
const app = express();
app.use(express.json());
const crypto = require('crypto');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb+srv://arpitpandeyyyy:arpitpandey@deloitte.daxpn.mongodb.net/', { useNewUrlParser: true }).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log(err);
})

app.get('/', (req, res) => {
  res.send('connected');
});


// Middleware function to encrypt the password
const encryptPasswordMiddleware = (req, res, next) => {
  if (req.body.password) {
    const key = '12345'; // encryption key
    const iv = ''; // initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedPassword = cipher.update(req.body.password, 'utf8', 'hex');
    encryptedPassword += cipher.final('hex');
    req.body.password = encryptedPassword;
  }
  next();
};

// Use the middleware function in the route
app.post('/user/crypto', encryptPasswordMiddleware, async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});




// Middleware function to hash the password
const hashPasswordMiddleware = async (req, res, next) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
  }
  next();
};

// Use the middleware function in the route
app.post('/user/bcrypt', hashPasswordMiddleware, async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});


app.post('/user', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
  console.log("User created successfully");
});

app.get('/user', async (req, res) => {
  const users = await User.find();
  res.send(users);
  console.log("Users fetched successfully");
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});