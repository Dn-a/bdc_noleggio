import React from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

const style = {
    display: 'none'
}

const SideBar = () =>{
    return(
        <Router>
        <aside id="sidebar" className="shadow active">
            <nav className="menu py-3" >
                <ul>
                    <li >
                        <Link to="/">
                            <i className="fa fa-home" aria-hidden="true"></i>
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/video">
                            <i className="fa fa-film" aria-hidden="true"></i>
                            <span>Video</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/edit">
                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                            <span>Edit</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/clienti">
                            <i className="fa fa-user-o" aria-hidden="true"></i>
                            <span>Clienti</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
        </Router>
    );
}

export default SideBar;
