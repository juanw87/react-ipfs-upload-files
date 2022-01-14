'use-strict'

import logo from './logo.svg';
import './App.css';

import * as ipfs from 'ipfs-core'
import { useEffect, useState } from 'react';

function App() {

    const [ipfsNode, setIpfsNode] = useState();
    const [file, setFile] = useState();
    const [files, setFiles] = useState();
    const [cid, setCid] = useState();
    const [image, setImage] = useState();


    // On file select (from the pop up)
    const onFileChange = event => {       
        
        // Update the state
        setFile(event.target.files[0]);

        console.log(event.target.files);
    }

    const onFileUpload = () => {
    
        // // Create an object of formData
        // const formData = new FormData();
      
        // // Update the formData object
        // formData.append(
        //   "myFile",
        //   file,
        //   file.name
        // );
      
        // Details of the uploaded file
        console.log(file);

        // console.log(formData);

        //send file to IPFS node
        loadFile();
        // Request made to the backend api
        // Send formData object
        //axios.post("api/uploadfile", formData);
      };

    // File content to be displayed after
    // file upload is complete
    // const fileData = () => {
    
    //     if (file) {
           
    //       return (
    //         <div>
    //             <h2>File Details:</h2>
    //             <p>File Name: {file.name}</p>
    //             <p>File Type: {file.type}</p> 
    //             <p>
    //                 Last Modified:{" "}
    //                 {file.lastModified}
    //             </p>   
    //         </div>
    //       );
    //     } else {
    //       return (
    //         <div>
    //           <br />
    //           <h4>Choose before Pressing the Upload button</h4>
    //         </div>
    //       );
    //     }
    //   };


    async function createNode(){
        const ipfs_node = await ipfs.create();
        const version = await ipfs_node.version();

        console.log("IPFS node was created succesfully...")
        console.log('Version:', version.version);    

        setIpfsNode(ipfs_node);
    }

    async function loadFile(){
        const reader = new FileReader();


        reader.onloadend = async function(e) {

            console.log(e.target.result);

            const fileObject = {
                path: file.name,
                content: e.target.result
            }   

            console.log(fileObject);

            const fileAdded = await ipfsNode.add(fileObject);

            setCid(fileAdded.cid.toString());

            console.log(fileAdded, fileAdded.cid.toString());     
            
        }
        
        // const fileObject = {
        //     path: file.name,
        //     content: file.content
        // }

        // console.log(fileObject);

        // const fileAdded = await ipfsNode.add(fileObject);

        // console.log(fileAdded, fileAdded.cid.toString());        

        
    }

    async function loadMultipleFiles(){

    }


    const retrieveFila = () => {
//         // prereqs
// const node = await IPFS.create()
// const cid = '/ipfs/Qmay7eKcsxZ5UkraAucEGtTsv6LzA5hn3P8JnQQcWaVwcN'

// // load the raw data from js-ipfs (>=0.40.0)
// let bufs = []
// for await (const buf of node.cat(cid)) {
//   bufs.push(buf)
// }
// const data = Buffer.concat(bufs)

// var blob = new Blob([data], {type:"image/jpg"})
// var img = document.getElementById("target") // the img tag you want it in
// img.src = window.URL.createObjectURL(blob)
    }

    async function getFile(){        

        console.log('Retrieving ',cid)

        for await (const result of ipfsNode.get(cid)) {
            console.log(result);
            var image = document.getElementById('image'); // IdOfImage is the id attribute of the img tag in your html page
            image.src = URL.createObjectURL(new Blob(result, {type:"image/jpg"}));
        }

    }

    useEffect(() => {
        createNode();
    }, [])


  return (
    <div className="App">
        <header className="App-header">                   
        <img  id="image" />
        <hr />
        <div>
            <input type="file" onChange={onFileChange} multiple={true}></input>
            <button onClick={onFileUpload}>
                  Upload!
                </button>
        </div>
        <div>
            <button onClick={() => getFile()}> Get the file!!!</button>     
        </div>
        {/* <div>
            {fileData()}
        </div> */}
        </header>       
    </div>
  );
}

export default App;
