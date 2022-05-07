import {useAuth} from './Contexts/AuthProvider';
import {Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useEffect,useState} from 'react';
export default function Dashboard()
{
    const navigate=useNavigate();
    const {user,setUser,expired,setExpired} = useAuth();
    const logOutHandler=async (e)=>
    {
        e.preventDefault();
        const response = await axios.get("http://localhost:5000/logout");
        if(response.status==200)
        {
            setUser(null);
            navigate("/");
        }
    }
    const retryHandler=async (e)=>
    {
          const refreshToken=localStorage.getItem('refreshToken');
          let response = await axios.get('http://localhost:5000/retry',{headers:{'authorization':refreshToken}});
          const accessToken = response.data.accessToken;
          localStorage.setItem('accessToken',accessToken);
          response = await axios.get('http://localhost:5000/checkToken',{headers:{'authorization':accessToken}});
          setUser({name:response.data.name,email:response.data.email});
    }
     if(user)
     {
        if(user.email!='' && user.name!=''){
            return(
         <>
         <div className='center-dashboard'>
         <h1>Email : {user.email}</h1>
         <h1>Name : {user.name}</h1>
         <div className='logout-container'>
             <Button onClick={logOutHandler}>Logout</Button>
         </div>
         </div>
         </>)
        }
        else
        {
            return(
                <>
                <div className='center-dashboard'>
                <h1>No User</h1>
                <div className='logout-container'>
                    <Button onClick={(e)=>{navigate("/")}}>SignUp</Button>
                </div>
                </div>
                </>
            );
        }
     }
     else if(expired)
     {
        return(
            <>
            <div className='center-dashboard'>
            <h1>Token Expired</h1>
            <div className='logout-container'>
                <Button onClick={retryHandler}>Generate Token</Button>
            </div>
            </div>
            </>
        );
     }
     else
     {
         return <h1>Loading</h1>
     }
}