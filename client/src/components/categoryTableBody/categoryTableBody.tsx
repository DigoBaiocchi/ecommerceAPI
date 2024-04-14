import { SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCategory, getCategories, updateCategory } from "../../store/categoriesSlice";
import { AppDispatch } from "../../store/store";
import '../../pages/Categories/Categories.css';

type CategoryTableBodyProps = {
    id: number;
    name: string;
}

export default function CategoryTableBody({ id, name }: CategoryTableBodyProps) {
    const [disableInput, setdisableInput] = useState(true);
    const [updateButtonName, setUpdateButtonName] = useState('Update Name');
    const [categoryName, setCategoryName] = useState(name);
    const [hideSpanMessage, setHideSpanMessage] = useState(true);

    const dispatch:AppDispatch = useDispatch();

    const onChangeCategoryname = (e: { target: { value: SetStateAction<string>; }; }) => {
        const { value } = e.target;
        setCategoryName(value);
    };
    
    const onClickDelete = (id:number): React.MouseEventHandler<HTMLButtonElement> => () => {
        dispatch(deleteCategory(id)).then(() => {
            dispatch(getCategories());
        });
    };
    
    const handleUpdateButtonClick = () => {
        if (updateButtonName === 'Submit Changes' && categoryName !== '' && categoryName !== name) {
            dispatch(updateCategory(id, {name: categoryName})).then(() => {
                dispatch(getCategories());
                setUpdateButtonName('Update Name');
                setdisableInput(true);
                setHideSpanMessage(true);
            });
        }
        if (updateButtonName === 'Submit Changes' && categoryName === '') {
            setHideSpanMessage(false);
            setdisableInput(false);
        } else {
            setUpdateButtonName(updateButtonName === 'Update Name' ? 'Submit Changes' : 'Update Name');
            setdisableInput(!disableInput);
            setHideSpanMessage(true);
        }
    };
    
    useEffect(() => {
        setCategoryName(name);
    }, [name]);

    return (
            <tr key={id}>
                <td className="id-box">{id}</td>
                <td className="name-box">
                    <input 
                        type="text" 
                        value={categoryName} 
                        disabled={disableInput} 
                        onChange={onChangeCategoryname}
                    />
                </td>
                <button onClick={onClickDelete(id)}>Delete</button>
                <button 
                    onClick={handleUpdateButtonClick} 
                    value={updateButtonName}>
                        {updateButtonName}
                </button>
                <span 
                    hidden={hideSpanMessage}
                    >Category name can't be blank!
                </span>
            </tr>
                
    );
}