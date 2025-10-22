import { useOwnedItems } from "../../../api/itemApi";
import ProfileItem from "../profile-item/ProfileItem";
import classes from "./ProfileProducts.module.css";

    export default function ProfileProducts() {
        const  { ownedItems , isPending}  = useOwnedItems();
        return (
            <>
            <section className={classes.created_items}>
                    <h3>Added TVs</h3>
                    <div className={classes.items_list}>
                        { ownedItems.length >0 ?
                            ownedItems.map( item => 
                                <ProfileItem key={item._id} item={item} />
                            ) 
                                
                        :
                        <p className={classes.no_post}>You haven&apos;t added a Tv yet</p>
                        }
                    </div>
            </section>
            </>
        );
    }