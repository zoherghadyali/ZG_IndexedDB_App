// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Search from './search.jsx'
import Gallery from './gallery.jsx'

export default class Content extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedView: props.selectedView
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            selectedView: nextProps.selectedView
        });
    }

    handleView(state){
        if (state.selectedView === "BingSearch"){
            return (
                <Search selectedView={this.state.selectedView} />
            )
        } else if (state.selectedView === "Gallery"){
            return (
                <Gallery selectedView={this.state.selectedView} />
            )
        } else {
            console.log("How the fuck did you get here?");
            return (
              <div>
                  <p>How the fuck did you get here?</p>
              </div>
            )  
        }
    }
    
    render() {
        return this.handleView(this.state);
    }
  }

