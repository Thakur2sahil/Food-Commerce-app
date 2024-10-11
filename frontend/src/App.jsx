
import './App.css'

import { BrowserRouter,createBrowserRouter,Route,RouterProvider,Routes } from 'react-router-dom'
import Login from './component/Login'
import Registration from './component/Registration'
import NewProduct from './component/NewProduct'
import OurProduct from './component/OurProduct'
import About from './component/About'
import Contact from './component/Contact'
import Updateproduct from './component/Updateproduct'
import Cart from './component/Cart'
import PlaceOrder from './component/PlaceOrder'
import AdminRoute from './AdminRoute'
import Layout from './component/layout'
import UpdateProfile from './component/UpdateProfile'
import DeleteProduct from './component/DeleteProduct'
import ProductUpdate from './component/ProductUpdate'
import OrderCard from './component/OrderCard'
import OrderRequest from './component/OrderRequest'
import PurchaseHistory from './component/PurchaseHistory'
import UserDashboard from './component/UserDashboard'
import AdminHome from './component/AdminHome'



const App = () => {

  const roll = localStorage.getItem('roll')
  
  const router = createBrowserRouter([
    
    {
      path:'/user/userhome',
      element:<UserDashboard/>
    },
    {
      path:'/',
      element:<Login/>
    },
    {
      path:'/signup',
      element:<Registration/>
    },

    {
      path:'/admin',
      element:<AdminRoute/>,
      children:[
        {
          path:'/admin/newproduct',
          element:<NewProduct/>
        },
        {
          path:'/admin/adminhome',
          element:<AdminHome/>
        },
        {
          path:'/admin/ourproduct',
          element:<OurProduct/>
        },
        {
          path:'/admin/updateproduct',
          element:<Updateproduct/>
        },
        {
          path:'/admin/updateprofile',
          element:<UpdateProfile/>
        },
        {
          path:'/admin/productupdate',
          element:<ProductUpdate/>
        },
        {
          path:'/admin/deleteproduct',
          element:<DeleteProduct/>
        },
        {
          path:'/admin/orderrequest',
          element:<OrderRequest/>
        },
  
      ]
    },
    {
      path:'/user',
      element:<Layout/>,
      children:[
        {
          path:'/user/cart',
          element:<Cart/>
        },
        {
          path:'/user/contact',
          element:<Contact/>
        },
        {
          path:'/user/about',
          element:<About/>
        },
        {
          path:'/user/ordercard',
          element:<OrderCard/>
        },
        {
          path:'/user/purchasehistory',
          element:<PurchaseHistory/>
        },
        {
          path:'/user/placeorder',
          element:<PlaceOrder/>
        }
      ]
    }
  ])
  return <RouterProvider router={router} />;
};



export default App
