import './App.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Mobile from './Mobile'
import { BrowserRouter, Route } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    <div className="wrap" style={{height: '100%'}}>
      <Route exact path="/" component={App} />
      <Route path="/app" component={App}></Route>
      <Route path="/mobile" component={Mobile}></Route>
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);
