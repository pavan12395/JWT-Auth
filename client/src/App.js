import {Routes,Route} from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import DashBoard from './DashBoard';
import AuthProvider from './Contexts/AuthProvider';
import {useRef} from 'react';
export default function App()
{
    return(
      <AuthProvider>
      <Routes>
        <Route exact path='/' element={<Signup/>}/>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/dashboard' element={<DashBoard/>}/>
      </Routes>
      </AuthProvider>
    )
}