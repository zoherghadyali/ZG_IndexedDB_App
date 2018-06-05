// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import logoImage from '../images/bing.jpg'

export default class Search extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedView: props.selectedView
        }
        this.searchInput = React.createRef();
    }    

    componentDidMount(){
        this.searchInput.current.focus();
    }

    render() {
      return (
        <div>
            <div id="logo">
                <img src={logoImage}/>
            </div>
            <form name="imageSearchForm" id="imageSearchForm">
                <input type="search" name="imageSearchTerm" placeholder="Search on Bing Images" ref={this.searchInput}/>
                <input type="submit" value="Submit" />
            </form>
        </div>
      )
    }
  }

