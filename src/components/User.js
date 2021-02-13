import React, { useState } from 'react';
import BipSelector from './bipselector'; 
import { FairLink, FairOSApi } from './FairLink'; 

const User = (props) =>  {
    const [username, setUser] = useState(props.user);         // t1111
    const [password, setPassword] = useState(props.password); // deedadsed
    const [mnemonic, setMnemonic] = useState(props.mnemonic); // 12 word mnemonic ie. push curve bottom alien silent stove genre deal nasty walnut blood foam
    const [address, setAddress] = useState(props.address); // user address
    const [apiEndpoint, setApiEndpoint] = useState(props.apiEndpoint); // user address
  
    const [loginUserStatus, setLoginUserStatus] = useState(''); 
    const [importStatus, setImportStatus] = useState(''); 
    const [signupStatus, setSignupStatus] = useState(''); 
    const [signupError, setSignupError] = useState(''); 
    const [presentStatus, setPresentStatus] = useState(''); 
    const [isLoggedStatus, setIsLoggedStatus] = useState(''); 

  
    var signupData = new FormData();   
    signupData.append("user", username); 
    signupData.append("password", password); 
    //signupData.append("mnemonic", props.mnemonic.toString().replace(/,/g," ")); 
    //signupData.append("address", address); 

    const userData = new FormData();   
    userData.append("user", username); 
    function onSignupStatus(response)
    {
        console.error("PODs", response);
        //if(response!=undefined && response.data!=undefined && response.data.message!=undefined)
        //    setDirError(response.data.message.toString());
        setSignupStatus(null);
    }

    function checkSignupMnemonic()
    {
      setSignupError(null);
      signupData.delete("mnemonic"); 
      return signupData;
    }
    function checkImportMnemonic()
    {
      setImportStatus(null);
      signupData.delete("mnemonic"); 
      signupData.append("mnemonic", props.mnemonic.toString().replace(/,/g," ")); 
      return signupData;
    }

    function isLoggedin()
    {
        FairOSApi("get", apiEndpoint + '/v0/user/isloggedin?user='+username, userData, undefined, props.isLoggedIn, setIsLoggedStatus, undefined, undefined)
    }
    //if(props.mnemonic===undefined) return <>Hmm</>
  
    return (<>
        <h2>User</h2>
           Username: &nbsp;<input type="text" onChange={(e)=>setUser(e.target.value)} value={username}></input><br/>
           Password: &nbsp;&nbsp;<input type="password" onChange={(e)=> {setPassword(e.target.value); props.onPassword(e.target.value); }} value={password}></input> <br/>
           <FairLink formData={signupData}  url={apiEndpoint + '/v0/user/login'} description={"Login"}  onResult={props.onLoginStatusChange} onError={setLoginUserStatus} onAfterGet={isLoggedin}/> 
           <div className="fairError">{loginUserStatus!=undefined ? loginUserStatus.toString(): "Error"}</div>
         <hr/>

         <h2>Create new user</h2>
           <BipSelector onMnemonicChange={props.onNewMnemonic} mnemonic={props.mnemonic}/>
           <FairLink formData={signupData}  url={apiEndpoint + '/v0/user/signup'} description={"Signup"} onCreateFormData={checkSignupMnemonic} onResult={setSignupStatus} onError={setSignupError} onData={props.onSignUp}/> 
           <div className="">{signupStatus}</div>
           <div className="fairError">{signupError}</div>
           Address: {props.address}<br/>
           Mnemonic: {props.mnemonic!=undefined ? props.mnemonic.toString() : null}
         <hr/>
  
         <h2>Import</h2>
           <strong>user: </strong>{username.toString()}<br/>
           <strong>mnemonic: </strong>{mnemonic.toString()}<br/>
           <FairLink formData={signupData}  url={apiEndpoint + '/v0/user/import'} description={"Import"} onCreateFormData={checkImportMnemonic} onResult={setSignupStatus} onError={setImportStatus}/> 
           <div className="fairError">{importStatus}</div>
         <hr/>   

        <h2>Check</h2>
           <FairLink formData={userData}  url={apiEndpoint + '/v0/user/present?user='+username} description={"Present"} onResult={setPresentStatus} method='get' onError={setPresentStatus}/> 
           <div className="fairError">{presentStatus}</div>           
           <FairLink formData={userData}  url={apiEndpoint + '/v0/user/isloggedin?user='+username} description={"Is Logged In?"} onResult={props.isLoggedIn} method='get' onError={setIsLoggedStatus}/> 
           <div className="fairError">{isLoggedStatus}</div>           

        <hr/>
        {window.showDebug==true ? 
        <ul>
              <strong>User APIs</strong>
              <li>POST -F 'user=\{username}' -F 'password=\{password}' -F 'mnemonic={mnemonic}' {apiEndpoint}/v0/user/signup</li>
              <li>POST -F 'user=\{username}' -F 'password=\{password}' {apiEndpoint}/v0/user/signup</li>
              <li>POST -F 'user=\{username}' -F 'password=\{password}' {apiEndpoint}/v0/user/login</li>
              <li>POST -F 'user=\{username}' -F 'password=\{password}' -F 'address=\{address}' {apiEndpoint}/v0/user/import</li>
              <li>POST -F 'user=\{username}' -F 'password=\{password}' -F 'mnemonic=\{mnemonic}' {apiEndpoint}/v0/user/import</li>
              <li>GET -F 'user=\{username}' {apiEndpoint}/v0/user/present</li>
              <li>GET -F 'user=\{username}' {apiEndpoint}/v0/user/isloggedin</li>    
        </ul>
        :null
        }
      </>
      );
  }

  
export default User;