// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class Gallery extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedView: props.selectedView
        }
    }    
    
    render() {
      return (
        <div>
            <h1>Your gallery: </h1>
            <p>WOO! You're passing state successfully!</p>
        </div>
      )
    }
  }

