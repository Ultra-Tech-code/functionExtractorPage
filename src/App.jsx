import React, { useState } from 'react';
import { ethers } from 'ethers';

function getFunctionNamesAndSelectors(abi) {
  const functionDetails = abi
    .filter(item => item.type === 'function')
    .map(func => {
      const signature = `${func.name}(${func.inputs.map(input => input.type).join(',')})`;
      const selector = ethers.keccak256(ethers.toUtf8Bytes(signature)).slice(0, 10);
      return { name: func.name, selector };
    });

  return functionDetails;
}

function AbiSelector() {
  const [abiInput, setAbiInput] = useState('');
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (!abiInput) {
        setError('Please enter an ABI');
        return;
      }
      setError('');
      
      const abi = JSON.parse(abiInput);
      const functionDetails = getFunctionNamesAndSelectors(abi);
      setResult(functionDetails);
    } catch (error) {
      console.error('Error parsing ABI:', error);
      setError('Error parsing ABI. Please check the input and try again.');
      setResult([]);
    }
  };

  return (
    <div >
      <h1>ABI Function Selector</h1>
      <p>Returns function name and their function selectors.</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={abiInput}
          onChange={(e) => setAbiInput(e.target.value)}
          placeholder="Paste your ABI here"
          rows="10"
          cols="50"
        />
        <br />
        <button type="submit">Get Selectors</button>
      </form>
      {error && <li style={{ color: 'red' }}>{error}</li>}
      {result.length > 0 && (
        <div>
          <h2>Results:</h2>
          <ul>
            {result.map((item, index) => (
              <li key={index}>
                {item.name}: {item.selector}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AbiSelector;