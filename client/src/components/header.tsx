import { FcSearch } from "react-icons/fc";

function Header() {
    return (
        <>
            <nav>
                <ul>
                    <li>Home</li>
                    <li>Products</li>
                    <li>Cart</li>
                    <input></input>
                    <button><FcSearch /></button>
                </ul>
            </nav>
        </>
    )
}

export default Header;