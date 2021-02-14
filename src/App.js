import './App.css';
import React, { useState } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import FairosSelector from './components/FairosSelector.js';
import Home from './components/Home.js';
import User from './components/User.js';
import PODs from './components/PODs.js';
import KVs from './components/KVs.js';
import DOCs from './components/DOCs.js';

window.showDebug = false;

function Settings() {
  return (<h2>Settings</h2>);
}
function Loader() {
  return (<div className="loader">&#1421;</div>);
}

function App() {
  const [apiEndpoint, setApiEndpoint] = useState('https://api.fairos.io');
  const [user, setUser] = useState(localStorage.getItem("user") ? null : 'testx12345612xx99');
  const [password, setPassword] = useState('testx12345612testx12345612');
  const [mnemonic, setMnemonic] = useState([]);
  const [address, setAddress]   = useState('0x');
  const [loginStatus, setLoginStatus] = useState('not logged in');
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  var   [fileSelect, setFileSelect]   = useState(null);
  var   [isLoading, setIsLoading]   = useState(false);
  var   [currentPod, setCurrentPod]   = useState(false);

  window.setIsLoading = setIsLoading; 

  function onSignup(data)
  {
    setAddress(data.address);
    setMnemonic(data.mnemonic.split(" "));
  }
  function onNewMnemonic(mnemonic)
  {
    setMnemonic(mnemonic);
  }
  function onCurrentPod(data)
  {
    setCurrentPod(data);
    setLoginStatus(null);
  }
 
  return (
    <div className="App">
      <Router>      
        <header className="App-header">
            
            <Link to="/user"><small>{isLoggedIn ? <>&#1421;</> :null}</small>User  </Link>
            {isLoggedIn===true ?
            <>
              <Link to="/pods">PODs </Link>
              <Link to="/kvs">KVs </Link>
              <Link to="/docs">DOCs </Link>
            </> 
            : <><span > </span><span > </span><span > </span></> }
              <Link to="/about">&#9881;&#128736; </Link>
              <Link to="/">&#8962;&#9432;  </Link> 
        </header>
        <div className="App-banner">{currentPod} {loginStatus} </div> 
        <div className="App-body">
          <Switch>
              <Route path="/" exact>
                  <Home />
              </Route>
              
              <Route path="/about">
                <FairosSelector  onSelectEndpoint={setApiEndpoint} apiEndpoint={apiEndpoint}/>
              </Route>
              <Route path="/user">
                  <User apiEndpoint={apiEndpoint} user={user} password={password} mnemonic={mnemonic}  address={address} onNewMnemonic={onNewMnemonic} onPassword={setPassword} onLoginStatusChange={setLoginStatus} isLoggedIn={setIsLoggedIn} onSignUp={onSignup}/>
                  Address:{address}<br/>
                  Mnemonic:{mnemonic.toString()}                
              </Route>

              {isLoggedIn===true ?
              <>
                <Route path="/pods">
                  <PODs apiEndpoint={apiEndpoint} user={user} password={password} onFileSelect={setFileSelect} onPodSelect={onCurrentPod} />
                </Route>
                <Route path="/kvs">
                  <KVs apiEndpoint={apiEndpoint} />
                </Route>
                <Route path="/docs">
                  <DOCs apiEndpoint={apiEndpoint}  />
                </Route>
              </>            
              : null }

           
            </Switch>
            {isLoading ? <Loader/> : null}
        </div>
      </Router>
      
    </div>
  );
}

export default App;
