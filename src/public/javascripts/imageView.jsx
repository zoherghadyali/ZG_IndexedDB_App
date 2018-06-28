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
            addToGallery: props.addToGallery,
            removeFromGallery: props.removeFromGallery,
            db: props.db,
            disabled: false
        }

        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }    

    componentWillReceiveProps(nextProps){
        this.setState({
            saved: nextProps.saved,
            db: nextProps.db
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

    deleteFromIndexedDB(id){
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
            objectStore.delete(this.state.id);
        });
    }
    
    handleSave(e){
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
            .then(id => this.state.addToGallery(id))
            .catch(error => this.setState({
                disabled: true     
            }));
        e.preventDefault();
    }

    handleDelete(e){
        console.log("Handling delete...");
        this.deleteFromIndexedDB()
            .then(id => this.state.removeFromGallery(id))
            .catch(error => this.setState({
                disabled: true
            }));
        e.preventDefault();
    }

    handleView(state){
        if (state.saved){
            return (
                <button type="button" className="imageViewButton" onClick={this.handleDelete} disabled={state.disabled}>Delete image</button>
            )  
        } else {
            return (
                <button type="button" className="imageViewButton" onClick={this.handleSave} disabled={state.disabled}>Save image</button>
            )
        }
    }
    
    render() {
      return (
          <div>
            <figure>
                <img className="imageView" src={this.state.url} />
            </figure>
            {this.handleView(this.state)}
          </div>
      )
    }
  }

