const { response } = require("express");
var express = require("express");
const { default: mongoose } = require("mongoose");
const variables = require("../config/variables");
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
var router = express.Router();


//----------SET-VARIABLE----------//
var user_header = true;
//----------CHECK-USER-LOGIN----------//
const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};
//----------HOME-PAGE----------//
router.get("/", async function (req, res, next) {
  res.redirect('/home')
});

//----------HOME-PAGE----------//
router.get('/home', verifyLogin, async (req, res) => {

  userHelpers.AllCatagories().then((response) => {
    if (response.status) {
      res.render("user/home", {
        user_header,
        userData: req.session.user,
        response,
      });
    } else {
      res.render("user/home", {
        user_header,
        userData: req.session.user,
        response: false
      });
    }
  })
})
//----------GET-SIGN-UP----------//
router.get("/signup", (req, res) => {
  res.render("user/signup", { user_part: true });
});
//----------POST-SIGN-UP----------//
router.post("/signup", (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    if (response.login) {
      req.session.user = response.user
      req.session.userLoggedIn = true
      res.redirect('/')
    } else {
      res.render("user/signup", { EmailError: 'Email is already registered', user_part: true });
    }
  })
});
//----------GET-LOGIN----------//
router.get('/login', (req, res) => {
  res.render('user/login', {
    MESSAGE: req.session.MESSAGE,
    user_part: true
  })
  req.session.MESSAGE = null
  EmailError = req.session.EmailError = null
})
//----------POST-LOGIN----------//
router.post("/login", (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user;
      req.session.userLoggedIn = true;
      res.redirect("/");
    } else {
      req.session.MESSAGE = {
        message: response.message,
        status: false,
      }
      res.redirect('/login')
    }
  });

});
//----------LOG-OUT----------//
router.get("/logout", (req, res) => {
  req.session.user = null
  req.session.userLoggedIn = null;
  res.redirect("/login");
});
//----------GET-SUBCATEGORIES----------//
router.get('/services/:type', verifyLogin, (req, res) => {
  req.session.PARAMS_TYPE = req.params.type
  if (req.params.type === 'building') {
    res.render('user/viewForm', {
      building: true,
      type: 'building',
      link: '/form/building',
      method: 'post',
      MESSAGE: req.session.MESSAGE,
      user_header,
    })

  } else if (req.params.type === 'property-tax') {
    res.render('user/viewForm', {
      property_tax: true,
      type: 'property_tax',
      link: '/form/property-tax',
      method: 'post',
      MESSAGE: req.session.MESSAGE,
      user_header,
    })

  } else if (req.params.type === 'birth-certificates') {
    res.render('user/viewForm', {
      birth: true,
      type: 'birth_certificate',
      link: '/form/birth-certificates',
      method: 'post',
      MESSAGE: req.session.MESSAGE,
      user_header,
    })
  } else if (req.params.type === 'death-certificates') {
    res.render('user/viewForm', {
      deathCertificates: true,
      type: 'death-certificates',
      link: '/form/death-certificates',
      method: 'post',
      MESSAGE: req.session.MESSAGE,
      user_header,
    })
  } else if (req.params.type === 'street') {
    res.render('user/viewForm', {
      street: true,
      type: 'street',
      link: '/form/street',
      method: 'post',
      MESSAGE: req.session.MESSAGE,
      user_header,
    })
  } else if (req.params.type === 'water') {
    res.render('user/viewForm', {
      water: true,
      type: 'water',
      link: '/form/water',
      method: 'post',
      MESSAGE: req.session.MESSAGE,
      user_header,
    })
  }else if (req.params.type === 'road') {
    res.render('user/viewForm', {
      road: true,
      type: 'road',
      link: '/form/road',
      method: 'post',
      MESSAGE: req.session.MESSAGE,
      user_header,
    })
  }
  req.session.MESSAGE = null
})




router.get('/status', verifyLogin,async (req, res) => {
  // let results = await userHelpers.getRecords(req.session.user._id)
    res.render('user/status', {
      user_header,
      // results,
      userData: req.session.user,
    })
})

router.post('/status', verifyLogin,async (req, res) => {
  console.log(req.body);
  let results = await userHelpers.getStatus(req.body.application_number,req.body.type_service)
  // console.log(results);
    res.render('user/status', {
      user_header,
      results,
      userData: req.session.user,
    })
    results=null
})

