//api地址
let baseURL = 'http://localhost:3000/api1/'

if (process.env.REACT_APP_TYPE === 'build') {
    baseURL = 'http://localhost:5000/';
}

export default baseURL
 
