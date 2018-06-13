// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import ImageView from './imageView.jsx'
import ClearGallery from './clearGallery.jsx'

export default class Gallery extends Component {
    constructor(props){
        super(props);
        this.state = {
            images: props.images,
            context: props.context,
            savedImages: [],
            loadImagesFromIndexedDB: props.loadImagesFromIndexedDB
        }
    }    

    componentWillReceiveProps(nextProps){
        this.setState({
            images: nextProps.images,
            context: nextProps.context,
            loadImagesFromIndexedDB: nextProps.loadImagesFromIndexedDB
        });
    }

    openIndexedDB(){
        function dbErrorHandler(db, reject){
            db.onerror = function(e){
                console.error("Database error: ", e.target.errorCode);
                reject(e.target.errorCode);
            }
        }

        return new Promise((resolve, reject) => {
            var db;
            var request = window.indexedDB.open("MyTestDatabase", 1);

            request.onerror = function(e){
                console.error("Request error: ", e.target.errorCode);
                reject(e.target.errorCode);
            }

            request.onupgradeneeded = function(e){
                console.log("Creating a new database or upgrading...");
                db = e.target.result;
                dbErrorHandler(db, reject);
                var objectStore = db.createObjectStore("images", { autoIncrement: true });
            }

            request.onsuccess = function(e){
                console.log("Success opening DB");
                db = e.target.result;
                dbErrorHandler(db, reject);
                resolve(db);
            }
        });    
    }

    updateGallery(){
        var self = this;
        this.openIndexedDB
            .then(db => self.readAllImagesFromIndexedDB(db))
            .then(items => self.setState({
                savedImages: items
            }));
    }

    readAllImagesFromIndexedDB(db){
        var self = this;
        return new Promise((resolve, reject) => {
            var transaction = db.transaction(["images"], "readonly");

            transaction.oncomplete = function(e) {
                console.log("Completed readonly transaction");
                resolve();
            };
                        
            transaction.onerror = function(e) {
                console.error("Transaction error: ", e.target.errorCode);
                reject(e.target.errorCode);
            };  
                
            var objectStore = transaction.objectStore("images"); 
            var getAll = objectStore.openCursor();

            var items = [];

            getAll.onsuccess = function(e) {
                var cursor = event.target.result;
                if(!cursor){
                    console.log("I've reached the end. Here are the items: ", items);
                    // self.setState({
                    //     savedImages: items
                    // });
                    resolve(items);
                }
                items.push(cursor.value);
                console.log("ITEMS: ", items);
                cursor.continue();
            };
        });
    }

    handleView(state){
        if (state.loadImagesFromIndexedDB){
            return (
                <p>Saved images: </p>
            );
        } else {
            return (
                <div>
                    <p>Found {state.images.length} results for '{state.context}'</p>
                    <div id="Gallery">
                        {state.images.map((image)=>
                            <ImageView url={image.contentUrl} key={image.imageId} loadImagesFromIndexedDB={state.loadImagesFromIndexedDB} />
                        )}
                    </div>
                    <ClearGallery />
                </div>
            )
        }
    }
    
    render() {
      return (
        <div>
            {this.handleView(this.state)}
        </div>
      )
    }
  }
