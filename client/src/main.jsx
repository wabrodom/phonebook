import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'

import { LoginContextProvider } from './contexts/LoginContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <LoginContextProvider>
        <App />
    </LoginContextProvider>
)
