## Run the Project
1. `npm install` to install all dependencies  
2. `firebase login` to login to your firebase account
3. `firebase init` to initialize project with firebase  
4. add firebase configuration file  

/functions/util/config.js:  

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
7. add functions/.env file with your OpenAI api key `OPENAI_API_KEY=""`


## API Documentation
request body parameters:

    {
        type: ""
        keyword: "",
        previous_keyword: ""
        link: "",
    }
* POST /chatgpt_api
    - type == "keyword-list"
        - ask GPT for a list of related keyword with `keyword`
    - type == "keyword-explanation"
        - ask GPT for definition of `keyword`
    - type == "keyword-list-bfs"
        - ask GPT for breath-first search related words with `keyword` and `previous_keyword`
    - type == "keyword-list-dfs"
        - ask GPT for depth-first search related words with `keyword` and `previous_keyword`
* POST /wiki_api
    - type == "keyword-search"
        - fetch a list of related wikipedia page with `keyword`
    - type == "page-summary"
        - fetch page content with `link`, ask GPT for summary
* POST /youtube_api
    - type == "keyword-search"
        - fetch a list of related youtube video with `keyword`
    - type == "summary"
        - fetch youtube video transcript with `link`, ask GPT for summary

## libraries
* https://github.com/damonwonghv/youtube-search-api
* https://github.com/Kakulukian/youtube-transcript
* https://github.com/html-to-text/node-html-to-text