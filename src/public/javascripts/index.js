// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Banner from './banner.jsx'

class App extends Component {
  render() {
    return (
      <div>
        <Banner/>
      </div>
    )
  }
}

const root = document.querySelector('#root')
ReactDOM.render(<App />, root)