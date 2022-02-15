var express = require('express');
var router = express.Router();
const { check } = require('express-validator')
const Auth = require('./controllers/auth');
const Expenses = require('./controllers/expenses');

//Middle ware that is specific to this router
const passport = require('passport');
require("./features/jwt")(passport); 
// Passport middleware
router.use(passport.initialize());
// Passport config

router.get('/', (req, res) => {
  res.send("Welcome to my backend demonstration!")
})

router.post('/register', [

  check('email', 'Email is invalid').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters and less than 20').isLength({ min: 6, max: 20 }),

], Auth.register)

router.post('/login', [

  check('email', 'Email is invalid').isEmail().normalizeEmail(),

], Auth.login)

// Timer Function Routes
router.get('/expenseBook', passport.authenticate('jwt', { session: false }), Expenses.getExpenseBook)
router.post('/save', passport.authenticate('jwt', { session: false }), Expenses.saveEntries)  
router.post('/delete', passport.authenticate('jwt', { session: false }), Expenses.deleteEntry)

module.exports = router;