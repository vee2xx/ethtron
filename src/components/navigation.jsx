import React from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
   return(
        <div className="navigation">
            <nav className="navbar navbar-expand navbar-light bg-light">
                <div className="container">
                    <div>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                        <NavLink className="nav-link" to="/accounts">
                            Accounts
                        </NavLink>
                        </li>
                        <li className="nav-item">
                        <NavLink className="nav-link" to="/contracts">
                            Contracts
                        </NavLink>
                        </li>                       
                        <li className="nav-item">
                        <NavLink className="nav-link" to="/history">
                            Transaction history
                        </NavLink>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
        </div>
   ) 
}

export default Navigation;