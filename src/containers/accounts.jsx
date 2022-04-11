import React, { useState, useEffect }  from "react";
import Web3 from 'web3';
import { Button, Container } from "react-bootstrap";
import Navigation from "../components/navigation";
import AccountList from "../components/accountlist";
import  Table  from 'react-bootstrap/Table';

// const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/"));
// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:3334"))
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))

var accounts = [];

function Accounts(props) {

    const [wallet, setWallet] = useState({});
    const [fromAddress, setFromAddress] = useState("");
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        loadWallet();
    }, []);

    const loadWallet = async() => {
        var addresses = []
        var w = await web3.eth.accounts.wallet.load("default", "start123");
        if (w != null) {
            for (var i = 0; i < w.length;i++) {
                addresses.push(w[i].address)
            }
            getAccountBalances(addresses); 
        }
        setWallet(w);
    }


    const addAccount =  async () => {
        if (wallet != null) {
            var account = await createAccount();
            wallet.add(account);
            wallet.save("default", "start123");
        }
        setWallet(wallet);
        loadWallet();
    }


    const handleSubmit = (evt) => {
        evt.preventDefault();
        sendEther(fromAddress, toAddress, amount)
    }

    return (
        <div>
            <Container>
            <Navigation /> 
                <div>
                    <h2>Account Balances</h2>
                    <Table stripped bordered hover size="sm">
                        <thead>
                            <tr>
                            <th width="170">Account</th>
                            <th width="50">Balance</th>
                            </tr>
                        </thead> 
                        <tbody>
                            {accounts.map((account, key) => {
                                return <tr key={key}><td>{account.address}</td>
                                    <td>{account.balance}</td>
                                    </tr>;
                                })}
                        </tbody>
                    </Table>                 
                </div>
                <div class="btn-group" role="group">
                    <Button className="btn btn-primary mr-3" onClick={addAccount}>Create Account</Button>
                    <Button className="btn btn-secondary mr-3" data-bs-toggle="modal" data-bs-target="#exampleModal">Send Eth</Button>
                </div>
                        
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label for="accountFrom" className="form-label">From</label>
                            <input type="text" className="form-control" id="accountFrom
                            " aria-describedby="accountFromHelp" value={fromAddress} onChange={e => setFromAddress(e.target.value)}/>
                            <div id="accountFromHelp" className="form-text">Enter the source account</div>
                        </div>
                        <div className="mb-3">
                            <label for="accountTo" className="form-label">To</label>
                            <input type="text" className="form-control" id="accountTo" aria-describedby="accountToHelp"  value={toAddress} onChange={e => setToAddress(e.target.value)}/>
                            <div id="accountToHelp" className="form-text">Enter the recipient</div>
                        </div>
                        <div className="mb-3">
                            <label for="amount" className="form-label">Amount</label>
                            <input type="text" className="form-control" id="amount" aria-describedby="amountHelp"  value={amount} onChange={e => setAmount(e.target.value)}/>
                            <div id="amountHelp" className="form-text">Enter the amount of eth to send</div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                        </form>
                    </div>

                    </div>
                </div>
                </div>
            </Container>
        </div>
    )
}

function getRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
  }


 async function getAccountBalances (addresses) {
    var accounts = [];
    for (var i = 0; i < addresses.length;i++) {
        var address = addresses[i];
        const balance = await web3.eth.getBalance(address);
        var account = {'key': i, 'address': address, 'balance': balance};
        accounts.push(account);        
      }
}

async function createAccount() {
    var entropy = getRandomString(16)
    var account = await web3.eth.accounts.create(entropy);
    console.log(account["address"]);
    console.log(account["privateKey"]);
    return account;
}
async function sendEther(fromAddress, toAddress, amount) {
    var result = await web3.eth.sendTransaction({
    from: fromAddress,
    to: toAddress,
    gasLimit: "21000",
    maxFeePerGas: "300",
    maxPriorityFeePerGas: "10",
    value: amount,
    chain: '5777'
  })
  console.log(result)
}

export default Accounts;