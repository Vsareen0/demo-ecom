// Express 
const express = require('express');
const path = require('path');
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

// Configure environment variables
const dotenv = require('dotenv');
dotenv.config();

// PORT and MONGO DB URI
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Set View Engine to ejs
app.set('view engine','ejs');

// Connect to DB
mongoose.connect(MONGODB_URI,{useNewUrlParser: true})
    .then(() => console.log('Connected to DB !'))
    .catch(() => console.log('Unable to connect to DB !'))


// Import Routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user.route');
const accountRoute = require('./routes/account.route');
const productsRoute = require('./routes/products.route');

// Route Middlewares
app.use('/', authRoute);
app.use('/', userRoute);
app.use('/account',accountRoute);
app.use('/product',productsRoute)

// Configure User Data And LoggedIn State Globally
app.set('globals', {user: null, isLoggedIn: false});


// Use static route
app.use(express.static(path.join(__dirname,"/public")));

// Listen on PORT
app.listen(PORT, () => console.log(`Server is running on port : ${PORT}`));

