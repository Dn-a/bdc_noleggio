import React from "react";

const style = {
    display: 'none'
}
const Header = () =>{
    return(
        <header>

            <button type="button" id="sidebarCollapse" className="btn btn-link">
                <i className="fa fa-align-left"></i>
            </button>

            <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm pl-5">

                <div className="container-fluid">

                    <a className="navbar-brand" href="">
                        VideoNoleggio
                    </a>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">

                        <ul className="navbar-nav mr-auto">

                        </ul>

                        <ul className="navbar-nav ml-auto">

                                <li className="nav-item dropdown">
                                    <a id="navbarDropdown" className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre="false">
                                        User <span className="caret"></span>
                                    </a>

                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                        <a className="dropdown-item" href=""
                                        onClick={() => { event.preventDefault(); document.getElementById('logout-form').submit();}}>
                                            Logout
                                        </a>
                                        <form id="logout-form" action="logout" method="POST" style={style} >
                                            <input type="hidden" name="_token" value={CSRF_TOKEN} />
                                        </form>
                                    </div>
                                </li>
                        </ul>
                    </div>

                </div>

            </nav>
        </header>
    );
}

export default Header;
