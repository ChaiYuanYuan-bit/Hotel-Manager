import React from 'react';
import { BrowserRouter,Routes,Route,useRoutes } from 'react-router-dom';
// import Login from './views/Login/Login';
// import Layout from './views/Layout/Layout';
import routes from './routes';

const App = () => {
    const element = useRoutes(routes)
    return (
        <div>
            {/* <Routes>
                <Route path='/' element={<Login/>}/>
                <Route path='/layout' element={<Layout/>}/>
            </Routes> */}
            {element}
        </div>
            
    );
}

export default App;
