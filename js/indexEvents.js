import dModule from "./modules/dModule.js"
import uModule from "./modules/uModule.js"
import eModule from "./modules/eModule.js"
import { urls, headers, page } from "./utils/variables.js"


const indexEvents = function () {

    var perfEntries = performance.getEntriesByType("navigation");
    if (perfEntries[0].type === "back_forward") {
        location.reload();
    }
    //

    async function loadPosts(pageNum, reload = false) {
        const { data, meta } = await dModule.getPosts(urls.posts, pageNum, page.pageLimit)
        const user = localStorage.getItem("user")
        if (user) {
            const currentUserId = JSON.parse(user).id
            data.currentUserId = currentUserId
        }
        page.lastPage = meta.last_page
        await uModule.renderPosts(data, reload)
        const postsElems = Array.from(uModule.getElems("post"))
        postsElems.forEach(function (postElem) {
            //  
            postElem.addEventListener("click", function (e) {
                //
                const clicked = e.target

                if (clicked === "edit") {
                    console.log("current post id: ", e.currentTarget.id)
                    uModule.openNewPostModal("edit")
                    const title = uModule.getElem("title", e.currentTarget).textContent
                    const body = uModule.getElem("body", e.currentTarget).textContent
                    uModule.setPostInputs(title, body, e.currentTarget.id)
                } else if (e.target.textContent.toLowerCase().trim() === "delete") {
                    console.log("current post to delete: ", e.currentTarget.id)
                    uModule.openDeletePostModal(e.currentTarget.id)
                } else if (clicked.id === "profile-image" || clicked.id === "username"){ // || clicked.id === "user-profile-link") 
                    window.location = "./userProfile.html?user-id=" + e.currentTarget.getAttribute("user-id")
                }
                else {
                    window.location = "./postDetails.html?id=" + postElem.id
                }
            })
            // 
        })
    }
    //


    window.addEventListener("load", async function () {
        // 
        let user = localStorage.getItem("user")
        let token = localStorage.getItem("token")

        if (user && token) {
            uModule.setupUI(token, JSON.parse(user))
        }
        //
        loadPosts(page.nextPage)
    })
    //


    window.addEventListener("scroll", async function () {
        const endOfPage = window.scrollY + window.innerHeight >= document.body.scrollHeight
        if (endOfPage && page.currentPage < page.lastPage) {
            loadPosts(page.nextPage)
        }
    })
    //


    async function reload() {
        page.reset()
        loadPosts(page.nextPage, true)
    }
    //

    eModule.registerButtonEvent(reload)
    eModule.loginButtonEvent(reload)
    eModule.logoutButtonEvent(reload)
    //


    uModule.getElem("add-btn").addEventListener("click", function () {
        uModule.openNewPostModal("new")
    })
    //


    uModule.elems.postSubmitBtn.addEventListener("click", async function () {
        try {
            let postInputs = uModule.getPostModalInputs()
            const token = `Bearer ${localStorage.getItem("token")}`
            const modalMode = uModule.postModal.mode
            let url = urls.posts
            const postId = uModule.postModal.postId
            if (modalMode === "edit") {
                postInputs.append("_method", "put")
                url = `${urls.posts}/${postId}`
            }
            await dModule.createPost(url, headers.withAuth(token), postInputs)
            if (modalMode === "new") {
                uModule.showAlert("Your post has been added successfully")
            } else {
                uModule.showAlert("Your post has been edited successfully")
            }
            uModule.hidePostModal()
            reload()
            //
        } catch (error) {
            uModule.hidePostModal()
            uModule.showAlert(error.message, "danger")
        }
    })
    //


    uModule.elems.postDeleteBtn.addEventListener("click", async function () {
        try {
            const postId = uModule.elems.deletePostModal.getAttribute("post-id")
            const url = `${urls.posts}/${postId}`
            const token = `Bearer ${localStorage.getItem("token")}`
            const h = headers.withAuth(token)
            await dModule.deletePost(url, h)
            uModule.hideModal(uModule.elems.deletePostModal)
            reload()
            uModule.showAlert("Your post has been deleted successfully")
            //
        } catch (error) {
            uModule.hideModal(uModule.elems.deletePostModal)
            uModule.showAlert(error.message, "danger")
        }

    })


}

export default indexEvents