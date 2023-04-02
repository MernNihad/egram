var express = require("express");
const { Db } = require("mongodb");
const messages = require("../config/messages");
var variable = require("../config/variables");
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
var router = express.Router();

//----------SET-VARIABLE----------//
var admin = true;
//----------LOGIN-CHECK----------//

const verifyLogin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect(`/${variable.admin_router}/login`);
  }
};

const verifyLogin_or_teacher = (req, res, next) => {
  if (req.session.adminLoggedIn || req.session.teacher_status) {
    next();
  } else {
    if (req.session.adminLoggedIn !== true) {
      res.redirect(`/${variable.admin_router}/login`);
    }
    if (req.session.teacher_status !== true) {
      res.redirect(`teacher/login`);
    }
  }
};









//  --------------------------------------------------------------------------------
// | *************************************HOME************************************* |
//  --------------------------------------------------------------------------------
router.get("/", verifyLogin,  (req, res, next)=> res.redirect(`/admin/view-services`));
// ----------------














// --------------------------------------------//
// -----------------STAFF----------------------//
// -------------------------------------------//
router.get("/add-staff", verifyLogin, (req, res) => {
  res.render(`${variable.admin_router}/addstaff`,
    {
      admin,
      Admin:req.session.admin,
      MESSAGE: req.session.MESSAGE
    })
  req.session.MESSAGE = null
});

router.post("/add-staff", verifyLogin, (req, res) => {
  productHelpers.addStaff(req.body).then((response) => {
    if (response.status) {
      req.session.MESSAGE = null
      req.session.MESSAGE = {
        message: 'Successfully inserted',
        status: true
      }
      res.redirect(`/${variable.admin_router}/add-staff`)
    } else {
      req.session.MESSAGE = null
      req.session.MESSAGE = {
        message: response.message,
        status: false
      }
      res.redirect(`/${variable.admin_router}/add-staff`)
    }
  })
});

router.get("/view-staff", verifyLogin, (req, res) => {
  productHelpers.getAllStaff().then((response) => {
    if (response.status) {
      res.render(`${variable.admin_router}/viewstaff`,
        {
          admin,
          Admin:req.session.admin,
          teachers: response.categories
        })
    }
    else {
      res.render(`${variable.admin_router}/viewstaff`,
        {
          admin,
          teacher: false
        })
    }
  })
});

router.get("/edit-staff/:id/:name", verifyLogin, async (req, res) => {
  let name = req.session.Category_Name = req.params.name   // null
  let id = req.session.Category_Id = req.params.id         // null
  productHelpers.getSingleStaff(req.params.id).then((response) => {
    res.render(`${variable.admin_router}/edit-staff`, {
      response,
      admin,
      Admin: req.session.admin,
      MESSAGE: req.session.MESSAGE,
    });
    req.session.MESSAGE = null
  })
  req.session.Response_For_Edit_Category = null
});

router.post("/edit-staff/:id", verifyLogin, async (req, res) => {
  let name = req.session.Category_Name = req.params.name   // null
  let id = req.session.Category_Id = req.params.id         // null
  productHelpers.updateStaff(req.params.id, req.body).then((response) => {
    if (response.status) {
      req.session.MESSAGE = {
        message: response.message,
        status: true
      }
      res.redirect(`/${variable.admin_router}/edit-staff/${id}/${name}`)
    } else {

      req.session.MESSAGE = {
        message: response.message,
        status: false
      }
      res.redirect(`/${variable.admin_router}/edit-staff/${id}/${name}`)
    }
  });
})

router.post("/delete-staff", (req, res) => {
  let categoryId = req.body.id;
  productHelpers.deleteStaff(categoryId).then((response) => {
    res.json({ status: true })
  });
});

// --------------------------------------





















