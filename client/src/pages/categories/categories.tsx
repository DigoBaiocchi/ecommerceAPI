import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/header";
import { AppDispatch } from "../../store/store";
import { addCategory, getCategories, selectCategories } from "../../store/categoriesSlice";
import { SetStateAction, useEffect, useState } from "react";
import CategoryTableBody from "../../components/categoryTableBody/categoryTableBody";

function Categories() {
    const dispatch:AppDispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const [categoryName, setCategoryName] = useState('');
    const [triggerRefetch, setTriggerRefetch] = useState(false);

    const onChangeCategoryname = (e: { target: { value: SetStateAction<string>; }; }) => {
        setCategoryName(e.target.value);
    };

    const onSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        dispatch(addCategory(categoryName)).then(() => {
            setTriggerRefetch(true);
            setCategoryName('');
        });
    };
    
    useEffect(() => {
        dispatch(getCategories());
        setTriggerRefetch(false);
    }, [triggerRefetch]);

    return (
        <>
            <Header />
            <form onSubmit={onSubmit}>
                <label htmlFor="category-name">Category Name:</label>
                <input 
                    type="text" 
                    id="category-name" 
                    value={categoryName}
                    onChange={onChangeCategoryname}
                />
                <button type="submit">Add Category</button>
            </form>
            <div>
                <thead>
                    <tr>
                        <th scope="column">Id</th>
                        <th scope="column">Category Name</th>
                        <th scope="column"></th>
                        <th scope="column"></th>
                        <th scope="column"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.map(category => (
                            <CategoryTableBody id={category.id} name={category.name} />
                        ))
                    }
                </tbody>
            </div>
        </>
    );
}

export default Categories;