import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ClipboardJS from 'clipboard';

function getFunctionNamesAndSelectors(abi) {
  const functionDetails = abi
    .filter(item => item.type === 'function')
    .map(func => {
      const signature = `${func.name}(${func.inputs.map(input => input.type).join(',')})`;
      const selector = ethers.keccak256(ethers.toUtf8Bytes(signature)).slice(0, 10);
      return {
        name: func.name,
        selector,
        signature,
        inputs: func.inputs,
        stateMutability: func.stateMutability,
      };
    });

  return functionDetails;
}

function AbiSelector() {
  const [abiInput, setAbiInput] = useState('');
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const clipboard = new ClipboardJS('.copy-btn');

    clipboard.on('success', function(e) {
      setCopiedId(e.trigger.dataset.id);
      setTimeout(() => setCopiedId(null), 2000);
      e.clearSelection();
    });

    clipboard.on('error', function(e) {
      console.error('Copy failed:', e);
    });

    return () => clipboard.destroy();
  }, []);

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

  const viewFunctions = result.filter(
    (func) => func.stateMutability === 'view' || func.stateMutability === 'pure'
  );
  const writeFunctions = result.filter(
    (func) => func.stateMutability === 'nonpayable' || func.stateMutability === 'payable'
  );

  return (
    <div>
      <h1>ABI Function Selector</h1>
      <p>Returns function and their function selectors.</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={abiInput}
          onChange={(e) => setAbiInput(e.target.value)}
          placeholder="Paste your ABI here"
          rows="10"
          style={{ width: '100%', maxWidth: '800px', fontFamily: 'monospace' }}
        />
        <br />
        <button type="submit">Get Selectors</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result.length > 0 && (
        <div>
          {/* <h2>Results:</h2> */}
          <div style={{ display: 'flex', gap: '40px' }}>
            {viewFunctions.length > 0 && (
              <div style={{ flex: 1 }}>
                <h3>View Functions:</h3>
                <div>
                  {viewFunctions.map((item, index) => (
                    <div key={`view-${index}`} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.signature}</span>
                        <button
                          type="button"
                          className="copy-btn"
                          data-clipboard-text={item.signature}
                          data-id={`view-sig-${index}`}
                          style={{
                            padding: '4px 8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            color: copiedId === `view-sig-${index}` ? '#28a745' : '#007bff',
                            border: 'none',
                            borderRadius: '3px',
                            transition: 'color 0.2s',
                          }}
                          title={copiedId === `view-sig-${index}` ? 'Copied!' : 'Copy to clipboard'}
                        >
                          {copiedId === `view-sig-${index}` ? '✓' : '📋'}
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>Selector:</strong> {item.selector}
                        </div>
                        <button
                          type="button"
                          className="copy-btn"
                          data-clipboard-text={item.selector}
                          data-id={`view-${index}`}
                          style={{
                            padding: '4px 8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            color: copiedId === `view-${index}` ? '#28a745' : '#007bff',
                            border: 'none',
                            borderRadius: '3px',
                            transition: 'color 0.2s',
                          }}
                          title={copiedId === `view-${index}` ? 'Copied!' : 'Copy to clipboard'}
                        >
                          {copiedId === `view-${index}` ? '✓' : '📋'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {writeFunctions.length > 0 && (
              <div style={{ flex: 1 }}>
                <h3>Write Functions:</h3>
                <div>
                  {writeFunctions.map((item, index) => (
                    <div key={`write-${index}`} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>
                          {item.stateMutability === 'payable' && (
                            <em style={{ color: '#ff6b6b', marginRight: '6px' }}>payable</em>
                          )}
                          {item.signature}
                        </span>
                        <button
                          type="button"
                          className="copy-btn"
                          data-clipboard-text={item.signature}
                          data-id={`write-sig-${index}`}
                          style={{
                            padding: '4px 8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            color: copiedId === `write-sig-${index}` ? '#28a745' : '#007bff',
                            border: 'none',
                            borderRadius: '3px',
                            transition: 'color 0.2s',
                          }}
                          title={copiedId === `write-sig-${index}` ? 'Copied!' : 'Copy to clipboard'}
                        >
                          {copiedId === `write-sig-${index}` ? '✓' : '📋'}
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>Selector:</strong> {item.selector}
                        </div>
                        <button
                          type="button"
                          className="copy-btn"
                          data-clipboard-text={item.selector}
                          data-id={`write-${index}`}
                          style={{
                            padding: '4px 8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            color: copiedId === `write-${index}` ? '#28a745' : '#007bff',
                            border: 'none',
                            borderRadius: '3px',
                            transition: 'color 0.2s',
                          }}
                          title={copiedId === `write-${index}` ? 'Copied!' : 'Copy to clipboard'}
                        >
                          {copiedId === `write-${index}` ? '✓' : '📋'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AbiSelector;