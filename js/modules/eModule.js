import dModule from "./dModule.js"
import uModule from "./uModule.js"
import { urls, headers} from "../utils/variables.js"

const eModule = function(){

    function registerButtonEvent(callback = function(){}){
        uModule.getElem("register-button").addEventListener("click", async function () {
            try {
                const data = uModule.getRegisterInputs()
                const response = await dModule.register(urls.register, headers.get(), data)
                const { token, user } = response
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                uModule.hideModal(uModule.getElem("register-modal"))
                uModule.showAlert("You have been registered successfully")
                uModule.setupUI(token, user)
                callback()
            } catch (error) {
                uModule.hideModal(uModule.getElem("register-modal"))
                uModule.showAlert(error.message, "danger")
            }
        })
    }


    function loginButtonEvent(callback = function(){}){
        uModule.getElem("login-button").addEventListener("click", async function () {
            try {
                const data = uModule.getLoginInputs()
                const h = headers.withContType("application/json")
                const response = await dModule.login(urls.login, h, data)
                const { token, user } = response
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                uModule.hideModal(uModule.getElem("login-modal"))
                uModule.showAlert("You have logged in successfully", "success")
                uModule.setupUI(token, user)
                callback()
    
            } catch (error) {
                uModule.hideModal(uModule.getElem("login-modal"))
                uModule.showAlert(error.message, "danger")
            }
        })
    }


    function logoutButtonEvent(callback = function(){}){
        uModule.getElem("nav-logout-button").addEventListener("click", async function () {
            try {
                await dModule.logout()
                uModule.setupUI()
                uModule.showAlert("Logged out successfully")
                callback()
            } catch (error) {
                uModule.setupUI()
                uModule.showAlert(error, "danger")
            }
        })
    }


    return {
        registerButtonEvent:registerButtonEvent,
        loginButtonEvent:loginButtonEvent,
        logoutButtonEvent:logoutButtonEvent
    }
    //
}()

export default eModule