import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header";
import { AppDispatch } from "../../store/store";
import { addCategory, getCategories, selectCategories } from "../../store/categoriesSlice";
import { SetStateAction, useEffect, useState } from "react";

function Categories() {
    const dispatch:AppDispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const [categoryName, setCategoryName] = useState('');

    const onChangeCategoryname = (e: { target: { value: SetStateAction<string>; }; }) => {
        setCategoryName(e.target.value);
    };

    const onSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        dispatch(addCategory(categoryName));
    };
    
    useEffect(() => {
        dispatch(getCategories());
    }, [categories]);

    return (
        <>
            <Header />
            <form onSubmit={onSubmit}>
                <label htmlFor="category-name">Category Name</label>
                <input type="text" id="category-name" onChange={onChangeCategoryname} />
                <button type="submit">Add Category</button>
            </form>
            <div>
                {
                    categories.map(category => (
                        <ul>
                            <li key={category.id}>{category.name}</li>
                        </ul>
                    ))
                }
            </div>
        </>
    );
}

export default Categories;