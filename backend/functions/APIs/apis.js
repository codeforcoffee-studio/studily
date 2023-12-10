const { log } = require('firebase-functions/logger');
const { admin, db } = require('../util/admin');
const { firebaseConfig } = require('../util/config');
const { initializeApp } = require('firebase/app');
const { OpenAI } = require('openai');

initializeApp(firebaseConfig);

// POST /chatgpt_api
exports.chatgptAPI =  async (req, res) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    let {type, keyword, previous_keyword} = req.body
    let response = "";

    if(type == "keyword-list"){
        log("fetching keyword-list...");
        response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": "You will be provided with a keyword, and your task is to return a list of related terms, the return list of keywords should be separated with commas."
              },
              {
                "role": "user",
                "content": keyword
              }
            ],
            temperature: 0.5,
            max_tokens: 64
        });
    }
    else if(type == "keyword-explanation"){
        log("fetching keyword-explanation...");
        response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": "You will be provided with a keyword, and your task is to return its definition in a single paragraph."
              },
              {
                "role": "user",
                "content": keyword
              }
            ],
            temperature: 0.5,
            max_tokens: 128
        });
    }
    else if(type == "keyword-list-bfs"){
        response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": "You will be provided with a keyword and a previous keyword, and your task is to return a list of terms related to keyword in the general context of the previous keyword, the return list of keywords should be separated with commas."
              },
              {
                "role": "user",
                "content": "keyword is " + keyword + ", previous keyword is " + previous_keyword
              }
            ],
            temperature: 0.5,
            max_tokens: 64
        });
    }
    else if(type == "keyword-list-dfs"){
        response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                "role": "system",
                "content": "You will be provided with a keyword and a previous keyword, and your task is to return a list of terms by going down the rabbit hole, each term should be related in the context of the previous word, the return list of keywords should be separated with commas."
                },
                {
                "role": "user",
                "content": "keyword is " + keyword + ", previous keyword is " + previous_keyword
                }
            ],
            temperature: 0.5,
            max_tokens: 64
        });
    }
    log(response.choices[0].message.content)
    res.send(JSON.stringify(response.choices[0].message.content))
}