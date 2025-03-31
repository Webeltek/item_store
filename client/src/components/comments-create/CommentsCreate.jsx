import { useState } from "react";
import { useCreateComment } from "../../api/commentApi";
import './CommentsCreate.css'

export default function CommentsCreate({
    email,
    username,
    itemId,
    onCreate
}) {
    const { create } = useCreateComment();
    const [pending, setPending] = useState(false);

    const commentAction = async (formData) => {
        const comment = formData.get('postText');
        try {
            setPending(true);
            const createdComment = await create( itemId, comment);
            setPending(false);
            onCreate(createdComment);
        } catch (error) {
            setPending(false);
        }

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
                        disabled={ pending} 
                        className="btn"
                        style={ {
                                backgroundColor: pending ? 'grey':'#0073e6'
                            } }
                        >
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
}