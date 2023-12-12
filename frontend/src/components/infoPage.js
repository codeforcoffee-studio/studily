import React, {useState, useEffect} from 'react';
import { Card, Text, Spacer, Button, Spinner, Tabs, Modal } from '@geist-ui/core'
import { Copy, Info, Flag, Settings, Moon, Circle, ArrowRight, Save } from '@geist-ui/icons';
import "../styles/info.css";
import ListComponent from './ListComponent';


const InfoPage = ({initNode, path, graph, clickNodeFromBreadcrumbs, infoWaiting}) => {
    const [node, setNode] = useState(null);
    const [modal, setModal] = useState(false);

    useEffect(()=>{
        if(initNode){
            setNode(initNode);
        }
    }, [initNode]);
    

    const styles = {
        div: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: "100%",
            justifyContent: 'center',
            alignContent: 'center',
            textAlign: 'left'
        },
        p: {
            textAlign: "left",
            margin: "20px",
            padding: "10px"
        },
        divcol: {
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
        buttons: {
            display: 'flex', 
            flexDirection: 'row',
            justifyContent: 'center'
        },
    }


    return (
        <Card width="100%" height="100%" style={styles.definition}>
            <div style={styles.buttons}>
            <Button icon={<Save />} auto disabled>Save</Button>
                <Button icon={<Moon />} auto disabled>Mode</Button>
                <Button icon={<Copy />} auto disabled>Copy</Button>
                <Button icon={<Flag />} auto disabled>Flag</Button>
                <Button icon={<Settings />} auto disabled>Settings</Button>
                <Button icon={<Info />} auto onClick={()=>setModal(!modal)}>
                    <Modal visible={modal} onClose={()=>setModal(!modal)}>
                        <Modal.Title>About Studily ☕</Modal.Title>
                        <Modal.Content>
                            <p style={{textAlign: 'center'}}>
                                Studily is a study copilot to help you learn faster. 🧐
                                Give a keyword, it automatically generates a knowledge graph 🕸️ with related terms and definitions. 
                                It queries other APIs such as Wikipedia and YouTube to provide more context and resources, with the option to quickly summarize the content inside those links.
                                You're able to expand the knowledge graph with breath-first and depth-first search on any node to further explore and go down the 🐰 hole. 
                            </p>
                        </Modal.Content>
                        <Modal.Subtitle>designed with ❤️ by CodeForCoffee ☕</Modal.Subtitle>
                    </Modal>
                    Info
                </Button>
            </div>
           
            <Spacer h={1}/>
            <div style={styles.divrow}>
                {path.map((item, index) => (
               
                <div style={styles.divrow}>
                    {item !== 0 ?
                        <Button icon={<ArrowRight />} auto></Button>    
                        :
                        <></>
                    }
                    <Button icon={<Circle />} auto onClick={()=>{clickNodeFromBreadcrumbs(graph.nodes[item].id)}}>{graph.nodes[item].label}</Button>
                </div>
               
                ))}
            </div>
            {
                infoWaiting ? 
                    <div style={styles.div}>
                        <Spacer h={1}/>
                        <Spinner/>
                    </div>
                :
                    node != null ? 
                    <div style={styles.div}>
                        <Spacer h={1}/>
                        <Text h3>{node.label}</Text>  
                        <Text p><b>Definition</b>: {node.definition}</Text>  
                        
                        <Tabs initialValue="1">
                            <Tabs.Item label="Wikipedia" value="1">
                                <ListComponent initNode={initNode} type={"wiki"}/>
                            </Tabs.Item>
                            <Tabs.Item label="YouTube" value="2">
                                <ListComponent initNode={initNode} type={"youtube"}/>
                            </Tabs.Item>
                        </Tabs>
                    </div>
                    :
                    <></>
            }
        </Card>
    );
}


export default InfoPage;