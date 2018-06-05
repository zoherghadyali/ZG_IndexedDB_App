// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import test from '../stylesheets/test.css'
import Content from './content.jsx'


export default class Banner extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedView: "BingSearch"
        }
        
        this.handleViewChange = this.handleViewChange.bind(this);
    }    

    handleViewChange(e){
        this.setState({             
            selectedView: e.target.value
        });
    }
    
    render() {
      return (
        <div>
          <form name="selectViewForm" id="selectViewForm">
            <div>
                <label>
                    <input type="radio" name="selectView" value="BingSearch" onChange={this.handleViewChange} checked={this.state.selectedView === "BingSearch"} />
                    Bing Search
                </label>
                <label>
                    <input type="radio" name="selectView" value="Gallery" onChange={this.handleViewChange} checked={this.state.selectedView === "Gallery"} />
                    Gallery
                </label>
            </div>
          </form>
          <Content selectedView={this.state.selectedView}/>
        </div>
      )
    }
  }

