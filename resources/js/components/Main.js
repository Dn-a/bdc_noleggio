import React, { Component , Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from "react-router-dom";

import Home from './view/Home';
import Prenotazioni from './view/Prenotazioni';
import Noleggi from './view/Noleggi';
import Video from './view/Video';
import Clienti from './view/Clienti';
import Dipendenti from './view/Dipendenti';
import Magazzino from './view/Magazzino';
import Incassi from './view/Incassi';
import Catalogo from './view/Catalogo';

const routes = [
    {path: "/", name:"Home",title:'Home', icon:'fa-home', Component:Home},
    {path: "/prenotazioni", name:"Prenotazioni",title:'Gestione Prenotazioni', icon:'fa-calendar-check-o', Component: Prenotazioni},
    {path: "/noleggi", name:"Noleggi",title:'Gestione Noleggi', icon:'fa-film', Component: Noleggi},
    {path: "/clienti", name:"Clienti",title:'Gestione Clienti', icon:'fa-address-card-o', Component: Clienti},
    {path: "/dipendenti", name:"Dipendenti",title:'Gestione Dipendenti', icon:'fa-users', Component: Dipendenti},
    {path: "/incassi", name:"Incassi",title:'Report Incassi', icon:'fa-area-chart', Component: Incassi},
    {path: "/magazzino", name:"Magazzino",title:'Gestione Magazzino', icon:'fa fa-truck', Component: Magazzino},
    {path: "/catalogo", name:"Catalogo",title:'Gestione Film', icon:'fa fa-youtube-play', Component: Catalogo},
];


const MainTitle = ()  => {
    return(
    <div className="px-2 ml-4 mb-4 ">
        <Switch>
            {
            routes.map(({path, title, icon},key) => {
            return(
            <Route key={key} exact path={path} >
                <h3>
                    <i className={"fa "+icon} aria-hidden="true"> </i>
                    <strong> {title}</strong>
                </h3>
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
        
        let menu = USER_CONFIG.menu !== undefined?USER_CONFIG.menu:[];

        return (
            <Router>
                <aside id="sidebar" className="shadow">
                    <nav className="menu py-3" >
                        <ul>
                            {
                                routes.map(({path, name, icon},key) => {
                                    if(menu.indexOf(name.toLowerCase())==-1) return;
                                    return(
                                        <li key={key} >
                                            <NavLink exact to={path} title={name}>
                                                <i className={"fa "+icon} aria-hidden="true"></i>
                                                <span>{name}</span>
                                            </NavLink>
                                        </li>
                                    );
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
