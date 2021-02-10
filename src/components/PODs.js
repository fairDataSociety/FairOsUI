import React, { useEffect, useState } from 'react';
import { FairLink, FairOSApi } from './FairLink'; 

const PODs = (props) => {
    const [username, setUser] = useState(props.user);         // 
    const [password, setPassword] = useState(props.password); // 
    const [podname, setPodName] = useState(props.podname);    // 
    const [status, setStatus] = useState(null);    // 
    const [dirStatus, setDirStatus] = useState(null);    // 
    const [pod_name, setPod_name] = useState([]);    // 
    const [dir_data, setDir_data] = useState([]);    // 
    const [dir_with_path, setDir_with_path] = useState('');    // 
    const [error, setError] = useState(null);    // 
    const [dirError, setDirError] = useState(null);    // 
    const [apiEndpoint] = useState(props.apiEndpoint);    // 

    const podData = new FormData();   
    podData.append("user", username); 
    podData.append("password", password); 
    podData.append("pod", podname); 
    
    const dirData = () =>
    {
        const dirData = new FormData();   
        dirData.append("dir", dir_with_path); 
        return dirData;
    }

    useEffect(() => {
        FairOSApiGetPods();
    }, []);

    function onResultOk(podData)
    {
        console.log(podData);
        setStatus(podData);
        setError(null);
    }
    function onDirResultOk(podData)
    {
        console.log(podData);
        setDirStatus(podData);
        setDirError(null);  
    }
    function onError(response)
    {
        console.error("PODs", response);
        if(response.data!=undefined && response.data.message!=undefined)
           setError(response.data.message.toString());
        setStatus(null);
    }
    function onDirError(response)
    {
        console.error("PODs", response);
        if(response.data!=undefined && response.data.message!=undefined)
           setDirError(response.data.message.toString());
        setDirStatus(null);
    }
    function onPodsReceived(podData)
    {
        //console.log(podData,podData["pod_name"]);
        setPod_name(podData["pod_name"]);
    }
    function FairOSApiGetPods()
    {
        FairOSApi("get", apiEndpoint + '/v0/pod/ls', podData, onPodsReceived, onResultOk, onError, undefined, undefined)
    }
    function FairOSApiOpenPod()
    {
        FairOSApi("post", apiEndpoint + '/v0/pod/open', podData, undefined, onResultOk, onError, undefined, undefined)
    }
    function FairOSApiClosePod()
    {
        FairOSApi("post", apiEndpoint + '/v0/pod/close', podData, undefined, onResultOk, onError, undefined, undefined)
    }
    function FairOSApiGetDirectory()
    {
        FairOSApi("get", apiEndpoint + '/v0/dir/ls?dir='+dir_with_path, podData, onDirectoryReceived, onDirResultOk, onDirError, undefined, undefined)
    }
    function onDirectoryReceived(dirData)
    {
        console.log(dirData);
        //setDir_Data(dirData["entries"]);
    }
    function selectPod(podName)
    {
        FairOSApiClosePod();
        setPodName(podName);
        podData.set("pod", podName);         
        FairOSApiOpenPod();
    }

    return (
        <>
            <h2>POD <strong>{podname}</strong></h2>
            <>
             {pod_name.map((p,i)=>
                <li key={"pod" + i}>
                  <strong onClick={(e)=>selectPod(p)}>{p}</strong><br/>
                </li>
             )}
             <hr/>
            </>  

                {/* Username: &nbsp;<input type="text" onChange={(e)=>setUser(e.target.value)} value={username}></input><br/> */}
                {/* Password: &nbsp;&nbsp;<input type="password" onChange={(e)=>setPassword(e.target.value)} value={password}></input> <br/> */}
                Pod: &nbsp;&nbsp;<input type="text" onChange={(e)=>setPodName(e.target.value)} value={podname}></input> &nbsp; {status} <br/>
                <div className="fairError">{error}</div>
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/new'} description={"Create New Pod"}      onResult={onResultOk}   onError={onError} onAfterGet={FairOSApiGetPods}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/open'} description={"Open"}               onResult={onResultOk}   onError={onError}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/close'} description={"Close"}             onResult={onResultOk}   onError={onError}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/ls'}   description={"List"}  method="get" onData={onPodsReceived} onResult={onResultOk} onError={onError}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/sync'} description={"Sync"}               onResult={onResultOk}   onError={onError}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/stat?user='+username + "&pod="+podname} description={"Stat"}  method="get" onResult={onResultOk} onError={onError}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/delete'} description={"Delete*"}  method="delete" onResult={onResultOk} onError={onError}/> 
            <hr/> 
         
            Directory: &nbsp;&nbsp;<input type="text" onChange={(e)=>setDir_with_path(e.target.value)} value={dir_with_path}></input> &nbsp; {dirStatus} <br/>
            <FairLink formData={dirData()}  url={apiEndpoint + '/v0/dir/mkdir'} description={"Make Directory"}  onResult={onDirResultOk}  onError={onDirError} />  
            <FairLink formData={dirData()}  url={apiEndpoint + '/v0/dir/rmdir'} description={"Remove Directory"}  method="delete" onResult={onDirResultOk}  onError={onDirError} onAfterGet={FairOSApiGetDirectory}/>  
            <FairLink formData={dirData()}  url={apiEndpoint + '/v0/dir/ls?dir='+dir_with_path} description={"List"} method="get" onResult={onDirResultOk}  onError={onDirError} onAfterGet={FairOSApiGetDirectory}/>  
            <FairLink formData={dirData()}  url={apiEndpoint + '/v0/dir/stat?dir='+dir_with_path} description={"Stat"}  method="get" onResult={onDirResultOk}  onError={onDirError} onAfterGet={FairOSApiGetDirectory}/>  
            <div className="fairError">{dirError}</div>

            <ul> <strong>POD APIs</strong>
                <li>POST -F 'password=\{password}' -F 'pod=\{podname}' {apiEndpoint}/v0/pod/new</li>
                <li>POST -F 'password=\{password}' -F 'pod=\{podname}' {apiEndpoint}/v0/pod/open</li>
                <li>POST {apiEndpoint}/v0/pod/sync</li>
                <li>POST {apiEndpoint}/v0/pod/close</li>
                <li>DELETE {apiEndpoint}/v0/pod/delete</li>
                <li>GET {apiEndpoint}/v0/pod/ls</li>
                <li>GET -F 'user=\{username}' -F 'pod=\{podname}' {apiEndpoint}/v0/pod/stat</li>
            </ul>

            <ul> <strong>Directory APIs</strong>
                <li>POST -F 'dir={dir_with_path} {apiEndpoint}/v0/dir/mkdir</li>
                <li>DELETE -F 'dir={dir_with_path}' {apiEndpoint}/v0/dir/rmdir</li>
                <li>GET -F 'dir={dir_with_path}' {apiEndpoint}/v0/dir/ls</li>
                <li>GET -F 'dir={dir_with_path}' {apiEndpoint}/v0/dir/stat</li>
            </ul>
        </>
        );
  }

export default PODs;


/*
  export default function* uploadFilesSaga(action) {
    console.log("uploadFilesSaga saga started");
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
  
      const formData = new FormData();
      var ins = action.data.length;
      for (var x = 0; x < ins; x++) {
        formData.append("files", action.data[x]);
      }
      formData.append("pod_dir", "/Pictures");
      formData.append("block_size", "64Mb");
  
      const uploadFiles = yield axi({method: "POST", url: "file/upload", data: formData, config: config, withCredentials: true});
  
      console.log(uploadFiles);
    } catch (e) {
      console.log("error on timeout", e);
    }
  }
*/  