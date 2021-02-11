import React, { useState, useEffect, useCallback } from 'react';
import { FairLink, FairOSApi } from './FairLink'; 
import {useDropzone} from 'react-dropzone';

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

function MyDropzone(props) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        //console.log(reader.result)
        props.onRead(reader.result);
      }
      reader.readAsText(file) //reader.readAsArrayBuffer(file)
    })
    
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} className="fairDrop">
      <input {...getInputProps()} />
      <p>JSON drop or click </p>
    </div>
  )
}

const DOCs = (props) =>  {
    const [apiEndpoint, setApiEndpoint] = useState(props.apiEndpoint); // 
    const [documentTableName, setDocumentTableName] = useState(''); // 
    const [documentIndexes, setDocumentIndexes] = useState('id=number,timestamp=string,tags=map'); // 
    
    const [documentId, setDocumentId] = useState(''); // 
    const [docKey, setDocKey] = useState("key"+Math.floor(Math.random() * 1000)); //
    const [docValue, setDocValue] = useState(1); // 
    const [expression, setExpression] = useState('expression'); // 
    const [start, setStart] = useState(1); // 
    const [end, setEnd] = useState(5); // 
    const [noRecords, setNoRecords] = useState(5); // 

    const [jsonFile, setJsonFile] = useState('{"jsonSample":"jsonValue"}'); // 
    const [podFile, setPodFile] = useState('{"podSample":"podValue"}'); // 
    const [jsonDocumentInBytes, setJsonDocumentInBytes] = useState(""); // 

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
        //console.log(docsData);
        setDocuments(docsData["Tables"]);
    }
    async function loadSampleData()
    {
        fetch('/sample.data.json').then((r) => r.text()) // included in public folder
        .then(text  => {
          setJsonDocumentInBytes(text);
        }) 
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
                     <input type="text" onChange={(e)=>setDocumentTableName(e.target.value)} value={documentTableName}></input> Document Name <br/>
                     <input type="text" onChange={(e)=>setDocumentIndexes(e.target.value)} value={documentIndexes}></input> Indexes <br/>
                    <div className="fairError">{error}</div>
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/new'}  description={"Create New DOC"}    onResult={onStatus}   onError={onError} onAfterGet={FairOSApiGetDocuments}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/open'} description={"Open"}              onResult={onStatus}   onError={onError}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/ls'}     description={"List"}     method="get"    onData={onDOCsReceived}  onError={onError}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/delete'} description={"Delete*"}  method="delete" onResult={onStatus} onError={onError} onAfterGet={FairOSApiGetDocuments}/> 
                    <br/> {status}
                <hr/> 
                    {/* JSON Data:  <br/> */}
                    <MyDropzone onRead={setJsonDocumentInBytes}/><br/>
                    <textarea type="textarea" onChange={(e)=>setJsonDocumentInBytes(e.target.value)} value={jsonDocumentInBytes} className="textAreaInput" rows="10"></textarea> <br/>
                    <FairLink formData={docPutData()}  url={apiEndpoint + '/v0/doc/entry/put'}  description={"Put"} onResult={onStatusExpression}   onError={onErrorExpression} /> 
                    <button onClick={(e)=>loadSampleData()}>Fetch Sample</button> <br/> 
                    <br/>{statusExpression}
                <hr/>
                    <input type="text" onChange={(e)=>setDocumentId(e.target.value)} value={documentId}></input> DocumentId<br/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/entry/get?id'+documentId+'&name='+documentTableName}  description={"Get"}  method="get" onResult={onStatusExpression}   onError={onErrorExpression} /> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/entry/delete'} description={"Delete*"}  method="delete" onResult={onStatus} onError={onError}/> 
                    <br/>{statusExpression} 
                <hr/> 
                    
                    <textarea type="textarea" onChange={(e)=>setJsonFile(e.target.value)} value={jsonFile} className="textAreaInput" rows="5"></textarea> &nbsp; {statusExpression} JSON <br/>

                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/loadjson'} description={"Load"}  onResult={onStatus} onError={onError}/> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/indexjson'} description={"index"}  onResult={onStatus} onError={onError}/> 

                <hr/> 
                    <input type="text" onChange={(e)=>setExpression(e.target.value)} value={expression} ></input> Expression
                    <div className="fairError">{errorExpression}</div>
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/count'} description={"Count"} onResult={onStatusExpression}   onError={onErrorExpression} /> 
                    <FairLink formData={docData}  url={apiEndpoint + '/v0/doc/find'}  description={"Find"}  onResult={onStatusExpression}   onError={onErrorExpression} /> 
                    <br/> {statusExpression}                     
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