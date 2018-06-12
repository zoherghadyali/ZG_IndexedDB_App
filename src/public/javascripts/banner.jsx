// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import test from '../stylesheets/test.css'
import Search from './search.jsx'
import Gallery from './gallery.jsx'

export default class Banner extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedView: "BingSearch"
        }
        
        this.handleChange = this.handleChange.bind(this);
    }    

    handleChange(e){
        this.setState({             
            selectedView: e.target.value
        });
    }

    handleView(state){
        if (state.selectedView === "BingSearch"){
            return (
                <Search />
            )
        } else if (state.selectedView === "Gallery"){
            return (
                <Gallery loadImagesFromIndexedDB />
            )
        } else {
            console.log("How the fuck did you get here? Here is the state: ");
            console.log(state);
            return (
              <div>
                  <p>How the fuck did you get here?</p>
              </div>
            )  
        }
    }
    
    render() {
      return (
        <div>
          <form name="selectViewForm" id="selectViewForm">
            <div>
                <label>
                    <input type="radio" name="selectView" value="BingSearch" onChange={this.handleChange} checked={this.state.selectedView === "BingSearch"} />
                    Bing Search
                </label>
                <label>
                    <input type="radio" name="selectView" value="Gallery" onChange={this.handleChange} checked={this.state.selectedView === "Gallery"} />
                    Gallery
                </label>
            </div>
          </form>
          {this.handleView(this.state)}
        </div>
      )
    }
  }

