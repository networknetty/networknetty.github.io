

importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-messaging.js');

importScripts('./libs/localforage.min.js');

function getLocalData(key, callback){
    localforage.getItem(key).then(function(value) {
        callback(value);
    }).catch(function(err) {
        callback();
    });
}

let _configkey = "config";

getLocalData(_configkey, back);

function back(cfg){

    if(cfg != null){

        let firebaseConfig2 = {
            apiKey: cfg.apiKey,
            projectId: cfg.projectId,
            messagingSenderId: cfg.messagingSenderId,
            appId: cfg.appId
        };

        firebase.initializeApp(firebaseConfig2);

        const messaging = firebase.messaging();

        messaging.setBackgroundMessageHandler(function(payload) {
            console.log('[firebase-messaging-sw.js] Received background message ', payload);
            const notificationTitle = 'Background Message Title';
            const notificationOptions = {
                body: 'Background Message body.',
                icon: '/firebase-logo.png'
            };

            return self.registration.showNotification(notificationTitle,
                notificationOptions);

        });
    }
}

