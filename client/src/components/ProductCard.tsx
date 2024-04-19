type ProductCardProps = {
    name:string;
    price: number;
};

export default function ProductCard({name, price}: ProductCardProps) {
    return (
        <div>
            <div>
                <img src="" alt="" />
            </div>
            <div>
                <div>
                    <span>{name}</span> 
                </div>
                <div>
                    <span>{price}</span>
                </div>
            </div>
        </div>
    );
}