'use strict'
function generateSeed(password) {
    let phrase = generateMnemonic();
    console.log(phrase)
    let salt = "mnemonic" + password

   let seed = crypto.pbkdf2Sync(phrase, Buffer.from(salt, 'utf-8'), 2048, 64, 'sha512');

   return toHexString(seed);
}

function generateMasterKey(seed) {
    let seedBytes = hexStringToByteArray(seed);
    let keyBytes = Buffer.from('Bitcoin seed', 'utf-8');
    let hmac = hexStringToByteArray(crypto.createHmac("sha512", keyBytes ).update(seedBytes).digest('hex')); 
    let left =  hmac.slice(0, 32);
    let right = hmac.slice(32, hmac.length);
    let masterPrivateKey = bytesToBigIntBE(left);
    let masterChainCode = right;

    const VERSION_BYTES = {
        'mainnet_public': hexStringToByteArray('0488b21e'),
        'mainnet_private': hexStringToByteArray('0488ade4'),
        'testnet_public': hexStringToByteArray('043587cf'),
        'testnet_private': hexStringToByteArray('04358394'),
    }

    let versionBytes = VERSION_BYTES['testnet_public'];
    let depthByte = new Uint8Array([0x00]);
    let parentFingerPrint = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    let childNumberBytes = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    keyBytes = new Uint8Array(33)
    keyBytes.set([0x00],0)
    keyBytes.set(left, 1);

    allParts = new Uint8Array(78)
    allParts.set(versionBytes, 0)
    allParts.set(depthByte, 4)
    allParts.set(parentFingerPrint, 5)
    allParts.set(childNumberBytes, 9)
    allParts.set(masterChainCode, 13)
    allParts.set(keyBytes, 45)


    rootKey = binary_to_base58(allParts)
    console.log(rootKey)
}

function getUint64(dataview, byteOffset, littleEndian) {
    // split 64-bit number into two 32-bit (4-byte) parts
    const left =  dataview.getUint32(byteOffset, littleEndian);
    const right = dataview.getUint32(byteOffset+4, littleEndian);
  
    // combine the two 32-bit values

    const combined = littleEndian? left + 2**32*right : 2**32*left + right;
  
    if (!Number.isSafeInteger(combined))
      console.warn(combined, 'exceeds MAX_SAFE_INTEGER. Precision may be lost');
  
    return combined;
  }

function generateMnemonic() {
    let mnemonicPhrase = "";
    let entropyBitSize = 128;
    let entropyBytes = hexStringToByteArray('919226cbde799fbc137276a70193f698')
    // let entropyBytes = crypto.randomBytes(entropyBitSize/ 8);

    let entropyBits = bytesToBinary(entropyBytes); 

    let checksumLength = entropyBitSize / 32;
    const fsHash = crypto.createHash('sha256');
    fsHash.update(entropyBytes);
    const hashBytes = fsHash.digest('hex');
    console.log(hashBytes);

    let hashBits = bytesToBinary(hexStringToByteArray(hashBytes));
    console.log(hashBits.join(''))

    let checksum = hashBits.slice(0, checksumLength); 
    console.log(checksum.join(''))
    entropyBits.push(...checksum);

    let groupedBits = new Array(entropyBits.length / 11);
    for (let i = 0; i < groupedBits.length;i++) {
        let tempBits = entropyBits.slice(i * 11, (i + 1) * 11);
        groupedBits[i] = tempBits;
    }

    let indices = new Array(groupedBits.length);

    for (let i = 0; i < indices.length; i++) {
        indices[i] = convertToNumber(groupedBits[i]);
    } 
    

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

function getWordList(language) {
    var fs = require("fs");
    var words = fs.readFileSync(`${language}.txt`).toString('UTF8').split('\n');
    return words;
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

function bytesToBigIntBE(bArr) {
    let arr = new Uint8Array(bArr.buffer);
    let result = BigInt(0);
    for (let i = 0;i < arr.length;  i++) {
        result = result * BigInt(256) + BigInt(arr[i]);
    }
    return result;
}

module.exports.generateSeed = generateSeed;
module.exports.generateMasterKey = generateMasterKey