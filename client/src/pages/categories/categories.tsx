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

    const onClick = (categoryId: number): React.MouseEventHandler<HTMLButtonElement> => () => {
        console.log(categoryId);
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
                <thead>
                    <tr>
                        <th scope="column">Id</th>
                        <th scope="column">Category Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td><input type="text" value={category.name} disabled={true} />{}</td>
                                <button onClick={onClick(category.id)}>Delete</button>
                                <button onClick={onClick(category.id)}>Update Name</button>
                            </tr>
                        ))
                    }
                </tbody>
            </div>
        </>
    );
}

export default Categories;