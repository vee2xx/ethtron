import React, { useState, useEffect }  from "react";
// import Button from 'react-bootstrap/Button';
import Web3 from 'web3'
import Container from 'react-bootstrap/Container';
// import  Form  from 'react-bootstrap/Form';
import CreateContract from '../components/createcontract';
import Navigation from "../components/navigation";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))

function Contracts() {

    const [contractName, setContractName] = useState('New Contract');
  
    const deployContract = (event) => {
        //code do deploy smart contract here
    }


    
    return (
        <div>
            <Container>
            <Navigation /> 
                <CreateContract
                    handleDeploy={deployContract} />
            </Container>
        </div>

    )
}

export default Contracts;