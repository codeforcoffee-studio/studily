import axios from 'axios';
const API_BASE_URL = "https://us-central1-studily-ca0ed.cloudfunctions.net/api";

export async function ChatGPTAPI_KeywordSearch (keyword){
    var relatedKeywords = [];
    try{
        var res = await axios.post(API_BASE_URL+"/chatgpt_api", { "type": "keyword-list", "keyword": `${keyword}`});
        relatedKeywords = res.data.replace(/\./g, '').split(', ');
    }
    catch(error) {
        console.error(error);
    };
    return relatedKeywords;
}

export async function ChatGPTAPI_KeywordDefinition (keyword, searchValue) {
    var definition = "";
    try{
        var res = await axios.post(API_BASE_URL+"/chatgpt_api", { "type": "keyword-explanation", "keyword": keyword + " in the context of " + `${searchValue} `, "previous_word": ""});
        definition = res.data;
    }
    catch(error){
        console.log(error);
    }
    return definition;
}

export async function ChatGPTAPI_BFS(keyword, previous_keyword){
    var relatedKeywords = [];
    try{
        var res = await  axios.post(API_BASE_URL+"/chatgpt_api", { "type": "keyword-list-bfs", "keyword": `${keyword}`, "previous_keyword": `${previous_keyword}`})
        relatedKeywords = res.data.replace(/\./g, '').split(', ');
    }
    catch(error) {
        console.error(error);
    };
    return relatedKeywords;
}

export async function ChatGPTAPI_DFS(keyword, previous_keyword){
    var relatedKeywords = [];
    try{
        var res = await  axios.post(API_BASE_URL+"/chatgpt_api", { "type": "keyword-list-dfs", "keyword": `${keyword}`, "previous_keyword": `${previous_keyword}`})
        relatedKeywords = res.data.replace(/\./g, '').split(', ');
    }
    catch(error) {
        console.error(error);
    };
    return relatedKeywords;
}

export async function WikiAPI_KeywordSearch (keyword){
    var items = [];
    try{
        var res = await axios.post(API_BASE_URL+'/wiki_api', { "type": "keyword-search", "keyword": keyword })
        items = res.data;
    }
    catch(error) {
        console.error(error);
    };
    return items;
}

export async function WikiAPI_Summary (link){
    var summary = "";
    try{
        var res = await axios.post(API_BASE_URL+'/wiki_api', { "type": "page-summary", "link": link })
        summary = res.data;
    }
    catch(error) {
        console.error(error);
    };
    return summary;
}

export async function YouTubeAPI_KeywordSearch (keyword){
    var items = [];
    try{
        var res = await axios.post(API_BASE_URL+'/youtube_api', { "type": "keyword-search", "keyword": keyword})
        items = res.data;
    }
    catch(error) {
        console.error(error);
    };
    return items;
}

export async function YouTubeAPI_Summary (id){
    var summary = "";
    try{
        var res = await axios.post(API_BASE_URL+'/youtube_api', { "type": "summary", "link": id })
        summary = res.data;
    }
    catch(error) {
        console.error(error);
    };
    return summary;
}