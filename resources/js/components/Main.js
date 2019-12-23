import React, { Component , Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from "react-router-dom";

import Home from './view/Home';
import Video from './view/Video';
import Clienti from './view/Clienti';

const routes = [
    {path: "/", name:"Home", icon:'fa-home', Component: Home},
    {path: "/video", name:"Video", icon:'fa-film', Component: Video},
    {path: "/clienti", name:"Clienti", icon:'fa-user-o', Component: Clienti},
];

export default class Main extends Component {
    render() {

        return (
            <Router>
                <aside id="sidebar" className="shadow">
                    <nav className="menu py-3" >
                        <ul>
                            {
                                routes.map(({path, name, icon},key) => {
                                    return(
                                        <li key={key} >
                                            <NavLink exact to={path}>
                                                <i className={"fa "+icon} aria-hidden="true"></i>
                                                <span>{name}</span>
                                            </NavLink>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </nav>
                </aside>

                <main id="content" className="py-4">

                    <MainTitle />

                    <Switch>
                        {
                            routes.map(({path, Component},key) => {
                                return(
                                    <Route key={key} path={path} exact component={Component} />
                                )
                            })
                        }
                    </Switch>

                </main>

            </Router>

        );
    }
}

const MainTitle = ()  => {
    return(
    <div className="px-2 ml-4 mb-4 ">
        <Switch>
            {
            routes.map(({path, name},key) => {
            return(
            <Route key={key} exact path={path} >
                <h3><strong>{name}</strong></h3>
            </Route>
            )
            })
            }
        </Switch>
    </div>

    );
}

if (document.getElementById('noleggio')) {
    ReactDOM.render(<Main />, document.getElementById('noleggio'));
}
