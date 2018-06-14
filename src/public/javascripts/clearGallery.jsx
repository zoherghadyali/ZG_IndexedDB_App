// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class ClearGallery extends Component {
    constructor(props){
        super(props);
        this.state = {
            db: props.db,
            updateGallery: props.updateGallery
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
            var transaction = this.state.db.transaction(["images"], "readwrite");

            //didn't need to do anything on transaction.oncomplete
            
            transaction.onerror = function(e) {
                console.error("Transaction error: ", e.target.errorCode);
                reject(e.target.errorCode);
            };  

            var objectStore = transaction.objectStore("images"); 
            var clearAll = objectStore.clear();
            
            clearAll.onsuccess = function(e) {
                resolve("clear");
            };
        });
    }

    handleClick(e){
        this.clearIndexedDB()
            .then(id => this.state.updateGallery(id));
        e.preventDefault()
    }
    
    render() {
      return (
          <button type="button" onClick={this.handleClick}>Clear gallery</button>
      )
    }
  }

