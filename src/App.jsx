import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Login from './Components/Login/Login';
import Registeration from './Components/Registeration/Registeration';
import Home from './Components/Home/Home';
import NotFound from './Components/NotFound/NotFound';
import { Routes , Route, useNavigate,Navigate } from 'react-router-dom';
import { useState } from 'react';
import jwtDecode from 'jwt-decode';

function App() {
  const [userData, setUserData] = useState(null);
  let navigate = useNavigate();
  function decodeToken(){
    let encodedToken = localStorage.getItem('token');
    let decodedToken = jwtDecode(encodedToken);
    setUserData(decodedToken);
    console.log(decodedToken);
  }
  function logingOut(){
    localStorage.removeItem('token');
    setUserData(null);
    navigate('/login')
  }
  function ProtectedRoute(props){
    if(localStorage.getItem('token') == null){
      return <Navigate to='/login'/>
    }
    else{
      return props.children;
    }
  }
  return (
    <>
    <Navbar logingOut={logingOut}/>
    <div className="container">
      <Routes>
        <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}></Route>
        <Route path='login' element={<Login decodeToken={decodeToken}/>}></Route>
        <Route path='register' element={<Registeration/>}></Route>
        <Route path='home' element={<ProtectedRoute><Home/></ProtectedRoute>}></Route>
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
    </div>
    </>
  );
}

export default App;
