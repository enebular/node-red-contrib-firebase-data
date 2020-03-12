var request = require('request');
module.exports = function(RED) {
  "use strict";
  function addFirebase(n) {
    RED.nodes.createNode(this,n);
    this.box = RED.nodes.getNode(n.box);
    var node = this;
    var firebase = n.firebase
    var newObj = JSON.parse(n.data)

    
    node.on("input", function(msg) {
      // var newObj =  msg.payload
      var opts = {
        method: "POST",
        url: "https://" + firebase + ".firebaseio.com/.json",
        body: JSON.stringify(newObj)
      };
      
      request(opts, function (error, response, body) {
          if (error) {
              node.error(error,{});
              node.status({fill:"red",shape:"ring",text:"calendar.status.failed"});
              return;
          }         
                      
          msg.payload = JSON.parse(body) || "Fail"            
          node.send(msg);
      })      
    });
  }
  RED.nodes.registerType("addFirebase",addFirebase);
};