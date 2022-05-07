import {useRef,useState} from 'react'
import {Form,Button,Modal} from 'react-bootstrap'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import {useAuth} from './Contexts/AuthProvider';
export default function SignUp()
{
   const emailRef=useRef();
   const nameRef=useRef(); 
   const passwordRef=useRef(); 
   const navigate = useNavigate(); 
   const [error,setError] = useState('');
   const {setUser}=useAuth();
   const loginHandler=async (e)=>
   {
       e.preventDefault();
       const email  = emailRef.current.value;
       const name  = nameRef.current.value;
       const password  = passwordRef.current.value;
       try
       {
           const response = await axios.post('http://localhost:5000/login',{email:email,password:password,name:name},{withCredentials:true});
           if(response.status!=200)
           {
               throw new Error(response.data.message);
           }
           else
           {
               const {accessToken,refreshToken} = response.data;
               localStorage.setItem('accessToken',accessToken);
               localStorage.setItem('refreshToken',refreshToken);
               setUser({name:name,email:email});
               navigate('/dashboard');
           }
       }
       catch(err)
       {
           setError(err.message);
       }

   }
   return(
    <div className='center-form'>
   <Form className='form'>
       <Form.Group>
           <Form.Label>Email Address</Form.Label>
           <Form.Control type='email' ref={emailRef}></Form.Control>
       </Form.Group>
       <Form.Group>
           <Form.Label>Name</Form.Label>
           <Form.Control type='text' ref={nameRef}></Form.Control>
       </Form.Group><Form.Group>
           <Form.Label>Password</Form.Label>
           <Form.Control type='password' ref={passwordRef}></Form.Control>
       </Form.Group>
       <Form.Control type='submit' onClick={loginHandler} value='Login'></Form.Control>
   </Form>
   <Modal show={error.length!=0} onHide={(e)=>{setError("");}}>
       <Modal.Header closeButton>Error!</Modal.Header>
       <Modal.Body>Message : {error}</Modal.Body>
   </Modal>
   <p className='text-center'>Dont have an Account ? <Link to='/'>SignUp</Link></p>
   </div>
   );
}