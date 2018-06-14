// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class ImageView extends Component {
    constructor(props){
        super(props);
        this.state = {
            url: props.url,
            saved: props.saved,
            id: props.id,
            loadImagesFromIndexedDB: props.loadImagesFromIndexedDB,
            updateGallery: props.updateGallery,
            db: props.db,
            disabled: false
        }

        this.handleClick = this.handleClick.bind(this);
    }    

    componentWillReceiveProps(nextProps){
        this.setState({
            saved: nextProps.saved,
            db: nextProps.db
        });
    }

    blobToDataUrl(blob){
        console.log("I kept going for some reason...");
        return new Promise((resolve, reject) => {
            var fr = new FileReader();  
            fr.onload = function() {
                resolve(fr.result);
            };
            fr.readAsDataURL(blob);
        });
    }
    
    saveToIndexedDB(dataUrl){
        var self = this;

        return new Promise((resolve, reject) => {
            var transaction = this.state.db.transaction(["images"], "readwrite");

            transaction.oncomplete = function(e) {
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
    
    handleClick(e){
        fetch(this.state.url, {
                method: 'GET'
            })
            .then(res => {
                if (!res.ok){
                    console.error(res.statusText);
                    throw res.statusText;
                } else {
                    return res.blob()
                }
            })
            .then(blob => this.blobToDataUrl(blob))
            .then(dataUrl => this.saveToIndexedDB(dataUrl))
            .then(id => this.state.updateGallery(id))
            .catch(error => this.setState({
                disabled: true     
            }));
        e.preventDefault();
    }

    handleView(state){
        if (state.saved){
            return (
                <p>Saved!</p>
            )  
        } else {
            return (
                <button type="button" className="imageViewButton" onClick={this.handleClick} disabled={state.disabled}>Save image</button>
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