//  --------------------------------------------------------------------------------
// | *****************USERS******************************************************** |
//  --------------------------------------------------------------------------------
//----------ALL-USERS----------//
router.get("/all-users", verifyLogin, (req, res) => {
  productHelpers.getAllUsers().then((userData) => {
    userData = userData.users
    let Admin = req.session.admin;
    res.render(`${variable.admin_router}/all-users`, {
      admin,
      userData,
      Admin,
    });
  });
});
// -------------------------------------























//  --------------------------------------------------------------------------------
// | *********************SECURITY-CODE*************************************************** |
//  --------------------------------------------------------------------------------

router.get("/add-security-code", verifyLogin, (req, res) => {
  res.render(`${variable.admin_router}/add-security-code`, {
    admin,
    Admin: req.session.admin,
    MESSAGE: req.session.MESSAGE
  })
  req.session.MESSAGE = null
});

router.post("/add-security-code", verifyLogin, (req, res) => {
  productHelpers.addSecurityCode(req.body.security_code).then((response) => {
    if (response.status) {
      req.session.MESSAGE = {
        message: response.message,
        status: true,
      }
      res.redirect(`/${variable.admin_router}/add-security-code`)
    } else {
      req.session.MESSAGE = {
        message: response.message,
        status: false,
      }
      res.redirect(`/${variable.admin_router}/add-security-code`)
    }
  })
});

router.get("/edit-security-code", verifyLogin, (req, res) => {
  productHelpers.getSecurityCode().then((response) => {
    res.render(`${variable.admin_router}/editSecurityCode`, {
      admin,
      Admin: req.session.admin,
      MESSAGE: req.session.MESSAGE,
      response
    })
    req.session.MESSAGE = null
  })
});

router.post("/edit-security-code", verifyLogin, (req, res) => {
  productHelpers.editSecurityCode(req.body.security_code, req.body.this_id).then((response) => {
    if (response.status) {
      req.session.MESSAGE = {
        message: response.message,
        status: true,
      }
      res.redirect(`/${variable.admin_router}/edit-security-code`)
    } else {
      req.session.MESSAGE = {
        message: response.message,
        status: false,
      }
      res.redirect(`/${variable.admin_router}/edit-security-code`)
    }
  })
});

router.get("/view-security-code", verifyLogin, (req, res) => {
  productHelpers.getSecurityCode().then((response) => {
    res.render(`${variable.admin_router}/viewSecurityCode`, {
      admin,
      Admin: req.session.admin,
      MESSAGE: req.session.MESSAGE,
      response
    })
    req.session.MESSAGE = null
  })
});

// -----------------------------------------------






















//  --------------------------------------------------------------------------------
// | *************PROFILE************************************************************* |
//  --------------------------------------------------------------------------------
router.get("/edit-profile", verifyLogin, (req, res) => {
  let Admin = req.session.admin;
  let Edit_Response = req.session.Response_For_Edit_Profile
  productHelpers.getAdminData(req.session.admin._id).then((data) => {
    res.render(`${variable.admin_router}/edit-profile`, { admin, data, Admin, Edit_Response });
    req.session.Response_For_Edit_Profile = null
  });
});
//----------POST-EDIT-PROFILE----------//
router.post("/edit-profile", verifyLogin, async (req, res) => {
  req.session.Edit_Profile_Data_For_Input = req.body;
  res.redirect(`/${variable.admin_router}/verifyPass`);
});
//----------VERIFYING-PROFILE-EDIT----------//
router.get('/verifyPass', verifyLogin, (req, res) => {
  let Admin = req.session.admin;
  let email = req.session.Edit_Profile_Data_For_Input.email
  let value = req.session.Edit_Profile_Data_For_Input
  let Response = req.session.Response_For_Edit_Profile
  res.render(`${variable.admin_router}/verifyPass`, { admin, Admin, Response });
  req.session.Response_For_Edit_Profile = null
})
router.post("/verifyPass", verifyLogin, (req, res) => {
  if (req.body.password === '') {
    req.session.Response_For_Edit_Profile = {
      message: 'Password is null',
      status: false,
    }
    res.redirect(`/${variable.admin_router}/verifyPass`);
  }
  else if (req.body.password) {
    productHelpers.confirmPass(req.body.password, req.session.admin.password).then((response) => {
      if (response.status) {
        productHelpers.updateProfile(req.session.Edit_Profile_Data_For_Input, req.session.admin._id).then((Response_Update) => {
          req.session.admin = Response_Update.admin
          req.session.Response_For_Edit_Profile = {
            message: 'Successfully updated',
            status: true,
          }
          res.redirect(`/${variable.admin_router}/edit-profile`);
        });
      } else {
        req.session.Response_For_Edit_Profile = {
          message: response.message,
          status: false,
        }
        res.redirect(`/${variable.admin_router}/verifyPass`);
      }
    });
  }
});

