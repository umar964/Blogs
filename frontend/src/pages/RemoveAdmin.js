import axios from 'axios';
import React,{useState} from 'react'
 

const RemoveAdmin = () => {
    const [email,setEmail] = useState('');
    const [message, setMessage] = useState("");

    // const token  = localStorage.getItem('token');

    const handleRemoveAdmin = async(e)=>{
        e.preventDefault();
        try{
            const confirmRemove = window.confirm("Are you sure to remove this admin");
            if(confirmRemove){
                const res = await axios.post('http://localhost:5000/api/admin/remove-admin',{email}
                    // {
                    //     headers: { Authorization: `Bearer ${token}` },
                    // }
                    )
                    setMessage(res.data.msg);
            }
             
        }catch(error){
            setMessage("Error: " + error.response.data.error);
            console.log("Error deleting admin",error);
        }
    }


    


    return (
        <div className="admin-login-container">
            <h2>Remove Admin</h2>
            {message && <p className="admin-message">{message}</p>}
             
            <form onSubmit={handleRemoveAdmin} className="admin-login-form">
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="admin-input"
                />
               
                <button type="submit" className="admin-button">Remove</button>
            </form>
        </div>
    );
}

export default RemoveAdmin