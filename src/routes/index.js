import Login from "../views/Login/Login";
import Layout from "../views/Layout/Layout";
import Role from "../views/Role/Role";
import Admin from "../views/Admin/Admin";
import Mine from "../views/Admin/Mine/Mine";
import UpdatePwd from "../views/Admin/UpdatePwd/UpdatePwd";
import RoomType from "../views/Type/Type";
import Room from "../views/Room/Room";
import Total from "../views/Total/Total";
import Guest from "../views/Guest/Guest";

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
				path:'pwd',
				element:<UpdatePwd/>
			},
			{
				path:'type',
				element:<RoomType/>
			},
			{
				path:'room',
				element:<Room/>
			},
			{
				path:'total',
				element:<Total/>
			},
			{
				path:'guest',
				element:<Guest/>
			}
        ]
	},
	{
		path:'/',
		element:<Login/>
	},
]