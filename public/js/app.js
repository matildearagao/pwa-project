// check if browser support service workers
if ('serviceWorker' in navigator) {
    //navigator is a js object that represents the browser
    navigator.serviceWorker.register('/sw.js')
        //its a promise
        .then((reg) => console.log('service worker registered', reg))
        .catch((err) => console.log('service worker not registered', err))
}