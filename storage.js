const crypto = require('crypto');


function saveWallet(walletName, password, wallet, encryptionMethod) {
    wallets = {};
    
    if (fs.existsSync(datastore_name)) {
      contents = fs.readFileSync(datastore_name);
      if (contents != null && contents.trim() != '') {
        wallets = JSON.parse(contents);
      }
    }
    wallets[walletName] = wallet;

    var data = JSON.stringify(wallets)
    if (encryptionMethod == AES256) {
      data = encryptData(password, AES256, Buffer.from(data));
    } 

    fs.writeFile(datastore_name, data,  err => {
      if (err) {
        throw err('Wallet was not saved');
      }
    });
}

function getWallet(walletName, password, encryptionMethod) {
  var wallets = {}
  var wallet;
  try {
    if (fs.existsSync(datastore_name)) {
      contents = fs.readFileSync(datastore_name);
      if (contents != null && contents.length > 0) {
        if (encryptionMethod == AES256) {
          var decryptedContents = decryptData(password, AES256, contents).toString()
          wallets = JSON.parse(decryptedContents);
        } else {
          wallets = JSON.parse(contents);
        }
        wallet = wallets[walletName];
      }
    }
  } catch (error) {
    // TODO: do we want to log this?
  }

  return wallet;
}

const encryptData = (password, algorithm, buffer) => {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  return Buffer.concat([iv,cipher.update(buffer), cipher.final()]);
}

const decryptData = (password, algorithm, data) => {
  const iv = data.slice(0, 16);
  contents = data.slice(16);
  const key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return Buffer.concat([decipher.update(contents), decipher.final()]);
}

module.exports.saveWallet = saveWallet;
module.exports.getWallet = getWallet;