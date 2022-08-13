'use strict';
const electron = require('electron');
const Web3 = require("web3");
// const web3Provider = new Web3.providers.WebsocketProvider("ws://localhost:3334")
const web3Provider = new Web3.providers.WebsocketProvider("http://localhost:7545")
const web3 = new Web3(web3Provider);
// const dialog = electron.remote.dialog;
// const menu = electron.remote.Menu;
const isMac = process.platform === 'darwin'
const crypto = require('crypto')
const wallet = require('./wallet.js');
const { binary_to_base58 } = require('base58-js')


function initialize () {
  // addMenu();
}

function login(walletName, password) {
  var savedWallet = localStorage.getItem("ethtron.wallets." + walletName)
  savedWallet = JSON.parse(savedWallet)
  savedWallet = decryptWallet(savedWallet, password)
  console.log(savedWallet, savedWallet);
  if (savedWallet != null && savedWallet.length > 0) {
    loadAccounts();
  } else {
    window.document.querySelector('#addAccounts').style.display = "block";
  }
  
  window.document.querySelector('#login').style.display = "none";
}

function createWallet(walletName, password) {
    let seed = wallet.generateSeed(password);
    let masterKey = wallet.generateMasterKey(seed)
}



async function getBalance(address) {
  // const balance = await web3.eth.getBalance(address);
  alert(balance);
  // return balance;
}

async function addAccounts(walletName, password, numAccounts) {
  if (wallet == null) {
    // wallet = await web3.eth.accounts.wallet.create(numAccounts);
  }
  for (var i = 0; i < numAccounts;i++) {
   var account = await createAccount();
   wallet.add(account.address);
  }
  wallet.save(walletName, password);
  window.document.querySelector('#addAccounts').style.display = "none";
}

async function getWallet(walletName, password) {
  var wallet = await web3.eth.accounts.wallet.load(walletName, password);
  return wallet;
}

async function sendEther(address) {
    var result = await web3.eth.sendTransaction({
    from: "0x6E4eD8c06E0926D20DBA9Fa09CAF981e34a76F93",
    to: address,
    gasLimit: "21000",
    maxFeePerGas: "300",
    maxPriorityFeePerGas: "10",
    value: "10000000000000000000",
    chain: '5777'
  })
  console.log(result)
}

async function getAccountsFromGeth() {
  var accounts = await web3.eth.getAccounts();
  var accountTable = window.document.querySelector("#accounts")
  for (var i = 0; i < accounts.length;i++) {
    var address = accounts[i];
    var row = document.createElement('tr');
    var addressCell = document.createElement('td');
    addressCell.appendChild(document.createTextNode(address));

    var balance = await getBalance(address);
    var balanceCell = document.createElement('td');
    balanceCell.appendChild(document.createTextNode(balance));

    row.appendChild(addressCell);
    row.appendChild(balanceCell);
    accountTable.appendChild(row);
  }
}

function loadAccounts() {
  var accountTable = window.document.querySelector("#accounts")
  for (var i = 0; i < wallet.length;i++) {
    var address = wallet[i].address;
    var row = document.createElement('tr');
    var addressCell = document.createElement('td');
    addressCell.appendChild(document.createTextNode(address));

    var balanceButton = document.createElement("button");
    balanceButton.data = "Get Balance";
    balanceButton.innerHTML = 'Get Balance';
    balanceButton.onclick = function()
    {
      getBalance(address)
    }

    row.appendChild(addressCell);
    row.appendChild(balanceButton);
    accountTable.appendChild(row);
  }
}

async function clearWallet(walletName, password) {
  const wallet = await web3.eth.accounts.wallet.load(walletName, password);
  wallet.clear();
}

async function createAccount() {
  var entropy = getRandomString(16)
  var account = await web3.eth.accounts.create(entropy);
  console.log(account["address"]);
  console.log(account["privateKey"]);
  return account;
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


// function addMenu() {

//   var template = []


//   var fileMenu = {label: 'File', submenu: [isMac ? { role: 'close' } : { role: 'quit' }]}

//   template.push(fileMenu)

//   var viewSubMenu = [{role: 'toggleDevTools'}]

//   var viewMenu ={label: 'View', submenu: viewSubMenu}

//   template.push(viewMenu)

//   var camMenu = menu.buildFromTemplate(template); 
//   menu.setApplicationMenu(camMenu); 
// }

window.onload = initialize;