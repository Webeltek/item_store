import { Link } from "react-router-dom";

const  IMAGES_URL = import.meta.env.VITE_IMAGES_URL;

export default function ProfileItem({
    item
}) {
    return (
        <div className="group w-full px-2 md:w-1/3 xl:w-1/4">
            <div className="overflow-hidden bg-white shadow-md rounded-xl duration-500 group-hover:shadow-xl">
              <Link to={`/items/${item._id}/details`}>
                { item.imageFile &&
                    <img className="w-full aspect-4/3 object-center object-cover" src={`${IMAGES_URL}/${item.imageFile}`} alt="image"  />
                }
                <img className="w-full aspect-4/3 object-center object-cover" src={item.image}
                    alt="" />
                <div className="h-1/2 p-4 sm:p-9 md:p-7 xl:p-9 duration-500 group-hover:bg-gray-100">
                  <h3 className="mb-4 block text-xl font-semibold text-gray-900 group-hover:text-blue-600 sm:text-[22px] md:text-xl lg:text-[22px] xl:text-xl 2xl:text-[22px]">
                      {item.model}
                  </h3>  
                  <h3 className="mb-4 block text-xl font-semibold text-gray-900 group-hover:text-blue-600 sm:text-[22px] md:text-xl lg:text-[22px] xl:text-xl 2xl:text-[22px]">
                      {item.price} $
                  </h3>
                  <p
                    className="mb-7 text-base leading-[1.65] text-slate-500"
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            </div>
        </div>
    );
}