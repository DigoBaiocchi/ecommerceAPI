import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/header";
import { AppDispatch } from "../../store/store";
import { addCategory, getCategories, selectCategories } from "../../store/categoriesSlice";
import { FormEvent, useEffect, useRef, useState } from "react";
import CategoryTableBody from "../../components/categoryTableBody/categoryTableBody";
import './Categories.css';

function Categories() {
    const dispatch:AppDispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const categoryName = useRef<HTMLInputElement>(null);
    const [triggerRefetch, setTriggerRefetch] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(addCategory({name: categoryName.current!.value})).then(() => {
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
            <form onSubmit={handleSubmit}>
                <label htmlFor="category-name">Category Name:</label>
                <input 
                    type="text" 
                    id="category-name"
                    ref={categoryName}
                />
                <button type="submit">Add Category</button>
            </form>
            <div className="categories-table">
                <table>
                    <thead>
                        <tr>
                            <th scope="column" className="id-box">Id</th>
                            <th scope="column" className="name-box">Category Name</th>
                            <th scope="column"></th>
                            <th scope="column"></th>
                            <th scope="column"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.map(category => (
                                <CategoryTableBody key={category.id} id={category.id} name={category.name} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Categories;