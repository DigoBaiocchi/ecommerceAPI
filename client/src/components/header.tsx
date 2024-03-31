import { FcSearch } from "react-icons/fc";
import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { selectCart, selectCartMessage, getCart } from "../store/cartSlice";

import './header.css';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUserUsername } from "../store/userSlice";
import { AppDispatch } from "../store/store";

function Header() {
    const dispatch:AppDispatch = useDispatch();
    const userUsername:String = useSelector(selectUserUsername);
    const cartMessage = useSelector(selectCartMessage);

    const handleClick = () => {
        dispatch(logoutUser());
    };

    const handleButton = () => {
        dispatch(getCart());
    };
    
    useEffect(() => {
        // dispatch(getCart());

    }, [userUsername, cartMessage]);

    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to={'/'}>Home</Link>
                    </li>
                    <li>Products</li>
                    <li>Cart</li>
                    <li>
                        {
                            userUsername ?    
                            <Link to={'/'} onClick={handleClick}>LogOut</Link> :
                            <Link to={'/login'}>Login</Link>
                        }
                    </li>
                </ul>
                <div className="search">
                    <h3>Welcome, {userUsername || 'Unknown'}</h3>
                    <input></input>
                    <button><FcSearch /></button>
                </div>
            </nav>
            <div>
                <h1>The message is {cartMessage || 'Not available'}</h1>
                <button onClick={handleButton}>Show Message</button>
            </div>
            <Outlet />
        </>
    )
}

export default Header;