import { FcSearch } from "react-icons/fc";
import { Outlet } from "react-router-dom";

function Header() {
    return (
        <>
            <nav>
                <ul>
                    <li>Home</li>
                    <li>Products</li>
                    <li>Cart</li>
                    <li><a href="/login">Login</a></li>
                    <input></input>
                    <button><FcSearch /></button>
                </ul>
            </nav>
            <Outlet />
        </>
    )
}

export default Header;