import React, { useState } from 'react';

const axios = require('axios').default;
const FormData = require('form-data');

axios.defaults.withCredentials = true;

async function FairOSGet(method, url)
{
  //let headers = { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}`}
  return await axios({
    method: method, // 'post',
    url: url, //'http://www.',
  //  headers: headers 
  });
}

async function FairOSDownloadFile(method, url, formData, onProgress, responseType)
{
  axios({
    url: url,
    method: method,
    data: formData,
    responseType: 'blob', // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', formData.get("file"));
    document.body.appendChild(link);
    link.click();
  });

  return {data: {message: "download " + formData.get("file")}};
}

async function FairOSPost(method, url, formData, onProgress, responseType)
{
  if(window.setIsLoading!=undefined) window.setIsLoading(true);
  
  console.log("FairOSPost", method, url, formData);
  const config = {
    onUploadProgress: progressEvent => onProgress==undefined ? console.log(progressEvent.loaded) : onProgress(progressEvent.loaded)
  }
  const headers = { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}`};
  if(responseType==="blob")
    return FairOSDownloadFile(method,url,formData,onProgress)

  const res = await axios({
    method: method, // 'post',
    url: url, //'http://www.',
    data: formData,
    headers: headers,
    responseType: responseType
    //config: config 
  });

  
  return res;
}

async function FairOSApi(method, url, formData, onData, onResult, onError, onAfterGet, onAfterPost, onProgress, responseType)
{
    if(window.setIsLoading!=undefined)
       window.setIsLoading(true);

    try
    {
      const res = await FairOSPost(method, url, formData, onProgress, responseType);
      console.log(res.data);
      
      if(onData!=undefined)  // called with pure data
      {
        onData(res.data);
      }
      if(onResult!=undefined) //might need result 
      {
        if(res.data.message!=undefined) onResult(res.data.message);
        else if(res.data.loggedin!=undefined) onResult(res.data.loggedin);
        else  onResult(JSON.stringify(res.data));
      }

      if(onAfterGet!=undefined)  // invoke after
        onAfterGet(res.data); 
      if(onAfterPost!=undefined) // invoke after
        onAfterPost(res.data); 

    } catch(err)
    {
      console.log("FairOSApi", err.response);
      if(onError!=undefined)
         if(err.response!=undefined && err.response.data != undefined && err.response.data.message!=undefined)
          onError(err.response.data.message);
         else if(err.response!=undefined)
          onError(err.response.toString());
         else  
           onError(err.toString());
    }
    if(window.setIsLoading!=undefined)
       window.setIsLoading(false);
}


const FairLink = ({description, method, url, formData, onData, onResult, onError, onAfterGet, onAfterPost, onCreateFormData, onProgress, responseType}) => {
    method = (method === undefined ? method='post' : method);
    async function onFairLinkClick() {
      if(onCreateFormData!=undefined) 
         formData = onCreateFormData(); 

      FairOSApi(method, url, formData, onData, onResult, onError, onAfterGet, onAfterPost, onProgress, responseType);
    }
    return (<button className="fairLink" onClick={(e)=>onFairLinkClick(e)}>{description}</button>);
  }
  
  export { FairLink, FairOSApi, FairOSPost };