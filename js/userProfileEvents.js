import eModule from "./modules/eModule.js";
import uModule from "./modules/uModule.js";
import dModule from "./modules/dModule.js";
import { urls, headers } from "./utils/variables.js";


const userProfileEvents = function () {

    const searchParams = new URLSearchParams(window.location.search)
    const userId = searchParams.get('user-id')

    const token = localStorage.getItem("token")
    const LoggedInUser = JSON.parse(localStorage.getItem("user"))



    async function loadPosts(userId, reload = true) {
        const url = urls.users + "/" + userId + "/posts"
        const { data } = await dModule.getUserPosts(url)
        if (LoggedInUser) {
            const currentUserId = LoggedInUser.id
            data.currentUserId = currentUserId
        }
        await uModule.renderPosts(data, reload)
        const postsElems = Array.from(uModule.getElems("post"))
        postsElems.forEach(function (postElem) {
            //  
            postElem.addEventListener("click", function (e) {
                //
                const clicked = e.target

                if (e.target.textContent.toLowerCase().trim() === "edit") {
                    console.log("current post id: ", e.currentTarget.id)
                    uModule.openNewPostModal("edit")
                    const title = uModule.getElem("title", e.currentTarget).textContent
                    const body = uModule.getElem("body", e.currentTarget).textContent
                    uModule.setPostInputs(title, body, e.currentTarget.id)
                } else if (e.target.textContent.toLowerCase().trim() === "delete") {
                    console.log("current post to delete: ", e.currentTarget.id)
                    uModule.openDeletePostModal(e.currentTarget.id)
                } else if (clicked.id === "profile-image" || clicked.id === "username") { // || clicked.id === "user-profile-link") 
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

    async function updateProfileData(userId) {
        const url = urls.users + "/" + userId
        const { data } = await dModule.getUser(url)
        uModule.setUserProfileInfo(data)
    }

    window.addEventListener("load", async function () {
        uModule.setupUI(token, LoggedInUser)
        if (userId) {
            uModule.getElem("add-btn").classList.add("d-none")
            updateProfileData(userId)
            loadPosts(userId)
        } else {
            uModule.setUserProfileInfo(LoggedInUser)
            loadPosts(LoggedInUser.id)
        }
    })


    uModule.getElem("add-btn").addEventListener("click", function () {
        uModule.openNewPostModal("new")
    })
    //

    async function reload() {
        loadPosts(LoggedInUser.id)
    }
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
            updateProfileData(LoggedInUser.id)
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
            updateProfileData(LoggedInUser.id)
            reload()
            uModule.showAlert("Your post has been deleted successfully")
            //
        } catch (error) {
            uModule.hideModal(uModule.elems.deletePostModal)
            uModule.showAlert(error.message, "danger")
        }

    })



    eModule.loginButtonEvent()
    eModule.logoutButtonEvent()
    eModule.registerButtonEvent()



}()