// search.jsx
import React, { Component } from 'react'

import logoImage from '../images/bing.jpg'
import Gallery from './gallery.jsx'

export default class Search extends Component {
    constructor(props){
        super(props);
        this.state = {
            searchSubmitted: false,
            searchTerm: '',
            searchedImages: []
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
            fetch('https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=' + encodeURI(this.state.searchTerm), {
                headers: {
                  'Ocp-Apim-Subscription-Key': process.env.BING_SEARCH_API_KEY,
                },
                method: 'GET'
            })
            .then(res => {
                if (!res.ok){
                    throw res.statusText;
                } else {
                    return res.json()
                }
            })
            .then(json => {
                this.setState({
                    searchSubmitted: true,
                    searchedImages: json.value
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({ searchSubmitted: true });
            });
        }
        e.preventDefault();
    }

    componentDidMount(){
        this.searchInput.current.focus();
    }

    handleView(){
        if (this.state.searchSubmitted && !this.state.searchedImages.length){
            return (
                <p> No images found! Please try searching for something else. </p>
            )
        } else if (this.state.searchSubmitted && this.state.searchedImages.length){
            return (
                <Gallery searchedImages={this.state.searchedImages} searchTerm={this.state.searchTerm} />
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
                    <input type="submit" value="Submit" className="button"/>
                </form>
                {this.handleView()}
            </div>
        )
    }
}