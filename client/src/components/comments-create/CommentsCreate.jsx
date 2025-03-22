import { useCreateComment } from "../../api/commentApi";
import './CommentsCreate.css'

export default function CommentsCreate({
    email,
    username,
    itemId,
    onCreate
}) {
    const { create } = useCreateComment();

    const commentAction = async (formData) => {
        const comment = formData.get('postText');

        const createdComment = await create( itemId, comment);

        onCreate(createdComment);
    }

    return (
        <div className="answer-comment">
            <p><span>{username}</span> comment:</p>
            <div className="answer">
                <form  action={commentAction}>
                    <textarea
                        // className={ hasValidErr ? 'input-error' : ''}
                        name="postText" 
                        id="comment" 
                        cols="20" 
                        rows="5"
                    ></textarea>
                        <div>
                                <p className="error">
                                    Comment is required!
                                </p>
                                <p className="error">
                                    Comment must be at least 10 characters!
                                </p>
                        </div>
                    <button 
                        // disabled={ hasValidErr} 
                        className="btn"
                        style={ {
                                //backgroundColor: hasValidErr ? 'grey':'#0073e6'
                            } }
                        >
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
}