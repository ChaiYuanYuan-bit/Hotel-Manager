import Login from "../views/Login/Login";
import Layout from "../views/Layout/Layout";
import Role from "../views/Role/Role";
import { Children } from "react";

export default [
	{
		path:'/layout',
		element:<Layout/>,
        children:[
            {
                path:'role',
		        element:<Role/>,
            }
        ]
	},
	{
		path:'/',
		element:<Login/>
	},
]