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

async function FairOSPost(method, url, formData )
{
  console.log("FairOSPost", method, url, formData);
  let headers = { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}`}
  return await axios({
    method: method, // 'post',
    url: url, //'http://www.',
    data: formData,
    headers: headers// 
  });
}

async function FairOSApi(method, url, formData, onData, onResult, onError, onAfterGet, onAfterPost)
{
    try
    {
      const res = await FairOSPost(method, url, formData);
      console.log(res.data);
      if(onData!=undefined) 
      {
        
        onData(res.data);
      }
      if(onResult!=undefined)
      {
        if(res.data.message!=undefined) onResult(res.data.message);
        else if(res.data.loggedin!=undefined) onResult(res.data.loggedin);
        else  onResult(JSON.stringify(res.data));
      }

      if(onAfterGet!=undefined) 
        onAfterGet(res.data); 
      if(onAfterPost!=undefined) 
        onAfterPost(res.data); 

    } catch(err)
    {
      console.log("FairOSApi", err.response);
      if(onError!=undefined)
         if(err.response.data != undefined && err.response.data.message!=undefined)
          onError(err.response.data.message);
         else 
          onError(err.response.toString());
    }
}


const FairLink = ({description, method, url, formData, onData, onResult, onError, onAfterGet, onAfterPost}) => {
    method = (method === undefined ? method='post' : method);
    async function onFairLinkClick() {
      FairOSApi(method, url, formData, onData, onResult, onError, onAfterGet, onAfterPost );
    }
    return (<button className="fairLink" onClick={(e)=>onFairLinkClick(e)}>{description}</button>);
  }
  
  export { FairLink, FairOSApi };