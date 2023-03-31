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

  // router.get("/add-categories", verifyLogin, (req, res) => {
  //   // let Admin = req.session.admin;
  //   // let Response_For_AddCategories = req.session.Response_For_AddCategories
  //   res.render(`staff/add-categories`, {
  //     staff:true,
  //     // Admin,
  //     MESSAGE:req.session.MESSAGE,
  //   });
  //   req.session.MESSAGE = null;
  // });
  
  // router.post("/add-categories", verifyLogin, (req, res) => {
  //   console.log(req.body);
  //   console.log(req.files);
  //   let CheckWhiteSpace = req.body.name;
  //   let trimStr = CheckWhiteSpace.trim();
  //   productHelpers.AddCategories(req.body,trimStr,(response)=>{
  //     // console.log(response);
  //     // res.render(`staff/add-categories`, {
  //     //     staff:true,
  //     //   });
  //       res.redirect('/staff/add-categories')
  //   })

  //   // let Admin = req.session.admin;
  //   // let Response_For_AddCategories = req.session.Response_For_AddCategories
  //   // 
  //   // Admin,
  //   // Response_For_AddCategories,
  //   // req.session.Response_For_AddCategories = null;
  // });

  
  router.get('/viewapplications', verifyLogin, async(req, res) => {
    let results = await staff_helper.getApplications()
    // .then((response) => {
      // let Categories = response.categories
      let auth = req.session.staff;
      res.render(`staff/view-applications`, {
        staff:true,
        results,
        auth,
      });
    // });
  })


  router.get("/view-application/:id", verifyLogin, async (req, res) => {
    let _id = req.session.RedirectPurposeStoreID__DeleteSubCategory = req.params.id;
    let result = await staff_helper.getApplication(req.params.id)
    // let name = req.session.Name_Show_Subcategory_View = req.params.name
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


  // router.get("/viewapplications/approve", verifyLogin, async (req, res) => {
  //   let _id = req.session.RedirectPurposeStoreID__DeleteSubCategory = req.params.status;
  //   staff_helper.getApplicationStatusFilter('approve').then((results)=>{
  //     let auth = req.session.staff;
  //     console.log(results);
  //    res.render(`staff/view-application-pending`,
  //     {
  //       staff:true,
  //       auth,
  //       results,
  //       _id
  //     });
  //   })
  //   // let name = req.session.Name_Show_Subcategory_View = req.params.name
    
  // });


  

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

router.get("/add-subcategories/:id/:name", verifyLogin, (req, res) => {
  let _id = req.session.SubCat = req.params.id;
  req.session.SubCatName = req.params.name;
  let name = req.params.name;
  let auth = req.session.staff;
  let FormStatus = req.session.Data_Added_SubCat_Status;
  res.render(`staff/choosenQuestionOption`,
    {
      auth,
      staff:true,
      FormStatus,
      name,
      _id_this: req.params.id,
      _name_this: req.params.name,
      _id
    });
  req.session.Data_Added_SubCat_Status = null;
});






  router.get("/edit-category/:id/:name", verifyLogin, async (req, res) => {
    let name = req.session.Category_Name = req.params.name   // null
    let id = req.session.Category_Id = req.params.id         // null
    let category = await productHelpers.getCategoryDetails(req.params.id);
    let auth = req.session.staff;
    let Response_For_Edit_Category = req.session.Response_For_Edit_Category
    res.render(`staff/edit-category`, {
      category,
      staff:true,
      auth,
      name,
      Response_For_Edit_Category,
    });
    req.session.Response_For_Edit_Category = null
  });
  //----------POST-EDIT-CATEGORY----------//
  router.post("/edit-category/:id", verifyLogin, (req, res) => {
    let CheckWhiteSpace = req.body.name;
    let id = req.params.id;
    let trimStr = CheckWhiteSpace.trim();
    let Name_For_RedDiR = req.session.Category_Name
    if (req.body.name === '') {
      req.session.Response_For_Edit_Category =
      {
        message: 'Name null',
        status: false
      }
      res.redirect(`/staff/edit-category/${id}/${Name_For_RedDiR}`);
    } else {
      productHelpers.updateCategory(req.params.id, req.body, trimStr).then((response) => {
        req.session.Category_Name = trimStr
        if (req.files) {
          let image = req.files.image;
          image.mv("./public/category-images/" + id + ".jpg");
          req.session.Response_For_Edit_Category =
          {
            message: 'Successfully updated',
            status: true
          }
          res.redirect(`/staff/edit-category/${id}/${trimStr}`);
        } else {
          req.session.Response_For_Edit_Category =
          {
            message: 'Successfully updated',
            status: true
          }
          res.redirect(`/staff/edit-category/${id}/${trimStr}`);
        }
      });
    }
  });
  
  

  router.get("/mcq/:id/:name", verifyLogin, function (req, res, next) {
    console.log(req.params.id);
    req.session.CATEGORIES_ID = req.params.id
    req.session.CATEGORIES_NAME = req.params.name
    console.log(req.params.name);
    let MESSAGE = req.session.MESSAGE
    res.render(`staff/mcq`, {
      this_id: req.params.id,
      staff:true,
      auth: req.session.staff,
      MESSAGE,
    });
    req.session.MESSAGE = null
  });
  router.post("/mcq", verifyLogin, function (req, res, next) {
    console.log(req.body);
    productHelpers.addQuestions(req.body).then((resposne) => {
      if (resposne.status) {
        req.session.MESSAGE = {
          message: 'Successfully inserted',
          status: true
        }
        res.redirect(`/staff/mcq/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
      } else {
        req.session.MESSAGE = {
          message: 'try again',
          status: false,
        }
        res.redirect(`/staff/mcq/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
      }
    }).catch((err) => {
      req.session.MESSAGE = {
        message: err.message,
        status: false,
      }
      res.redirect(`/staff/mcq/${req.session.CATEGORIES_NAME}/${req.session.CATEGORIES_ID}`);
    })
  });






router.post("/trueOrFalse", verifyLogin, function (req, res, next) {
  productHelpers.addQuestions(req.body).then((resposne) => {
    if (resposne.status) {
      req.session.MESSAGE = {
        message: 'Successfully inserted',
        status: true
      }
      res.redirect(`/staff/trueOrFalse/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
    } else {
      req.session.MESSAGE = {
        message: 'try again',
        status: false,
      }
      res.redirect(`/staff/trueOrFals/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
    }
  }).catch((err) => {
    req.session.MESSAGE = {
      message: err.message,
      status: false,
    }
    res.redirect(`/staff/mcq/${req.session.CATEGORIES_NAME}/${req.session.CATEGORIES_ID}`);
  })
});
router.get("/trueOrFalse/:id/:name", verifyLogin, function (req, res, next) {
  req.session.CATEGORIES_ID = req.params.id
  req.session.CATEGORIES_NAME = req.params.name
  let MESSAGE = req.session.MESSAGE
  res.render(`staff/trueOrFalse`, {
    this_id: req.params.id,
    staff:true,
    auth: req.session.staff,
    MESSAGE,
  });
  req.session.MESSAGE = null
});



router.get("/typeAnswer/:id/:name", verifyLogin, function (req, res, next) {
  req.session.CATEGORIES_ID = req.params.id
  req.CATEGORIES_NAME = req.params.name
  let MESSAGE = req.session.MESSAGE
  res.render(`staff/typeAnswer`, {
    this_id: req.params.id,
    staff:true,
    auth: req.session.auth,
    MESSAGE,
  });
  req.session.MESSAGE = null
});

router.post("/typeAnswer", verifyLogin, function (req, res, next) {
  productHelpers.addQuestions(req.body).then((resposne) => {
    if (resposne.status) {
      req.session.MESSAGE = {
        message: 'Successfully inserted',
        status: true
      }
      res.redirect(`/staff/typeAnswer/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
    } else {
      req.session.MESSAGE = {
        message: 'try again',
        status: false,
      }
      res.redirect(`/staff/typeAnswer/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
    }
  })
});




router.get("/viewQstn/:id/:name", verifyLogin, function (req, res, next) {
  productHelpers.getQuestions(req.params.id, req.params.name).then((response) => {
    console.log(response,'start');
    if (response.status) {
      if (req.params.name === 'mcq_type') {
        response.div = true
        res.render(`staff/viewQstn`, {
          staff:true, Data: response,
          answer: true,auth:req.session.staff
        });
      } else if (req.params.name === 'true_or_false_type') {
        res.render(`staff/viewQstn`, {
          staff:true, Data: response,
          answer: true,auth:req.session.staff
        });
      } else if (req.params.name === 'type_question_type') {
        res.render(`staff/viewQstn`, {
          staff:true, Data: response,
          answer: false,auth:req.session.staff
        });
        console.log('response',response);
      }

    } else {
      res.render(`staff/viewQstn`, {
        staff:true, Data: false,auth:req.session.staff
      });
    }
  })
});




router.post("/editQstntype", verifyLogin, function (req, res, next) {
  console.log(req.body);
  productHelpers.updateQuestionForTypeQstn(req.body).then((response) => {
    console.log(response);
    if (response.status) {
      req.session.MESSAGE = {
        message: 'Successfully updated',
        status: true
      }
      res.redirect(`/staff/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    } else {
      req.session.MESSAGE = {
        message: 'try again',
        status: false,
      }
      res.redirect(`/staff/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    }
  })
});


router.get("/editQstn/:id/:name", verifyLogin, function (req, res, next) {
  req.session.MCQ_ERDIRECT_ID = req.params.id
  req.session.MCQ_ERDIRECT_NAME = req.params.name
  productHelpers.getQuestionForUpdate(req.params.id).then((response) => {
    // console.log(response);
    if (response.status) {
      if (req.params.name === 'mcq_type') {
        res.render(`staff/editQstnmcq`, {
          staff:true, Data: response,
          response: req.session.MESSAGE,
          auth:req.session.staff   
        });
        req.session.MESSAGE = null
      }
      else if (req.params.name === 'true_or_false_type') {
        res.render(`staff/editQstntf`, {
          staff:true, Data: response,
          response: req.session.MESSAGE,
          auth:req.session.staff
        });
        req.session.MESSAGE = null
      } else if (req.params.name === 'type_question_type') {
        res.render(`staff/editQstntype`, {
          staff:true, Data: response,
          response: req.session.MESSAGE,
          auth:req.session.staff
        });
        req.session.MESSAGE = null
      }


    } else {
      res.render(`staff/viewQstn`, {
        staff:true, Data: false,
        auth:req.session.staff
      });
    }
  })
});


router.post("/editmcq", verifyLogin, function (req, res, next) {
  productHelpers.updateQuestionForMCQ(req.body).then((response) => {
    if (response.status) {
      req.session.MESSAGE = {
        message: 'Successfully updated',
        status: true
      }
      res.redirect(`/staff/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    } else {
      req.session.MESSAGE = {
        message: 'try again',
        status: false,
      }
      res.redirect(`/staff/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    }
  })
});


router.post("/edittf", verifyLogin, function (req, res, next) {
  console.log(req.body);
  productHelpers.updateQuestionForTOF(req.body).then((response) => {
    if (response.status) {
      req.session.MESSAGE = {
        message: 'Successfully updated',
        status: true
      }
      res.redirect(`/staff/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    } else {
      req.session.MESSAGE = {
        message: 'try again',
        status: false,
      }
      res.redirect(`/staff/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    }
  })
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



router.get("/getUsersTypeAnswer/:id", verifyLogin,(req, res) => {
  req.session.RedirectPurposeStoreID = req.params.id
  productHelpers.getTypeAnswer(req.params.id).then((response)=>{
    console.log(response);
    res.render(`staff/viewMore`,{response,staff:true,auth:req.session.staff,
    MESSAGE:req.session.MESSAGE
    })
    req.session.MESSAGE =null
  })
});




router.post("/checkTypeQstnAnswer", verifyLogin,(req, res) => {
  console.log(req.body,'req.body');
  if(req.body.type_question_answer === 'correct'){
    productHelpers.update_Type_Question_Answer(req.body._id).then((response)=>{
            req.session.MESSAGE = {
      message: 'score added',
      status: true,
    }
    console.log(req.session.RedirectPurposeStoreID,'seession id');
      res.redirect(`/staff/getUsersTypeAnswer/${req.session.RedirectPurposeStoreID}`)
      })
  }else{
    req.session.MESSAGE = {
      message: 'rejected',
      status: false,
    }
    res.redirect(`/staff/getUsersTypeAnswer/${req.session.RedirectPurposeStoreID}`)
  }    
});

module.exports = router;
