import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IdProvider } from './component/context';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './component/redux/store';
import Category from './component/screens/Category';
import BannerCategory from './component/screens/banner';
// Commented out for dev phase
// import Auth from './component/auth/Auth';
// import PrivateRoute from './component/auth/privateRoute';
import GeneralNotify from './component/screens/generalNotify';
import AllBusinesses from './component/screens/AllBusinesses';
// Removed AllProviders - no longer needed
// import AllProviders from './component/screens/AllProviders';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  // Commented out auth route for dev phase
  // {
  //   path:"/auth",
  //   element: <Auth />,
  // },
  {
    path: '/',
    // Commented out PrivateRoute for dev phase - direct access
    element : <App/>
    // element : <PrivateRoute element={<App/>}/>
  },  
  {
    path : "/category",
    // Commented out PrivateRoute for dev phase - direct access
    element : <Category/>
    // element :  <PrivateRoute element={<Category/>}/>
  },
  {
    path : "/banner",
    // Commented out PrivateRoute for dev phase - direct access
    element : <BannerCategory/>
    // element :  <PrivateRoute element={<BannerCategory/>}/>
  },
  {
    path : '/general-notify',
    // Commented out PrivateRoute for dev phase - direct access
    element : <GeneralNotify/>
    // element : <PrivateRoute element={<GeneralNotify/>}/>
  },
  {
    path : '/all-businesses',
    // Commented out PrivateRoute for dev phase - direct access
    element : <AllBusinesses/>
    // element : <PrivateRoute element={<AllBusinesses/>}/>
  }
  // Removed all-providers route - no longer needed
])

root.render(
    <ReduxProvider store={store}>
    <IdProvider>
      <RouterProvider router={router}/>
    </IdProvider>
    </ReduxProvider>
);
