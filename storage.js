const fs = require("fs");

function encryptAndStore(wallet, encryptionMethod) {
    if (encryptionMethod == "PLAINTEXT") {
        fs.writeFile('storage', JSON.stringify(wallet),  err => {
            if (err) {
              throw err('Wallet was not saved');
            }
        });
    }
}

function retrieveWallet(password, encryptionMethod) {
  if (encryptionMethod == "PLAINTEXT") {;
      return fs.readFileSync('storage',
            {encoding:'utf8', flag:'r'});
  }
}

module.exports.encryptAndStore = encryptAndStore;
module.exports.retrieveWallet = retrieveWallet;