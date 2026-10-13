import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { migrateLegacyCurrency } from './utils/migrateCurrency.js'
import './styles.css'

migrateLegacyCurrency()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)