import React, { useState, useEffect } from 'react';
import { FairLink, FairOSApi } from './FairLink'; 

const KVs = (props) =>  {
    const [apiEndpoint, setApiEndpoint] = useState(props.apiEndpoint); // 
    const [kvTableName, setKvTableName] = useState(''); // 
    const [kvKey, setKvKey] = useState("key"+Math.floor(Math.random() * 1000)); //
    const [kvValue, setKvValue] = useState(1); // 
    const [kvStart, setStart] = useState(1); // 
    const [kvEnd, setEnd] = useState(5); // 
    const [kvNoRecords, setKvNoRecords] = useState(5); // 

    const [status, setStatus] = useState(null);    // 
    const [error, setError] = useState(null);    //     

    const [statusKey, setStatusKey] = useState(null);    // 
    const [errorKey, setErrorKey] = useState(null);    //   
    const [statusSeekKey, setStatusSeekKey] = useState(null);    //   
    const [errorSeekKey, setErrorSeekKey] = useState(null);    //     
    

    const [table, setTable] = useState([]);    //     
    const [tables, setTables] = useState([]);    //     
    
    const kvData = new FormData();   
    kvData.append("name", kvTableName); 
    kvData.append("key", kvKey); 
    kvData.append("start", kvStart); 
    kvData.append("end", kvEnd); 
    kvData.append("value", kvValue); 
    kvData.append("limit", kvNoRecords); 
    
    useEffect(() => {
        FairOSApiGetTables();
    }, []);
    
    function onStatus(podData)
    {
        console.log(podData);
        setStatus(podData);
        setError(null);
    }
    function onError(response)
    {
        console.error("KVs", response);
        if(response!=undefined && response.data!=undefined && response.data.message!=undefined)
           setError(response.data.message.toString());
        setStatus(null);
    }
    function selectTable(table)
    {
        console.log(table);
        setTable(table);
        setKvTableName(table.name);
        kvData.set("name", table.name);
        FairOSApiTableOpen(); 
    }
    function selectIndex(index)
    {
        console.log(index);
    }

    function onKVsReceived(kvData)
    {
        console.log(kvData);
        setTables(kvData["Tables"]);
    }
    
    function onKeyReceived(keyData)
    {
        console.log(keyData);
        //setTables(kvData["Tables"]);
    }
    
    function onStatusKeyValue(kvData)
    {
        console.log(kvData);
        setStatusKey(kvData);
        //setTables(kvData["Tables"]);
        var o = JSON.parse(kvData);
        console.log(atob(o.values));
        setStatusKey(atob(o.values));
        setKvValue(atob(o.values))
    }
    function onStatusKey(podData)
    {
        console.log(podData);
        setStatusKey(podData);
        setErrorKey(null);
        
    }
    function onStatusSeekKey(response)
    {
        console.error("KVs", response);
        if(response!=undefined&&response.data!=undefined && response.data.message!=undefined)
           setErrorSeekKey(response.data.message.toString());
        setStatusSeekKey(null);
    }
    function onErrorKey(response)
    {
        console.error("KVs", response);
        if(response!=undefined&&response.data!=undefined && response.data.message!=undefined)
           setErrorKey(response.data.message.toString());
        setStatusKey(null);
    }
    function onErrorSeekKey(response)
    {
        console.error("KVs", response);
        if(response.data!=undefined && response.data.message!=undefined)
             setErrorSeekKey(response.data.message.toString());
        setStatus(null);
    }

    function FairOSApiGetTables()
    {
        FairOSApi("get", apiEndpoint + '/v0/kv/ls', kvData, onKVsReceived, undefined, onError, undefined, undefined)
    }
    function FairOSApiTableOpen()
    {
        FairOSApi("post", apiEndpoint + '/v0/kv/open', kvData, undefined, onStatus, onError, undefined, undefined)
    }
  
    return (<>
    <div className="sideBySide">
        <div className="leftSide">
            <h2>Table <strong>{kvTableName}</strong>  {status} </h2>
                <>
                    {tables!=null ? tables.map((p,i)=>
                        <li key={"pod" + i}>
                        <strong onClick={(e)=>selectTable(p)}>{p.name}</strong>
                           {p.indexes.map((d,j)=>
                                <small key={"index" + j}>
                                    <small onClick={(e)=>selectIndex(d)}> ({d})</small><br/>
                                </small>
                            )}
                        </li>
                    ) : null}
                </>    
        </div>
        <div className="rightSide">
                Table Name: &nbsp;&nbsp;<input type="text" onChange={(e)=>setKvTableName(e.target.value)} value={kvTableName}></input> &nbsp; {status} <br/>
                <div className="fairError">{error}</div>
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/new'} description={"Create New Table"}      onResult={onStatus}   onError={onError} onAfterGet={FairOSApiGetTables}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/open'} description={"Open"}                 onResult={onStatus}   onError={onError}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/count'} description={"Count"}               onResult={onStatus}   onError={onError} onAfterGet={FairOSApiGetTables}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/ls'}   description={"List"} method="get"  onData={onKVsReceived}  onError={onError}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/delete'} description={"Delete*"}  method="delete" onResult={onStatus} onError={onError}/> 
            <hr/> 
            <h3>Key <strong>{kvTableName}</strong>.{kvKey} </h3>
            Key Name: &nbsp;&nbsp;<input type="text" onChange={(e)=>setKvKey(e.target.value)} value={kvKey}></input> &nbsp; {statusKey} <br/>
            Key Value: &nbsp;&nbsp;<input type="text" onChange={(e)=>setKvValue(e.target.value)} value={kvValue}></input>  <br/>
                <div className="fairError">{errorKey}</div>
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/entry/put'} description={"Put"}      onResult={onStatusKey}   onError={onErrorKey}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/entry/get?name='+kvTableName+'&key='+kvKey} description={"Get"}  method="get"  onResult={onStatusKeyValue}   onError={onErrorKey}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/entry/del'} description={"Delete*"}  method="delete" onResult={onStatusKey}   onError={onErrorKey}/> 
            <hr/> 

                <div className="fairError">{errorSeekKey}</div>                
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/loadcsv'} description={"Load CSV"}   onResult={onStatusSeekKey}   onError={onErrorSeekKey}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/seek'} description={"Seek"}          onResult={onStatus}   onError={onErrorSeekKey}/> 
                {/* <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/seek/next'}   description={"Next"} method="get"  onData={onKeyReceived} onResult={onStatusSeekKey} onError={onErrorSeekKey}/>  */}
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/seek/next?name='+kvTableName}   description={"Next"} method="get"  onData={onKeyReceived} onResult={onStatusSeekKey} onError={onErrorSeekKey}/>
        </div>
    </div>

    <hr/>
        <ul>
              <strong>KV Table APIs</strong>
              <li>POST -F 'file=\{kvTableName}' {apiEndpoint}/v0/kv/new</li>
              <li>POST -F 'file=\{kvTableName}' {apiEndpoint}/v0/kv/open</li>
              <li>POST -F 'file=\{kvTableName}' {apiEndpoint}/v0/kv/count</li>
              <li>POST {apiEndpoint}/v0/kv/ls</li>
              <li>DELETE -F 'file=\{kvTableName}' {apiEndpoint}/v0/kv/delete</li>
        </ul>
        <ul>
              <strong>KV APIs</strong>
              <li>POST -F 'file=\{kvTableName}' -F 'key={kvKey}' -F 'value=\{kvValue}' {apiEndpoint}/v0/kv/entry/put</li>
              <li>GET -F 'file=\{kvTableName}' -F 'key={kvKey}' {apiEndpoint}/v0/kv/entry/get</li>
              <li>DELETE -F 'file=\{kvTableName}' -F 'key={kvKey}' {apiEndpoint}/v0/kv/entry/del</li>
        </ul>

        <ul>
              <strong>CSV Seek APIs</strong>              
              <li>POST -F 'file=\{kvTableName}' -F 'csv=@{kvKey}' {apiEndpoint}/v0/kv/loadcsv</li>
              <li>POST -F 'file=\{kvTableName}' -F 'start={kvStart}' -F 'end={kvEnd}' -F 'limit={kvNoRecords}' {apiEndpoint}/v0/kv/seek</li>
              <li>GET -F 'file=\{kvTableName}' {apiEndpoint}/v0/kv/seek/next</li>
        </ul>
      </>
      );
  }

  
export default KVs;