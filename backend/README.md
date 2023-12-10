## Run the Project
1. `npm install` to install all dependencies  
2. `firebase login` to login to your firebase account
3. `firebase init` to initialize project with firebase  
4. add firebase configuration file

*/functions/util/config.js:  

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

5. `firebase serve` to run serve locally  
or  
6. `firebase deploy` to deploy apis to server
7. add .env file with your OpenAI api key `OPENAI_API_KEY=""`


## API Documentation
### HTTP-GET


### HTTP-POST

