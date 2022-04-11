import React, { useState, useEffect }  from "react";
import { Container } from "react-bootstrap";
import Login from "../components/login";

function SignInScreen(props) {
    return (
        <Container>
        <div>
            <Login ></Login>
        </div>
        </Container>
    )
}

export default SignInScreen;