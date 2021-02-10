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
    const [createUserStatus, setCreateUserStatus] = useState(''); 
    const [presentStatus, setPresentStatus] = useState(''); 
    const [isLoggedStatus, setIsLoggedStatus] = useState(''); 
    
  
    const signupData = new FormData();   
    signupData.append("user", username); 
    signupData.append("password", password); 
    signupData.append("mnemonic", mnemonic); 
    signupData.append("address", address); 

    const userData = new FormData();   
    userData.append("user", username); 
    function CreateUserStatus(response)
    {
        console.error("PODs", response);
        // if(response.data!=undefined && response.data.message!=undefined)
        //    setDirError(response.data.message.toString());
        // setDirStatus(null);
    }

    function isLoggedin()
    {
        FairOSApi("get", apiEndpoint + '/v0/user/isloggedin?user='+username, userData, undefined, props.isLoggedIn, setIsLoggedStatus, undefined, undefined)
    }
  
    return (<>
        <h2>User</h2>
           Username: &nbsp;<input type="text" onChange={(e)=>setUser(e.target.value)}></input><br/>
           Password: &nbsp;&nbsp;<input type="password" onChange={(e)=>setPassword(e.target.value)}></input> <br/>
           <FairLink formData={signupData}  url={apiEndpoint + '/v0/user/login'} description={"Login"}  onResult={props.onLoginStatusChange} onError={setLoginUserStatus} onAfterGet={isLoggedin}/> 
           <div className="fairError">{loginUserStatus!=undefined ? loginUserStatus.toString(): "Error"}</div>
         <hr/>

         <h2>Create new user</h2>
           <BipSelector onMnemonicChange={setMnemonic}/> 
           <FairLink formData={signupData}  url={apiEndpoint + '/v0/user/signup'} description={"Signup"} onResult={props.onSignup} onError={CreateUserStatus}/> 
           <div className="fairError">{createUserStatus}</div>
         <hr/>
  
         <h2>Import</h2>
           <strong>user: </strong>{username.toString()}<br/>
           {/* <strong>pass: </strong>{password.toString()}<br/> */}
           {/* <strong>address: </strong>{address.toString()}<br/> */}
           <strong>mnemonic: </strong>{mnemonic.toString()}<br/>
           <FairLink formData={signupData}  url={apiEndpoint + '/v0/user/import'} description={"Import"} onResult={props.onLoginStatusChange} onError={setImportStatus}/> 
           <div className="fairError">{importStatus}</div>
         <hr/>   

        <h2>Check</h2>
           <FairLink formData={userData}  url={apiEndpoint + '/v0/user/present?user='+username} description={"Present"} onResult={setPresentStatus} method='get' onError={setPresentStatus}/> 
           <div className="fairError">{presentStatus}</div>           
           <FairLink formData={userData}  url={apiEndpoint + '/v0/user/isloggedin?user='+username} description={"Is Logged In?"} onResult={props.isLoggedIn} method='get' onError={setIsLoggedStatus}/> 
           <div className="fairError">{isLoggedStatus}</div>           

        <hr/>
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
      </>
      );
  }

  
export default User;