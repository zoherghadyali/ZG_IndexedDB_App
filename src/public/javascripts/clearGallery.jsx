// clearGallery.jsx
import React, { Component } from 'react'

export default class ClearGallery extends Component {
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    clearIndexedDB(){
        return new Promise((resolve, reject) => {
            var transaction = this.props.db.transaction(["images"], "readwrite");

            //didn't need to do anything on transaction.oncomplete
            
            transaction.onerror = function(e) {
                console.error("Transaction error: ", e.target.errorCode);
                reject(e.target.errorCode);
            };  

            var objectStore = transaction.objectStore("images"); 
            var clearAll = objectStore.clear();
            
            clearAll.onsuccess = function(e) {
                resolve();
            };
        });
    }

    handleClick(e){
        this.clearIndexedDB()
            .then(this.props.clearGallery());
        e.preventDefault()
    }
    
    render() {
        return (
            <button type="button" className="button" onClick={this.handleClick}>Clear gallery</button>
        )
    }
}

