import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import '../../pages/Products/Products.css';
import { deleteProduct, getProducts, updateProduct } from "../../store/productsSlice";

type ProductTableBodyProps = {
    id: number;
    name: string;
    quantity: number;
    description: string;
    price: number;
}

export default function ProductTableBody({ id, name, quantity, description, price }: ProductTableBodyProps) {
    const [disableInput, setdisableInput] = useState(true);
    const [updateButtonName, setUpdateButtonName] = useState('Update Name');
    const [productName, setProductName] = useState(name);
    const [productQuantity, setProductQuantity] = useState(quantity);
    const [productDescription, setProductDescription] = useState(description);
    const [productPrice, setProductPrice] = useState(price);
    const [hideSpanMessage, setHideSpanMessage] = useState(true);

    const dispatch:AppDispatch = useDispatch();

    const onChangeProductname = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setProductName(value);
    };
    const onChangeProductQuantity = (e: ChangeEvent<HTMLInputElement>) => {
        const value= parseInt(e.target.value);
        setProductQuantity(value);
    };
    const onChangeProductDescription = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setProductDescription(value);
    };
    const onChangeProductPrice = (e: ChangeEvent<HTMLInputElement>) => {
        const value= parseInt(e.target.value);
        setProductPrice(value);
    };
    
    const onClickDelete = (id:number): React.MouseEventHandler<HTMLButtonElement> => () => {
        dispatch(deleteProduct(id)).then(() => {
            dispatch(getProducts());
        });
    };
    
    const handleUpdateButtonClick = () => {
        if (updateButtonName === 'Submit Changes' && productName !== '' && productName !== name) {
            dispatch(updateProduct(id, {
                name: productName,
                quantity: productQuantity,
                description: productDescription,
                price: productPrice
            })).then(() => {
                dispatch(getProducts());
                setUpdateButtonName('Update Name');
                setdisableInput(true);
                setHideSpanMessage(true);
            });
        }
        if (updateButtonName === 'Submit Changes' && productName === '') {
            setHideSpanMessage(false);
            setdisableInput(false);
        } else {
            setUpdateButtonName(updateButtonName === 'Update Name' ? 'Submit Changes' : 'Update Name');
            setdisableInput(!disableInput);
            setHideSpanMessage(true);
        }
    };
    
    useEffect(() => {
        setProductName(name);
    }, [name]);

    return (
            <tr key={id}>
                <td className="id-box">{id}</td>
                <td className="name-box">
                    <input 
                        type="text" 
                        value={productName} 
                        disabled={disableInput} 
                        onChange={onChangeProductname}
                    />
                </td>
                <td className="quantity-box">
                    <input 
                        type="text" 
                        value={productQuantity} 
                        disabled={disableInput} 
                        onChange={onChangeProductQuantity}
                    />
                </td>
                <td className="description-box">
                    <input 
                        type="text" 
                        value={productDescription} 
                        disabled={disableInput} 
                        onChange={onChangeProductDescription}
                    />
                </td>
                <td className="price-box">
                    <input 
                        type="text" 
                        value={productPrice} 
                        disabled={disableInput} 
                        onChange={onChangeProductPrice}
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