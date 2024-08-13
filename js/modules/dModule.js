const dModule = function () {

    function fullfilPromise(res, resolve, reject, data) {
        if (res.ok) {
            resolve(data)
        } else {
            reject(data)
        }
    }

    function register(url, headers, registerData) {
        return new Promise(async function (resolve, reject) {
            const options = {
                method: 'POST',
                headers: headers,
                body: registerData
            }
            const res = await fetch(url, options)
            const data = await res.json()
            fullfilPromise(res, resolve, reject, data)
        })
    }

    function login(url, headers, loginData) {
        return new Promise(async function (resolve, reject) {
            const options = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(loginData)
            }
            const res = await fetch(url, options)
            const data = await res.json()
            fullfilPromise(res, resolve, reject, data)
        })
    }

    

    function logout() {
        return new Promise(function (resolve, reject) {
            try {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }


    function getPosts(url, page, limit) {
        return new Promise(async function (resolve, reject) {
            const res = await fetch(url + '?limit=' + limit + "&page=" + page)
            const data = await res.json()
            fullfilPromise(res, resolve, reject, data)
        })
    }

    function getPost(url) {
        return new Promise(async function (resolve, reject) {
            const res = await fetch(url)
            const data = await res.json()
            fullfilPromise(res, resolve, reject, data)
        })
    }


    function createPost(url, headers, postData) {
        return new Promise(async function (resolve, reject) {
            const options = {
                method: 'POST',
                headers: headers,
                body: postData
            }
            const res = await fetch(url, options)
            const data = await res.json()
            fullfilPromise(res, resolve, reject, data)
        })
    }

    function deletePost(url, headers){
        return new Promise(async function (resolve, reject) {
            const options = {
                method: 'DELETE',
                headers: headers,
            }
            const res = await fetch(url, options)
            const data = await res.json()
            fullfilPromise(res, resolve, reject, data)
        })   
    }

    function createComment(url, headers, commentData) {
        return new Promise(async function (resolve, reject) {
            const options = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(commentData)
            }
            console.log(url, headers, commentData)
            const res = await fetch(url, options)
            const data = await res.json()
            fullfilPromise(res, resolve, reject, data)
        })
    }

    function getUser(url) {
        return new Promise(async function (resolve, reject) {
            const res = await fetch(url)
            const data = await res.json()
            fullfilPromise(res, resolve, reject, data)
        })
    }

    function getUserPosts(url) {
        return new Promise(async function (resolve, reject) {
            const res = await fetch(url)
            const data = await res.json()
            fullfilPromise(res, resolve, reject, data)
        })
    }

    //
    return {
        getPosts: getPosts,
        getPost: getPost,
        register: register,
        login: login,
        logout: logout,
        createPost: createPost,
        deletePost:deletePost,
        createComment: createComment,
        getUser: getUser,
        getUserPosts: getUserPosts,
    }
}()

export default dModule