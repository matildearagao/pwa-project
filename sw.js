// install service worker
self.addEventListener('install', evt => {
    console.log('service worker installed');
})

//activate event
self.addEventListener('activate', evt =>{
    console.log('service has been activated');
    
})