router.get("/view-profile", verifyLogin, (req, res) => {
  let Admin = req.session.admin;
  let Edit_Response = req.session.Response_For_Edit_Profile
  productHelpers.getAdminData(req.session.admin._id).then((data) => {
    res.render(`${variable.admin_router}/view-profile`, { admin, data, Admin, Edit_Response });
    req.session.Response_For_Edit_Profile = null
  });
});


// -----------------------------------------0-



























//  --------------------------------------------------------------------------------
// | ******************************** LOGIN SESSION ******************************* |
//  --------------------------------------------------------------------------------
//----------GET-LOGIN----------//
router.get("/login", (req, res) => {
  if (req.session.adminLoggedIn) {
    res.redirect(`/${variable.admin_router}/view-services`);
  } else {
    // -------
    let RESPONSE_FOR_FORGOT_PASSWORD = req.session.RESPONSE_FOR_FORGOT_PASSWORD;
    res.render(`${variable.admin_router}/login`, {
      adminLogErr: req.session.adminLogErr,
      RESPONSE_FOR_FORGOT_PASSWORD,
      static: true,
    });
    req.session.adminLogErr = false;
    req.session.RESPONSE_FOR_FORGOT_PASSWORD = null;
  }
});
// //----------POST-LOGIN----------//
router.post("/login", (req, res) => {
  productHelpers.doLogin(req.body).then(async (response) => {
    if (response.status) {
      let email = req.body.email;
      req.session.admin = response.admin;
      req.session.adminLoggedIn = true;
      res.redirect(`/${variable.admin_router}/view-services`);
    } else {
      req.session.adminLogErr = "Invalid Password or Username";
      res.redirect(`/${variable.admin_router}/login`);
    }
  });
});
// //----------LOG-OUT----------//
router.get("/logout", (req, res) => {
  req.session.admin = null;
  req.session.adminLoggedIn = null;
  res.redirect(`/${variable.admin_router}/login`);
});
// ----------------------------------


















/*  --------------------------------------------------------------------------------
   | ************************ IF USER CLICK FORGOT PASSWORD *********************** |
    --------------------------------------------------------------------------------  */
