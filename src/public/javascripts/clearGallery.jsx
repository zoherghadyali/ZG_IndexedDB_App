// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class ClearGallery extends Component {
    constructor(props){
        super(props);
        this.state = {}

        this.handleClick = this.handleClick.bind(this);
    }    

    deleteIndexedDB(){
        return new Promise((resolve, reject) => {
            var req = window.indexedDB.deleteDatabase("MyTestDatabase");
            req.onsuccess = function(e){
                console.log("Deleted database successfully");
                resolve();
            };
            req.onerror = function(e){
                console.error("Couldn't delete database: ", e.target.errorCode);
                reject(e.target.errorCode);
            };
            req.onblocked = function(e){
                console.error("Couldn't delete database due to the operation being blocked");
                reject("Couldn't delete database due to the operation being blocked")
            };
        });
    }

    handleClick(e){
        this.deleteIndexedDB()
            .then(e.preventDefault());
        // e.preventDefault();
    }
    
    render() {
      return (
          <button type="button" onClick={this.handleClick}>Clear gallery</button>
      )
    }
  }

