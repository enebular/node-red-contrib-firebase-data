var request = require('request');
var firebase = require('firebase');
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
    var private_key = n.private_key;
    var client_email = n.client_email

    // console.log(private_key);
    console.log(client_email);
    
    
    node.on("input", function(msg) {
      if(newObj == "") newObj = msg.payload;    
      if (typeof newObj != 'object') newObj = JSON.parse(newObj);
      if (methodValue == "msg.method" || methodValue == "") methodValue = msg.method;

      
      var {google} = require("googleapis");

      // Define the required scopes.
      var scopes = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/firebase.database"
      ];

      var key = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCg3AjKLe3AP7Dw\nTK3kDmu169GNDbl4CazSdfbhtO2Sc2ZKdQrF6D92T10QUaGqIcLzypprArmGDb98\nkjpYZZq5UZML/ZKqFYWFY8j/4bIpe/dTsMRln5whB4LCqHyUSaOCkmlXKKh7h8vA\nMitJGlKBk8Vzs8Xbg6vA+EOi8e3SJLryIWCytF+bcZQk+rwRQ/q5VOp2arVbWYUz\nPa7cfrIcu//fQMlucN+prprhXUIhRFOs8ymi87eD2T5f1XA8ultj8X7be/NCGaga\nWm/Sh0GA2AfTUfEhy+HTE46aqC3LLIB4FEgurHPnVLNSj9NOqNv5K2pGuJEdaa2G\nfYDtZfC1AgMBAAECggEAAz6tBrcKdrhSL2a8kz8fORo6ree6+Arp64zpn//wUuX1\nCEd4IinfLdnH/M5Ivo/TyOsrVkFF0MhyNmcUujfCeT6GAtXooXmxqdEres3otCGG\nCbAlJg+kLJ5kKt0PNkaN/9JIQbPWQjepCoV4jg7z3x1F/GGB+j2bt1bKtny+2WBQ\nGSE3PBSbWNYUIJP7Sa3khNUwlkVpThjg+t61+iFChGeIvSKcWgbJtfb8btVBdYPh\n3sYujWX8EyC3/cNwOWUxm52OJGiHJIDEGVwxh1emCovGBn/VAX4KhGeb05ARn+ol\n321S2yxqflS7Cknno3/OEpx+B3uz9bBcdwa9Qm1cgQKBgQDYAAA2t6cdUli+3uFi\nMV35+F03Ci8kZmbxIeoNPdNmeurUjOjzD8Jc3yYziGRCdMT/ybh0XFdtlhUyOqjf\nUY+sUzXhYnKbVEhD8D0YtxKlvwnz4WTFB0JX4HF7QiHJDBRRgrftIseTycKco91w\nhkFvhsRCv9kx+iHsMCqfs0eqpQKBgQC+pfdEEMVVXuWGI5vk+mSb6tn94yGzIjmh\nq+qC3GV1IymjQKdU5BOlHUdC+iV7EhhtUl8+dV5skdLvZGnCt8UE4zHJPmz26Aa4\nkdoqqJbPOq0MJXbBuqxkrnIBsNkLSQOyuFMBfFmDy51xHIE2vzd7eH1+SPUq+J20\nSbJ8TiMg0QKBgHli1rvpTbL+ufzaCFNEZwm5d7kcsg2EtslAQ+YZHppy7VFxtuAR\ntSq4BSHkvmNSd/s/g7dwxXlCZLsLmCeYEGPJh3gX+Uwte0ci1VL0XzhiOdeijRzk\nzXXRHjUknxP7A9gi2/YaG4qEUifxNtqruE5SsCzK3+ZkKXgwQWPqPpY5AoGAUMiO\nn/7jPyt44oAQPNSE8TRwro4h53/nH8RzGIQ/UYVWzWBGB0ilsl9XpN/OJfoi85/l\nz9d37VVVJi9MSUAJceq7W+Th0zW6M1dKNK0/Sgw4616slaZ+CiOJF4JSVd/Ye1Bz\ni7ufSqNq0VUcw4/++Iiz1GEh0dWLLavUv6t0YyECgYBUs9xSiQRwv5Z81E4V1g8E\nVVNhtCnnx6Ej83E5758QDIag9ctku0Q45lJCvrdHEq8ykYl++tcJhEZAhuo92Hck\nj3I1pnd4jBUsNud/heOMGNrkVo/bmUBSuHuYqez24aMVIoXHnqtuLFQOnQPe4IRg\naTEVNi/53C+LAPuC/ddNsg==\n-----END PRIVATE KEY-----\n";
      // Authenticate a JWT client with the service account.
      // var jwtClient = new google.auth.JWT(
      //   client_email,
      //   null,
      //   key,
      //   scopes
      // );
      // console.log("11111111", private_key);
      // // var private_key1 = private_key.toString();
      // // var private_key2 = private_key1.replace("\\n","").replace("\n","");
      // // const private_key2 = private_key;
      // // console.log("2222222222", private_key2);
      // var decoder = new TextDecoder(private_key, 'utf-8'); 
      
      var decoder2 = private_key.replace("\\n","\n");
      var decoder = private_key.replace(new RegExp('\n', 'g'), '');
      // var decoder3 = decoder3
      
      // console.log("decoder1", decodeURI(encodeURI(private_key)));       
      // console.log("decoder2", unescape(private_key));
      console.log("decoder3", key);
      console.log("decoder4", decoder);
      // console.log("decoder4", decoder3);
      
      // var res = str.split("\n");
      var jwtClient = new google.auth.JWT(client_email, null, decoder, scopes);

      console.log("jwtClient1", jwtClient.key);
      // // jwtClient.key = private_key.replace("\\n","\r\n");
      // // jwtClient.key = private_key.replace('\\n','\n').toString();
      // // console.log("jwtClient2", jwtClient.key);
      console.log("jwtClient3", jwtClient);
      

      // Use the JWT client to generate an access token.
      jwtClient.authorize(function(error, tokens) {
        if (error) {
          console.log("Error making request to generate access token:", error);
        } else if (tokens.access_token === null) {
          console.log("Provided service account does not have permission to generate access tokens");
        } else {
          var accessToken = tokens.access_token;        

          var opts = {
            method: methodValue,
            url: "https://" + firebase + ".firebaseio.com/" + childPath + jsonPath+"?access_token=" +accessToken,
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
        }
      });
      
      
      
      
           
    });
  }
  RED.nodes.registerType("addFirebase",addFirebase);
};