import { Link } from "react-router-dom";
import './CatalogItem.css'

const imagesUrl = import.meta.env.VITE_IMAGES_URL;

export default function CatalogItem({
    imageFile,
    image,
    model,
    price,
    description,
    screenSize,
    _id
}) {
    return (
        <div className="product-item">
            { imageFile &&
                <img src={`${imagesUrl}/${imageFile}`} alt="Phone" />
            }
            <img src={image} />
            <h3>{model}</h3>
            <h2>${price}</h2>
            <p>Description: {description}</p>
            <p>Screen: {screenSize} inch</p>
            <Link to={`/items/${_id}/details`} className="btn">View Details</Link>
        </div>
    );
}