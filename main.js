const $id = (el) => document.getElementById(el);

const $commentContainer = $id('commentContainer');
const $modalDelete = $id('modalDelete');
const commentTemplate = $id('commentTemplate').content;


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
                if(e.target.textContent.includes('Yes')) $commentContainer.removeChild(parentComment) || "";
                $modalDelete.classList.remove('active');
            })
            
        },
        "reply":()=>{
            const replyTemplate = document.getElementById('replyTemplate').content;
            const replyTemplateClone = replyTemplate.cloneNode(true);
            const commentElement = replyTemplateClone.querySelector('.postComment');
            const commentContent = commentElement.querySelector('.postComment__comment');
            const cancleBtn = replyTemplate.querySelector('postComment__cancel');
            if(parentComment.classList.contains('reply')) commentElement.classList.add('replytoreply')
            const commentToInsertBefore = parentComment.nextSibling;
            $commentContainer.insertBefore(replyTemplateClone,commentToInsertBefore);
            commentElement.addEventListener('submit',(e)=>{
                e.preventDefault();
                const cloneReplyTemplate = commentTemplate.cloneNode(true);
                const reply = cloneReplyTemplate.querySelector('.comment');
                const span = document.createElement('span');
                span.classList.add('comment__replyTo');
                span.textContent = `@${parentComment.querySelector('.comment__author').textContent} `;
                reply.classList.add('reply');
                reply.classList.remove('comment');
                cloneReplyTemplate.querySelector('.comment__content').textContent = commentContent.value;
                cloneReplyTemplate.querySelector('.comment__content').prepend(span);
                $commentContainer.replaceChild(cloneReplyTemplate,commentElement);
                addObservation();
            })
            cancleBtn.addEventListener('click',()=>{
                $commentContainer.removeChild(replyTemplateClone)
            })

        },
        "edit":()=>{
            const wrapper = parentComment.querySelector('.comment__wrapper');
            const textArea = document.createElement('textarea');
            const commentContent = wrapper.querySelector('.comment__content');
            const mention = parentComment.querySelector('.comment__replyTo');
            const userInfo = wrapper.querySelector('.comment__userInfo');
            const putButton = document.createElement('button');
            const userInteract = userInfo.querySelector('.comment__votes--replybtn');
            putButton.classList.add('putButton');
            putButton.textContent = 'update';
            if(mention) commentContent.removeChild(mention)
            textArea.classList.add('comment__content');
            textArea.value = commentContent.textContent.trim();
            wrapper.replaceChild(textArea,commentContent);
            userInfo.replaceChild(putButton,userInteract);

            putButton.addEventListener('click',()=>{
                commentContent.textContent = textArea.value;
                commentContent.prepend(mention || "");
                wrapper.replaceChild(commentContent,textArea);
                userInfo.replaceChild(userInteract,putButton)
            })
            
            
        }
    }
    if(actions[e.target.dataset.operation]) actions[e.target.dataset.operation]();
})



const $postComment = $id('postComment');

$postComment.addEventListener('submit',(e)=>{
    e.preventDefault();
    const commentContent = $postComment.querySelector('.postComment__comment');
    if(commentContent.value!==""){
            const cloneCommentTemplate = commentTemplate.cloneNode(true);

            cloneCommentTemplate.querySelector('.comment__content').textContent=commentContent.value;
            $commentContainer.append(cloneCommentTemplate);
            commentContent.value="";
    
    }
    addObservation();
})




window.addEventListener('DOMContentLoaded',()=>{
    addObservation();
})