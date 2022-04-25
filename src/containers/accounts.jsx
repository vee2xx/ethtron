import React, { useState, useEffect }  from "react";
import Web3 from 'web3';
import { Button, Container } from "react-bootstrap";
import Navigation from "../components/navigation";
import AccountList from "../components/accountlist";
import  Table  from 'react-bootstrap/Table';

// const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/"));
// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:3334"))
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))


function Accounts(props) {

    const [wallet, setWallet] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [currentAccount, setCurrentAccount] = useState({});
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        loadWallet();
    }, []);

    const loadWallet = async() => {
        var a = [];
        var w = await web3.eth.accounts.wallet.load("default", "start123");
        if (w != null) {
            for (var i = 0; i < w.length;i++) {
                var address = w[i].address;
                var privateKey = w[i].privateKey
                var balance = await getAccountBalance(address)
                var account = {'key': i, 'address': address, 'balance': balance, 'privateKey': privateKey};
                a.push(account);  
            }
            setAccounts(a); 
            
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
        sendEther(currentAccount.address, toAddress, amount, currentAccount.privateKey)
        resetModal();
    }

    const resetModal = () => {
        setToAddress("");
        setAmount("");
        setCurrentAccount({})
    }

    const handleRowSelect = (data) => {
        setCurrentAccount(data.account);
    }

    return (
        <div>
            <Container>
            <Navigation /> 
                <div>
                    <Table stripped  hover size="sm">
                        <thead>
                            <tr>
                            <th width="10"></th>
                            <th width="180">Account</th>
                            <th width="50">Balance</th>
                            </tr>
                        </thead> 
                        <tbody>
                            {accounts.map((account, key) => {
                                return <tr key={key}>
                                    <td><Button  onClick={() => handleRowSelect({account})} className="btn shadow-none btn-light border-white bg-transparent" data-bs-toggle="modal" data-bs-target="#sendEthModal">&#187;</Button></td>
                                    <td>{account.address}</td>
                                    <td>{account.balance}</td>

                                    </tr>;
                                })}
                        </tbody>
                    </Table>                 
                </div>
                <div class="btn-group" role="group">
                    <Button className="btn btn-primary mr-3" onClick={addAccount}>Create Account</Button>
                </div>  
                <div className="modal fade" id="sendEthModal" tabIndex="-1" aria-labelledby="sendEthModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="sendEthModalLabel">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                        </div>
                        <div className="mb-3">
                            <label for="accountFrom" className="form-label">From</label>
                            <input type="text" className="form-control" id="accountFrom" aria-describedby="accountFromHelp"  value={currentAccount.address} placeholder={currentAccount.address} readonly/>
                            <div id="accountFromHelp" className="form-text">Sender address</div>
                        </div>
                        <div className="mb-3">
                            <label for="balance" className="form-label">Current balance</label>
                            <input type="text" className="form-control" id="balance" aria-describedby="balanceHelp"  value={currentAccount.balance} placeholder={currentAccount.balance} readonly/>
                            <div id="balanceHelp" className="form-text">The current balance of the sender</div>
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
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
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


 async function getAccountBalance (address) {
    const balance = await web3.eth.getBalance(address);
    return balance
}

async function createAccount() {
    var entropy = getRandomString(16)
    var account = await web3.eth.accounts.create(entropy);
    return account;
}

async function sendEther(fromAddress, toAddress, amount, privateKey) {

    const createTransaction = await web3.eth.accounts.signTransaction(
        {
           from: fromAddress,
           to: toAddress,
           value: amount,
           gasLimit: 53000
        },
        privateKey
     );


     const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
     );
     console.log(createReceipt)
}

export default Accounts;