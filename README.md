## Introduction
I will briefly explain how to use Firebase methods.
https://firebase.google.com/docs/reference/rest/database
Basically implemented based on this API document.

## Features
Get
Set
Push
Update
Remove
setpriority
rename child path

## Certificate
Access link firebase settings as below. After that, click button "Generate new private key" to download key
https://console.firebase.google.com/u/0/project/`[your-project]`/settings/serviceaccounts/adminsdk

![certificate](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/certificate1.png)

Edit node, choose Auth Type is JSON Web Token and input client Email and private Key from the file

![certificate2](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/certificate2.png)

## Usage
1. Get method (GET)
If you execute after setting the Child Path, the Child Path data will appear.

![get-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/get1.png)

![get-data-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/get2.png)

2. Set method (PUT)
After inputting data such as {"first": "Jack", "last": "Sparrow"}, if there is already data in the specified Child Path, that data will be lost and updated with the input data.

![set-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/set1.png)

![set-data-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/set2.png)

3. Push method (POST)
For example, Child Path is a list of users, enter {"user_number": "321", "name": "John"}. When executed, the new user will be added to the user list.

![push-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/push1.png)

![push-data-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/push2.png)

4. Update method (PATCH)
Update the existing data with the entered data.

![update-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/update1.png)

![update-data-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/update2.png)


5. Remove method (DELETE)
Delete Child Path.

![remove-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/remove1.png)

![remove-data-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/remove2.png)


6. Set Priority and setwithPrioty methods (PATCH)
This is because the Put method sets the priority for the child path. (Or to get the priority with GET)

![setpriority-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/setpriority1.png)

![setpriority-data-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/setpriority2.png)

7. Rename child path

![rename-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/rename1.png)

![rename-data-node](https://cdn.jsdelivr.net/gh/taminhhienmor/node-red-contrib-firebase-data/source/image/rename2.png)