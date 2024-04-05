import { FcSearch } from "react-icons/fc";
import { Outlet, Link } from "react-router-dom";

import './header.css';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUserUsername } from "../../store/userSlice";
import { AppDispatch } from "../../store/store";
import { getCategories } from "../../store/categoriesSlice";

function Header() {
    const dispatch:AppDispatch = useDispatch();
    const userUsername:String = useSelector(selectUserUsername);

    const handleClick = () => {
        dispatch(logoutUser());
    };

    const handleCategoriesClick = () => {
        dispatch(getCategories());
    }

    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to={'/'}>Home</Link>
                    </li>
                    <li>
                        <Link to={'/categories'} onClick={handleCategoriesClick}>Categories</Link>
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
                    <h3>{userUsername ? `Welcome, ${userUsername}` : ''}</h3>
                    <input placeholder="Search Product..."></input>
                    <button><FcSearch /></button>
                </div>
            </nav>
            <Outlet />
        </>
    )
}

export default Header;