const uModule = function () {

    function getElem(id, parent = document) {
        if (typeof id != "string") {
            id.toString()
        }
        return parent.querySelector(`#${id}`)
    }

    function getElems(cls, parent = document) {
        return parent.getElementsByClassName(cls)
    }

    const elems = {
        postModal: getElem("new-post-modal"),
        deletePostModal: getElem("delete-post-modal"),
        postSubmitBtn: getElem("post-submit-button"),
        postDeleteBtn: getElem("post-delete-button"),
        deletePostModal: getElem("delete-post-modal"),
    }


    function renderPosts(posts, reload = false) {
        return new Promise(
            function(resolve, reject){
                //
                try {
                    const postsElem = getElem("posts")
                    if (reload) {
                        postsElem.innerHTML = ""
                    }
            
                    for (let post of posts) {
                        const ownPost = posts.currentUserId === post.author.id
                        renderPost(post, ownPost)
                    }
                    resolve(true)
                } catch (error) {
                    reject(error)
                }
            }
        )
    }


    function renderPost(post, ownPost=false) {
        return new Promise(function (resolve, reject) {
            try {
                const template = getElem("post-template")
                const postElem = template.content.cloneNode(true)
                
                if (ownPost){
                    getElem("edit-post" , postElem).classList.remove("d-none")
                    getElem("delete-post" , postElem).classList.remove("d-none")
                }else{
                    getElem("edit-post" , postElem).classList.add("d-none")
                    getElem("delete-post" , postElem).classList.add("d-none")
                }

                getElem("profile-image", postElem).src = typeof post.author.profile_image === "object" ? "" : post.author.profile_image
                getElem("username", postElem).textContent = `@${post.author.username}`
                getElem("post-image", postElem).src = typeof post.image === "object" ? "" : post.image
                getElem("created-at", postElem).textContent = post.created_at
                getElem("title", postElem).textContent = post.title ? post.title : ""
                getElem("body", postElem).textContent = post.body
                getElem("comments-count", postElem).textContent = `(${post.comments_count}) comment`
                for (let tag of post.tags) {
                    const tagElem = document.createElement("span")
                    tagElem.textContent = tag
                    getElem("tags", postElem).appendChild(tagElem)
                }
                //

                // cloneNode return element which has no parent so we should create a parent and append it to it in order to give it an id.
                const postElemWrapper = document.createElement("div")
                postElemWrapper.id = post.id
                postElemWrapper.setAttribute("user-id", post.author.id) 
                postElemWrapper.classList.add("post")

                postElemWrapper.appendChild(postElem)
                getElem("posts").append(postElemWrapper)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }


    //copy
    function renderComments(comments) {
        const commentsElem = getElem("comments")
        commentsElem.innerHTML = ""
        for (let comment of comments) {
            renderComment(comment, commentsElem)
        }
    }


    function renderComment(comment, parent) {
        const template = getElem("comment-template")

        const commentElem = template.content.cloneNode(true)

        getElem("commenter-profile-image", commentElem).src = typeof comment.author.profile_image === "object" ? "" : comment.author.profile_image
        getElem("commenter-username", commentElem).textContent = `@${comment.author.username}`
        getElem("comment-body", commentElem).textContent = comment.body
        //

        // cloneNode return element which has no parent so we should create a parent and append it to it in order to give it an id.
        const commentElemWrapper = document.createElement("div")
        commentElemWrapper.id = comment.id
        commentElemWrapper.classList.add("comment")

        commentElemWrapper.appendChild(commentElem)
        parent.append(commentElemWrapper)
    }

    //
    function getLoginInputs() {
        const username = getElem("username-input").value
        const password = getElem("password-input").value

        return {
            username: username,
            password: password
        }
    }


    function setPostInputs(title, body, postId){
        getElem("new-post-title-input").value = title
        getElem("new-post-body-input").value = body
        getElem("new-post-modal").setAttribute("post-id", postId)
    }


    function getRegisterInputs() {
        //
        const name = getElem("register-name-input").value
        const username = getElem("register-username-input").value
        const password = getElem("register-password-input").value
        const image = getElem("register-profile-image").files.length > 0 ? getElem("register-profile-image").files[0] : null

        const formData = new FormData()

        formData.append("name", name)
        formData.append("username", username)
        formData.append("password", password)
        if (image) {
            formData.append("image", image)
        }
        console.log(Object.fromEntries(formData))
        return formData
        //
    }

    function getPostModalInputs() {
        const image = getElem("new-post-image").files.length > 0 ? getElem("new-post-image").files[0] : null
        const body = getElem("new-post-body-input").value
        const title = getElem("new-post-title-input").value

        const formData = new FormData()
        if (image) {
            formData.append("image", image)
        }
        formData.append("body", body)
        formData.append("title", title)
        console.log(Object.fromEntries(formData))
        return formData
    }
    

    function getNewCommentInputs() {
        const body = getElem("comment-input").value
        return {
            body: body
        }
    }

    function commentInputReset(){
        getElem("comment-input").value = ""
    }

    function hideModal(modal) {
        const bsModal = bootstrap.Modal.getInstance(modal)
        bsModal.hide()
    }

    function hidePostModal(){
        const modal = getElem("new-post-modal")
        const bsModal = bootstrap.Modal.getInstance(modal)
        bsModal.hide()
    }


    function removeAlerts(){
        const alerts = Array.from(getElems("alert"))
        if (alerts.length > 0) {
            alerts.forEach(function (alert) {
                alert.remove()
            })
        }
    }


    function showAlert(msg, type = "success", parent = document.body, duration = 5000) {
        removeAlerts()
        //
        const alert = createToast(msg, type, parent)
        setTimeout(function () {
            alert.close()
        }, duration)
    }


    function setupUI(token = null, user = null) {
        if (token && user) { //user logged in
            getElem("nav-login-button").classList.add("d-none")
            getElem("nav-register-button").classList.add("d-none")
            const addBtn = getElem("add-btn")
            if (addBtn) {
                addBtn.classList.remove("d-none")
            }
            getElem("nav-logout-button").classList.remove("d-none")
            getElem("logged-in-user").classList.remove("d-none")
            let profile_image = Object.keys(user["profile_image"]) <= 0 ? "" : user["profile_image"]
            getElem("user-pic").src = profile_image
            getElem("username").textContent = user.username
        } else {
            getElem("nav-login-button").classList.remove("d-none")
            getElem("nav-register-button").classList.remove("d-none")
            getElem("nav-logout-button").classList.add("d-none")
            getElem("logged-in-user").classList.add("d-none")
            const addBtn = getElem("add-btn")
            if (addBtn) {
                getElem("add-btn").classList.add("d-none")
            }
        }
    }


    function createToast(msg, type, parent) {
        const alert = getElem("alert-template").content.cloneNode(true)
        getElem("alert-type", alert).classList.add(`alert-${type}`)
        getElem("alert-msg", alert).textContent = msg
        parent.appendChild(alert)
        return new bootstrap.Alert(getElem("current-alert"))
    }


    function openNewPostModal(mode){
        const postModalElem = getElem("new-post-modal")
        postModalElem.setAttribute("mode", mode)
        const bsModal =  bootstrap.Modal.getOrCreateInstance(postModalElem)
        resetPostModal()
        bsModal.show()
        return postModalElem
    }


    function resetPostModal(){
        const postModalElem = getElem("new-post-modal")
        postModalElem.querySelector("#new-post-title-input").value = ""
        postModalElem.querySelector("#new-post-body-input").value = ""
        postModalElem.querySelector("#new-post-image").src= ""
    }


    function openDeletePostModal(id){
        const postModalElem = getElem("delete-post-modal")
        postModalElem.setAttribute("post-id",id )
        const bsModal =  bootstrap.Modal.getOrCreateInstance(postModalElem)
        bsModal.show()
    }


    function setUserProfileInfo(user){
        getElem("profileInfo-header-image").src = user.profile_image
        getElem("profileInfo-email").textContent = user.email
        getElem("profileInfo-name").textContent = user.name
        getElem("profileInfo-username").textContent = user.username
        getElem("profileInfo-posts-count").textContent = user.posts_count 
        getElem("profileInfo-comments-count").textContent = user.comments_count 
        getElem("posts-title").textContent = user.username + "'s Posts" 
    }

    return {
        elems: elems,
        getElem: getElem,
        getElems: getElems,
        getRegisterInputs: getRegisterInputs,
        getLoginInputs: getLoginInputs,
        getPostModalInputs: getPostModalInputs,
        renderPosts: renderPosts,
        renderPost: renderPost,
        setupUI: setupUI,
        showAlert: showAlert,
        removeAlerts:removeAlerts,
        hideModal: hideModal,
        hidePostModal:hidePostModal,
        renderComments: renderComments,
        getNewCommentInputs: getNewCommentInputs,
        commentInputReset:commentInputReset,
        setPostInputs: setPostInputs,
        openNewPostModal: openNewPostModal,
        postModal: {
            get mode(){
                return getElem("new-post-modal").getAttribute("mode")
            }, 
            get postId(){
                return uModule.getElem("new-post-modal").getAttribute("post-id")
            }
        },
        openDeletePostModal: openDeletePostModal,
        setUserProfileInfo: setUserProfileInfo,
    }
}()


export default uModule