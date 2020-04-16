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
        var newchildpath = n.newchildpath
        var childPathProperty = n.childpath || ""
        var propertyType = n.propertyType || "msg";
        var globalContext = this.context().global;
        var flowContext = this.context().flow;

        var firebaseCertificate = RED.nodes.getNode(n.firebaseCertificate);
        var jsonPath = ".json"
        var url_params = "";
        var url_params_childpath = "";

        node.on("input", function (msg) {
            node.status({});
            
            // select method 
            switch (methodValue) {
                case "set":
                    methodValue = "PUT"
                    break;
                case "push":
                    methodValue = "POST"
                    break;
                case "update":
                    methodValue = "PATCH"
                    break;
                case "remove":
                    methodValue = "DELETE"
                    break;
                default:
                    methodValue = methodValue
                    break;
            }

            // select childPath
            var childPath = "";
            switch (propertyType) {
                case "str":
                    childPath = childPathProperty
                    break;
                case "msg":
                    childPath = msg[childPathProperty]
                    break;
                case "flow":
                    childPath = flowContext.get(childPathProperty)
                    break;
                case "global":
                    childPath = globalContext.get(childPathProperty)
                    break;
                default:
                    childPath = childPathProperty
                    break;
            }
            
            if (methodValue == "setPriority" || methodValue == "setWithPriority") {
                methodValue = "put"
            } else if (methodValue == "msg.method" || methodValue == "") {
                methodValue = msg.method
            };
            
            if(typeof msg.payload != 'number') {
                newObj = msg.payload
            }

            if (typeof newObj != 'object') {
                newObj = JSON.parse(newObj)
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
                        url_params_childpath = firebaseCertificate.firebaseurl + newchildpath + jsonPath+"?access_token=" + accessToken
                        requestData(newObj, methodValue, url_params, url_params_childpath, node, msg)
                    }
                });        
            } else {
                url_params = firebaseCertificate.firebaseurl + childPath + jsonPath
                url_params_childpath = firebaseCertificate.firebaseurl + newchildpath + jsonPath
                requestData(newObj, methodValue, url_params, url_params_childpath, node, msg)
            }
        });
    }

    function requestData(newObj, methodValue, url_params, url_params_childpath, node, msg) {
        if (methodValue == "reanameChildPath") {
            var optsGet = {
                method: "GET",
                url: url_params
            };
            request(optsGet, function (errorGet, response, bodyGet) {
                if (errorGet) {
                    node.error(errorGet, {});
                    node.status({fill: "red", shape: "ring", text: "failed"});
                    return;
                } else {
                    var dataClone = JSON.parse(bodyGet); 
                    var optsDelete = {
                        method: "DELETE",
                        url: url_params
                    };

                    request(optsDelete, function (errorDelete, response, bodyDelete) {
                        if (errorDelete) {
                            node.error(errorDelete, {});
                            node.status({fill: "red", shape: "ring", text: "failed"});
                            return;
                        } else {
                            var optsPut = {
                                method: "PUT",
                                url: url_params_childpath,
                                body: JSON.stringify(dataClone)
                            };
                            request(optsPut, function (errorPut, response, bodyPut) {
                                if (errorPut) {
                                    node.error(errorPut, {});
                                    node.status({fill: "red", shape: "ring", text: "failed"});
                                    return;
                                } else {
                                    msg.payload = JSON.parse(bodyPut);
                                    node.send(msg);
                                }    
                            })
                        }
                    })
                }    
            })
        } else {
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
    }

    RED.nodes.registerType("addFirebase", addFirebase);
};