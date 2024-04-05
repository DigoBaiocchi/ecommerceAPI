import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/header";
import { AppDispatch } from "../../store/store";
import { addCategory, deleteCategory, getCategories, selectCategories, updateCategory } from "../../store/categoriesSlice";
import { SetStateAction, useEffect, useState } from "react";

function Categories() {
    const dispatch:AppDispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const [categoryName, setCategoryName] = useState('');
    const [triggerRefetch, setTriggerRefetch] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(true);
    const [editedCategory, setEditedCategory] = useState<{ [key: number]: string }>({});
    const [editButtonName, setEditButtonName] = useState('Update Name');

    const onChangeCategoryname = (e: { target: { value: SetStateAction<string>; }; }) => {
        setCategoryName(e.target.value);
    };

    const onSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        dispatch(addCategory(categoryName)).then(() => {
            setTriggerRefetch(true);
        });
    };
    
    const onClickDelete = (categoryId: number): React.MouseEventHandler<HTMLButtonElement> => () => {
        dispatch(deleteCategory(categoryId)).then(() => {
            setTriggerRefetch(true);
        });;
    };
    
    const onClickUpdate = (categoryId: number): React.MouseEventHandler<HTMLButtonElement> => () => {
        setInputDisabled(!inputDisabled);
        if (editButtonName === 'Submit Change') {
            dispatch(updateCategory(categoryId, editedCategory[categoryId])).then((response) => {
                console.log(response)
            });
            setEditButtonName('Update Name');
        } else {
            setEditButtonName('Submit Change');
        }
        console.log(editedCategory);
    };

    const handleChangeName = (categoryId:number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEditedCategory((prev) => ({
            ...prev,
            [categoryId]: value
        }));
    }
    
    useEffect(() => {
        dispatch(getCategories());
        setTriggerRefetch(false);
    }, [triggerRefetch]);

    return (
        <>
            <Header />
            <form onSubmit={onSubmit}>
                <label htmlFor="category-name">Category Name</label>
                <input 
                    type="text" 
                    id="category-name" 
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
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>
                                    <input 
                                        type="text" 
                                        value={editedCategory[category.id] !== undefined ? 
                                            editedCategory[category.id] : 
                                            category.name} 
                                        disabled={inputDisabled} 
                                        onChange={handleChangeName(category.id)}
                                    />
                                </td>
                                <button onClick={onClickDelete(category.id)}>Delete</button>
                                <button 
                                    onClick={onClickUpdate(category.id)} 
                                    value={editButtonName}>
                                        {editButtonName}
                                </button>
                            </tr>
                        ))
                    }
                </tbody>
            </div>
        </>
    );
}

export default Categories;