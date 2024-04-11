import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/header";
import { AppDispatch } from "../../store/store";
import { getCategories, selectCategories } from "../../store/categoriesSlice";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import './Products.css';
import ProductTableBody from "../../components/ProductTableBody/ProductTableBody";
import { addProduct, getProducts, selectProducts } from "../../store/productsSlice";

export default function Products() {
    const dispatch:AppDispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const products = useSelector(selectProducts);
    const [categoryId, setCategoryId] = useState(0);
    const name = useRef<HTMLInputElement>(null);
    const quantity = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLInputElement>(null);
    const price = useRef<HTMLInputElement>(null);
    const [triggerRefetch, setTriggerRefetch] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(addProduct({
            categoryId, 
            name: name.current!.value, 
            quantity: parseInt(quantity.current!.value), 
            description: description.current!.value, 
            price: parseInt(price.current!.value),
        })).then(() => {
            setTriggerRefetch(true);
        });
        event.currentTarget.reset();
    };

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newValue = parseInt(event.target.value, 10);
        setCategoryId(newValue);
        console.log(isNaN(categoryId), categoryId);
    };
    
    useEffect(() => {
        dispatch(getCategories());
        dispatch(getProducts());
        setTriggerRefetch(false);
        console.log(products);
    }, [triggerRefetch]);

    return (
        <>
            <Header />
            <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-container">
                    <div className="form-inputs">
                        <label htmlFor="category-name">Category:</label>
                        <select name="categories" className="category-select" onChange={handleChange}>
                            <option value={0} disabled selected  >Select a category</option>
                            {
                                categories.map(category => (
                                    <option value={category.id} >{category.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="form-inputs">
                        <label htmlFor="product-name">Name:</label>
                        <input 
                            type="text" 
                            id="product-name"
                            className="input"
                            ref={name}
                        />
                    </div>
                    <div className="form-inputs">
                        <label htmlFor="product-quantity">Quantity:</label>
                        <input 
                            type="number" 
                            id="product-quantity"
                            className="input"
                            ref={quantity}
                        />
                    </div>
                    <div className="form-inputs">
                        <label htmlFor="product-description">Description:</label>
                        <input 
                            type="text" 
                            id="product-description"
                            className="input"
                            ref={description}
                        />
                    </div>
                    <div className="form-inputs">
                        <label htmlFor="product-price">Price:</label>
                        <input 
                            type="number" 
                            id="product-price"
                            className="input"
                            ref={price}
                        />
                    </div>
                    <button type="submit">Add Product</button>
                </div>
            </form>
            <div className="categories-table">
                <div>
                <thead>
                    <tr>
                        <th scope="column" className="id-box">Id</th>
                        <th scope="column" className="name-box">Name</th>
                        <th scope="column" className="name-box">Quantity</th>
                        <th scope="column" className="name-box">Description</th>
                        <th scope="column" className="name-box">Price</th>
                        <th scope="column"></th>
                        <th scope="column"></th>
                        <th scope="column"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map(product => (
                            <ProductTableBody 
                                id={product.id}
                                name={product.name}
                                quantity={product.quantity}
                                description={product.description}
                                price={product.price}
                            />
                            // <CategoryTableBody id={category.id} name={category.name} />
                        ))
                    }
                </tbody>
                </div>
            </div>
        </>
    );
}