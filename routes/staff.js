const { response } = require("express");
var express = require("express");
const variables = require("../config/variables");
const productHelpers = require("../helpers/product-helpers");
const staff_helper = require("../helpers/staff_helper");
const userHelpers = require("../helpers/user-helpers");
var router = express.Router();

const verifyLogin = (req, res, next) => {
    if (req.session.staff_status) {
      next();
    } else {
      res.redirect(`/staff/login`);
    }
  };

router.get("/", verifyLogin,function (req, res, next) {
    res.redirect('/staff/viewapplications')
  });

router.get("/login", function (req, res, next) {
    res.render(`staff/login`, {
      adminLogErr: req.session.adminLogErr,
      MESSAGE:req.session.MESSAGE,
      static: true,
    });
    req.session.MESSAGE = null;
    res.render('staff/login',{staff_login:true,MESSAGE:req.session.MESSAGE})
  
  });

  router.post("/login", function (req, res, next) {
    staff_helper.doLogin(req.body).then(async (response) => {
        if (response.status) {
          let email = req.body.email;
          req.session.staff = response.data;
          req.session.staff_status = true;
          res.redirect(`/staff`);
        } else {
          req.session.MESSAGE = {
            message:response.message,
            status:false,
          }
          res.redirect(`/staff/login`);
        }
      });
  });

  router.get("/logout", (req, res) => {
    req.session.staff = null;
    req.session.staff_status = null;
    res.redirect(`/staff/`);
  });


  
  router.get('/viewapplications', verifyLogin, async(req, res) => {
    let results = await staff_helper.getApplications()
      let auth = req.session.staff;
      res.render(`staff/view-applications`, {
        staff:true,
        results,
        auth,
      });
  })


  
  router.get("/view-application/:id", verifyLogin, async (req, res) => {
    let _id = req.session.RedirectPurposeStoreID__DeleteSubCategory = req.params.id;
    let result = await staff_helper.getApplication(req.params.id)
    console.log(result);
    let auth = req.session.staff;
    res.render(`staff/view-application`,
      {
        staff:true,
        auth,
        result,
        _id
      });
  });

  router.get("/viewapplications/:status", verifyLogin, async (req, res) => {
    let _id = req.session.RedirectPurposeStoreID__DeleteSubCategory = req.params.status;
    staff_helper.getApplicationStatusFilter(req.params.status).then((results)=>{
      console.log(results);
      let auth = req.session.staff;
     res.render(`staff/view-application-pending`,
      {
        staff:true,
        auth,
        results,
        _id
      });
    })
    // let name = req.session.Name_Show_Subcategory_View = req.params.name
    
  });



  

  router.get("/viewapplications-approvel/:status/:id", verifyLogin, (req, res) => {
    // let _id = req.session.SubCat = req.params.id;
    // req.session.SubCatName = req.params.name;
    // let name = req.params.name;
    let auth = req.session.staff;
    staff_helper.updateStatus(req.params.status,req.params.id)
    // let FormStatus = req.session.Data_Added_SubCat_Status;
    res.redirect(`/staff/viewapplications/${req.session.RedirectPurposeStoreID__DeleteSubCategory}`);
    req.session.Data_Added_SubCat_Status = null;
  });







router.get("/edit-profile", verifyLogin, (req, res) => {
  let auth = req.session.staff;
  let Edit_Response = req.session.MESSAGE
  staff_helper.getTecherData(req.session.staff._id).then((data) => {
    res.render(`staff/edit-profile`, { staff:true, data, auth, MESSAGE:req.session.MESSAGE });
    req.session.MESSAGE = null
  });
});
//----------POST-EDIT-PROFILE----------//
router.post("/edit-profile", verifyLogin, async (req, res) => {
  console.log(req.body);
  let id = req.session.staff._id
  staff_helper.editProfile(req.body,id).then((response)=>{
    req.session.MESSAGE ={
      message:"Successfully updated",
      status:true,
    }
    res.redirect('/staff/edit-profile')
  })
});




router.get("/all-users", verifyLogin, (req, res) => {
  productHelpers.getUserDetails().then((userData) => {
    userData = userData.users
    let auth = req.session.staff;
    res.render(`staff/all-users`, {
      staff:true,
      userData,
      auth,
    });
  });
});

// -------------------------------
router.get("/view-services", verifyLogin, (req, res) => {
  userHelpers.getServices().then((response) => {
    res.render(`staff/view-services`, {
      staff:true,
      Admin : req.session.admin,
      response,
    });
  })
});

router.post("/delete-services/:type", verifyLogin, (req, res) => {
  productHelpers.deleteService(req.params.type).then((response) => {
    if (response.status) {
      res.json({ status: true })
    } else {
      res.json({ status: false })
    }
  });
});




router.get("/create-services", verifyLogin, (req, res) => {

  res.render('staff/create-services',
    {
      staff:true,
      Admin: req.session.admin,
      MESSAGE: req.session.MESSAGE
    })
  req.session.MESSAGE = null
})



router.post("/create-services", verifyLogin, (req, res) => {

  productHelpers.createServices(req.body).then(() => {
    req.session.MESSAGE = {
      message: 'Successfully inserted',
      status: true
    }
    res.redirect('/staff/create-services')
  }).catch((err) => {
    req.session.MESSAGE = {
      message: err.message,
      status: false
    }
    res.redirect('/staff/create-services')
  })
})






module.exports = router;
