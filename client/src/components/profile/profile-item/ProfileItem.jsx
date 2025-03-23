import { Link } from "react-router-dom";
import './ProfileItem.css'

const  IMAGES_URL = import.meta.env.VITE_IMAGES_URL;

export default function ProfileItem({
    item
}) {
    return (
        <div key={item._id} className="tv-item">
            { item.imageFile &&
                <img src={`${IMAGES_URL}/${item.imageFile}`} alt="Phone" />
            }
            <img src={item.image}
                alt="Laptop" />
            <p><strong>Price:</strong> {item.price}</p>
            <p><strong>Model:</strong> {item.model}</p>
            <Link to={`/items/${item._id}/details`} className="btn">View Details</Link>
        </div>
    );
}