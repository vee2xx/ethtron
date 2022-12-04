'use strict';
const electron = require('electron');
const Web3 = require("web3");
const fs = require("fs");
// const web3Provider = new Web3.providers.WebsocketProvider("ws://localhost:3334")
const web3Provider = new Web3.providers.WebsocketProvider("http://localhost:7545")
const web3 = new Web3(web3Provider);
// const dialog = electron.remote.dialog;
// const menu = electron.remote.Menu;

const crypto = require('crypto')
const base58 = require('bs58');
const { bytesToHex, toNumber } = require('web3-utils');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const keccak = require('keccak')

const wallet = require('./wallet.js');
const storage = require('./storage.js');

const isMac = process.platform === 'darwin'

const AES256 = 'aes-256-ctr';

const datastore_name = 'storage';

var currentWallet;

function initialize () {
  if (!fs.existsSync(datastore_name)) {
    window.document.querySelector('#loginBtn').style.display = "none";

  } else {
    window.document.querySelector('#createBtn').style.display = "none";
  }
  // addMenu();
}

function login(walletName, password) {
  currentWallet = getWallet(walletName, password, AES256)
  if (currentWallet == null) {
    alert("login incorrect")
    //TODO: display option to create new wallet
  }

  loadAccounts(currentWallet);
  window.document.querySelector('#login').style.display = "none";
}

function createWallet(walletName, password) {
    currentWallet = wallet.createWallet(password, 5);
    storage.saveWallet(walletName, password, currentWallet, AES256 )
    window.document.querySelector('#loginForm').style.display = "none";
    window.document.querySelector('#phraseDiv').style.display = "block";
    window.document.querySelector('#phraseText').value = currentWallet['mnemonicPhrase'];
}

function onLoginClose() {
  loadAccounts(currentWallet);
  window.document.querySelector('#login').style.display = "none";
}

function getWallet(walletName, password) {
  return storage.getWallet(walletName, password, AES256);
}

async function getBalance(address) {
  // const balance = await web3.eth.getBalance(address);
  alert(balance);
  // return balance;
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

function loadAccounts(currentWallet) {
  var accountTable = window.document.querySelector("#accounts")
  for (var i = 0; i < currentWallet.addresses.length;i++) {
    var address = currentWallet.addresses[i].address;
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


window.onload = initialize;