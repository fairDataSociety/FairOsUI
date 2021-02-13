import React, { useState, useEffect } from 'react';
import { FairLink, FairOSApi } from './FairLink'; 

const KVs = (props) =>  {
    const [apiEndpoint, setApiEndpoint] = useState(props.apiEndpoint); // 
    const [kvTableName, setKvTableName] = useState(''); // 
    const [kvKey, setKvKey] = useState("key"+Math.floor(Math.random() * 1000)); //
    const [kvValue, setKvValue] = useState(1); // 
    const [kvStart, setKvStart] = useState("0"); // 
    const [kvEnd, setKvEnd] = useState("z"); // 
    const [kvNoRecords, setKvNoRecords] = useState(0); // 


    var   [tableValues, setTableValues] = useState([]); // 

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
        if(response!=undefined)
          setError(response.toString());
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
        //console.log(kvData);
        setTables(kvData["Tables"]);
    }
    
    function onKeyReceived(keyData)
    {
        //console.log(keyData);
        if(keyData.names!=undefined)
        {
            //console.log(keyData.names[0]);
            //console.log(atob(keyData.values));

            tableValues.push({name:keyData.names[0], value:atob(keyData.values)});
            setTableValues(tableValues);
        }
    }
    function onCountReceived(countData)
    {
        //console.log(countData.message.match(/\d+/g)[1]);
        setKvNoRecords(countData.message.match(/\d+/g)[0]); // extract number from message
    }
    
    function onStatusKeyValue(kvData)
    {
        //console.log(kvData);
        setStatusKey(kvData);
        //setTables(kvData["Tables"]);
        var o = JSON.parse(kvData);
        console.log(atob(o.values));
        setStatusKey(atob(o.values));
        setKvValue(atob(o.values));
        setErrorKey(null);
    }
    function onStatusKey(podData)
    {
        console.log(podData);
        setStatusKey(podData);
        setErrorKey(null);
    }
    function onStatusSeekKey(response)
    {
        //console.error("KVs", response);
        if(response!=undefined)
            setStatusSeekKey(response.toString());
        setErrorSeekKey(null);
        
    }
    function onErrorKey(response)
    {
        //console.error("KVs", response);
        if(response!=undefined)
           setErrorKey(response.toString());
        setStatusKey(null);
    }
    function onErrorSeekKey(response)
    {
        //console.error("KVs", response);
        if(response!=undefined)
             setErrorSeekKey(response.toString());
        setStatus(null);
    }

    function FairOSApiGetTables()
    {
        FairOSApi("get", apiEndpoint + '/v0/kv/ls', kvData, onKVsReceived, undefined, onError, undefined, undefined)
    }
    function FairOSApiTableOpen()
    {
        FairOSApi("post", apiEndpoint + '/v0/kv/open', kvData, undefined, onStatus, onError, FairOSApiGetTableCount, undefined)
    }
    function FairOSApiGetTableCount()
    {
        FairOSApi("post", apiEndpoint + '/v0/kv/count', kvData, onCountReceived, undefined, onError, undefined, undefined)
    }
  
    return (<>
    <div className="sideBySide">
        <div className="leftSide">
            <h2>Table <strong>{kvTableName}</strong></h2>
                <>
                    {tables!=null ? tables.map((p,i)=>
                        <li key={"pod" + i}>
                        <strong onClick={(e)=>selectTable(p)} className={p.name==kvTableName ? "selected" : ""}>{p.name}</strong>
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
                Table Name: &nbsp;&nbsp;<input type="text" onChange={(e)=>setKvTableName(e.target.value)} value={kvTableName}></input> <br/>
                <div className="fairError">{error}</div>
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/new'} description={"Create New Table"}      onResult={onStatus}   onError={onError} onAfterGet={FairOSApiGetTables}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/open'} description={"Open"}                 onResult={onStatus}   onError={onError}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/ls'}   description={"List"} method="get"  onData={onKVsReceived}  onError={onError}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/delete'} description={"Delete*"}  method="delete" onResult={onStatus} onError={onError}/> 
                <br/> {status}
            <hr/> 
            <h3>Key <strong>{kvTableName}</strong>.{kvKey} </h3> 
            Key Name: &nbsp;&nbsp;<input type="text" onChange={(e)=>setKvKey(e.target.value)} value={kvKey}></input> <br/> 
            Key Value: &nbsp;&nbsp;<input type="text" onChange={(e)=>setKvValue(e.target.value)} value={kvValue}></input>  <br/>
                <div className="fairError">{errorKey}</div>
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/entry/put'} description={"Put"}      onResult={onStatusKey}   onError={onErrorKey}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/entry/get?name='+kvTableName+'&key='+kvKey} description={"Get"}  method="get"  onResult={onStatusKeyValue}   onError={onErrorKey}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/entry/del'} description={"Delete*"}  method="delete" onResult={onStatusKey}   onError={onErrorKey}/> 
                <br/>{statusKey} 
            <hr/> 
                <div className="fairError">{errorSeekKey}</div>       
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/count'} description={"Count: "+kvNoRecords} onData={onCountReceived} onResult={onStatusSeekKey}   onError={onErrorSeekKey}/> 
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/seek'} description={"Seek"}          onResult={onStatusSeekKey}   onError={onErrorSeekKey}/> 
                {/* <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/seek/next'}   description={"Next"} method="get"  onData={onKeyReceived} onResult={onStatusSeekKey} onError={onErrorSeekKey}/>  */}
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/seek/next?name='+kvTableName}   description={"Next"} method="get"  onData={onKeyReceived} onResult={onStatusSeekKey} onError={onErrorSeekKey}/>
                Start:<input type="text" onChange={(e)=>setKvStart(e.target.value)} value={kvStart} style={{maxWidth:"5%",minWidth:"10%"}}></input>
                End:  <input type="text" onChange={(e)=>setKvEnd(e.target.value)} value={kvEnd} style={{maxWidth:"5%",minWidth:"10%"}}></input>

                <br/> {statusSeekKey} <br/>
             <hr/>
                <FairLink formData={kvData}  url={apiEndpoint + '/v0/kv/loadcsv'} description={"Load CSV"}   onResult={onStatusSeekKey}   onError={onErrorSeekKey}/> 

             <hr/>      
                <button onClick={(e)=>setTableValues([])}>clear</button>  <br/>      
                {tableValues.map((tv)=><> 
                   <span>{tv.name}: {tv.value}</span> <br/>
                  </>)}
        </div>
    </div>

    <hr/>
        {window.showDebug==true ? 
        <>    
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
                <li>POST -F 'file=\{kvTableName}' -F 'start={kvStart}' -F 'end={kvEnd}' -F 'limit={kvNoRecords}' {apiEndpoint}/v0/kv/seek</li>
                <li>GET -F 'file=\{kvTableName}' {apiEndpoint}/v0/kv/seek/next</li>
                <li>POST -F 'file=\{kvTableName}' -F 'csv=@{kvKey}' {apiEndpoint}/v0/kv/loadcsv</li>
            </ul>
        </> 
        : null }
      </>
      );
  }

  
export default KVs;