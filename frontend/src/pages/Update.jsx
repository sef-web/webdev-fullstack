import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Update =()=>{
    const [shoe, setShoe] = useState({
        prod_name:"",
        prod_description:"",
        price: null,
        image: ""
    });
    const navigate= useNavigate();
    const location= useLocation();
    const shoeId= location.pathname.split("/")[2]

    const handleChange=(e)=> {
        setShoe((prev)=> ({...prev, [e.target.name]: e.target.value}))
    };

    const handleClick= async e=>{
        e.preventDefault()
        try{
            await axios.put(`http://localhost:8800/shoes/${shoeId}`, shoe)
            navigate("/")
        }catch(err){
            console.log (err)
        }
    };

    console.log(shoe)
//if mouse, use onClick, if kb use onChange
    return (
        <div className='form'>
            <h1>Update Item</h1>
            <input type="text" placeholder='prod_name' onChange={handleChange} name="prod_name"/>
            <input type="text" placeholder='prod_description' onChange={handleChange}me="prod_description"/>
            <input type="text" placeholder='price' onChange={handleChange} name="price"/>
            <input type="text" placeholder='image' onChange={handleChange} name="image"/>

            <button onClick={handleClick}>Update</button>

        </div>
    )
}

export default Update