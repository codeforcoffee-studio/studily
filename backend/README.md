## Run the Project
1. `npm install` to install all dependencies  
2. `firebase init` to initialize project with firebase  
3. add firebase configuration file (see below)  
4. `firebase serve` to run serve locally  
or  
5. `firebase deploy` to deploy apis to server

*add firebase configurations in /functions/util/config.js:  

    const firebaseConfig = {
        apiKey: "",   
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
    };
    module.exports = { firebaseConfig };


## API Documentation
### HTTP-GET


### HTTP-POST

