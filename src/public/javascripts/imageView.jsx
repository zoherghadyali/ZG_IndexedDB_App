// imageView.jsx
import React, { Component } from 'react'

export default class ImageView extends Component {
    constructor(props){
        super(props);
        this.state = {
            disabled: false
        }

        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
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
        return new Promise((resolve, reject) => {
            var transaction = this.props.db.transaction(["images"], "readwrite");

            transaction.oncomplete = function(e) {
                resolve(savedImage);
            };

            transaction.onerror = function(e) {
                console.error("Transaction error: ", e.target.errorCode);
                reject(e.target.errorCode);
            };  
                
            var objectStore = transaction.objectStore("images"); 
            var savedImage = {
                id: this.props.id,
                data: dataUrl
            };
            objectStore.add(savedImage);
        });
    }

    deleteFromIndexedDB(){
        var self = this;

        return new Promise((resolve, reject) => {
            var transaction = this.props.db.transaction(["images"], "readwrite");

            transaction.oncomplete = function(e) {
                resolve(self.props.id);
            };
                        
            transaction.onerror = function(e) {
                console.error("Transaction error: ", e.target.errorCode);
                reject(e.target.errorCode);
            };  
                
            var objectStore = transaction.objectStore("images"); 
            objectStore.delete(this.props.id);
        });
    }
    
    handleSave(e){
        fetch(this.props.url, {
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
            .then(id => this.props.addToGallery(id))
            .catch(error => this.setState({ disabled: true }));
        e.preventDefault();
    }

    handleDelete(e){
        this.deleteFromIndexedDB()
            .then(id => this.props.removeFromGallery(id))
            .catch(error => this.setState({ disabled: true }));
        e.preventDefault();
    }

    handleView(){
        if (this.props.saved){
            return (
                <button type="button" className="button" onClick={this.handleDelete} disabled={this.state.disabled}>Delete image</button>
            )  
        } else {
            return (
                <button type="button" className="button" onClick={this.handleSave} disabled={this.state.disabled}>Save image</button>
            )
        }
    }
    
    render() {
      return (
          <div>
            <figure>
                <img className="imageView" src={this.props.url} />
            </figure>
            {this.handleView()}
          </div>
      )
    }
  }

