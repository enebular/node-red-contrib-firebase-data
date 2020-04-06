module.exports = function(RED) {
  "use strict";
  function firebaseCertificate(n) {
    RED.nodes.createNode(this,n);
    var node = this;
    //

    this.firebaseurl = "https://" + n.firebaseurl + ".firebaseio.com/";
    this.loginType = n.loginType;
    this.secret = this.credentials.secret;
    this.email = this.credentials.email;
    
  }
  RED.nodes.registerType("firebaseCertificate",firebaseCertificate, {
    credentials: {
        loginType: {type: 'text'},
        secret: {type: 'password'},
        email: {type: 'text'},
        firebaseurl: {type: 'text'},
    }
  });
};