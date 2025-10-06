import { useState } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [inputData, setInputData] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      let data;
      try {
        data = JSON.parse(inputData);
      } catch {
        data = inputData.split(',').map(item => item.trim().replace(/['"]/g, ''));
      }

      const response = await fetch(`${API_BASE_URL}/bfhl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setResponse(result);
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (example) => {
    setInputData(JSON.stringify(example));
  };

  const examples = [
    { name: 'Example A', data: ["a", "1", "334", "4", "R", "$"] },
    { name: 'Example B', data: ["2", "a", "y", "4", "&", "-", "*", "5", "92", "b"] },
    { name: 'Example C', data: ["A", "ABcD", "DOE"] }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bajaj Finserv API Test</h1>
        <p>Test the /bfhl endpoint with your data</p>
      </header>

      <main className="main-content">
        <div className="input-section">
          <h2>Input Data</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder='Enter data as JSON array: ["a", "1", "334", "4", "R", "$"]'
              rows={4}
              className="input-field"
            />
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </form>

          <div className="examples">
            <h3>Try these examples:</h3>
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExample(example.data)}
                className="example-button"
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>

        <div className="output-section">
          {error && (
            <div className="error">
              <h3>Error:</h3>
              <p>{error}</p>
            </div>
          )}

          {response && (
            <div className="response">
              <h3>Response:</h3>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App