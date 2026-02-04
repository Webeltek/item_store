import { Link } from "react-router-dom";

const IMAGES_URL = import.meta.env.VITE_IMAGES_URL;

export default function CatalogItem({
    imageFile,
    image,
    images,
    name,
    price,
    description,
    _id
}) {
    return (
        <>
        <div className="group px-2 w-full md:w-1/3 xl:w-1/4">
          <div className="overflow-hidden bg-white shadow-md rounded-xl duration-500 group-hover:shadow-xl">
            <Link to={`/items/${_id}/details`}>
                { imageFile &&
                    <img className="w-full h-full object-center object-cover" 
                    src={`${IMAGES_URL}/${imageFile}`} alt="image"  />
                }
                <img className="w-full aspect-4/3 object-center object-cover"
                sizes="(min-width: 1300px) 306px, (min-width: 1010px) 316px, (min-width: 768px) 33vw, (min-width: 480px) 50vw, 100vw" 
                src={image ? image : images && images.length > 0 ? images[0].url :''} 
                    alt="" />
              <div className="h-1/2 p-4 sm:p-9 md:p-7 xl:p-9 duration-500 group-hover:bg-gray-100">
                <h3 className="text-base font-semibold
                 text-gray-900 group-hover:text-blue-600 ">
                    {price} $
                </h3>
                <h3 className="line-clamp-1 text-base font-semibold
                 text-gray-900 group-hover:text-blue-600 ">
                    {name}
                </h3>
                <p
                  className="line-clamp-2 text-base leading-[1.65] text-slate-500"
                >
                  {description}
                </p>
              </div>
            </Link>
          </div>
          </div>
            </>    
    );
}