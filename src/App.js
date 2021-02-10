import './App.css';
import React, { useState } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import FairosSelector from './components/FairosSelector.js';
import Home from './components/Home.js';
import User from './components/User.js';
import PODs from './components/PODs.js';
import KVs from './components/KVs.js';
import DOCs from './components/DOCs.js';



function Settings() {
  return (<h2>Settings</h2>);
}

function App() {
  const [apiEndpoint, setApiEndpoint] = useState('https://api.fairos.io');
  const [user, setUser] = useState(localStorage.getItem("user") ? null : 'testx12345612');
  const [password, setPassword] = useState('testx12345612testx12345612');
  const [mnemonic, setMnemonic] = useState('');
  const [address, setAddress]   = useState('');
  const [loginStatus, setLoginStatus]   = useState('not logged in');
  const [isLoggedIn, setIsLoggedIn]   = useState(false);

  function onSignup(data)
  {
    setAddress(data.address);
    setMnemonic(data.mnemonic);
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
        <div className="App-banner">{loginStatus} </div> 
        <div className="App-body">
          <Switch>
              <Route path="/about">
                <FairosSelector  onSelectEndpoint={setApiEndpoint} apiEndpoint={apiEndpoint}/>
                <Settings />
              </Route>
              <Route path="/user">
                  <User apiEndpoint={apiEndpoint} user={user} password={password} mnemonic={mnemonic} address={address} onLoginStatusChange={setLoginStatus} isLoggedIn={setIsLoggedIn} onSignUp={onSignup}/>
              </Route>

              {isLoggedIn===true ?
              <>
                <Route path="/pods">
                  <PODs apiEndpoint={apiEndpoint} user={user} password={password} />
                </Route>
                <Route path="/kvs">
                  <KVs apiEndpoint={apiEndpoint} />
                </Route>
                <Route path="/docs">
                  <DOCs apiEndpoint={apiEndpoint}  />
                </Route>
                <Route path="/" exact>
                  <Home />
                </Route>
              </>            
              : null }
            </Switch>
        </div>
      </Router>
      
    </div>
  );
}

export default App;
