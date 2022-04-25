import React, { useState, useEffect, navigate }  from "react";
import { Button, Container } from "react-bootstrap";
import  Form  from 'react-bootstrap/Form';

import { useNavigate } from "react-router-dom";

import { createBrowserHistory as history} from 'history';

function SignInScreen(props) {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const onPasswordChange = (event) => {
        setPassword(event.target.value)
    }
    
    const handleKeyUp = (event) => {
        if (event.charCode == 13) {
            onLogin();
        }
    }

    const onLogin = () => {
        var savedPassword = localStorage.getItem("ethtron_password")
        //TOD): check for password earlier and display message to create one
        //Also generate mnemonic and add code to recover password
        if (savedPassword == null) {
          localStorage.setItem("ethtron_password", password)
        } else {
            if (savedPassword != password) {
                alert("password incorrect");
                return;
            }
        }
        navigate('/accounts');
    }
    return (
        <div>
            <Container>
                <h1>Sign in</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="formWalletPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={onPasswordChange} type="password" placeholder="Password" value={props.password}/>
                    </Form.Group>
                    <div>
                        <Button onKeyUp={handleKeyUp} onClick={onLogin}>Sign in</Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
}

export default SignInScreen;