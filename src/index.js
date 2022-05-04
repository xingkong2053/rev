import Vue from "./vue";

console.log("app")

const vm = new Vue({
    el: "#app",
    data: {
        msg: "hello,vue",
        name: {
            first: "XIN",
            last: "KONG"
        }
    }
})