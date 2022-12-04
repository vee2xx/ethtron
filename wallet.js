'use strict'

const generatorPoint = ec.g;
const order = ec.n;

const VERSION_BYTES = {
    'mainnet_public': hexStringToByteArray('0488b21e'),
    'mainnet_private': hexStringToByteArray('0488ade4'),
    'testnet_public': hexStringToByteArray('043587cf'),
    'testnet_private': hexStringToByteArray('04358394'),
}

function createWallet(password, numAddresses) {
    var walletInfo = {'mnemonicPhrase': '', 'seed': '', 'rootkey': '', 'addresses': [], 'extendedPrivateKey': ''};
    let phrase = generateMnemonic();
    walletInfo['mnemonicPhrase'] = phrase
    var seed = generateSeed(phrase, password);

    //for testing
    // var seed = 'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542'
    
    var seedBytes = hexStringToByteArray(seed);
    var keyBytes = Buffer.from('Bitcoin seed', 'utf-8');
    var hmac = hexStringToByteArray(crypto.createHmac("sha512", keyBytes ).update(seedBytes).digest('hex')); 
    var masterPrivateKey =  hmac.slice(0, 32);
    var masterChainCode = hmac.slice(32, hmac.length);

    var depthByte = new Uint8Array([0x00]);
    var parentFingerPrint = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    var childNumberBytes = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    walletInfo['rootkey'] = generateExtendedKey(masterPrivateKey, masterChainCode, depthByte, parentFingerPrint, childNumberBytes);

    // m / purpose’ / coin_type’ / account’ / change / address_index
    // m/44'/60'/0'/0/0
    // add 2**31 to hardened child keys
    //TODO: read more on this
    for(var i = 0; i < numAddresses; i++) {
        var pathNumbers = [2147483692, 2147483708, 2147483648, 0, i];
        var depth = 0;
        var parentFingerprint = null;
        var childNumber = null;
        var privateKey = masterPrivateKey;
        var chainCode = masterChainCode;
    
        for (var i = 0; i < pathNumbers.length; i++) {
            depth += 1;
            childNumber = pathNumbers[i];
            parentFingerprint = fingerPrintFromPrivateKey(privateKey);
            var child = extendedFromPrivateKey(privateKey, chainCode, childNumber);
            privateKey = numberToUintArrayBE(child.childPrivateKey, 32);
            chainCode = child.childChainCode;
        }
    
        walletInfo['extendedPrivateKey'] = generateExtendedKey(privateKey, chainCode, numberToUintArrayBE(depth, 1),  numberToUintArrayBE(parentFingerprint, 4), numberToUintArrayBE(childNumber, 4))
        
        var pCurve = curvePointFromInt(privateKey);
    
        var xy = new Uint8Array(64);
        xy.set(pCurve.getX().toArray(), 0);
        xy.set(pCurve.getY().toArray(), 32);
        
        var xyHash = keccak('keccak256').update(Buffer.from(xy)).digest();
        var address = {'address': '0x' + toHexString(xyHash.slice(12, xyHash.length)), 'publicKey': toHexString(serializeCurvePoint(pCurve)), 'privateKey': privateKey};
        walletInfo['addresses'].push(address);
    }
    return walletInfo;
}

function generateSeed(mnemonicPhrase, password) {
    let salt = "mnemonic" + password
    let seed = crypto.pbkdf2Sync(mnemonicPhrase, Buffer.from(salt, 'utf-8'), 2048, 64, 'sha512');
    return toHexString(seed);
}

function generateMnemonic() {
    let mnemonicPhrase = "";
    let entropyBitSize = 128;

    //for testing
    // let entropyBytes = hexStringToByteArray('919226cbde799fbc137276a70193f698')

    let entropyBytes = crypto.randomBytes(entropyBitSize/ 8);

    let entropyBits = bytesToBinary(entropyBytes); 

    let checksumLength = entropyBitSize / 32;
    const fsHash = crypto.createHash('sha256');
    fsHash.update(entropyBytes);
    const hashBytes = fsHash.digest('hex');

    let hashBits = bytesToBinary(hexStringToByteArray(hashBytes));
    let checksum = hashBits.slice(0,checksumLength);

    entropyBits = entropyBits.concat(checksum)

    let indices = new Array();
    
    for(let i=0; i < entropyBits.length / 11 ;i++) {
        indices.push(convertToNumber(entropyBits.slice(i * 11,(i + 1) * 11)));
    }
    
    // console.log(indices)


    let wordList = getWordList('en')

    if (wordList != null && wordList.length >= 12) {
        let mnemonic = new Array(12);

        for (let i =0; i < 12; i++) {
            mnemonic[i] = wordList[indices[i]];
        }

        mnemonicPhrase = mnemonic.join(' ');
    }
    return mnemonicPhrase;
}

function generateExtendedKey(privateKey, chainCode, depthByte, parentFingerPrint, childNumberBytes) {
    let versionBytes = VERSION_BYTES['mainnet_private'];

    let keyBytes = new Uint8Array(33)
    keyBytes.set([0x00],0)
    keyBytes.set(privateKey, 1);

    let allParts = new Uint8Array(74)
    allParts.set(depthByte, 0)
    allParts.set(parentFingerPrint, 1)
    allParts.set(childNumberBytes, 5)
    allParts.set(chainCode, 9)
    allParts.set(keyBytes, 41)
             
    let key = encode(Buffer.from(allParts), Buffer.from(versionBytes))
    return key
} 

