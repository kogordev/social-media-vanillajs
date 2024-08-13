

import indexEvents from "./indexEvents.js"

const app =  function (){

    function init(){
        indexEvents()
    }
``
    return {
        init: init
    }
}()

export default  app