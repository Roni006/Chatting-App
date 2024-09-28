

import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import Registration from './pages/Registration'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import LoggedInUserRoute from './PrivateRoute/LoggedInUserRoute';
import NotLoggedInUserRoute from './PrivateRoute/NotLoggedInUserRoute';
import Messages from './pages/Messages';
import RootLayout from './components/RootLayout';
import "cropperjs/dist/cropper.css";


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<LoggedInUserRoute />} >
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/messages" element={<Messages />} />
          </Route>
        </Route>
        <Route element={<NotLoggedInUserRoute />} >
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
        </Route>
        
      </Route>
    )
  )
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
