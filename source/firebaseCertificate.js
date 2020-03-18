var request = require('request');
var firebase = require('firebase');
module.exports = function(RED) {
  "use strict";
  function firebaseCertificate(n) {
    RED.nodes.createNode(this,n);
    var node = this;
    //

    this.firebaseurl = "https://" + n.firebaseurl + ".firebaseio.com";
    this.loginType = n.loginType;
    this.uid = this.credentials.uid;
    this.secret = this.credentials.secret;
    this.email = this.credentials.email;
    this.password = this.credentials.password;
    this.jwtClaims = JSON.parse(this.credentials.jwtClaims != undefined ? this.credentials.jwtClaims : "[]");
    // console.log("firebaseurl", this.firebaseurl);
    // console.log("email", this.email);
    
  }
  RED.nodes.registerType("firebaseCertificate",firebaseCertificate, {
    credentials: {
        loginType: {type: 'text'},
        uid: {type: 'text'},
        secret: {type: 'password'},
        email: {type: 'text'},
        password: {type: 'password'},
        jwtClaims: {type: 'text'}
    }
  });
};