import React, { useState, useEffect } from 'react';
import { FairLink, FairOSApi } from './FairLink'; 

const DOCs = (props) =>  {
    const [apiEndpoint, setApiEndpoint] = useState(props.apiEndpoint); // 
    const [documentTableName, setDocumentTableName] = useState(''); // 
    const [documentId, setDocumentId] = useState(''); // 
    const [docKey, setDocKey] = useState("key"+Math.floor(Math.random() * 1000)); //
    const [docValue, setDocValue] = useState(1); // 
    const [expression, setExpression] = useState('expression'); // 
    const [start, setStart] = useState(1); // 
    const [end, setEnd] = useState(5); // 
    const [noRecords, setNoRecords] = useState(5); // 

    const [jsonFile, setJsonFile] = useState('{"jsonSample":"jsonValue"}'); // 
    const [podFile, setPodFile] = useState('{"podSample":"podValue"}'); // 
    const [jsonDocumentInBytes, setJsonDocumentInBytes] = useState(null); // 

    const [status, setStatus] = useState(null);    // 
    const [error, setError] = useState(null);    //     

    const [statusExpression, setStatusExpression] = useState(null);    // 
    const [errorExpression, setErrorExpression] = useState(null);    // 
    const [errorKey, setErrorKey] = useState(null);    //   
    const [statusSeekKey, setStatusSeekKey] = useState(null);    //   
    const [errorSeekKey, setErrorSeekKey] = useState(null);    //     

    const [document, setDocument] = useState([]);    //     
    const [documents, setDocuments] = useState([]);    //     
    
    const docData = new FormData();   
    docData.append("name", documentTableName); 
    docData.append("key", docKey); 
    docData.append("start",start); 
    docData.append("end", end); 
    docData.append("value", docValue); 
    docData.append("limit", noRecords); 
    docData.append("expr", expression); 
    docData.append("id", documentId); 
    
    useEffect(() => {
        FairOSApiGetDocuments();
    }, []);
    
    function onStatus(podData)
    {
        console.log(podData);
        setStatus(podData);
        setError(null);
    }
    function onStatusExpression(podData)
    {
        console.log(podData);
        //setStatusExpression(podData);
        //setErrorExpression(null);
    }
    function onErrorExpression(response)
    {
        console.error("DOCs", response);
        if(response!=undefined)
            setErrorExpression(response.toString());

        //setStatusExpression(null);
    }
    function onError(response)
    {
        console.error("DOCs", response);
        if(response!=undefined)
           setError(response.toString());
        setStatus(null);
    }
    function selectDocument(doc)
    {
        console.log(doc);
        setDocument(doc);
        setDocumentTableName(doc.name);
        docData.set("name", doc.name);
        FairOSApiDocumentOpen(); 
    }
    function selectIndex(idx)
    {
        console.log(idx);
    }
    function onDOCsReceived(docsData)
    {
        console.log(docsData);
        setDocuments(docsData["Tables"]);
    }
    
    function FairOSApiGetDocuments()
    {
        FairOSApi("get", apiEndpoint + '/v0/doc/ls', docData, onDOCsReceived, undefined, onError, undefined, undefined)
    }
    function FairOSApiDocumentOpen()
    {
        FairOSApi("post", apiEndpoint + '/v0/doc/open', docData, undefined, onStatus, onError, undefined, undefined)
    }
  
    return (<>
    <div className="sideBySide">
        <div className="leftSide">
                <h2>DOCs <strong>{documentTableName}</strong>  {status} </h2>
                    <>
                        {documents!=null ? documents.map((d,i)=>
                            <li key={"doc" + i}>
                            <strong onClick={(e)=>selectDocument(d)} className={d.name==documentTableName ? "selected" : ""}>{d.name}</strong> <span>{d.type}</span>
                            {d.indexes.map((k,j)=>
                                    <small key={"index" + k}>
                                        <small onClick={(e)=>selectIndex(k)}> ({k.name} {k.type})</small><br/>
                                    </small>
                                )}  
                            </li>
                        ) : null}
                    </>    
        </div>
        <div className="rightSide">
                    Document Name: &nbsp;&nbsp;<input type="text" onChange={(e)=>setDocumentTableName(e.target.value)} value={documentTableName}></input> &nbsp; {status} <br/>
                    <div className="fairError">{error}</div>
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/new'}  description={"Create New DOC"}     onResult={onStatus}   onError={onError} onAfterGet={FairOSApiGetDocuments}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/open'} description={"Open"}              onResult={onStatus}   onError={onError}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/ls'}     description={"List"}      method="get"    onData={onDOCsReceived}  onError={onError}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/delete'} description={"Delete*"}  method="delete" onResult={onStatus} onError={onError}/> 
                    
                <hr/> 
                    Expression: &nbsp;&nbsp;<input type="text" onChange={(e)=>setExpression(e.target.value)} value={expression} ></input> &nbsp; {statusExpression} <br/>
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/count'} description={"Count"} onResult={onStatusExpression}   onError={onErrorExpression} /> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/find'}  description={"Find"}  onResult={onStatusExpression}   onError={onErrorExpression} /> 

                <hr/> 
                    JSON Data: <br/><textarea type="textarea" onChange={(e)=>setJsonDocumentInBytes(e.target.value)} value={jsonDocumentInBytes} className="textAreaInput" rows="5"></textarea> &nbsp; {statusExpression} <br/>
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/entry/put'}  description={"Put"} onResult={onStatusExpression}   onError={onErrorExpression} /> <br/>

                    DocumentId: &nbsp;&nbsp;<input type="text" onChange={(e)=>setDocumentId(e.target.value)} value={documentId}></input> &nbsp; {statusExpression} <br/>
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/entry/get?id'+documentId+'&name='+documentTableName}  description={"Get"}  method="get" onResult={onStatusExpression}   onError={onErrorExpression} /> 

                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/entry/delete'} description={"Delete*"}  method="delete" onResult={onStatus} onError={onError}/> 
                <hr/> 
                    JSON: <br/>
                    <textarea type="textarea" onChange={(e)=>setJsonFile(e.target.value)} value={jsonFile} className="textAreaInput" rows="5"></textarea> &nbsp; {statusExpression} <br/>

                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/loadjson'} description={"Load"}  onResult={onStatus} onError={onError}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/indexjson'} description={"index"}  onResult={onStatus} onError={onError}/> 
        </div>
    </div>
        <hr/>
        <ul>
              <strong>DOCs  APIs</strong>
              <li>POST -F 'name=\{documentTableName}' {apiEndpoint}/v0/doc/new</li>
              <li>POST -F 'name=\{documentTableName}' {apiEndpoint}/v0/doc/open</li>
              
              <li>POST {apiEndpoint}/v0/doc/ls</li>
              <li>DELETE -F 'name=\{documentTableName}' {apiEndpoint}/v0/doc/delete</li>
        </ul>
        <ul>  <strong>DOCs Search APIs</strong>
              <li>POST -F 'name=\{documentTableName}' -F 'expr=\{expression}' {apiEndpoint}/v0/doc/count</li>
              <li>POST -F 'name=\{documentTableName}' -F 'expr=\{expression}' -F 'limit=\{noRecords}' {apiEndpoint}/v0/doc/find</li>
        </ul>
              
        <ul>  <strong>DOCs Entry APIs</strong>
              <li>POST -F 'name=\{documentTableName}' -F 'doc=\{jsonDocumentInBytes}' {apiEndpoint}/v0/doc/entry/put</li>
              <li>GET -F 'name=\{documentTableName}' -F 'id=\{documentId}' {apiEndpoint}/v0/doc/entry/get</li>
              <li>DELETE -F 'name=\{documentTableName}' -F 'id=\{documentId}' {apiEndpoint}/v0/doc/entry/del</li>
              <li>POST -F 'name=\{documentTableName}' -F 'json=@\{jsonFile}' {apiEndpoint}/v0/doc/loadjson</li>
              <li>POST -F 'name=\{documentTableName}' -F 'file=\{podFile}' {apiEndpoint}/v0/doc/indexjson</li>
        </ul>
    </>
      );
  }

  
export default DOCs;