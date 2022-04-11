import React, { useState, useEffect }  from "react";
import { Container } from "react-bootstrap";
import Web3 from 'web3';
import Navigation from "../components/navigation";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))

function History() {
    const [accounts, setAccounts] = useState([]);
  
    useEffect(() => {
      //get transactions 
    }, []);
    return (
        <Container>
            <Navigation /> 
        <div>
            <h1>History</h1>
            <p>Transaction history will be displayed here</p>
        </div>

        </Container>

    )
}

export default History;