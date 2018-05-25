// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const styles = {
  root: {
    paddingTop: 40,
    textAlign: 'center',
  },
}

class App extends Component {
  render() {
    return (
      <div style={styles.app}>
        Welcome to React!
      </div>
    )
  }
}

const root = document.querySelector('#root')
ReactDOM.render(<App />, root)