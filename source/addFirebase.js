var axios = require('axios');
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

        node.on("input", async function (msg) {
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

            try {
                if (firebaseCertificate.loginType == "jwt") {
                    // Define the required scopes.
                    var scopes = [
                        "https://www.googleapis.com/auth/userinfo.email",
                        "https://www.googleapis.com/auth/firebase.database"
                    ];

                    var decoder = firebaseCertificate.secret.replace(/\\n/g,"\n")
                    var jwtClient = new google.auth.JWT(firebaseCertificate.email, null, decoder, scopes);

                    // Use the JWT client to generate an access token.
                    const tokens = await new Promise((resolve, reject) => {
                        jwtClient.authorize((error, tokens) => {
                            if (error) {
                                node.status({fill: "red", shape: "ring", text: "Error making request to generate access token"});
                                reject(error);
                            } else {
                                resolve(tokens);
                            }
                        });
                    });

                    if (tokens.access_token === null) {
                        const errorMessage = "Provided service account does not have permission to generate access tokens";
                        node.status({fill: "red", shape: "ring", text: errorMessage});
                        throw new Error(errorMessage);
                    }

                    var accessToken = tokens.access_token;
                    url_params = firebaseCertificate.firebaseurl + childPath + jsonPath+"?access_token=" + accessToken
                    url_params_childpath = firebaseCertificate.firebaseurl + newchildpath + jsonPath+"?access_token=" + accessToken
                    await requestData(newObj, methodValue, url_params, url_params_childpath, node, msg);
                } else {
                    url_params = firebaseCertificate.firebaseurl + childPath + jsonPath
                    url_params_childpath = firebaseCertificate.firebaseurl + newchildpath + jsonPath
                    await requestData(newObj, methodValue, url_params, url_params_childpath, node, msg);
                }
            } catch (error) {
                node.error(error, {});
            }
        });
    }

    async function requestData(newObj, methodValue, url_params, url_params_childpath, node, msg) {
        try {
            if (methodValue == "reanameChildPath") {
                // GET request to fetch data
                const responseGet = await axios({
                    method: "GET",
                    url: url_params
                });
                
                const dataClone = responseGet.data;
                
                // DELETE request to remove old data
                await axios({
                    method: "DELETE",
                    url: url_params
                });
                
                // PUT request to create new data
                const responsePut = await axios({
                    method: "PUT",
                    url: url_params_childpath,
                    data: dataClone
                });
                
                msg.payload = responsePut.data;
                node.send(msg);
            } else {
                const response = await axios({
                    method: methodValue,
                    url: url_params,
                    data: newObj
                });
                
                if (methodValue.toLowerCase() == "delete") {
                    msg.payload = "Delete success!";
                    node.send(msg);
                } else {
                    msg.payload = response.data;
                    node.send(msg);
                }
            }
        } catch (error) {
            node.error(error, {});
            node.status({fill: "red", shape: "ring", text: "failed"});
        }
    }

    RED.nodes.registerType("addFirebase", addFirebase);
};