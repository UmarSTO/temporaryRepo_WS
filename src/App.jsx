import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [symbol, setSymbol] = useState('')
  const [subscribedSymbols, setSubscribedSymbols] = useState([])
  const [messages, setMessages] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const wsRef = useRef(null)

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('wss://feed.iel.net.pk')
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      setConnectionStatus('connected')
    }

    ws.onmessage = (event) => {
      console.log('Received:', event.data)
      try {
        const data = JSON.parse(event.data)
        setMessages(prev => [{ timestamp: new Date().toLocaleTimeString(), data }, ...prev].slice(0, 50))
      } catch (e) {
        setMessages(prev => [{ timestamp: new Date().toLocaleTimeString(), data: event.data }, ...prev].slice(0, 50))
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnectionStatus('error')
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setConnectionStatus('disconnected')
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [])

  const handleSubscribe = () => {
    if (!symbol.trim()) {
      alert('Please enter a symbol')
      return
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const symbolsToSubscribe = symbol.split(',').map(s => s.trim().toUpperCase()).filter(s => s)
      
      const message = {
        type: 'subscribe',
        symbols: symbolsToSubscribe
      }

      wsRef.current.send(JSON.stringify(message))
      setSubscribedSymbols(prev => [...new Set([...prev, ...symbolsToSubscribe])])
      setSymbol('')
      console.log('Subscribed to:', symbolsToSubscribe)
    } else {
      alert('WebSocket is not connected')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubscribe()
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return '#4caf50'
      case 'disconnected':
        return '#f44336'
      case 'error':
        return '#ff9800'
      default:
        return '#9e9e9e'
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>WebSocket Feed</h1>
        <div className="status">
          <span className="status-dot" style={{ backgroundColor: getStatusColor() }}></span>
          <span className="status-text">{connectionStatus}</span>
        </div>
      </header>

      <div className="subscribe-section">
        <div className="input-group">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter symbol(s), e.g., AAPL or AAPL,MSFT"
            className="symbol-input"
            disabled={connectionStatus !== 'connected'}
          />
          <button 
            onClick={handleSubscribe}
            className="subscribe-button"
            disabled={connectionStatus !== 'connected'}
          >
            Subscribe
          </button>
        </div>
        
        {subscribedSymbols.length > 0 && (
          <div className="subscribed-symbols">
            <strong>Subscribed to:</strong> {subscribedSymbols.join(', ')}
          </div>
        )}
      </div>

      <div className="messages-section">
        <h2>Live Data</h2>
        {messages.length === 0 ? (
          <div className="no-messages">
            Waiting for data... Subscribe to symbols above to receive updates.
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className="message-item">
                <span className="message-time">{msg.timestamp}</span>
                <pre className="message-data">{JSON.stringify(msg.data, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