//----------GET-FORGOT-PASSWORD----------//
router.get("/forgot-password", (req, res) => {
  let sess = req.session;
  let RESPONSE_FOR_ENTER_EMAIL = sess.RESPONSE_FOR_ENTER_EMAIL;
  let RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR = sess.RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR;
  res.render(`${variable.admin_router}/forgot-password`, {
    RESPONSE_FOR_ENTER_EMAIL,
    RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR,
    static: true,
  });
  sess.RESPONSE_FOR_ENTER_EMAIL = null;
  sess.RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR = null;
});
//----------POST-FORGOT-PASSWORD----------//
router.post("/forgot-password", (req, res) => {
  let sess = req.session;
  if (req.body.email === "") {
    sess.RESPONSE_FOR_ENTER_EMAIL = obj = {
      heading: `${messages.Heading_For_Empty_Value_That_Email}`,
      paragraph: `${messages.Paragraph_For_Empty_Value_That_Email}`,
    };
    res.redirect(`/${variable.admin_router}/forgot-password`);
  } else {
    productHelpers.FoundEmail(req.body).then(async (response) => {
      if (response.status == true) {
        req.session.USER_ENTER_FOUNDED_EMAIL = req.body.email
        req.session.ELIGIBLE_FOR_SENT_0TP_STATUS = true
        res.redirect(`/${variable.admin_router}/verifyOtpForgetPass`);
      } else {
        sess.RESPONSE_FOR_ENTER_EMAIL = obj = {
          heading: `${messages.Heading_For_NotFound_Value_That_Email}`,
          paragraph: `${messages.Paragraph_For_NotFound_Value_That_Email}`,
        };
        res.redirect(`/${variable.admin_router}/forgot-password`);
      }
    });
  }
});
//----------GET-CONFIRM-OTP----------//
router.get("/verifyOtpForgetPass", (req, res) => {
  let sess = req.session;
  if (sess.ELIGIBLE_FOR_SENT_0TP_STATUS) {
    let RESPONSE_FOR_ENTER_OTP = sess.RESPONSE_FOR_ENTER_OTP;
    res.render(`${variable.admin_router}/verifyOtpForgetPass`, {
      RESPONSE_FOR_ENTER_OTP,
      static: true,
    });
  } else {
    res.redirect(`/${variable.admin_router}/forgot-password`);
  }
});
//----------POST-CONFIRM-OTP----------//
router.post("/verifyOtpForgetPass", async (req, res) => {
  let sess = req.session;
  productHelpers.getSecurityCode().then((response) => {
    if (req.body.security_code === "") {
      sess.RESPONSE_FOR_ENTER_OTP = `${messages.Empty_OTP_Is_Response}`;
      res.redirect(`/${variable.admin_router}/verifyOtpForgetPass`);
    } else {
      if (req.body.security_code === response[0].code) {
        sess.Update_Password_Route_Status = true;
        res.redirect(`/${variable.admin_router}/forgotPassword`);
        sess.ELIGIBLE_FOR_SENT_0TP_STATUS = null;
      } else {
        sess.RESPONSE_FOR_ENTER_OTP = `${messages.OTP_Invalid}`;
        res.redirect(`/${variable.admin_router}/verifyOtpForgetPass`);
      }
    }
  })
});
//----------GET-UPDATE-PASSWORD----------//
router.get("/forgotPassword", (req, res) => {
  let sess = req.session;
  if (sess.Update_Password_Route_Status) {
    let RESPONSE_FOR_ENTER_PASSWORD = sess.RESPONSE_FOR_ENTER_PASSWORD;
    res.render(`${variable.admin_router}/forgotPassword`, {
      RESPONSE_FOR_ENTER_PASSWORD,
      static: true,
    });
    sess.RESPONSE_FOR_ENTER_PASSWORD = null;
  } else {
    res.redirect(`/${variable.admin_router}/forgot-password`);
  }
});
//----------POST-UPDATE-PASSWORD----------//
router.post("/forgotPassword", (req, res) => {
  let sess = req.session;
  if (req.body.password === "") {
    sess.RESPONSE_FOR_ENTER_PASSWORD = `${messages.Empty_New_Password}`;
    res.redirect(`/${variable.admin_router}/forgotPassword`);
  } else if (req.body.password.length >= 6) {
    if (req.body.password.length <= 16) {
      let ForgetPassEmail = req.session.USER_ENTER_FOUNDED_EMAIL
      productHelpers.ForgotPassword(req.body, ForgetPassEmail).then((response) => {
        if (response.modifiedCount === 1) {
          sess.Update_Password_Route_Status = null;
          sess.RESPONSE_FOR_FORGOT_PASSWORD = obj = {
            message: `${messages.Password_Reset_Successful}`,
            status: true,
          };
          res.redirect(`/${variable.admin_router}/login`);
        } else {
          sess.RESPONSE_FOR_FORGOT_PASSWORD = obj = {
            message: `${messages.Password_Reset_Failed}`,
            status: false,
          };
          res.redirect(`/${variable.admin_router}/login`);
        }
      });
      // -----
    } else {
      sess.RESPONSE_FOR_ENTER_PASSWORD = `${messages.No_MoreThan_Restricted_Characters}`;
      res.redirect(`/${variable.admin_router}/forgotPassword`);
    }
  } else {
    sess.RESPONSE_FOR_ENTER_PASSWORD = `${messages.Enter_Minimum_Restricted_Characters}`;
    res.redirect(`/${variable.admin_router}/forgotPassword`);
  }
});
// ----------------------------



















