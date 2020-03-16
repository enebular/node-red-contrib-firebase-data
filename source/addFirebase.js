var request = require('request');
module.exports = function(RED) {
  "use strict";
  function addFirebase(n) {
    RED.nodes.createNode(this,n);
    this.box = RED.nodes.getNode(n.box);
    var node = this;
    var firebase = n.firebase
    var newObj = n.data
    var methodValue = n.method
    var childPath = n.childpath || ""
    var jsonPath = ".json"
    
    
    node.on("input", function(msg) {      
      if(newObj == "") {
        newObj = msg.payload       
      }      
      
      if (typeof newObj != 'object') newObj = JSON.parse(newObj);

      if (methodValue == "msg.method" || methodValue == "") {
        methodValue = msg.method
      }

      var opts = {
        method: methodValue,
        url: "https://" + firebase + ".firebaseio.com/" + childPath + jsonPath,
        body: JSON.stringify(newObj)
      };
      
      request(opts, function (error, response, body) {
          if (error) {
            node.error(error,{});
            node.status({fill:"red",shape:"ring",text:"failed"});
            return;
          }
          
          if (methodValue == "delete"){
            msg.payload = "Delete success!"
          } else {
            msg.payload = JSON.parse(body)
          }                     
                      
          node.send(msg);
      })      
    });
  }
  RED.nodes.registerType("addFirebase",addFirebase);
};