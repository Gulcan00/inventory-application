require('dotenv').config();
const express = require('express');
const path = require('path');
const coffeeRouter = require('./routes/coffeeRouter');
const regionRouter = require('./routes/regionRouter');
const flavorProfileRouter = require('./routes/flavorProfileRouter');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});
app.post('/validate-user', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.body.password == process.env.ADMINPASSWORD) {
    res.json({ isAdmin: true });
  } else {
    res.json({ isAdmin: false });
  }
});

app.use('/coffee', coffeeRouter);
app.use('/region', regionRouter);
app.use('/flavor-profile', flavorProfileRouter);
app.use('*', (req, res) => {
  res.render('error', {
    error: 'This page does not exist.',
    code: 404,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
