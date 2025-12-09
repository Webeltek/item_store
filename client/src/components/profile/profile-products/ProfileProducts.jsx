import { useOwnedItems } from "../../../api/itemApi";
import ProfileItem from "../profile-item/ProfileItem";

    export default function ProfileProducts() {
        const  { ownedItems , isPending}  = useOwnedItems();
        return (
            <>
            <section className="bg-gray-100 pb-10 pt-4 lg:pb-20 lg:pt-[1rem]">
                <h3 className="text-center text-[2rem] pb-4 uppercase relative
                 after:content-[&quot;&quot;] after:bg-sky-600 after:w-12 after:h-1 
                 after:absolute after:-translate-x-1/2 after:left-1/2 after:bottom-3">My products</h3>
                    <div className="container mx-auto">
                        <div className="flex justify-center gap-y-4 flex-wrap">
                                    { ownedItems.length >0 ?
                                        ownedItems.map( item => 
                                            <ProfileItem key={item._id} item={item} />
                                        ) 
                                            
                                    :
                                    <p className="flex justify-center">You haven&apos;t added a Tv yet</p>
                                    }
                        </div>
                    </div>        
            </section>
            </>
        );
    }