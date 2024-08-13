import uModule from "./modules/uModule.js";
import dModule from "./modules/dModule.js";
import eModule from "./modules/eModule.js";
import { urls, headers } from "./utils/variables.js";

const postDetailsEvents = function () {
    
    const searchParams = new URLSearchParams(window.location.search) 
    const id = searchParams.get('id')

    function loadPost() {
        return new Promise(async function (resolve, reject) {
            try {
                const { data } = await dModule.getPost(urls.posts + "/" + id)
                const postWrapper = uModule.getElem("posts")
                postWrapper.innerHTML = ""
                uModule.renderPost(data)
                if (data.comments.length > 0) {
                    uModule.getElems("comments").innerHTML = ""
                    uModule.renderComments(data.comments)
                }
                uModule.getElem("comment-submit-button").addEventListener("click", handleCommentSubmit)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        }
    )
    }


    async function handleCommentSubmit(){
        uModule.removeAlerts()
        try {
            const token = localStorage.getItem("token")
            if(token){
                const url = `${urls.posts}/${id}/comments`
                const h = headers.add({
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "Application/json"
                })
                const commentData = uModule.getNewCommentInputs()
                await dModule.createComment(url, h, commentData)
                loadPost()
            }
            else{
                throw new Error( "Login first enable to add a comment")
            }

        } catch (error) {
            uModule.showAlert(error.message, "danger")
        }

    }

    window.addEventListener("load", async function () {
        const token = localStorage.getItem("token")
        const user = JSON.parse(localStorage.getItem("user"))
    
        uModule.setupUI(token, user)
        await loadPost()
    })



    eModule.registerButtonEvent()
    eModule.loginButtonEvent()
    eModule.logoutButtonEvent()

    //




}()