//  --------------------------------------------------------------------------------
// | *************SERVICES*********************************************************** |
//  --------------------------------------------------------------------------------

router.get("/view-services", verifyLogin, (req, res) => {
  userHelpers.getServices().then((response) => {
    res.render(`admin/view-services`, {
      admin,
      Admin : req.session.admin,
      response,
    });
  })
});

router.get('/viewSingleServices/:type', verifyLogin, (req, res) => {
  productHelpers.getApplicationForTpyeFind(req.params.type).then((data) => {
    let Admin = req.session.admin;
    res.render(`${variable.admin_router}/view-applications-approved`, {
      admin,
      response:data,
      Admin,
    });

  console.log('data');
  });
})

router.post('/delete-services/:service_type', verifyLogin, (req, res) => {
  productHelpers.deleteService(req.params.service_type).then((data) => {
    res.json({status:true})
  });
})

















// router.get('/view-profile/', verifyLogin_or_teacher, (req, res) => {
//   productHelpers.getAdminData(req.session.admin._id).then((data) => {
//     res.render(`${variable.admin_router}/view-profile`, { admin, data, Admin: req.session.admin });
//   });
// })
// Home route

// router.get('/admin/view-services/', verifyLogin_or_teacher, (req, res) => {
//   productHelpers.getAllCategories().then((response) => {
//     let Categories = response.categories
//     let Admin = req.session.admin;
//     res.render(`${variable.admin_router}/view-categories`, {
//       admin,
//       Categories,
//       Admin,
//     });
//   });
// })








// router.get("/all-users", verifyLogin, (req, res) => {
//   productHelpers.getUserDetails().then((userData) => {
//     userData = userData.users
//     let Admin = req.session.admin;
//     res.render(`${variable.admin_router}/all-users`, {
//       admin,
//       userData,
//       Admin,
//     });
//   });




// });







// new codes



router.get("/create-services", verifyLogin, (req, res) => {

  res.render('admin/create-services',
    {
      admin,
      Admin: req.session.admin,
      MESSAGE: req.session.MESSAGE
    })
  req.session.MESSAGE = null
})





router.post("/create-services", verifyLogin, (req, res) => {
  console.log(req.body);

  productHelpers.createServices(req.body).then(() => {
    req.session.MESSAGE = {
      message: 'Successfully inserted',
      status: true
    }
    res.redirect('/admin/create-services')
  }).catch((err) => {
    req.session.MESSAGE = {
      message: err.message,
      status: false
    }
    res.redirect('/admin/create-services')
  })
})



router.post("/delete-services", verifyLogin, (req, res) => {
  productHelpers.deleteServices(req.body.id).then((response) => {
    if (response.status) {
      res.json({ status: true })
    } else {
      res.json({ status: false })
    }
  });
});

// 

router.get("/view-applications", verifyLogin, (req, res) => {
  productHelpers.getServices().then((response) => {
    console.log(response);
    res.render('admin/view-applications',
      {
        admin,
        Admin: req.session.admin,
        MESSAGE: req.session.MESSAGE,
        response
      })
    req.session.MESSAGE = null
  })
})







module.exports = router;
