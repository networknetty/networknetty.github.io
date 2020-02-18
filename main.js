

window.onload = function () {

    if (!window.localStorage) {
        console.log("!window.localStorage");
    }

    let _configkey = "config";

    let setLocalObject = function(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));

        localforage.setItem(key, value)
            .then(function (value) {})
            .catch(function (error) {
                console.log('localforage.setItem err: '+error);
            });
    };

    let getLocalObject = function(key) {
        if(!window.localStorage.hasOwnProperty(key))
            return null;
        return JSON.parse(window.localStorage.getItem(key));
    };

    let _config = getLocalObject(_configkey);
    if(_config == null){
        _config = { url:"http://localhost:3000", sock:"", jwt:"", apiKey: "", authDomain: "", databaseURL: "",
            projectId: "",  storageBucket: "", messagingSenderId: "", appId: "", measurementId: "", user:"" };
        setLocalObject(_configkey, _config);
        onConfigEdit();
    }else{
        $('#form_div').addClass('hide_view');
        $('#info_config').html('url: '+_config.url+' <br> ' +
            'sock: '+_config.sock +' <br> ' +
            'apiKey: '+_config.apiKey +' <br> ' +
            'authDomain: '+_config.authDomain +' <br> ' +
            'databaseURL: '+_config.databaseURL +' <br> ' +
            'projectId: '+_config.projectId +' <br> ' +
            'storageBucket: '+_config.storageBucket +' <br> ' +
            'messagingSenderId: '+_config.messagingSenderId +' <br> ' +
            'appId: '+_config.appId +' <br> ' +
            'measurementId: '+_config.measurementId +' <br> ' +
            'user: '+_config.user
        );
    }

    $('#sock_block').addClass('hide_view');
    $('#sockForm').addClass('hide_view');

    let info_t_fb = document.getElementById('info_t_fb');
    let info_t_fcm = document.getElementById('info_t_fcm');
    let info_res = document.getElementById('info_res');
    let info_msg = document.getElementById('info_msg');

    let info_sock = document.getElementById('info_sock');

    let tk_fb;
    let tk_fcm;

    $('.btn_save').on('click', onConfigSave);

    function onConfigSave() {

        let formdt = new FormData(  document.getElementById("userForm")  );

        _config.url = formdt.get('url');
        _config.sock = formdt.get('sock');
        _config.jwt = formdt.get('jwt');
        _config.apiKey = formdt.get('apiKey');
        _config.authDomain = formdt.get('authDomain');
        _config.databaseURL = formdt.get('databaseURL');
        _config.projectId = formdt.get('projectId');
        _config.storageBucket = formdt.get('storageBucket');
        _config.messagingSenderId = formdt.get('messagingSenderId');
        _config.appId = formdt.get('appId');
        _config.measurementId = formdt.get('measurementId');

        setLocalObject(_configkey, _config);

        $('#form_div').addClass('hide_view');
        $('#form_info').removeClass('hide_view');

        $('#info_config').html('url: '+_config.url+' <br> ' +
            'sock: '+_config.sock +' <br> ' +
            'apiKey: '+_config.apiKey +' <br> ' +
            'authDomain: '+_config.authDomain +' <br> ' +
            'databaseURL: '+_config.databaseURL +' <br> ' +
            'projectId: '+_config.projectId +' <br> ' +
            'storageBucket: '+_config.storageBucket +' <br> ' +
            'messagingSenderId: '+_config.messagingSenderId +' <br> ' +
            'appId: '+_config.appId +' <br> ' +
            'measurementId: '+_config.measurementId
        );
    }

    $('.btn_send').on('click', onSend);

    function onSend() {

        $('.buttons').addClass('hide_view');

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('firebase-messaging-sw.js').then(function(registration) {
            }).catch(function(error) {
                console.log('error reg service worker:', error);
            });
        } else {
            console.log('browser service worker not sup');
        }

        firebase.initializeApp(
            {
                apiKey: _config.apiKey,
                authDomain: _config.authDomain,
                databaseURL: _config.databaseURL,
                projectId: _config.projectId,
                storageBucket: _config.storageBucket,
                messagingSenderId: _config.messagingSenderId,
                appId: _config.appId,
                measurementId: _config.measurementId
            }
        );

        let messaging = firebase.messaging();

        messaging.requestPermission()
            .then(
                function () {
                    console.log("Notification permission granted");
                    return messaging.getToken();
                }
            )
            .catch( function (err) { console.log("Unable to get permission to notify.", err); } );

        messaging.onMessage((payload) => {
            let msg = JSON.stringify(payload);
            info_msg.innerHTML = 'Message received: '+ msg;
            new Notification(payload.notification.title, payload.notification);
        });

        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider)
            .then(
                function(result) {
                    var user = result.user;
                    tk_fb = user.ma.toString();
                    info_t_fb.innerHTML = "token firebase:   "+tk_fb;

                    messaging.getToken()
                        .then(
                            (tok)=>{
                                tk_fcm = tok;
                                info_t_fcm.innerHTML = 'token fcm:   '+tk_fcm;
                                callBackend();
                            }
                        );
                }
            ).catch(function(error) {console.log('error: ', error);});
    }

    $('.btn_edit').on('click', onConfigEdit);

    function onConfigEdit() {
        $("#cfg_url").val(_config.url);
        $("#cfg_sock").val(_config.sock);
        $("#cfg_jwt").val(_config.jwt);
        $("#cfg_apiKey").val(_config.apiKey);
        $("#cfg_authDomain").val(_config.authDomain);
        $("#cfg_databaseURL").val(_config.databaseURL);
        $("#cfg_projectId").val(_config.projectId);
        $("#cfg_storageBucket").val(_config.storageBucket);
        $("#cfg_messagingSenderId").val(_config.messagingSenderId);
        $("#cfg_appId").val(_config.appId);
        $("#cfg_measurementId").val(_config.measurementId);

        $('#form_div').removeClass('hide_view');
        $('#form_info').addClass('hide_view');


    }

    let callBackend = function (){
        let body = { data:{token:tk_fb}, action:'login' };//, fcm:tk_fcm
        fetch(
            _config.url+'/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                        'jwt': _config.jwt
                    },
                    body: JSON.stringify(body)
                }
            )
            .then( function (response) {
                    if (response.ok) {
                        response.json()
                            .then( function (body) {


                                let bodyStr = JSON.stringify(body);
                                info_res.innerHTML = "response.body:   "+bodyStr;

                                sockActivated();
                            });
                    } else { alert("error HTTP: " + response.status);}
                }
            );
    };

    let sockActivated = function () {
        $('#sock_block').removeClass('hide_view');
    };
    let openedSock = function(){
        $('#sockForm').removeClass('hide_view');
    };
    let closedSock = function(){
        $('#sockForm').addClass('hide_view');
    };

    let socket;
    let sockOpen = function () {
        socket = io(_config.sock);
        socket.on('connect', () => {
            console.log('connect socket');
            console.log(socket.id);
            openedSock();
        });
        socket.on('disconnect', () => {
            closedSock();
            console.log('disconnect socket');
            socket.open();
        });
    };

    $('.btn_connect_sock').on('click', sockOpen);
    $('.btn_emit_sock').on('click', onEmitMsg);
    $('.btn_listen_sock').on('click', onAddListenSock);

    function onAddListenSock() {
        let formmsglisten = new FormData(  document.getElementById("sockListen")  );
        let key = formmsglisten.get('key');

        socket.on(key, (data) => {
            console.log(key + ' listen data:'+data);
        });
    };

    function onEmitMsg() {

        let formmsg = new FormData(  document.getElementById("sockForm")  );

        let msg = formmsg.get('msg');
        let body = formmsg.get('body');

        socket.emit(msg, body);

        // setLocalObject(_configkey, _config);

        // $('#form_div').addClass('hide_view');
        // $('#form_info').removeClass('hide_view');

        // $('#info_config').html('url: '+_config.url+' <br> ' +
        //     'sock: '+_config.sock +' <br> ' +
        //     'apiKey: '+_config.apiKey +' <br> ' +
        //     'authDomain: '+_config.authDomain +' <br> ' +
        //     'databaseURL: '+_config.databaseURL +' <br> ' +
        //     'projectId: '+_config.projectId +' <br> ' +
        //     'storageBucket: '+_config.storageBucket +' <br> ' +
        //     'messagingSenderId: '+_config.messagingSenderId +' <br> ' +
        //     'appId: '+_config.appId +' <br> ' +
        //     'measurementId: '+_config.measurementId
        // );
    }
};
