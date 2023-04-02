var db = require("../config/connection");
var collection = require("../config/collections");
var bcrypt = require("bcrypt");
var objectId = require("mongodb").ObjectId;
const { response, request } = require("express");
const { PRODUCT_COLLECTION } = require("../config/collections");
const variables = require("../config/variables");
const collections = require("../config/collections");
module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + ' ' + time;
      let objData = {
        name: userData.name,
        email: userData.email,
        date: dateTime,
        password: userData.password
      }
      db.get().collection(collection.USER_COLLECTION).findOne({ email: objData.email }).then(async (response) => {
        if (response == null) {
          // objData.password = await bcrypt.hash(objData.password, 10);
          db.get().collection(collection.USER_COLLECTION).insertOne(objData).then((data) => {
            let proID = data.insertedId;
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(proID) }).then((user) => {
              response = {
                user: user,
                login: true
              }
              resolve(response);
            });
          });
        } else {
          resolve({ login: false,message:'email available ' })
        }
      })
    });
  },
  doLogin: (userData) => {
    console.log('start server');
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
      if (user) {
        if(user.password===userData.password){
          console.log('email password correct');
          db.get().collection(collections.USER_COLLECTION).findOne({_id:user._id}).then((user)=>{
            console.log(user);
            resolve({status:true,user})
          })
        }else{
          console.log('Password not correct');
        let message = 'Password not correct'
        resolve({ status: false, message });
        }
      } 
      else {
        console.log("Email not found ");
        let message = 'Email not found'
        resolve({ status: false, message });
      }
    });
  },
  getRecords: (CateId) => {
    return new Promise(async (resolve, reject) => {
      let result = await db.get().collection('forms').find({ userID:CateId}).toArray()
      resolve(result)
    })
  },
  getStatus: (application_id,type_of_service) => {

    return new Promise(async (resolve, reject) => {
      let result = await db.get().collection('forms').find({ applicationID:parseInt(application_id),form_type:type_of_service}).toArray()
      resolve(result)
      // console.log(result);
    })
  },
  // ------------------//
  // ------------------//
  // ------------------//
  getServices: () => {
    return new Promise(async (resolve, reject) => {
      let data = await db.get().collection('services').find().toArray()
      if(data.length>0){
        resolve({status:true,data})
      }else{
        resolve({status:false})
      }
    })
  },
  // ------------------//

  
  getSubCategory: (CateId) => {
    return new Promise(async (resolve, reject) => {
      let result = await db.get().collection(collection).find({ category: objectId(CateId) }).toArray()
      resolve(result)
    })
  },
  
}


