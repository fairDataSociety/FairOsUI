import React, { useEffect, useState } from 'react';
import { FairLink, FairOSApi } from './FairLink'; 

const PODList = (props) => {
    return(<>
        {props.pods.map((p,i)=>
            <li key={"pod" + i}>
              <strong onClick={(e)=>props.selectPod(p)} className={p==props.podname ? "selected" : ""}>{p}</strong><br/>
              {p===props.podname ?
                <span> 
                    <span className="padLeft" onClick={props.goFolderUp}>{props.dir_with_path}</span><br/>

                    {props.dir_data.map((di,i)=>
                        <span key={"dirEntry" + i} className="padLeft"> 
                            { di.content_type=="inode/directory" ?
                             <strong onClick={(e)=>props.selectFolder(di)}>&#128193; {di.name}</strong>
                            :
                             <span onClick={(e)=>props.selectFile(di)}>&#128452; {di.name}</span>
                            }
                            <br/>
                        </span>
                    )}
               </span>
               : null }
            </li>
        )}
    </>)
};

const PODs = (props) => {
    const [username, setUser] = useState(props.user);         // 
    const [password, setPassword] = useState(props.password); // 
    const [podname, setPodName] = useState(props.podname);    // 
    const [status, setStatus] = useState(null);    // 
    const [dirStatus, setDirStatus] = useState(null);    // 
    const [podNames, setPodNames] = useState([]);    // 
    const [sharedPodNames, setSharedPodNames] = useState([]);    // 
    const [dir_data, setDir_data] = useState([]);    // 
    var   [dir_with_path, setDir_with_path] = useState('/');    // 
    var   [shareHash, setShareHash] = useState('');    // 
    const [error, setError] = useState(null);    // 
    const [dirError, setDirError] = useState(null);    // 
    const [shareError, setShareError] = useState(null);    // 
    const [shareStatus, setShareStatus] = useState(null);    // 
    const [apiEndpoint] = useState(props.apiEndpoint);    // 
    const [podShareReference, setPodShareReference] = useState(null);    // 

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
        if(response!=undefined)
           setError(response.toString());
        setStatus(null);
    }
    function onDirError(response)
    {
        console.error("PODs", response);
        if(response!=undefined)
           setDirError(response.toString());
        setDirStatus(null);
    }
    function onShareError(response)
    {
        console.error("PODs", response);
        if(response!=undefined)
           setShareError(response.toString());
        setShareStatus(null);
    }
    function onPodsReceived(podData)
    {
        //console.log(podData);
        setPodNames(podData["pod_name"]);
        setSharedPodNames(podData["shared_pod_name"]);
    }
    function onDirectoryList(entries)
    {
        //console.log(entries);
        setDir_data(entries["entries"]);
    }
    function onShareResultOk(result)
    {
        console.log(result);
        //setDir_data(entries["entries"]);
        setPodShareReference(result.pod_sharing_reference);
        setShareError(null)
    }
    function onReceiveResultOk(result)
    {
        console.log(result);
        //setDir_data(entries["entries"]);
    }

    function FairOSApiGetPods()
    {
        FairOSApi("get", apiEndpoint + '/v0/pod/ls', podData, onPodsReceived, onResultOk, onError, undefined, undefined)
    }
    function FairOSApiOpenPod()
    {
        FairOSApi("post", apiEndpoint + '/v0/pod/open', podData, undefined, onResultOk, onError, FairOSApiGetDirectory, undefined)
    }
    function FairOSApiClosePod()
    {
        FairOSApi("post", apiEndpoint + '/v0/pod/close', podData, undefined, onResultOk, onError, undefined, undefined)
    }
    function FairOSApiGetDirectory(obj, path)
    {
        if(path===undefined)
           FairOSApi("get", apiEndpoint + '/v0/dir/ls?dir='+dir_with_path, podData, onDirectoryList, undefined/*onDirResultOk*/, onDirError, undefined, undefined)
        else 
           FairOSApi("get", apiEndpoint + '/v0/dir/ls?dir='+path, podData, onDirectoryList, undefined/*onDirResultOk*/, onDirError, undefined, undefined)
    }
    async function selectPod(podName)
    {
        FairOSApiClosePod();
        setPodName(podName);
        podData.set("pod", podName);         
        setDir_data([]);
        dir_with_path = "/";
        setDir_with_path("/");
        FairOSApiOpenPod();
    }
    function selectFolder(folderName)
    {
        var newPath = dir_with_path;

        if(newPath==="/") 
           newPath = dir_with_path + folderName.name;
        else 
           newPath = dir_with_path + "/" + folderName.name;

        setDir_with_path(newPath);
        FairOSApiGetDirectory(null, newPath);
    }
    function goFolderUp()
    {
        setDir_data([]);
        dir_with_path = dir_with_path.substring(0, dir_with_path.lastIndexOf("/") + 1);
        setDir_with_path(dir_with_path);
        FairOSApiGetDirectory(null, dir_with_path);
    }
    function selectFile(fileName)
    {
        console.log(fileName);
        //podData.set("pod", podName);         
        //FairOSApiOpenPod();
    }

    return (
        <>
        <div className="sideBySide">
            <div className="leftSide">
                <h2>POD <strong>{podname}</strong></h2>
                <PODList podname={podname} pods={podNames} dir_with_path={dir_with_path} dir_data={dir_data}
                         selectPod={selectPod} goFolderUp={goFolderUp} selectFile={selectFile} selectFolder={selectFolder}/>

                <PODList podname={podname} pods={sharedPodNames} dir_with_path={dir_with_path} dir_data={dir_data}
                         selectPod={selectPod} goFolderUp={goFolderUp} selectFile={selectFile} selectFolder={selectFolder}/>

            </div>        
            <div className="rightSide">

                {/* Username: &nbsp;<input type="text" onChange={(e)=>setUser(e.target.value)} value={username}></input><br/> */}
                {/* Password: &nbsp;&nbsp;<input type="password" onChange={(e)=>setPassword(e.target.value)} value={password}></input> <br/> */}
                <input type="text" onChange={(e)=>setPodName(e.target.value)} value={podname}></input> Pod Name<br/>
                <div className="fairError">{error}</div>
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/new'} description={"Create New Pod"}      onResult={onResultOk}   onError={onError} onAfterGet={FairOSApiGetPods}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/open'} description={"Open"}               onResult={onResultOk}   onError={onError} onAfterGet={FairOSApiGetDirectory}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/close'} description={"Close"}             onResult={onResultOk}   onError={onError}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/ls'}   description={"List"}  method="get" onData={onPodsReceived} onResult={onResultOk} onError={onError}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/sync'} description={"Sync"}               onResult={onResultOk}   onError={onError}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/stat?user='+username + "&pod="+podname} description={"Stat"}  method="get" onResult={onResultOk} onError={onError}/> 
                <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/delete'} description={"Delete*"}  method="delete" onResult={onResultOk} onError={onError}/> 
                <br/> {status}
            <hr/> 
         
            <input type="text" onChange={(e)=>setDir_with_path(e.target.value)} value={dir_with_path}></input> Directory<br/>
            <FairLink formData={dirData()}  url={apiEndpoint + '/v0/dir/mkdir'} description={"Make Directory"}  onResult={onDirResultOk}  onError={onDirError} />  
            <FairLink formData={dirData()}  url={apiEndpoint + '/v0/dir/rmdir'} description={"Remove Directory"}  method="delete" onResult={onDirResultOk}  onError={onDirError} onAfterGet={FairOSApiGetDirectory}/>  
            <FairLink formData={dirData()}  url={apiEndpoint + '/v0/dir/ls?dir='+dir_with_path} description={"List"} method="get" onData={onDirectoryList} onResult={onDirResultOk}  onError={onDirError} />  
            <FairLink formData={dirData()}  url={apiEndpoint + '/v0/dir/stat?dir='+dir_with_path} description={"Stat"}  method="get" onResult={onDirResultOk}  onError={onDirError} />  
            <div className="fairError">{dirError}</div>
            {dirStatus} <br/>
            <hr/>

            <input type="text" onChange={(e)=>setShareHash(e.target.value)} value={shareHash}></input> Share Hash<br/> 
            <div className="fairError">{shareError}</div>
            <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/share'} description={"Share"}  onData={onShareResultOk}  onError={onShareError} />  
            <FairLink formData={podData}  url={apiEndpoint + '/v0/pod/receive?ref='+shareHash} description={"Receive"}  method="get" onResult={onReceiveResultOk}  onError={onShareError} onAfterGet={FairOSApiGetDirectory}/>  
            <br/> {shareStatus} <br/>
            
            {podShareReference != null ? <span>Share Reference: <small><small><small>{podShareReference}</small></small></small></span> : null}
            </div>
        </div>
        <hr/> 
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