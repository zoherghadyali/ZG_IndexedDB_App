// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import fetch from 'node-fetch';

import logoImage from '../images/bing.jpg'
import Gallery from './gallery.jsx'

export default class Search extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchSubmitted: false,
            searchTerm: '',
            searchTermImages: []
        }

        this.searchInput = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }    

    handleChange(e) {
        this.setState({
            searchTerm: e.target.value
        });
      }

    handleSubmit(e) {
        if (this.state.searchTerm){
            var self = this;
            fetch('https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=' + encodeURI(this.state.searchTerm), {
                headers: {
                  'Ocp-Apim-Subscription-Key': process.env.BING_SEARCH_API_KEY,
                },
                method: 'GET'
            })
            .then(res => {
                if (!res.ok){
                    console.error(res.statusText);
                    return res;
                } else {
                    return res.json()
                }
            })
            .then(function(json){
                self.setState({
                    searchSubmitted: true,
                    searchTermImages: json.value
                });
            });
        }
        e.preventDefault();
    }

    componentDidMount(){
        this.searchInput.current.focus();
    }

    handleView(state){
        if (state.searchSubmitted && !state.searchTermImages.length){
            return (
                <p> No images found! Please try searching for something else. </p>
            )
        } else if (state.searchSubmitted && state.searchTermImages.length){
            return (
                <Gallery images={state.searchTermImages} context={state.searchTerm} />
            )
        }
    }

    render() {
        return (
            <div>
                <div id="logo">
                    <img src={logoImage}/>
                </div>
                <form name="imageSearchForm" id="imageSearchForm" onSubmit={this.handleSubmit}>
                    <input type="search" name="imageSearchTerm" placeholder="Search on Bing Images" ref={this.searchInput} value={this.state.value} onChange={this.handleChange}/>
                    <input type="submit" value="Submit"/>
                </form>
                {this.handleView(this.state)}
            </div>
        )
    }
}