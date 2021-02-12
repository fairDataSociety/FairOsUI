import React, { useState, useEffect, useCallback } from 'react';
import { FairLink, FairOSApi } from './FairLink'; 
import FileDropzone from './FileDropzone';

function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

const DOCs = (props) =>  {
    const [apiEndpoint, setApiEndpoint] = useState(props.apiEndpoint); // 
    const [documentTableName, setDocumentTableName] = useState(''); // 
    const [documentIndexes, setDocumentIndexes] = useState('id=number,name=string,tags=map'); // 
    
    const [documentId, setDocumentId] = useState(''); // 
    const [docKey, setDocKey] = useState("key"+Math.floor(Math.random() * 1000)); //
    const [docValue, setDocValue] = useState(1); // 
    const [expression, setExpression] = useState(''); // 
    //const [start, setStart] = useState(1); // 
    //const [end, setEnd] = useState(5); // 
    const [noRecords, setNoRecords] = useState(0); // 

    const [url, setUrl] = useState('https://'); // 

    const [jsonFile, setJsonFile] = useState('{"jsonSample":"jsonValue"}'); // 
    const [podFile, setPodFile] = useState('{"podSample":"podValue"}'); // 
    const [jsonDocumentInBytes, setJsonDocumentInBytes] = useState('{"id":"1", "name":"John", "surname": "Doe" }'); // 

    const [status, setStatus] = useState(null);    // 
    const [error, setError] = useState(null);    //     

    const [statusPut, setStatusPut] = useState(null);    // 
    const [errorPut, setErrorPut] = useState(null);    //     

    const [statusGet, setStatusGet] = useState(null);    // 
    const [errorGet, setErrorGet] = useState(null);    //     

    const [statusUrl, setStatusUrl] = useState(null);    // 
    const [errorUrl, setErrorUrl] = useState(null);    //     

    const [statusIndex, setStatusIndex] = useState(null);    // 
    const [errorIndex, setErrorIndex] = useState(null);    //     

    const [statusImport, setStatusImport] = useState(null);    // 
    const [errorImport, setErrorImport] = useState(null);    //     

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
    //docData.append("start",start); 
    //docData.append("end", end); 
    docData.append("value", docValue); 
    docData.append("limit", noRecords); 
    docData.append("expr",  expression); 
    docData.append("id",    documentId); 
    //docData.append("si", documentIndexes);

    function docPutData()
    {
        var putData = new FormData();   
        putData.append("name", documentTableName); 
        putData.append("doc", Buffer.from(jsonDocumentInBytes.toString())); 
        //putData.append("doc", toUTF8Array(jsonDocumentInBytes)); 
        
        return putData;
    }
    
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
        setStatusExpression(podData);
        setErrorExpression(null);
    }
    function onErrorExpression(response)
    {
        console.error("DOCs", response);
        if(response!=undefined)
            setErrorExpression(response.toString());
        //setStatusExpression(null);
    }    
    function onStatusPut(response)
    {
        setStatusPut(response);
        setErrorPut(null);
    }
    function onStatusGet(response)
    {
        //console.log(response);
        setStatusGet(atob(response.doc));
        setErrorGet(null);
    }
    function onFindGet(response)
    {
        console.log(response.docs);
        setExpression(atob(response.docs));
    }
    function onStatusGetError(response)
    {
        console.log(response);
        if(response!=undefined)
          setErrorGet(response.toString());
    }
    function onStatusIndex(response)
    {
        //console.log(response);
        setStatusIndex(atob(response.doc));
        setErrorIndex(null);
    }
    function onStatusIndexError(response)
    {
        console.log(response);
        if(response!=undefined)
          setErrorIndex(response.toString());
        setStatusIndex(null);
    }
    function onStatusImport(response)
    {
        //console.log(response);
        setStatusImport(atob(response.doc));
        setErrorImport(null);
    }
    function onStatusImportError(response)
    {
        console.log(response);
        if(response!=undefined)
          setErrorImport(response.toString());
        setStatusImport(null);
    }
    
    function onError(response)
    {
        console.error("DOCs", response);
        if(response!=undefined)
           setError(response.toString());
        setStatus(null);
    }

    function checkIfIndexes()
    {
        var fData = new FormData();   
        fData.append("name", documentTableName); 
        fData.append("key", docKey); 
        fData.append("value", docValue); 
        fData.append("limit", noRecords); 
        fData.append("expr",  expression); 
        fData.append("id",    documentId); 
        if(documentIndexes.length>1)
           fData.append("si", documentIndexes);

        return fData;
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
        //console.log(docsData);
        setDocuments(docsData["Tables"]);
    }
    function onCountReceived(countData)
    {
        console.log(countData);
        setNoRecords(countData.message);
    }
    async function loadSampleData()
    {
        fetch('/sample.data.json').then((r) => r.text()) // included in public folder
        .then(text  => {
          setJsonDocumentInBytes(text);
        }) 
    }

    function onGetDataFromUrl(e,url)
    {

    }
    function onImportData(e,url)
    {

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
                <h2>DOCs <strong>{documentTableName}</strong></h2>
                    <>
                        <ul>
                            {documents!=null ? documents.map((d,i)=>
                                <li key={"doc" + i}>
                                    <strong onClick={(e)=>selectDocument(d)} className={d.name==documentTableName ? "selected" : ""}>{d.name}</strong>  <span>{d.type}</span>

                                    {d.indexes.length>0 ?
                                    <>  <br/>
                                        {d.indexes.map((k,j)=>
                                                <small key={"index" + j + "_"+d.name} onClick={(e)=>selectIndex(k)}> 
                                                    <small>({k.name} {k.type}) </small>
                                                </small>
                                            )}  
                                    </> : null }
                                </li>
                            ) : null}
                        </ul>
                    </>    
        </div>
        
        <div className="rightSide">
                     <input type="text" onChange={(e)=>setDocumentTableName(e.target.value)} value={documentTableName}></input> Document Name <br/>
                     <input type="text" onChange={(e)=>setDocumentIndexes(e.target.value)} value={documentIndexes}></input> Indexes <br/>
                    <div className="fairError">{error}</div>
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/new'}  description={"Create New DOC"} onCreateFormData={checkIfIndexes}   onResult={onStatus}   onError={onError} onAfterGet={FairOSApiGetDocuments}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/open'} description={"Open"}                       onResult={onStatus}   onError={onError}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/ls'}     description={"List"}     method="get"    onData={onDOCsReceived}  onError={onError}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/delete'} description={"Delete*"}  method="delete" onResult={onStatus} onError={onError} onAfterGet={FairOSApiGetDocuments}/> 
                    <br/> {status}
                <hr/> 
                    {/* JSON Data:  <br/> */}
                    <FileDropzone onRead={setJsonDocumentInBytes}/><br/>
                    <textarea type="textarea" onChange={(e)=>setJsonDocumentInBytes(e.target.value)} value={jsonDocumentInBytes} className="textAreaInput" rows="10"></textarea> <br/>

                    <div className="fairError">{errorPut}</div>
                    <FairLink formData={docPutData()}  url={apiEndpoint + '/v0/doc/entry/put'}  description={"Put"} onResult={onStatusPut}   onError={setErrorPut} /> 
                    <button onClick={(e)=>loadSampleData()}>Fetch Sample</button> 
                    <br/>{statusPut}
                <hr/>
                    <input type="text" onChange={(e)=>setDocumentId(e.target.value)} value={documentId}></input> DocumentId<br/> 
                    <div className="fairError">{errorGet}</div>
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/entry/get?id='+documentId+'&name='+documentTableName}  description={"Get"}  method="get" onData={onStatusGet} /*onResult={setStatusGet}*/  onError={onStatusGetError} /> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/entry/delete'} description={"Delete*"}  method="delete" onResult={onStatus} onError={onError}/> 
                    <br/>{statusGet} 
                <hr/> 
                    
                    <textarea type="textarea" onChange={(e)=>setJsonFile(e.target.value)} value={jsonFile} className="textAreaInput" rows="5"></textarea> JSON <br/>
                    <div className="fairError">{errorIndex}</div>            
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/loadjson'} description={"Load"}  onResult={onStatusIndex} onError={onStatusIndexError}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/indexjson'} description={"index"}  onResult={onStatusIndex} onError={onStatusIndexError}/> 
                    <br/>{statusIndex} 
                <hr/> 
                    <input type="text" onChange={(e)=>setExpression(e.target.value)} value={expression} ></input> Expression (name=John)
                    <div className="fairError">{errorExpression}</div>
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/count'} description={"Count"} onData={onCountReceived} onResult={onStatusExpression}   onError={onErrorExpression} /> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/find?name='+documentTableName+'&expr='+expression}  description={"Find"} method="get" 
                              onData={onFindGet}  onResult={onStatusExpression}   onError={onErrorExpression} /> 
                    <input type="text" onChange={(e)=>setNoRecords(e.target.value)} value={noRecords} style={{maxWidth:"5%",minWidth:"10%"}}></input> Limit
                    <br/> {statusExpression}                     

                <hr/> 
                    <input type="text" onChange={(e)=>setUrl(e.target.value)} value={url} ></input> Import From URL 
                    <div className="fairError">{errorImport}</div>

                    <button className="fairLink" onClick={(e)=>onGetDataFromUrl(e,url)}>{"GET"}</button>
                    <button className="fairLink" onClick={(e)=>onImportData(e,url)}>{"Import"}</button>
{/* 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/count'} description={"GET"}     onResult={onStatusImport} onError={onStatusImportError} /> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/find'}  description={"Import"}  onResult={onStatusImport} onError={onStatusImportError} />  */}
                    <br/> {statusImport}                     
   
        </div>
    </div>
        <hr/>
        {window.showDebug==true ? 
        <>            
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
        : null }
    </>
      );
  }

  
export default DOCs;