import { useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/header/header";
import { selectProducts } from "../../store/productsSlice";

export default function Home() {
    const products = useSelector(selectProducts);

    return (
        <>
            <Header />
            <main>
                {
                    products.map(product => (
                        <ProductCard name={product.name} price={product.price} />
                    ))
                }
            </main>
        </>
    );
}