function serializeCurvePoint(curvePoint) {
    var x = curvePoint.getX();
    var y = curvePoint.getY();

    var serializedKey = new Uint8Array(33)
    if (y.isEven()) {
        serializedKey.set([0x02], 0)

    } else{
        serializedKey.set([0x03], 0)
    }
    serializedKey.set(x.toArray(), 1)
    return serializedKey;
}

function curvePointFromInt(privKey) {
    return generatorPoint.mul(privKey);
}

function fingerPrintFromPrivateKey(privateKey) {
    var curvePoint = curvePointFromInt(privateKey)
    var serializedCurvePoint = serializeCurvePoint(curvePoint)
    var fingerprint = crypto.createHash('sha256').update(serializedCurvePoint).digest();
    fingerprint = crypto.createHash('ripemd160').update(fingerprint).digest();
    return fingerprint.slice(0,4)
}

function extendedFromPrivateKey(privateKey, chainCode, childNumber) {
    var data = new Uint8Array(37);
    if (childNumber >= 2 ** 31) {
        data.set([0x00],0);
        data.set(privateKey, 1);
    } else {
        var curvePoint = curvePointFromInt(privateKey);
        data.set(serializeCurvePoint(curvePoint), 0);
    }
    data.set(numberToUintArrayBE(childNumber, 4), 33);

    let hmac_child = hexStringToByteArray(crypto.createHmac("sha512", chainCode).update(data).digest('hex')); 
    let left =  hmac_child.slice(0, 32);
    let childChainCode = hmac_child.slice(32, hmac_child.length);
    let childPrivateKey = (bytesToBigIntBE(left) + bytesToBigIntBE(privateKey)) % bytesToBigIntBE(new Uint8Array(order.toArray(true)));
    return {"childPrivateKey": childPrivateKey, "childChainCode": childChainCode};
}


function encode(data, prefix = '00', encoding = 'hex') {
    if (typeof data === 'string') {
      data = new Buffer.from(data, encoding)
    }
    if (!(data instanceof Buffer)) {
      throw new TypeError('"data" argument must be an Array of Buffers')
    }
    if (!(prefix instanceof Buffer)) {
      prefix = new Buffer.from(prefix, encoding)
    }
    let hash = Buffer.concat([prefix, data])
    hash = crypto.createHash('sha256').update(hash).digest()
    hash = crypto.createHash('sha256').update(hash).digest()
    hash = Buffer.concat([prefix, data,  hash.slice(0, 4)])
    return base58.encode(hash)
}

function getWordList(language) {
    var words = fs.readFileSync(`${language}.txt`).toString('UTF8').split('\n');
    return words;
}

function hexStringToByteArray(hexString) {
    if (hexString.length % 2 !== 0) {
        throw "Must have an even number of hex digits to convert to bytes";
    }/* w w w.  jav  a2 s .  c o  m*/
    var numBytes = hexString.length / 2;
    var byteArray = new Uint8Array(numBytes);
    for (var i=0; i<numBytes; i++) {
        byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
    }
    return byteArray;
}

function bytesToBinary(bytes) {
    const bitArray = new Array(bytes.length * 8).fill(0);
    let bitIndex = 0
    for (var i = 0; i < bytes.length; i++) {
        let tempArray = convertToBinary(bytes[i])
        for (let j = 0; j < 8; j++) {
            bitArray[bitIndex] = tempArray[j]
            bitIndex++
        }
    }
    return bitArray
}

function numberToUintArrayBE(bigNumber, size) {
    let zero = BigInt(0);
    let result = new Uint8Array(size);
    let i = 0;
    while (bigNumber > 0) {
        let bn = BigInt(bigNumber) % BigInt(256);
        result[i] = Number(bn)
        bigNumber = BigInt(bigNumber) / BigInt(256);
        i += 1;
    }
    return result.reverse();
}


function bytesToBigIntBE(bArr) {
    let arr = new Uint8Array(bArr.buffer);
    let result = BigInt(0);
    for (let i = 0;i < arr.length;  i++) {
        result = result * BigInt(256) + BigInt(arr[i]);
    }
    return result;
}

function toHexString(byteArray) {
    var hexString = '';
    var nextHexByte;
    for (var i=0; i<byteArray.byteLength; i++) {
        nextHexByte = byteArray[i].toString(16);    // Integer to base 16
        if (nextHexByte.length < 2) {
            nextHexByte = "0" + nextHexByte;        // Otherwise 10 becomes just a instead of 0a
        }//  w w w.java  2 s  . c  om
        hexString += nextHexByte;
    }
    return hexString;
}

function convertToBinary (number) {
    let num = number;
    let bitArray = new Array(8).fill(0);
    let i = 7

    bitArray[i] = (num % 2)
    i--;
    for (; num > 1; ) {
        num = parseInt(num / 2);
        bitArray[i] = (num % 2)
        i--;
    }
    return bitArray;
}
function convertToNumber (bitArray) {
    let ba = bitArray;
    let num = 0;
    let bitIndex = ba.length - 1
    for (let i = 0; i < ba.length; i++ ) {
        let tempNum = ba[i] * (2 ** bitIndex);
        num = num + tempNum;
        bitIndex--;
    }
    return num;
}


module.exports.createWallet = createWallet;
