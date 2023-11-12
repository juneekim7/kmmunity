import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './common.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID as string}
        onScriptLoadError={() => console.log("fail")}
        onScriptLoadSuccess={() => console.log("success")}>
           <App />
        </GoogleOAuthProvider>
    </React.StrictMode>
)
