import React, { Component , Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from "react-router-dom";

import Home from './view/Home';
import Video from './view/Video';
import Clienti from './view/Clienti';
import Deposito from './view/Deposito';

const routes = [
    {path: "/", name:"Home",title:'Home', icon:'fa-home', Component:Home},
    {path: "/noleggi", name:"Noleggi",title:'Gestione Noleggi', icon:'fa-film', Component: Video},
    {path: "/deposito", name:"Deposito",title:'Gestione Deposito', icon:'fa-list-alt', Component: Deposito},
    {path: "/clienti", name:"Clienti",title:'Gestione Clienti', icon:'fa-user-o', Component: Clienti},
];


const MainTitle = ()  => {
    return(
    <div className="px-2 ml-4 mb-4 ">
        <Switch>
            {
            routes.map(({path, title},key) => {
            return(
            <Route key={key} exact path={path} >
                <h3><strong>{title}</strong></h3>
            </Route>
            )
            })
            }
        </Switch>
    </div>

    );
}

export default class Main extends Component {

    constructor(props){
        super(props);

        const host = window.location.hostname;
        this.home = host=='www.dn-a.it'? '/noleggio':'';
        this.url = this.home;
    }

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
                                    <Route key={key} path={path} exact
                                        component={() => <Component url={this.url} />}
                                    />
                                )
                            })
                        }
                    </Switch>

                </main>

            </Router>

        );
    }
}


if (document.getElementById('noleggio')) {
    ReactDOM.render(<Main />, document.getElementById('noleggio'));
}
