// gallery.js
import React, { Component } from 'react'

import ImageView from './imageView.jsx'
import ClearGallery from './clearGallery.jsx'

export default class Gallery extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchedImages: props.searchedImages,
            searchTerm: props.searchTerm,
            savedImageIds: [],
            savedImageData: [],
            db: undefined,
            loadImagesFromIndexedDB: props.loadImagesFromIndexedDB
        }

        this.addToGallery = this.addToGallery.bind(this);
        this.clearGallery = this.clearGallery.bind(this);
        this.removeFromGallery = this.removeFromGallery.bind(this);
    }    

    componentWillMount(){
        var self = this;
        this.openIndexedDB()
            .then(db => {
                this.setState({
                    db: db
                });
                return this.readAllImagesFromIndexedDB(db);
            })
            .then(items => {
                var array = [];
                for (var i = 0; i < items.length; i++){
                    array.push(items[i].id);
                }
                this.setState({
                    savedImageData: items,
                    savedImageIds: array
                });
                return;
            });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            searchedImages: nextProps.searchedImages,
            searchTerm: nextProps.searchTerm,
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
                var objectStore = db.createObjectStore("images", { keyPath : "id" , autoIncrement: true })
            }

            request.onsuccess = function(e){
                console.log("Success opening DB");
                db = e.target.result;
                dbErrorHandler(db, reject);
                resolve(db);
            }
        });    
    }

    addToGallery(id){
        this.setState({
            savedImageIds: [...this.state.savedImageIds, id]
        });
    }

    clearGallery(){
        this.setState({
            savedImageIds: []
        });
    }

    removeFromGallery(id){
        var array = this.state.savedImageIds;
        var index = array.indexOf(id);
        var filteredArray = this.state.savedImageData.filter(savedImage => savedImage.id !== id);

        if (index > -1){
            array.splice(index, 1);
            this.setState({
                savedImageIds: array,
                savedImageData: filteredArray
            });
        } else {
            console.error("The id to be removed isn't in the array of savedImageIds. How did this happen?");
        }
    }

    readAllImagesFromIndexedDB(db){
        var self = this;
        return new Promise((resolve, reject) => {
            var transaction = db.transaction(["images"], "readonly");
            
            //didn't need to do anything on transaction.oncomplete

            transaction.onerror = function(e) {
                console.error("Transaction error: ", e.target.errorCode);
                reject(e.target.errorCode);
            };  
                
            var objectStore = transaction.objectStore("images"); 
            var getAll = objectStore.openCursor();

            //if Edge supported getAllKeys() method for objectStore
            // var getAll = objectStore.getAllKeys();

            // getAll.onsuccess = function(e) {
            //     resolve(e.target.result);
            // }

            var items = [];

            getAll.onsuccess = function(e) {
                var cursor = e.target.result;
                if(!cursor){
                    resolve(items);
                    return;
                }
                items.push(cursor.value);
                cursor.continue();
            };
        });
    }

    handleView(state){
        if (state.loadImagesFromIndexedDB){
            if (state.savedImageData.length){
                return (
                    <div>
                        <div id="GalleryHeader">
                            <p>Saved images:</p>
                            <ClearGallery db={state.db} clearGallery={this.clearGallery}/>
                        </div>
                        <div id="Gallery">
                            {state.savedImageData.map((savedImage)=>
                                <ImageView url={savedImage.data} key={savedImage.id} saved id={savedImage.id} loadImagesFromIndexedDB addToGallery={this.addToGallery} removeFromGallery={this.removeFromGallery} db={state.db}/>
                            )}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div>
                        <p>Saved images: </p>
                        <p>Uh-oh! It looks like you haven't saved any images yet.</p>
                    </div>
                );
            }
        } else {
            return (
                <div>
                    <div id="GalleryHeader">
                        <p>Found {state.searchedImages.length} results for '{state.searchTerm}'</p>
                        <ClearGallery db={state.db} clearGallery={this.clearGallery}/>
                    </div>
                    <div id="Gallery">
                        {state.searchedImages.map((image)=>
                            <ImageView url={image.contentUrl} key={image.imageId} saved={state.savedImageIds.includes(image.imageId)} id={image.imageId} loadImagesFromIndexedDB={state.loadImagesFromIndexedDB}  addToGallery={this.addToGallery} removeFromGallery={this.removeFromGallery} db={state.db}/>
                        )}
                    </div>
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

