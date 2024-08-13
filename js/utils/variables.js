const urls = function () {
    //
    const baseUrl = "https://tarmeezacademy.com/api/v1"


    //
    const urls = {
        login: baseUrl + "/login",
        register: baseUrl + "/register",
        posts: baseUrl + "/posts",
        users: baseUrl + "/users",
    }

    function add(urlObj) {
        for (let [key, value] of urlObj) {
            urls[key] = value
        }
    }

    return {
        add: add,
        ...urls
    }
}()

//
const headers = function () {

    const headersObj = {
        "X-Requested-With": "XMLHttpRequest",
        "Access-Control-Allow-Origin": "*",
    }


    //add will return a copy of the headers obj because it is sharable between other request headers
    const add = function (headerObj) {
        return {
            ...headerObj,
            ...headersObj
        }
    }

    const withAuth = function (token) {
        return {
            "Authorization": token,
            ...headersObj
        }
    }

    const withContType = function (ContentType) {
        return {
            "Content-Type": ContentType,
            ...headersObj
        }
    }

    const get = function () {
        return headersObj
    }

    return {
        add: add,
        get: get,
        withAuth: withAuth,
        withContType: withContType,
    }
}()

//
const page = function(){
    let page = 0 
    let lPage = 0
    let pageLmt = 10

    return {
        get pageLimit(){
            return pageLmt
        },
        set pageLimit(value){
            pageLmt = value
        },
        get currentPage(){
            return page 
        },
        set currentPage(value){
            page = value
        },
        get nextPage(){
            page++
            return page
        }
       ,
        set lastPage(value){
            lPage = value
        },
        get lastPage(){
            return lPage
        }, 
        reset: function(){
            page = 0
        }
        
}
//
}()

export { urls, headers, page }
