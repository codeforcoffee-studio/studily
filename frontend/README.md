## run locally
- `npm install --force` or `npm install --legacy-peer-deps` bypass peerDependency auto-installation in order to use React 18 (vis-react has peer-dependency of React 16)
- `npm start`

## project structure
- main component: `App.js`, which splits the page into two parts
    - search & knowledge graph
        - /components/`SearchSection.js` - breath & depth search
        - /components/`KnowledgeGraph.js` - graph & nodes
    - information display 
        - /components/`InfoPage.js` & /`ListComponent.js`: definition, wiki, youtube
- api/APICall.js stores all API call functions

## libraries
- React: https://react.dev/
- Geist UI: https://geist-ui.dev/en-us 
- Vis-React: https://github.com/anishmprasad/vis-react
    - more on vis: https://visjs.github.io/vis-network/docs/network/index.html
- Axios: https://axios-http.com/