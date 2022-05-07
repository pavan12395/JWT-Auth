import React,{useState,useEffect,useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const AuthContext = React.createContext();

export const useAuth=()=>
{
    return useContext(AuthContext);
}

export default function AuthProvider(props)
{
    const [user,setUser] = useState();
    const [expired,setExpired] = useState(false);
    const navigate=useNavigate();
    useEffect(()=>
    {
         const accessToken = localStorage.getItem("accessToken");
         if(!accessToken)
         {
             return;
         }
         const doWork=async ()=>
         {
           try
           {  
             const response = await axios.get('http://localhost:5000/checkToken',{headers:
             {
                 'authorization':accessToken
             }});
             const {email,name} = response.data;
             setUser({email:email,name:name});
             navigate('/dashboard');
           }
           catch(err)
           {
               if(err.response.data.indexOf('expired')!=-1)
               {
                   setExpired(true);
               }
           }
         }
         doWork();
    },[]);
    return(
        <AuthContext.Provider value={{user:user,setUser:setUser,expired:expired,setExpired:setExpired}}>
        {
            props.children
        }
        </AuthContext.Provider>
    )
}