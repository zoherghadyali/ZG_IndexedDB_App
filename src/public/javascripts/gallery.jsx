// gallery.jsx
import React, { Component } from 'react'

import ImageView from './imageView.jsx'
import ClearGallery from './clearGallery.jsx'

export default class Gallery extends Component {
    constructor(props){
        super(props);
        this.state = {
            savedImages: [],
            db: undefined
        }

        this.addToGallery = this.addToGallery.bind(this);
        this.clearGallery = this.clearGallery.bind(this);
        this.removeFromGallery = this.removeFromGallery.bind(this);
    }

    componentWillMount(){
        this.openIndexedDB()
            .then(db => {
                this.setState({
                    db: db
                });
                return this.readAllImagesFromIndexedDB(db);
            })
            .then(items => {
                this.setState({
                    savedImages: items
                });
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

    addToGallery(savedImage){
        this.setState({
            savedImages: [...this.state.savedImages, savedImage]
        });
    }

    clearGallery(){
        this.setState({
            savedImages: []
        });
    }

    removeFromGallery(deletedImageId){
        var filteredArray = this.state.savedImages.filter(savedImage => savedImage.id !== deletedImageId);
        this.setState({
            savedImages: filteredArray
        });
    }

    readAllImagesFromIndexedDB(db){
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

    handleView(){
        if (this.props.loadImagesFromIndexedDB){
            if (this.state.savedImages.length){
                return (
                    <div>
                        <div id="GalleryHeader">
                            <p>Saved images:</p>
                            <ClearGallery db={this.state.db} clearGallery={this.clearGallery}/>
                        </div>
                        <div id="Gallery">
                            {this.state.savedImages.map((savedImage)=>
                                <ImageView url={savedImage.data} key={savedImage.id} saved id={savedImage.id} addToGallery={this.addToGallery} removeFromGallery={this.removeFromGallery} db={this.state.db}/>
                            )}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        <p>Saved images: </p>
                        <p>Uh-oh! It looks like you haven't saved any images yet.</p>
                    </div>
                )
            }
        } else {
            var savedImageIds = [];
            for (var i = 0; i < this.state.savedImages.length; i++){
                savedImageIds.push(this.state.savedImages[i].id);
            }
            return (
                <div>
                    <div id="GalleryHeader">
                        <p>Found {this.props.searchedImages.length} results for '{this.props.searchTerm}'</p>
                        <ClearGallery db={this.state.db} clearGallery={this.clearGallery}/>
                    </div>
                    <div id="Gallery">
                        {this.props.searchedImages.map((image)=>
                            <ImageView url={image.contentUrl} key={image.imageId} saved={savedImageIds.includes(image.imageId)} id={image.imageId} addToGallery={this.addToGallery} removeFromGallery={this.removeFromGallery} db={this.state.db}/>
                        )}
                    </div>
                </div>
            )
        }
    }
    
    render() {
        return (
            <div>
                {this.handleView()}
            </div>
        )
    }
}

