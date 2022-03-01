const $id = (el) => document.getElementById(el);

const $commentContainer = $id('commentContainer');
const $modalDelete = $id('modalDelete');
let editingComment=undefined;


const addObservation = () =>{
    const cb = (entries) =>{
        entries.forEach(el=>{
            if(el.isIntersecting) el.target.classList.add('commentSeen')
            else el.target.classList.remove('commentSeen')
        })
    }
    const allComents = Array.from($commentContainer.children);
    const observer = new IntersectionObserver(cb,{threshold:.7})
    allComents.forEach(el=>{
        observer.observe(el);
    })
} 





$commentContainer.addEventListener('click',(e)=>{
    const parentComment = e.target.closest('.comment') || e.target.closest('.reply');
    const actions = {
        "upvote":()=>{
            const count = e.target.parentNode.querySelector('.comment__votes--count');
            count.textContent = Number(count.textContent)+1;
        },
        "lessvote":()=>{
            const count = e.target.parentNode.querySelector('.comment__votes--count');
            count.textContent = Number(count.textContent)-1;
        },
        "delete":()=>{
            $modalDelete.classList.add('active');
            $modalDelete.addEventListener('click',(e)=>{
                if(e.target.textContent.includes('Yes')) $commentContainer.removeChild(parentComment);
                $modalDelete.classList.remove('active');
            })
            
        },
        "reply":()=>{
            
            $postComment.dataset.operation="reply"
            $postComment.dataset.replyTo = parentComment.querySelector('.comment__author').textContent;
            $postComment.querySelector('.postComment__comment').placeholder = `replying to @${$postComment.dataset.replyTo}`;
        },
        "edit":()=>{
            $postComment.dataset.operation="edit";
            editingComment=parentComment;
            $postComment.querySelector('.postComment__comment').placeholder = `editing a comment...`;
            
        }
    }
    if(actions[e.target.dataset.operation]) actions[e.target.dataset.operation]();
})



const $postComment = $id('postComment');

$postComment.addEventListener('submit',(e)=>{
    e.preventDefault();
    const commentContent = $postComment.querySelector('.postComment__comment');
    const commentTemplate = $id('commentTemplate').content;
    if($postComment.dataset.operation==="post" && commentContent.value!==""){
            const cloneCommentTemplate = commentTemplate.cloneNode(true);

            cloneCommentTemplate.querySelector('.comment__content').textContent=commentContent.value;
            $commentContainer.append(cloneCommentTemplate);
            commentContent.value="";
    
    }
    else if($postComment.dataset.operation==="reply" && commentContent.value!==""){
        const cloneReplyTemplate = commentTemplate.cloneNode(true);
        const reply = cloneReplyTemplate.querySelector('.comment');
        const span = document.createElement('span');
        span.classList.add('comment__replyTo');
        span.textContent = `@${$postComment.dataset.replyTo} `;
        reply.classList.add('reply');
        reply.classList.remove('comment');
        cloneReplyTemplate.querySelector('.comment__content').textContent = commentContent.value;
        cloneReplyTemplate.querySelector('.comment__content').prepend(span);
        $commentContainer.append(cloneReplyTemplate);
        commentContent.value="";
        $postComment.dataset.operation="post";
        $postComment.removeAttribute('data-replyTo');
        $postComment.querySelector('.postComment__comment').placeholder = `Add a comment...`;
    }
    else if($postComment.dataset.operation==="edit" && commentContent.value!==""){
        const parent = editingComment;
        const span = parent.querySelector('.comment__replyTo');
        const editContent = parent.querySelector('.comment__content');
        editContent.textContent = `${commentContent.value}`;
        editContent.prepend(span ||"");
        $postComment.dataset.operation="post";
        editingComment=undefined;
        commentContent.value="";
        $postComment.querySelector('.postComment__comment').placeholder = `Add a comment...`;
    }
    addObservation();
})




window.addEventListener('DOMContentLoaded',()=>{
    addObservation();
})