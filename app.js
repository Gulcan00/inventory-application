require('dotenv').config();
const express = require('express');
const coffeeRouter = require('./routes/coffeeRouter');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.redirect('/region');
});

app.use('/coffee', coffeeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
