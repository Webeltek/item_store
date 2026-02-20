import { useDeleteItem, useItem, useOrderItem } from "../../api/itemApi";
import CommentsCreate from "../comments-create/CommentsCreate";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useComments } from "../../api/commentApi";
import { fromIsoDateString } from "../../utils/fromIsoDateString.js";
import classes from './ItemDetails.module.css'
import './ItemDetails.scss'
import { Breadcrumbs, Button, Title } from "@mantine/core";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";

const imagesUrl = import.meta.env.VITE_IMAGES_URL;

const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <button
      className={`${className} custom-arrow prev-arrow`}
      onClick={onClick}
      aria-label="Previous slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
};

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <button
      className={`${className} custom-arrow next-arrow`}
      onClick={onClick}
      aria-label="Next slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
};

export default function ItemDetails({
  imageSize = { width: 600, height: 600 },
  thumbnailSize = { width: 100, height: 100 },
}) {
    // const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { email, _id: userId, username, isAuthenticated } = useAuth();
    const { itemId } = useParams();
    const { deleteItem } = useDeleteItem();
    const { item, setItem } = useItem(itemId);
    const { orderItem } = useOrderItem();
    const { comments, addComment } = useComments(itemId);

    const isOwner = userId === item?.owner;
    const isOrdered = item?.orderList?.some( orderUserId =>
        orderUserId === userId
    )

    const itemDeleteHandler = async ()=>{
        const hasConfirm =  confirm(`Are you sure you want to delete ${item?.name} `);
        if (!hasConfirm){
            return;
        }
        try {
            const updatedItems = await deleteItem(itemId);
            
            navigate('/items',{ state: {items: updatedItems} });
        } catch (error) {
            console.log(error);
            
        }
    }

    const itemOrderHandler = async ()=> {
        if(isOrdered){
            return;
        }
        try {
            const orderedItem = await orderItem(itemId);
            setItem(orderedItem);
        } catch (error) {
            console.log(error);
            
        }
    }

    const commentCreateHandler = ( newComment )=>{
        // console.log({newComment});
        addComment( newComment );
    }

    const mainSliderSettings = {
    dots: item?.images?.length > 1,
    dotsClass: 'slick-dots slick-thumb',
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: item?.images?.length > 1,
    fade: false,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    // beforeChange: (current, next) => setCurrentSlideIndex(next),
    customPaging: function (i) {
      return (
        <div className="thumbnail-wrapper">
          <img
            src={item?.images[i]?.url}
            alt={`Thumbnail ${i + 1}`}
            width={thumbnailSize.width}
            height={thumbnailSize.height}
            className="object-contain"
          />
        </div>
        );
        }
    };

    const breadcrumbsItems = [
        { title: "Home", href: "/" },
        { title: "Catalog", href: "/items" },
        { title: item?.name || "Item Details", href: location.pathname }
    ];

    return (
        <>
        {/* <Title classNames={ {root: classes.detailsTitle }} c="gray.5" ta="center" order={2}>Details</Title> */}
        <Breadcrumbs c="gray.8" my="md">{breadcrumbsItems.map((item, index) => (
            <Link className="hover:text-emerald-700" key={index} to={item.href}>{item.title}</Link>
        ))}</Breadcrumbs>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            <section className="product-media-container">     
                <div className="main-image-container">
                    {item?.images?.length > 0 && (
                        <Slider  {...mainSliderSettings}
                        className="product-slider">
                        {item.images.map((image, index) => (
                            <div key={index}
                            className="product-image" 
                            style={{ width: imageSize.width, height: imageSize.height }}>
                                <img className="object-scale-down"  src={image.url} alt="Item"
                                width={imageSize.width} height={imageSize.height}
                                sizes="(min-width: 1300px) 306px, (min-width: 1010px) 316px, (min-width: 768px) 33vw, (min-width: 480px) 50vw, 100vw" />
                            </div>
                        ))}
                        </Slider>
                    )}
                
                </div>
            </section>    
            <section className="text-gray-700 leading-12">
                <Title order={3} mb="lg"> {item?.name}</Title>
                <p><strong>SKU:</strong> modify 231212</p>
                <p><strong>In Stock:</strong> {item?.stock}</p>
                <p><strong>Price:</strong> ${item?.price}</p>
                <p><strong>Added:</strong> {fromIsoDateString(item?.created_at) }</p>
                { email && 
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        { isOwner 
                        ?
                            <>
                                <Button component={Link}  to={`/items/${item._id}/edit`}>Edit</Button>
                                <Button component={Link} color="var(--color-red-400)" onClick={itemDeleteHandler}>Delete</Button>
                            </>    
                        :  
                        isOrdered ?
                            <p className="prefer-message">You&apos;ve already ordered this device</p>
                            :
                            <button className="btn prefer" onClick={itemOrderHandler}>Order</button>
                        }
                    </div>
                }    
            </section>
            <section className={classes.productDescription}>
                <Title classNames={ {root: classes.detailsTitleDescription }} c="gray.7"  order={3}>Description</Title>
                <p>{item?.description}</p>
            </section>
            {/* <section className="col-span-full">        
            { comments.length > 0 
            ? comments.map( msg => (
                <div key={msg._id} className="comment">
                    <section className="header">
                        <p>
                            <span><strong>{msg.authorId?._id === item.owner?._id ? 'Owner:': ''} </strong></span>
                            <span>{msg.authorId?.username}</span> posted on <time>{fromIsoDateString(msg.created_at) }</time>
                        </p>
                    </section>
                    <div className="comment-main">
                        <div className="post-content">
                            <p>{msg.text}</p>
                        </div>
                    </div>
                </div>
                )
                )
            : <p>No comments.</p>    
            }
            { isAuthenticated 
            &&  
            <CommentsCreate 
            email={email}
            itemId={itemId}
            username={username}
            onCreate={commentCreateHandler} /> 
            }
            </section> */}
        </div>
        
        </>
    );
}