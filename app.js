require('dotenv').config();
const express = require('express');
const coffeeRouter = require('./routes/coffeeRouter');
const regionRouter = require('./routes/regionRouter');
const flavorProfileRouter = require('./routes/flavorProfileRouter');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.redirect('/coffee');
});

app.use('/coffee', coffeeRouter);
app.use('/region', regionRouter);
app.use('/flavor-profile', flavorProfileRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
