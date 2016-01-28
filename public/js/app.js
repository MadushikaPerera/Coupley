/**
 Coupley entry point for webpack
 */

//es6 imports
import React from 'react';
import ReactDOM from 'react-dom';
//Router components
import { Router, Route, Link, hashHistory } from 'react-router';

import Header from './components/base/Header.react';
import Home from './components/Home.react';
import Profile from './components/profile/profile.react';
import ActivityContainer from './components/profile/ActivityFeed/ActivityFeedContainer.react';
import About from './components/profile/About.react';
import Photos from './components/profile/visitor/Photos.react';
import ProfileVisitor from './components/profile/visitor/profile.react';
import ActivityContainerVisitor from './components/profile/visitor/ActivityFeed/ActivityFeedContainer.react';
import AboutVisitor from './components/profile/visitor/About.react';
import PhotosVisitor from './components/profile/visitor/Photos.react';
import Search from './components/search/Search.react';
import Admin from './components/admin/dashboard.react';
import AdminLogin from './components/admin/login.react';

function requireAuth(nextState, replace) {
  if(! localStorage.getItem('apitoken')) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}
function requireAdminAuth(nextState, replace) {
    if(! localStorage.getItem('apitoken')) {
        replace({
            pathname: '/AdminLogin',
            state: { nextPathname: nextState.location.pathname }
        })
    }

}

function signout() {
  console.log('Removing token ...');
  localStorage.removeItem('apitoken');
  localStorage.removeItem('user');
  document.location = "/#/login";
}

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/login" component={Home} />
    <Route path="/AdminLogin" component={AdminLogin} />
    <Route path="/dashboard" component={Admin} onEnter={requireAdminAuth} />
    <Route path="/" component={Header} onEnter={requireAuth}>
      <Route path="/search" component={Search} />
      <Route path="profile" component={Profile} >
      	<Route path="activityfeed" component={ActivityContainer} />
      	<Route path="about" component={About} />
        <Route path="photos" component={Photos} />
      </Route>
      <Route path="/:username" component={ProfileVisitor} >
        <Route path="activityfeed" component={ActivityContainerVisitor} />
        <Route path="about" component={AboutVisitor} />
        <Route path="photos" component={PhotosVisitor} />
      </Route>
    </Route>

    <Route path="/signout" onEnter={signout} />
  </Router>
  ),
  document.getElementById('content')
);
