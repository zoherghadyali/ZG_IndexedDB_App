// banner.jsx
import React, { Component } from 'react'

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

    handleView(){
        if (this.state.selectedView === "BingSearch"){
            return (
                <Search />
            )
        } else if (this.state.selectedView === "Gallery"){
            return (
                <Gallery loadImagesFromIndexedDB={true} />
            )
        } else {
            console.error("Unknown state in Banner component: ", this.state);
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
                {this.handleView()}
            </div>
        )
    }
}

