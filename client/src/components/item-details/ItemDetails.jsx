import { useDeleteItem, useItem, useOrderItem } from "../../api/itemApi";
import CommentsCreate from "../comments-create/CommentsCreate";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useComments } from "../../api/commentApi";
import './ItemDetails.css'

const imagesUrl = import.meta.env.VITE_IMAGES_URL;

export default function ItemDetails() {
    const navigate = useNavigate();
    const { email, _id: userId, username } = useAuth();
    const { itemId } = useParams();
    const { deleteItem } = useDeleteItem();
    const { item, setItem } = useItem(itemId);
    const { orderItem } = useOrderItem();
    const { comments, setComments } = useComments(itemId);

    const isOwner = userId === item.owner?._id;
    const isOrdered = item.orderList?.some( orderUserId =>
        orderUserId === userId
    )

    const itemDeleteHandler = async ()=>{
        const hasConfirm =  confirm(`Are you sure you want to delete ${item.model} `);
        if (!hasConfirm){
            return;
        }
        await deleteItem(itemId);
        navigate('/items');
    }

    const itemOrderHandler = async ()=> {
        if(isOrdered){
            return;
        }
        const orderedItem = await orderItem(itemId);
        setItem(orderedItem);
    }

    const commentCreateHandler = ( newComment )=>{
        // console.log({newComment});
        
        setComments( state => [...state, newComment]);
    }

    return (
        <>

        <section className="details-hero">
            <div className="container">
                <h2>Tv Details</h2>
            </div>
        </section>

        <section className="details-content">
            <div className="container">
                <div className="product-details">
                    <p>Created: {item.created_at }</p>
                    <div className="product-image">
                        { item.imageFile &&
                            <img src={`${imagesUrl}/${item.imageFile}`} alt="Phone" />
                        }
                        <img src={item.image} alt="Tv"/>
                    </div>
                    <div className="product-info">
                        <h3>Model: {item.model}</h3>
                        <p><strong>Screen Size:</strong> {item.screenSize} inches</p>
                        <p><strong>Price:</strong> ${item.price}</p>
                        <p><strong>Description:</strong> {item.description}</p>
                    </div>
                </div>
                { email && 
                    <div className="product-actions">
                        { isOwner 
                        ?
                            <>
                                <button className="btn edit"><Link to={`/items/${item._id}/edit`}>Edit</Link></button>
                                <button className="btn delete" onClick={itemDeleteHandler}>Delete</button>
                            </>    
                        :  
                        isOrdered ?
                            <p className="prefer-message">You&apos;ve already ordered this device</p>
                            :
                            <button className="btn prefer" onClick={itemOrderHandler}>Order</button>
                        }
                    </div>
                }    
                    
                { comments.length > 0 
                ? comments.map( msg => (
                    <div key={msg._id} className="comment">
                        <section className="header">
                            <p>
                                <span><strong>{msg.authorId?._id === item.owner?._id ? 'Owner:': ''} </strong></span>
                                <span>{msg.authorId?.username}</span> posted on <time>{msg.created_at }</time>
                            </p>
                        </section>
                        <div className="comment-main">
                            <div className="userdetails">
                                <img src="/profile.png" alt="avatar" />
                            </div>
                            <div className="post-content">
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    </div>
                    )
                    )
                : <p>No comments.</p>    
                }
                { email 
                &&  
                <CommentsCreate 
                email={email}
                itemId={itemId}
                username={username}
                onCreate={commentCreateHandler} /> 
                }
            </div>
        </section>
        
        </>
    );
}