// -----------
router.get('/records', verifyLogin,async (req, res) => {
  let results = await userHelpers.getRecords(req.session.user._id)
    res.render('user/viewrecords', {
      user_header,
      results,
      userData: req.session.user,
    })
})

router.post('/form/:type', verifyLogin, (req, res) => {
  let ApplicationID = Math.floor(100000 + Math.random() * 900000)
  var pic_1 = new mongoose.Types.ObjectId();
  var pic_2 = new mongoose.Types.ObjectId();
  var pic_3 = new mongoose.Types.ObjectId();
  var pic_4 = new mongoose.Types.ObjectId();
  let patta = String(pic_1)
  let document = String(pic_2)
  let cover_letter = String(pic_3)
  let signature = String(pic_4)
  if (req.params.type === 'building') {
    productHelpers.insertForm(req.body, req.session.user._id, ApplicationID, patta, document, cover_letter).then((response) => {
      if (req.files.patta) {
        req.files.patta.mv('./public/category-images/' + patta + '.jpg')
      }
      if (req.files.reg_document) {
        req.files.reg_document.mv('./public/category-images/' + document + '.jpg')
      }
      if (req.files.covering_letter) {
        req.files.covering_letter.mv('./public/category-images/' + cover_letter + '.jpg')
      }
      req.session.MESSAGE = {
        message: `Application No. : ${ApplicationID}`,
        status: true,
      }
      res.redirect(`/services/${req.session.PARAMS_TYPE}`)
    })
  }else if (req.params.type === 'property-tax') {
    productHelpers.insertForm(req.body, req.session.user._id, ApplicationID, patta, document, cover_letter).then((response) => {
      if (req.files.patta) {
        req.files.patta.mv('./public/category-images/' + patta + '.jpg')
      }
      if (req.files.reg_document) {
        req.files.reg_document.mv('./public/category-images/' + document + '.jpg')
      }
      if (req.files.covering_letter) {
        req.files.covering_letter.mv('./public/category-images/' + cover_letter + '.jpg')
      }
      req.session.MESSAGE = {
        message: `Application No. : ${ApplicationID}`,
        status: true,
      }
      res.redirect(`/services/${req.session.PARAMS_TYPE}`)
    }) 
 
  }else if (req.params.type === 'birth-certificates') {
    productHelpers.insertForm(req.body, req.session.user._id, ApplicationID, patta, document, cover_letter).then((response) => {
     
      req.session.MESSAGE = {
        message: `Application No. : ${ApplicationID}`,
        status: true,
      }
      res.redirect(`/services/${req.session.PARAMS_TYPE}`)
    }) 



 console.log(req.body);
  }else if (req.params.type === 'death-certificates') {
    productHelpers.insertForm(req.body, req.session.user._id, ApplicationID, patta, document, cover_letter).then((response) => {
      req.session.MESSAGE = {
        message: `Application No. : ${ApplicationID}`,
        status: true,
      }
      res.redirect(`/services/${req.session.PARAMS_TYPE}`)
    }) 


//  console.log(req.body);
  }else if (req.params.type === 'street') {
    productHelpers.insertForm(req.body, req.session.user._id, ApplicationID, patta, document, cover_letter).then((response) => {
      req.session.MESSAGE = {
        message: `Application No. : ${ApplicationID}`,
        status: true,
      }
      res.redirect(`/services/${req.session.PARAMS_TYPE}`)
    }) 
    
    
    //  console.log(req.body);
  }else if (req.params.type === 'water') {
    productHelpers.insertForm(req.body, req.session.user._id, ApplicationID, patta, document, cover_letter).then((response) => {
      req.session.MESSAGE = {
        message: `Application No. : ${ApplicationID}`,
        status: true,
      }
      res.redirect(`/services/${req.session.PARAMS_TYPE}`)
    }) 
  }else if (req.params.type === 'road') {
    console.log(req.files,signature);
    productHelpers.insertForm(req.body, req.session.user._id, ApplicationID, patta, document, cover_letter,signature).then((response) => {if (req.files.patta) {
      // if(req.files.signature){
      //   req.files.signature.mv('./public/signtures/' + signature + '.jpg')
      // }
    }
      req.session.MESSAGE = {
        message: `Application No. : ${ApplicationID}`,
        status: true,
      }
      res.redirect(`/services/${req.session.PARAMS_TYPE}`)
    }) 
    //  console.log(req.body);
    //  console.log(req.files);
  }
})

module.exports = router;
