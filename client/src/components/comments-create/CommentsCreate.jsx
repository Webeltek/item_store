import { useState } from "react";
import { useCreateComment } from "../../api/commentApi";
import './CommentsCreate.css'
import { useForm } from "react-hook-form";

export default function CommentsCreate({
    email,
    username,
    itemId,
    onCreate
}) {
    const { create } = useCreateComment();
    const [pending, setPending] = useState(false);
    const { register, handleSubmit, formState: { errors },} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const commentAction = async (data) => {
        const { postText} = data;
        try {
            setPending(true);
            const createdComment = await create( itemId, postText);
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
                <form  action={handleSubmit(commentAction)}>
                    <textarea
                        // className={ hasValidErr ? 'input-error' : ''}
                        name="postText" 
                        id="comment" 
                        cols="20" 
                        rows="5"
                        {...register('postText',{
                            required: 'Comment is required!',
                            minLength: {
                                value: 10,
                                message: 'Comment must be at least 10 characters!'
                            }
                        })}
                    ></textarea>
                    { errors.postText && 
                        <div>
                                <p className="error">
                                    {errors.postText.message}
                                </p>
                        </div>
                    }
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