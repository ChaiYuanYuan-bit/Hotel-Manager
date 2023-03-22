import React from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import 'antd/dist/reset.css';
import App from "./App";


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
)

