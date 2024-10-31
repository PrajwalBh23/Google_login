const express = require("express");
const dotenv = require('dotenv');
require('./db/connection.js');
const auth = require("./routes/auth.js"); // Change import to require
const route = require("./routes/route.js"); // Change import to require
const cors = require('cors');  // Use `const` to declare dotenv
const passport = require('./controllers/passport.js');
const bodyParser = require('body-parser');

const app = express();

dotenv.config({ path: './config.env' });


app.use(bodyParser.json({ limit: '10mb' })); // Adjust the size as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); 

app.use(cors());
app.use(express.json());

app.use(passport.initialize());

app.use('/auth', auth);
app.use('/routes', route);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is on ${PORT}`);
});
