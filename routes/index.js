var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var randomstring = require('randomstring');
var monk = require('monk');
var db = monk("localhost:27017/company");
var col = db.get('login');
var OTP = randomstring.generate({
  length: 6,
  charset: 'alphabetic'
});
//---------------------------------Login Page---------------------------------------------
router.get('/', function(req, res) {
  res.render('login/login');
});
//---------------------------------Forgot Page---------------------------------------------
router.get('/forgot', function(req, res) {
  res.render('login/forgot');
});
//---------------------------------Login-------------------------------------------
router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  col.findOne({"username":username,"password":password}, function(err,docs){
    // console.log(docs)
    if(!docs){
      res.sendStatus(500);
    }
    else if(docs){
      delete docs.password
      req.session.user = docs;
      res.sendStatus(200);
    }
  })
});
//---------------------------------Forgot Password-------------------------------------------
router.post('/forgot', function(req, res) {
  col.update({"Email":req.body.email},{$set:{"password":OTP}})
  col.find({"Email":req.body.email}, function(err,docs){
    if(err){
      res.sendStatus(500);
    }
    else{
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'youremail@gmail.com',
          pass: 'yourpassword'
        }
      });

      var mailOptions = {
        from: 'youremail@gmail.com',
        to: req.body.email,
        subject: 'Password Reset',
        text: 'Your Password is'+OTP+'.Please Login using this Password'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.sendStatus(500);
        } else {
          console.log('Email sent: ' + info.response);
          res.sendStatus(200);
        }
      });
    }
  })
});
//---------------------------------Logout----------------------------------------------
router.get('/logout', function(req, res){
  req.session.reset();
  res.redirect('/');
});
//----------------------------------Home Page-------------------------------------------
router.get('/home', function(req, res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    // console.log(req.session.user.username)
    res.render('home/home');
  }
  else{
    req.session.reset();
    res.redirect('/');
  }
})
//-----------------------------------User Data-----------------------------------------
router.get('/userdata', function(req,res){
  if(req.session && req.session.user){
    res.locals.user = req.session.user;
    console.log(req.session.user.username)
    col.find({"username" : req.session.user.username}, function(err,docs){
      if(err){
        res.sendStatus(500);
      }
      else{
        res.send(docs);
      }
    })
  }
  else{
    req.session.reset();
    res.redirect('/');
  }
})
module.exports = router;
