import React, { Component , Fragment } from 'react';
import ReactDOM from 'react-dom';

import Home from './view/Home';
import Video from './view/Video';
import Clienti from './view/Clienti';

import {BrowserRouter as Router, Switch, Route, Link, NavLink} from "react-router-dom";

export default class Main extends Component {
    render() {
        return (
            <Router>
                <aside id="sidebar" className="shadow">
                    <nav className="menu py-3" >
                        <ul>
                            <li >
                                <NavLink exact to="/">
                                    <i className="fa fa-home" aria-hidden="true"></i>
                                    <span>Home</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/video">
                                    <i className="fa fa-film" aria-hidden="true"></i>
                                    <span>Video</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/edit">
                                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                    <span>Edit</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/clienti">
                                    <i className="fa fa-user-o" aria-hidden="true"></i>
                                    <span>Clienti</span>
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <main id="content">
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/video" exact component={Video} />
                        <Route path="/clienti" exact component={Clienti} />
                    </Switch>
                </main>

            </Router>

        );
    }
}

if (document.getElementById('noleggio')) {
    ReactDOM.render(<Main />, document.getElementById('noleggio'));
}
