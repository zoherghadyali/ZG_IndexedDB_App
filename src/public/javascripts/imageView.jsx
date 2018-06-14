// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import fetch from 'node-fetch';

export default class ImageView extends Component {
    constructor(props){
        super(props);
        this.state = {
            url: props.url,
            saved: props.saved,
            id: props.id,
            loadImagesFromIndexedDB: props.loadImagesFromIndexedDB,
            updateGallery: props.updateGallery,
            openIndexedDB: props.openIndexedDB
        }

        this.handleClick = this.handleClick.bind(this);
    }    

    componentWillReceiveProps(nextProps){
        this.setState({
            saved: nextProps.saved
        });
    }

    blobToDataUrl(blob){
        return new Promise((resolve, reject) => {
            var fr = new FileReader();  
            fr.onload = function() {
                resolve(fr.result);
            };
            fr.readAsDataURL(blob);
        });
    }
    
    saveToIndexedDB(dataUrl, db){
        var self = this;

        return new Promise((resolve, reject) => {
            var transaction = db.transaction(["images"], "readwrite");

            transaction.oncomplete = function(e) {
                console.log("Completed readwrite transaction");
                resolve(self.state.id);
            };
                        
            transaction.onerror = function(e) {
                console.error("Transaction error: ", e.target.errorCode);
                reject(e.target.errorCode);
            };  
                
            var objectStore = transaction.objectStore("images"); 
            objectStore.add({
                id: this.state.id,
                data: dataUrl
            });
        });
    }

    getDataUrlAndOpenDB(blob) {
        var dataUrl = this.blobToDataUrl(blob);
        var db = this.state.openIndexedDB();
        return Promise.all([dataUrl, db]);
    }
    
    handleClick(e){
        fetch(this.state.url, {
                method: 'GET'
            })
            .then(res => {
                if (!res.ok){
                    console.error(res.statusText);
                    return res;
                } else {
                    return res.blob()
                }
            })
            .then(blob => this.getDataUrlAndOpenDB(blob))
            .then(combinedPromiseResults => this.saveToIndexedDB(combinedPromiseResults[0], combinedPromiseResults[1]))
            .then(id => this.state.updateGallery(id));
        e.preventDefault();
    }

    handleView(state){
        if (state.saved){
            return (
                <p>Saved!</p>
            )  
        } else {
            return (
                <button type="button" className="imageViewButton" onClick={this.handleClick}>Save image</button>
            )
        }
    }
    
    render() {
      return (
          <div>
            <a href={this.state.url} target="_blank">
                <figure>
                    <img className="imageView" src={this.state.url} />
                </figure>
            </a>
            {this.handleView(this.state)}
          </div>
      )
    }
  }

