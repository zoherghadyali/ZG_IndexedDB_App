// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class ClearGallery extends Component {
    constructor(props){
        super(props);
        this.state = {
            db: props.db
        }

        this.handleClick = this.handleClick.bind(this);
    }    

    componentWillReceiveProps(nextProps){
        this.setState({
            db: nextProps.db
        });
    }


    clearIndexedDB(){
        return new Promise((resolve, reject) => {
            var transaction = this.db.transaction(["images"], "readwrite");

            transaction.oncomplete = function(e) {
                console.log("Completed readwrite transaction");
            };
                        
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
            .then(e.preventDefault());
    }
    
    render() {
      return (
          <button type="button" onClick={this.handleClick}>Clear gallery</button>
      )
    }
  }

