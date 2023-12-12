const { log } = require('firebase-functions/logger');
const { admin, db } = require('../util/admin');
const { firebaseConfig } = require('../util/config');
const { initializeApp } = require('firebase/app');
const axios = require('axios');
const { OpenAI } = require('openai');
const youtubesearchapi = require("youtube-search-api");
const {YoutubeTranscript}  = require('youtube-transcript');
const { convert } = require('html-to-text');

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
                "content": "You will be provided with a keyword, and your task is to return a list of related terms, the return list of keywords should be separated with commas. Use the following word as keyword and do not reply anything else."
              },
              {
                "role": "user",
                "content": "the word is: " + keyword
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

// POST /wiki_api
exports.wikiAPI = async (req, res) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    let {type, keyword, link} = req.body

    var query = keyword;
    if(type == "keyword-search"){
        axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search="+ ${query} +”&format=json`)
        .then(response => {
            //log(response.data[3]);

            let data = []
            for(var i = 0; i < response.data[1].length; i++){
                data.push({
                   "title": response.data[1][i],
                   "original_link": response.data[3][i],
                   "pageid": i 
                });
            }
            //log(data)
            res.send(JSON.stringify(data))
        })
        .catch(error => {
            log(error);
        });
    }
    else if(type == "page-summary"){
        log(link);

        try{
            const axiosResponse = await axios.get(link); //"https://en.wikipedia.org/api/rest_v1/page/html/steve_jobs");
            //log(axiosResponse.data);
    
            var text = convert(axiosResponse.data, { wordwrap: 130 })
    
            text = text.replace(/ *\([^)]*\) */g, "");
            text = text.replace(/ *\[[^\]]*]/g, '');
            text = text.replace(/(\r\n|\n|\r)/g, "");
            
            //log(text)
    
            if(text.length > 13000){
                text = text.slice(0, 13000);
            }
    
            response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                    "role": "system",
                    "content": "You will be provided with text, and your task is to return a summary of the text in one paragraph."
                    },
                    {
                    "role": "user",
                    "content": text
                    }
                ],
                temperature: 0.5,
                max_tokens: 256
            });
            
            log(response.choices[0].message.content)
            res.send(JSON.stringify("Summary of first ~2000 words: " + response.choices[0].message.content))
    
        }
        catch(error){
            res.send(JSON.stringify("summary not available :("))
        }
        
    }
}

//POST /youtube_api
exports.youtubeAPI = async (req, res) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    let {type, keyword, link} = req.body

    if(type == "keyword-search"){
        let response = await youtubesearchapi.GetListByKeyword(keyword);
        log(response);
        let data = [];
        var limit = response.items.length < 10 ? response.items.length : 10;
        for(var i = 0; i < limit; i++){
            data.push({
                "title": response.items[i].title,
                "videoId": response.items[i].id,
            });
        }
        //log(data)
        res.send(JSON.stringify(data))
        
    }
    else if(type == "summary"){
        try{
            let transcript = await YoutubeTranscript.fetchTranscript(link);
            var transcript_text = "";
            for(var i = 0; i < transcript.length; i++){
                transcript_text += transcript[i].text + " ";
            }
            log(transcript_text)
            if(transcript_text.length > 16000){
                transcript_text = transcript_text.slice(0, 16000);
            }

            response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                    "role": "system",
                    "content": "You will be provided with text, and your task is to return a summary of the text in one paragraph."
                    },
                    {
                    "role": "user",
                    "content": transcript_text
                    }
                ],
                temperature: 0.5,
                max_tokens: 256
            });
            
            log(response.choices[0].message.content)
            res.send(JSON.stringify("Summary of first ~5 minutes of video: " + response.choices[0].message.content))
        }
        catch(error){
            res.send(JSON.stringify("video caption not available :("))
        } 
    }
}