import React,{useEffect} from 'react';
 
import { useNavigate } from 'react-router-dom';
 

// this conponent is used to protect admin route from  unauthenticated  user  
// It gets the token from localStorage.
// If no token is found, it redirects the user to the home page (/).
// If the token exists, it allow user to access  the child components ({children}).

const AdminProtected = ({children}) => {
     
    const  Token  = localStorage.getItem('token');
    const navigate = useNavigate();
    

     useEffect(()=>{
        if(!Token){
            navigate('/')
        }  
       
     },[Token,navigate]);
     return (
        <>
           {children}
        </>
       );
}

export default  AdminProtected;