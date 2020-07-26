

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

        // const messaging = firebase.messaging();
        //
        // messaging.setBackgroundMessageHandler(function(payload) {
        //     console.log('[firebase-messaging-sw.js] Received background message ', payload);
        //     const notificationTitle = 'Background Message Title';
        //     const notificationOptions = {
        //         body: 'Background Message body.',
        //         icon: '/firebase-logo.png'
        //     };
        //
        //     return self.registration.showNotification(notificationTitle,
        //         notificationOptions);
        //
        // });




        //Выполняем инсталяцию приложения
        self.addEventListener('install', function(event) {
            // event.waitUntil(skipWaiting());
            console.info('Установка fcm service worker выполнена!');
        });

        //Активируем приложения для данной вкладки
        self.addEventListener('activate', function(event) {
            // event.waitUntil(clients.claim());
            console.info('Активация fcm service worker выполнена!');
            // MySyncFunc();
        });

        // //Синхронизация indexedDB с FCM БД
        // function MySyncFunc(){
        //     try{
        //         db_transaction = self.indexedDB.open('assistant');
        //         db_transaction.onsuccess = function(e) {
        //             db_transaction_inc = db_transaction.result.transaction(['ServiceWorker'],
        //                 "readonly").objectStore("ServiceWorker").getAll();
        //             db_transaction_inc.onsuccess = function(e) {
        //                 db_transaction_inc2 = db_transaction_inc.result[0];
        //                 writeUserData(db_transaction_inc2.username, db_transaction_inc2.realname,
        //                     db_transaction_inc2.fcm_token, db_transaction_inc2.photo);
        //                 db_transaction.result.close();
        //             }
        //         }
        //         console.log('Синхронизация выполнена!');
        //     } catch(e) {
        //         console.error('Sync Error:' + e);
        //     }
        // }

        // //Регистрация юзера в FCM БД
        // function writeUserData(username, realname, fcm_token, image_url) {
        //     try {
        //         var tokendata = new Date();
        //         tokendatastr = tokendata.toString();
        //         firebase.database().ref('users/' + username.replace(".","_")).update({
        //             email: username+'@farmin.by',
        //             username: realname,
        //             token: fcm_token,
        //             profile_picture : image_url,
        //             time: tokendatastr
        //         });
        //     } catch(e) {
        //         console.error('Send to FCM Error:' + e);
        //     }
        // }

        //Получаем сообщение в сервис-воркер
        self.addEventListener('push', function(event) {
            event.waitUntil(
                self.registration.pushManager.getSubscription()
                    .then(function(subscription) {
                        console.info(event.data.json());
                        // if(event.data.json().notification.tag === 'Asterisk_Incomming'){
                        //     if(typeof(event.data.json().data) == "undefined"){
                        //         return NotifyIncomming(event.data.json());
                        //     }else {
                        //         return NotifyIncommingCall(event.data.json());
                        //     }
                        // }else if(event.data.json().notification.tag === 'Asterisk_Queue'){
                        //     return NotifyIncomming(event.data.json());
                        // }else if(event.data.json().notification.tag === 'Assistant_Notify'){
                        //     return NotifyIncomming(event.data.json());
                        // }else if(
                        //     (event.data.json().notification.tag === 'Helpdesk_Notify') ||
                        //     (event.data.json().notification.tag === 'Helpdesk_Notify_Tech')
                        // ){
                        //     return NotifyHelpdesk(event.data.json());
                        // }else{
                        //     return NotifyIncomming(event.data.json());
                        // }

                        return NotifyIncomming(event.data.json());
                    })
                    .catch(function(err) {
                        console.error('Невозможно получить данные с сервера: ', err);
                    })
            );
        });

        //Клик по окну Notification
        self.addEventListener('notificationclick', function(event) {
            console.info('notificationclick');
            // if(typeof(event.action) != "undefined" && event.action !== ""){
            //     clik_behavior = event.action.split('|');
            //     if(clik_behavior[0] === "busy_call"){
            //         PostMessage(clik_behavior[1], "");
            //     }else if(
            //         (clik_behavior[0] === "setting_call") ||
            //         (clik_behavior[0] === "helpdesk_view") ||
            //         (clik_behavior[0] === "helpdesk_pick_up")
            //     ){
            //         clients.openWindow(clik_behavior[1]);
            //     }
            // } else{
            //     myNotifyClose(event.notification.tag);
            // }

            // clients.openWindow();

            // WindowClient.navigate();
        });

        //Закрытие окна уведомления
        self.addEventListener('notificationclose', function(event) {
            console.log('notificationclose fcm service worker');
        });

        //Функция создания стандартного окна уведомления
        function NotifyIncomming(data){
            return self.registration.showNotification(data.notification.title, {
                    body : data.notification.body,
                    icon : data.notification.image != null ? data.notification.image : data.notification.icon,
                    tag: data.notification.tag
                }
            );
        }

        // //Функция создания окна уведомления о входящем вызове(+ кнопки)
        // function NotifyIncommingCall(data){
        //     return self.registration.showNotification(data.notification.title, {
        //             body : data.notification.body,
        //             icon : data.notification.icon,
        //             tag: data.notification.tag,
        //             actions: [
        //                 {
        //                     icon: "images/menu/call_noanswer.png",//сылка на иконку в кнопке
        //                     action: "busy_call|/search/ami_asterisk.php?hangup&channel=" + data.data.channel, //наименивание действия
        //                     title: "Отклонить" //лейбл
        //                 }
        //             ]
        //         }
        //     );
        // }

    }
}

