const request = function () {

    //
    function get(url, resType = "json") {
        return new Promise(function (resolve, reject) {
            //
            const xhr = new XMLHttpRequest()
            xhr.open("GET", url)
            xhr.responseType = resType
            xhr.send()
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.response)
                }
            }
            //
        })
    }

    //
    // function post(url, headers, data, resType = "json", isString = true) {
    //     {
    //         return new Promise(function (resolve, reject) {
    //             const xhr = new XMLHttpRequest()
    //             xhr.open("post", url, true)
    //             for (let[key, value] of Object.entries(headers)) {
    //                 xhr.setRequestHeader(key, value)
    //             }
    //             xhr.responseType = resType
    //             if (isString) {
    //                 data = JSON.stringify(data)
    //             }
    //             xhr.send(data)
    //             xhr.onload = function () {
    //                 if (xhr.status >= 200 && xhr.status < 300) {
    //                     resolve(xhr.response)
    //                 } else {
    //                     reject(xhr.response)
    //                 }
    //             }
    //         })
    //     }
    // }


    function post(url, headers, data, resType = "json", isString = true) {
        {
            return new Promise(function (resolve, reject) {
                const xhr = new XMLHttpRequest()
                xhr.open("post", url, true)
                for (let[key, value] of Object.entries(headers)) {
                    xhr.setRequestHeader(key, value)
                }
                xhr.responseType = resType
                if (isString) {
                    data = JSON.stringify(data)
                }
                xhr.send(data)
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response)
                    } else {
                        reject(xhr.response)
                    }
                }
            })
        }
    }



    //
    return {
        get: get,
        post: post
    }

}()

export default request