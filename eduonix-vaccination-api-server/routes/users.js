//because you put business logic in model, fat model thin controller(router), controller/router part is extremely easy and straigtforward
var express = require('express');
const { getAllAppointmentByUser } = require('../model/Appointment');
const { userSignUp, validateLogin, editUser } = require('../model/User');
const User = require('../model/User');
var router = express.Router();

router.get('/:email', async function (req, res) {
  try {
    const { email } = req.params;
    const data = await User.getUserDetailsByEmail(email);
    res.send({
      success: true,
      data
    })
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message,
      data: null
    })
  }
});

router.post('/signup', async function (req, res) { //for router/controller, no Promise is involved
  try {
    const data = await userSignUp(req.body);
    res.send({
      success: true,
      data
    });
  } catch (error) { //here caused by either db issue or db no issue but user already existed (ALL DB RELATED ISSUE)
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message,
      data: null
    })
  }
});

router.post('/login', async function (req, res) {
  try {
    const data = await validateLogin(req.body);
    res.send({
      success: true,
      data
    });
  } catch (error) { //db issue or db no issue, but email not found(user being null) or if password doesn't match (ALL DB RELATED)
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message,
      data: null
    });
  }
});

router.get('/my-appointments/:userId', async function (req, res) {
  try {
    const { userId } = req.params;
    const data = await getAllAppointmentByUser(userId);
    res.send({  //no matter if find userId or not
      success: true,
      data
    });
  } catch (error) { //db issue
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message,
      data: null
    });
  }
});

router.put('/update-profile', async function (req, res) {
  try {
    const data = await editUser(req.body.userId, req.body);
    res.send({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message,
      data: null
    });
  }
});

module.exports = router;
