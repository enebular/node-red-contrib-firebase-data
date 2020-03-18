var request = require('request');
module.exports = function (RED) {
  "use strict";

  function addFirebase(n) {
    RED.nodes.createNode(this, n);
    this.box = RED.nodes.getNode(n.box);
    var node = this;
    var firebase = n.firebase
    var newObj = n.data || {}
    var methodValue = n.method
    var childPath = n.childpath || ""
    var jsonPath = ".json"
    // var private_key = n.private_key;
    // var client_email = n.client_email
    // var firebaseCertificate = RED.nodes.getNode(n.firebaseCertificate);

    node.on("input", function (msg) {    
      
      console.log("newObj1", newObj); 
      if(typeof msg.payload != 'number') {
        newObj = msg.payload
      }

      if (typeof newObj != 'object') {
        newObj = JSON.parse(newObj)
      };
      if (methodValue == "msg.method" || methodValue == "") {
        methodValue = msg.method
      };

      console.log("newObj", newObj);      


      // var {google} = require("googleapis");

      // Define the required scopes.
      // var scopes = [
      //   "https://www.googleapis.com/auth/userinfo.email",
      //   "https://www.googleapis.com/auth/firebase.database"
      // ];

      // var decoder = private_key.replace(/\\n/g,"\n")
      // var jwtClient = new google.auth.JWT(client_email, null, decoder, scopes);      

      // // Use the JWT client to generate an access token.
      // jwtClient.authorize(function(error, tokens) {
      //   if (error) {
      //     console.log("Error making request to generate access token:", error);
      //   } else if (tokens.access_token === null) {
      //     console.log("Provided service account does not have permission to generate access tokens");
      //   } else {
      // var accessToken = tokens.access_token;

      var opts = {
        method: methodValue,
        // url: "https://" + firebase + ".firebaseio.com/" + childPath + jsonPath+"?access_token=" +accessToken,
        url: "https://" + firebase + ".firebaseio.com/" + childPath + jsonPath,
        body: JSON.stringify(newObj)
      };

      request(opts, function (error, response, body) {
        if (error) {
          node.error(error, {});
          node.status({
            fill: "red",
            shape: "ring",
            text: "failed"
          });
          return;
        }
        

        if (methodValue == "delete") {
          msg.payload = "Delete success!"
        } else {
          msg.payload = JSON.parse(body)
        }

        node.send(msg);
      })
      //   }
      // });        
    });
  }
  RED.nodes.registerType("addFirebase", addFirebase);
};