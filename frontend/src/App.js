import React, {useState, useEffect} from 'react';
import './styles/App.css';
import "./styles/styles.css";
import { Grid, Text, Spacer, Button, Spinner, Toggle  } from '@geist-ui/core';
import { CornerDownLeft, Coffee, CornerLeftDown, CornerRightUp } from '@geist-ui/icons'
import logo from "./imgs/studily-signature.png"
import InfoPage from './components/InfoPage';
import KnowledgeGraph from './components/KnowledgeGraph';
import SearchSection from './components/SearchSection';
import * as APICalls from "./apis/APICalls";

const App = () => {
  const [searchValue, setSearchValue] = useState("");
  const [node, setNode] = useState(null);
  const [path, setPath] = useState([]);
  const [graph, setGraph] = useState(null);
  const [definitions, setDefinitions] = useState({});
  const [waiting, setWaiting] = useState(false);
  const [infoWaiting, setInfoWaiting] = useState(false);
  const [dragNode, setDragNode] = useState(null);
  const [gravity, setGravity] = useState(true);
  const [nodeSize, setNodeSize] = useState(13);
  const [width, setWidth] = React.useState(window.innerWidth);

  const styles = {
    grid: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    img: {
      width: '10%',
      height: 'auto',
    },
    input: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: "100%",
      justifyContent: 'center',
      alignContent: 'center'
    },
    scroll: {
      width: "100%",
      height: "100%",
      overflowX: "hidden",
      overflowY: "auto",
      textAlign: "center"
    },
    divrow: {
      display: 'flex', 
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: "center"
    },
    divStyle: {
      width: '100%', 
      height: '100%', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  }

  useEffect(()=>{
    const handleResizeWindow = () => setWidth(window.innerWidth);
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);

    const keyDownHandler = event => {
      console.log('User pressed: ', event.key);

      if (event.key === 'Enter') {
        event.preventDefault();

        onSubmitButtonPressed();
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [searchValue]);

  const onInputChange = (e) => {
    setSearchValue(e.target.value);
  }

  const onSubmitButtonPressed = async () => {
    if(searchValue == ""){
      return;
    }
    console.log("submitting ", searchValue);
    setWaiting(true);

    let relatedKeywords = await APICalls.ChatGPTAPI_KeywordSearch(searchValue);

    let nodes = [];
    let edges = [];
    /*
      nodes: [
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        { id: 3, label: "Node 3" }
      ],
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 }
      ]
    */ 
    nodes.push({id: 0, label: `${searchValue}`, color: "#998881"}); // coffee #584C47, purple #874d99
    for(var i = 0; i < relatedKeywords.length; i+=1){
      nodes.push({id: i+1, label: `${relatedKeywords[i]}`, color: "#D4D4D4"});
      edges.push({from: 0, to: i+1, arrows: { from: { enabled: false, type: 'arrow' } }});
    }
    console.log(nodes);
    console.log(edges); 

    let newGraph = {nodes: nodes, edges: edges};
    console.log(newGraph);
    setGraph(newGraph);
    setWaiting(false);
  }

  const breadcrumbs = (node_id) => {
    // return a list of node starting from root_node to node_id
    var current_node = node_id;
    var path = []
    while(current_node !== 0){ // while current_node is not root
      for(var i = 0; i < graph.edges.length; i++){
        if(graph.edges[i].to === current_node){
          path.push(current_node);
          current_node = graph.edges[i].from;
          break;
        }
      }
    }
    path.push(0);

    return path.reverse();
  }

  const selectNode = async (node_id) => {
    console.log("Selected nodes: ", graph.nodes[node_id]);
    const keyword = graph.nodes[node_id].label;

    const bread = breadcrumbs(node_id);
    var nodeObj = {};
    setInfoWaiting(true);

    if(!definitions[keyword]){
      var definition = await APICalls.ChatGPTAPI_KeywordDefinition(keyword, searchValue);
      console.log("def: " + definition);
      setDefinitions({[searchValue]: definition});
      nodeObj = {
        ...graph.nodes[node_id],
        'definition': definition
      }
    }
    else{
      nodeObj = {
        ...graph.nodes[node_id],
        'definition': definitions[keyword]
      }
    }
    setNode(nodeObj);
    setPath(bread);
    setInfoWaiting(false);
  }

  const clickNodeFromBreadcrumbs = (node_id) => {
    selectNode(node_id)
  }

  const handleDragNode = (node_id) => {
    const nodeObj = {
      ...graph.nodes[node_id],
    }
    setDragNode(nodeObj);
  }

  const addGraph = async (node, type) => {
    console.log("searching: " + node.label + " with id " + node.id + " " + type);
    const bread = breadcrumbs(node.id);
    var nodes = [];
    var edges = [];
    /*
        nodes: [
          { id: 1, label: "Node 1" },
          { id: 2, label: "Node 2" },
          { id: 3, label: "Node 3" }
        ],
        edges: [
          { from: 1, to: 2 },
          { from: 1, to: 3 }
        ]
    */
    if(type === "breath"){
      let relatedKeywords = await APICalls.ChatGPTAPI_BFS(node.label, graph.nodes[bread.length-1].label);
      
      for(let i = 0; i < 5; i+=1){
        nodes.push({id: graph.nodes.length + (i), label: `${relatedKeywords[i]}`, color: "#D4D4D4"});
        edges.push({from: node.id, to: graph.nodes.length + (i), arrows: { from: { enabled: false, type: 'arrow' } }});
      }
      console.log(nodes);
      console.log(edges); 

      let newGraph = {nodes: graph.nodes.concat(nodes), edges: graph.edges.concat(edges)};
      console.log(newGraph);
      setGraph(newGraph);
    }
    else if(type === "depth"){  
      let relatedKeywords = await APICalls.ChatGPTAPI_DFS(node.label, graph.nodes[bread.length-1].label);
     
      console.log("graph nodes length: ",graph.nodes.length);
      var prev_node = node.id;
      for(let i = 0; i < 3; i+=1){
        nodes.push({id: graph.nodes.length + (i), label: `${relatedKeywords[i]}`, color: "#D4D4D4"});
        edges.push({from: prev_node, to: graph.nodes.length + (i), arrows: { from: { enabled: false, type: 'arrow' } }});
        prev_node = graph.nodes.length + (i);
      }
      console.log(nodes);
      console.log(edges); 

      let newGraph = {nodes: graph.nodes.concat(nodes), edges: graph.edges.concat(edges)};
      console.log(newGraph);
      setGraph(newGraph);
    }
  }  

  const toggleGravity = () => {
    setGravity(!gravity);
  }

  const nodeSizeChange = (op) =>{
    if(op === "add"){
      setNodeSize(nodeSize+1)
    }
    else{ // op === "minus"
      if(nodeSize > 0)
        setNodeSize(nodeSize-1)
    }
  }

  return (
    <div className="App">
      <Grid.Container gap={0} justify="center" align='center' height="100%">
        <Grid xs={24} md={12} width="100%" style={styles.grid}>
          <Spacer h={1}/>
          
          <div style={styles.input}>
            <img src={logo} alt="Logo" style={styles.img}/>
            by 
            <Spacer w={0.5}/>
            <Button icon={<Coffee />} auto><a href='https://github.com/codeforcoffee-studio/studily' target="_blank" rel="noreferrer">CodeforCoffee</a></Button>
          </div>

          <Spacer h={1}/>
          <div style={styles.input}>
            <input 
                style={{
                borderRadius:"10px",
                padding: "10px",
                border: "0px solid #ccc",
                boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)"}} 
                type='text'
                value={searchValue}
                onChange={onInputChange}
            />
            <Spacer w={1}/>
            <Button icon={<CornerDownLeft />} auto onClick={onSubmitButtonPressed}></Button>
          </div>

          <SearchSection node={dragNode} addGraph={addGraph}/>
          <div style={styles.divrow}>
            <Text small>gravity</Text>
            <Spacer w={0.5}/>
            <Toggle type="secondary" initialChecked checked={gravity} onChange={toggleGravity}/>
            <Spacer w={0.5}/>
            <Text small>node size</Text>
            <Spacer w={0.5}/>
            <Button icon={<CornerLeftDown /> } auto onClick={()=>nodeSizeChange("minus")}></Button>
            <Spacer w={0.5}/>
            <Text small>{nodeSize}</Text>
            <Spacer w={0.5}/>
            <Button icon={<CornerRightUp />} auto onClick={()=>nodeSizeChange("add")}></Button>
          </div>
          {
            waiting ? 
            <div>
              <Spacer h={5}/>
              <Spinner />
            </div>
            :
            <div className="vis-react">
              <KnowledgeGraph initGraph={graph} selectNode={selectNode} handleDragNode={handleDragNode} gravity={gravity} nodeSize={nodeSize}/>
            </div>
          }
        </Grid>
        <Grid xs={24} md={12}>
            <div style={styles.scroll}>
                <InfoPage initNode={node} path={path} graph={graph} clickNodeFromBreadcrumbs={clickNodeFromBreadcrumbs} infoWaiting={infoWaiting}/>
            </div>
        </Grid>
      </Grid.Container>
    </div>
  );
}


export default App;
