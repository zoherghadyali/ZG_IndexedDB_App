// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import ImageView from './imageView.jsx'

export default class Gallery extends Component {
    constructor(props){
        super(props);
        this.state = {
            images: props.images,
            context: props.context,
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

