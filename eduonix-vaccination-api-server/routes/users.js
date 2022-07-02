//because you put business logic in model, fat model thin controller(router), controller/router part is extremely easy and straigtforward
var express = require('express');
const { getAllAppointmentByUser } = require('../model/Appointment');
const { userSignUp, validateLogin, editUser } = require('../model/User'); //其实getUserDetailsByEmail也可以在这里提取
const User = require('../model/User'); //其实不需要，如果前面提取的话，其实完全不需要User model import, 直接用model里exposed的几个functions即可，beauty of fat model thin controller
var router = express.Router();

router.get('/:email', async function (req, res) {
  try {
    const { email } = req.params;
    const data = await User.getUserDetailsByEmail(email); //data can be null when not found the user， 其实直接getUserDetailsByEmail就行，如果前面提取的话
    res.send({
      success: true,
      data
    })
  } catch (error) { //db issue
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
