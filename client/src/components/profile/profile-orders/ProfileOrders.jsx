import { useOrderedItems } from "../../../api/itemApi";
import ProfileItem from "../profile-item/ProfileItem";
import classes from "./ProfileOrders.module.css";

export default function ProfileOrders() {
    const { orderedItems } = useOrderedItems();
    return (
        <>
        <section className={classes.ordered_items}>
                <h3>My Orders</h3>
                <div className={classes.items_list}>
                    { orderedItems.length >0 ?
                        orderedItems.map( item => 
                            <ProfileItem key={item._id} item={item} />
                        ) 
                    :
                    <p className="no-post">You haven&apos;t ordered any food yet</p>
                    }
                </div>
        </section>
        </>
    );
}