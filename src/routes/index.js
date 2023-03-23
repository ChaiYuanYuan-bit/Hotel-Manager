import Login from "../views/Login/Login";
import Layout from "../views/Layout/Layout";
import Role from "../views/Role/Role";
import Admin from "../views/Admin/Admin";

export default [
	{
		path:'/layout',
		element:<Layout/>,
        children:[
            {
                path:'role',
		        element:<Role/>,
            },
			{
				path:'admin',
				element:<Admin/>,
			}
        ]
	},
	{
		path:'/',
		element:<Login/>
	},
]