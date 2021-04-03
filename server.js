const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
// import sequelize connection
const sequelize = require('./config/connection')
const models = require('./models')
// for auth0
const { auth } = require('express-openid-connect');
// const config = require('./config/auth0');

const app = express();
const PORT = process.env.PORT || 3001;
const hbs = exphbs.create({});

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// auth router attached /login, /logout, and /callback routes
app.use(auth(config));

app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false, logging: console.log }).then(() => {
  app.listen(PORT, () => console.log(`Now listening ${PORT}`))
});
