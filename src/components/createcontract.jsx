import React, { useState, useEffect }  from "react";
import Button from 'react-bootstrap/Button';
import Web3 from 'web3'
import Container from 'react-bootstrap/Container';
import  Form  from 'react-bootstrap/Form';

function CreateContract(props) {

    const handleSubmit = () => {
        alert("coming soon")
    }

    return (
        <div>
            <Container>
                <h1>Create a Smart Contract</h1>
                <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label for="smartContract" className="form-label">From</label>
                            <textarea rows="15" className="form-control" id="smartContract" aria-describedby="accountFromHelp" />
                            <div id="smartContractHelp" className="form-text">Enter code here</div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
            </Container>
        </div>
    )
}

export default CreateContract;