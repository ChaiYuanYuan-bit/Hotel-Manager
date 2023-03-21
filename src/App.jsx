import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './views/Login/Login';
import Layout from './views/Layout/Layout';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login/>}/>
                <Route path='/layout' element={<Layout/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
