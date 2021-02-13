import React, { useCallback } from 'react';
import {useDropzone} from 'react-dropzone';

function FileDropzone(props) {
    const onDrop = useCallback((acceptedFiles) => {
      if(props.onFiles)
         props.onFiles(acceptedFiles, props.dir); 

      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
  
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
          //console.log(reader.result)
          if(props.onRead)
             props.onRead(reader.result);
        }
        reader.readAsText(file) //reader.readAsArrayBuffer(file)
      })
      
    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})
  
    return (
      <div {...getRootProps()} className="fairDrop">
        <input {...getInputProps()} />
        <p>{props.text==undefined ? "JSON drop or click" : props.text} </p>
      </div>
    )
  }

  export default FileDropzone;