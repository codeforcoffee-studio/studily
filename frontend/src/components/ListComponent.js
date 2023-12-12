import React, {useState, useEffect} from 'react';
import { Text, Spacer, Button, Spinner } from '@geist-ui/core'
import { Zap, Youtube, BookOpen } from '@geist-ui/icons';
import * as APICalls from "../apis/APICalls";


const ListComponent = ({initNode, type}) => {
    const [summaries, setSummaries] = useState({});
    const [waitingIndex, setWaitingIndex] = useState(-1);
    const [items, setItems] = useState([])
    const [waiting, setWaiting] = useState(false);

    useEffect(()=>{
        if(initNode){
            const fetchData = async () => {
                setWaiting(true);
                console.log(initNode.label);
                var items = [];
                if(type === "wiki"){
                    items = await APICalls.WikiAPI_KeywordSearch(initNode.label);
                }
                else if(type === "youtube"){
                    items = await APICalls.YouTubeAPI_KeywordSearch(initNode.label);
                }
                setItems(items)
                setWaiting(false);
            };
          
            fetchData();
        }
    }, [initNode])

    const styles = {
        wiki_divcol: {
            background: '#f5f5f5', 
            padding: '2px', 
            borderRadius: '10px',
            margin: '5px',
            display: 'flex', 
            flexDirection: 'column',
            alignContent: "center"
        },
        youtube_divcol: {
            background: '#E4C9C9', 
            padding: '4px', 
            borderRadius: '10px',
            margin: '5px',
            display: 'flex', 
            flexDirection: 'column',
            alignContent: "center"
        },
        divrow: {
            display: 'flex', 
            flexDirection: 'row',
            justifyContent: 'center'
        },
        link: {
            textDecoration: 'none', 
            color: '#333', 
        },
        button: {
            marginLeft: '10px'
        },
        div: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: "100%",
            justifyContent: 'center',
            alignContent: 'center',
            textAlign: 'left'
        },
    }

    function truncateString(string, maxLength) {
        if (string.length > maxLength) {
          return string.substring(0, maxLength - 3) + '...';
        }
        return string;
      }

    const handleClick = async (id, index) => {
        setWaitingIndex(index);
        var summary = "";
        if(type === "wiki"){
            summary = await APICalls.WikiAPI_Summary(items[id].original_link);
        }
        else if(type === "youtube"){
            summary = await APICalls.YouTubeAPI_Summary(id);
        }
       
        setSummaries({...summaries, [id]: summary});
        setWaitingIndex(-1);   
    }
    
    return (
      <div>
        {
        waiting ? 
            <div style={styles.div}>
                <Spacer h={1}/>
                <Spinner/>
            </div>
            :
        items.map((item, index) => (
          <div style={type === "wiki" ? styles.wiki_divcol : styles.youtube_divcol} key={index}>
            <div style={styles.divrow}> 
                <Button icon={type === "wiki" ? <BookOpen /> : <Youtube />} style={{width:"300px"}}>
                    <a key={index} href={type === "wiki" ? item.original_link : "https://www.youtube.com/watch?v="+item.id} target="_blank" rel="noopener noreferrer" style={styles.link}>
                        {truncateString(item.title, 30)}
                    </a>
                </Button>
                {
                    waitingIndex === index ? 
                    <>
                        <Spacer w={0.5}></Spacer>
                        <Button loading scale={0.75}></Button>
                    </>
                    :
                    <Button icon={<Zap />} auto scale={0.8} onClick={() => handleClick(item.id, index)} style={styles.button}>Summarize</Button>
                }
            </div>
            {
                summaries[item.id] ? 
                <div style={{textAlign: 'left', padding: "15px"}}><Text>{summaries[item.id]}</Text></div>
                :
                <></>
            }
          </div>
        ))
        }
      </div>    
    );
};

export default ListComponent;