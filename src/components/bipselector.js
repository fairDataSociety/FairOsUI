import React, { useState } from 'react';
import bip39english from '../data/bip39/english.json'; 

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

const BipSelector = (props) => {
    const [mnemonic, setMnemonic] = useState(props.mnemonic==undefined || props.mnemonic===null ? getRandom(bip39english,12) : props.mnemonic);  
    function refreshMnemonic()
    {
        setNewMnemonic(getRandom(bip39english,12)); 
    }
    function setNewMnemonic(mn)
    {
        setMnemonic(mn); 
        props.onMnemonicChange(mn);
    }
    return (
        <div className="Bip39">
               <span>Mnemonic: </span>
                <input type="text" style={{width:'80%'}} onChange={(e)=>setNewMnemonic(e.target.value)} value={mnemonic.toString()}>
                </input>
                <button onClick={()=>refreshMnemonic()}>&#x1f5d8;</button>
        </div>
    )
}

export default BipSelector;
