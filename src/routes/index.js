import Login from "../views/Login/Login";
import Layout from "../views/Layout/Layout";
import Role from "../views/Role/Role";
import Admin from "../views/Admin/Admin";
import Mine from "../views/Admin/Mine/Mine";
import UpdatePwd from "../views/Admin/UpdatePwd/UpdatePwd";

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
			},
			{
				path:'mine',
				element:<Mine/>
			},
			{
				path:'upPwd',
				element:<UpdatePwd/>
			}
        ]
	},
	{
		path:'/',
		element:<Login/>
	},
]