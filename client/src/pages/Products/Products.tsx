import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/header";
import { AppDispatch } from "../../store/store";
import { addCategory, getCategories, selectCategories } from "../../store/categoriesSlice";
import { FormEvent, useEffect, useRef, useState } from "react";
import CategoryTableBody from "../../components/categoryTableBody/categoryTableBody";
import './Products.css';
import ProductTableBody from "../../components/ProductTableBody/ProductTableBody";

export default function Products() {
    const dispatch:AppDispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const name = useRef<HTMLInputElement>(null);
    const quantity = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLInputElement>(null);
    const price = useRef<HTMLInputElement>(null);
    const [triggerRefetch, setTriggerRefetch] = useState(false);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(addCategorys(name.current!.value)).then(() => {
            setTriggerRefetch(true);
        });
        event.currentTarget.reset();
    };
    
    useEffect(() => {
        dispatch(getCategories());
        setTriggerRefetch(false);
    }, [triggerRefetch]);

    return (
        <>
            <Header />
            <form className="product-form" onSubmit={onSubmit}>
                <div className="form-container">
                    <div className="form-inputs">
                        <label htmlFor="category-name">Category:</label>
                        <select name="categories" className="category-select">
                            <option value="" disabled selected >Select a category</option>
                            {
                                categories.map(category => (
                                    <option value={category.name}>{category.name}</option>
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
                        <th scope="column" className="name-box">Price</th>
                        <th scope="column"></th>
                        <th scope="column"></th>
                        <th scope="column"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.map(category => (
                            <ProductTableBody />
                            // <CategoryTableBody id={category.id} name={category.name} />
                        ))
                    }
                </tbody>
                </div>
            </div>
        </>
    );
}