import React from "react";
import { NavLink } from "react-router-dom";
import { Container, NavDropdown, Nav, Navbar } from "react-bootstrap";
// import { Navbar} from "react-router-dom";

function Navigation() {
   return(
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Navbar.Brand>
                            <img src="/runkoin3.png" 
                                    width="60"
                                    height="60"
                                    className="d-inline-block align-top"/>
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                        <NavDropdown className="dropstart nav-dropdown-toggle" title="..." id="basic-nav-dropdown">
                        <NavDropdown.Item>
                            <NavLink className="nav-link" to="/accounts">
                                Accounts
                            </NavLink>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                            <NavLink className="nav-link" to="/contracts">
                                    Contracts
                            </NavLink>         
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                            <NavLink className="nav-link" to="/history">
                                    Transaction history
                            </NavLink>
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
   ) 
}

export default Navigation;