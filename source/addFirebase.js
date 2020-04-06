var request = require('request');
var {google} = require("googleapis");
module.exports = function (RED) {
  "use strict";

  function addFirebase(n) {
    RED.nodes.createNode(this, n);
    this.box = RED.nodes.getNode(n.box);
    var node = this;
    
    var newObj = n.data || {}
    var methodValue = n.method
    var childPath = n.childpath || ""
    var jsonPath = ".json"
    var firebaseCertificate = RED.nodes.getNode(n.firebaseCertificate);
    var url_params = "";    

    node.on("input", function (msg) {     
      if(typeof msg.payload != 'number') {
        newObj = msg.payload
      }

      if (typeof newObj != 'object') {
        newObj = JSON.parse(newObj)
      };

      if (methodValue == "msg.method" || methodValue == "") {
        methodValue = msg.method
      };  

      if (firebaseCertificate.loginType == "jwt") {
        // Define the required scopes.
        var scopes = [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/firebase.database"
        ];

        var decoder = firebaseCertificate.secret.replace(/\\n/g,"\n")
        var jwtClient = new google.auth.JWT(firebaseCertificate.email, null, decoder, scopes);

        // Use the JWT client to generate an access token.
        jwtClient.authorize(function(error, tokens) {
          if (error) {
            node.error(error, {});
            node.status({fill: "red", shape: "ring", text: "Error making request to generate access token"});
            return;
          } else if (tokens.access_token === null) {
            node.error(error, {});
            node.status({fill: "red", shape: "ring", text: "Provided service account does not have permission to generate access tokens"});
            return;
          } else {
            var accessToken = tokens.access_token;
            url_params = firebaseCertificate.firebaseurl + childPath + jsonPath+"?access_token=" + accessToken
            var opts = {
              method: methodValue,
              url: url_params,
              body: JSON.stringify(newObj)
            };

            request(opts, function (error, response, body) {
              if (error) {
                node.error(error, {});
                node.status({fill: "red", shape: "ring", text: "failed"});
                return;
              } else {
                if (methodValue == "delete") {
                  msg.payload = "Delete success!"
                  node.send(msg);
                } else {
                  msg.payload =  JSON.parse(body);
                  node.send(msg);
                }
              }    
            })   
          }
        });        
      } else {
        url_params = firebaseCertificate.firebaseurl + childPath + jsonPath
        var opts = {
          method: methodValue,
          url: url_params,
          body: JSON.stringify(newObj)
        };

        request(opts, function (error, response, body) {
          if (error) {
            node.error(error, {});
            node.status({fill: "red", shape: "ring", text: "failed"});
            return;
          } else {
            if (methodValue == "delete") {
              msg.payload = "Delete success!"
              node.send(msg);
            } else {
              msg.payload =  JSON.parse(body);
              node.send(msg);
            }
          }    
        })
        
      }
    });
  }

  RED.nodes.registerType("addFirebase", addFirebase);
};