const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Login', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});




// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});



// Booking Schema
const bookingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  deskId: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { collection: 'bookings' }); // Specify the collection name here


const Booking = mongoose.model('Booking', bookingSchema);


// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookingSchema)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Handler for the root URL
app.get('/', (req, res) => {
  res.render("index.ejs")
});

app.get('/login.ejs', (req, res) => {
  res.render("login.ejs")
});

app.get('/aboutus.ejs', (req, res) => {
  res.render("aboutus.ejs")
});

app.get('/homePage.ejs', (req, res) =>{
  res.render("homePage.ejs")
}); 

app.get('/map.ejs', (req, res) =>{
  res.render("map.ejs")

});

// User Registration
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      //return res.status(400).json({ error: 'Email already exists' });
      return res.send(`
      <script>
      alert('Email already exists');
      window.history.back();
      </script>
      `);
      
    }

    const newUser = new User({ email, password });
    await newUser.save();
    
    //redirect to the sign-in page upon succsesful registration
    //res.status(201).json({ message: 'User created successfully' });
    res.redirect("login.ejs")
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      //return res.status(401).json({ error: 'Invalid email or password' });
      return res.send(`
      <script>
      alert('Email wrong');
      window.history.back();
      </script>
      `);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      //return res.status(401).json({ error: 'Invalid email or password' });
      return res.send(`
      <script>
      alert('Password wrong');
      window.history.back();
      </script>
      `);
    }

    //res.status(200).json({ message: 'Login successful' });
    res.redirect("/homePage.ejs");
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Book a desk
app.post('/book', async (req, res) => {
  const { email, deskId } = req.body; // Extract email and deskId from request body

  try {
    // Create a new booking
    const newBooking = new Booking({ email, deskId });

    // Save the booking to the "bookings" collection
    await newBooking.save();

  
    res.redirect("/map.ejs")
    
    
  } catch (error) {
    console.error('Error booking desk:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
