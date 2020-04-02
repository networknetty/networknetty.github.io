

window.onload = function () {

    if (!window.localStorage) {
        console.log("!window.localStorage");
    }

    let _configkey = "config";
    let userID = "";

    let openFile = function () {
        let fileInput;
        fileInput = document.createElement("input");
        fileInput.type='file';
        fileInput.style.display='none';
        fileInput.onchange = function(e) {
            let file = e.target.files[0];
            if (!file) { return; }
            let reader = new FileReader();
            reader.onload = function(e) {
                let parseNode = JSON.parse(e.target.result);
                if(parseNode.list){
                    _config.list = parseNode.list;
                    _config.current_list_item = 0;
                }
                if(parseNode.jwt) _config.jwt = parseNode.jwt;
                if(parseNode.web) _config.web = parseNode.web;
                if(parseNode.listen) _config.listen = parseNode.listen;

                document.body.removeChild(fileInput);

                setLocalObject(_configkey, _config);
                changeList();
                updateCurrentInfoBlockAboutConfig();
            };
            reader.readAsText(file)
        };
        document.body.appendChild(fileInput);
        let eventMouse = document.createEvent("MouseEvents");
        eventMouse.initMouseEvent("click", true, false, window, 0,
            0, 0, 0, 0, false, false,
            false, false, 0, null);
        fileInput.dispatchEvent(eventMouse);
    };
    $('#btn_open_cfg').on('click', openFile);
    $('#btn_return').on('click', onReturn);
    function onReturn() {
        $('#form_div').addClass('hide_view');
        $('#form_info').removeClass('hide_view');
    }

    $('#list_current').on('change', changeCurrentList);
    function changeList(){
        let list = "";
        for(let i=0; i<_config.list.length; i++){
            list += "<option value="+i+">"+_config.list[i].name+"</option>";
        }
        $('#list_current').html(list);
        document.getElementById("list_current").selectedIndex = _config.current_list_item;
    }
    function changeCurrentList(e){
        _config.current_list_item = Number.parseInt(this.value);
        setLocalObject(_configkey, _config);
        updateCurrentInfoBlockAboutConfig();
    }

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
        _config = { list:[{name:"none", url:"none", sock:"none"}], current_list_item:0, jwt:"none", web:{}, listen:[]};
        setLocalObject(_configkey, _config);
        onConfigEdit();
    }else{
        if(_config.list[_config.current_list_item].url === "none"){
            onConfigEdit();
        }else{
            $('#form_div').addClass('hide_view');
            updateCurrentInfoBlockAboutConfig();
        }
    }

    function updateCurrentInfoBlockAboutConfig(){
        $('.info_config').html(
            'name: '+_config.list[_config.current_list_item].name+' <br> ' +
            'url: '+_config.list[_config.current_list_item].url+' <br> ' +
            'sock: '+_config.list[_config.current_list_item].sock +' <br> '
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

    $('.btn_send').on('click', onSend);

    function onSend() {

        $('.buttons_cfg').addClass('hide_view');

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('firebase-messaging-sw.js').then(function(registration) {
            }).catch(function(error) {
                console.log('error reg service worker:', error);
            });
        } else {
            console.log('browser service worker not sup');
        }

        firebase.initializeApp(_config.web);

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
        changeList();
        $('#form_div').removeClass('hide_view');
        $('#form_info').addClass('hide_view');
    }

    function call(endpoint, body, callback){
        fetch(
            _config.list[_config.current_list_item].url+endpoint,
            {
                    method: 'POST', headers: { 'Content-Type' : 'application/json', 'jwt': _config.jwt },
                    body: JSON.stringify(body)
                }
            )
            .then( function (response) {
                    if (response.ok) {
                        response.json()
                            .then( function (body) { callback(body); });
                    }
                    else {
                        // alert("error HTTP: " + response.status);
                        callback(null, response.status);
                    }
                }
            );
    }

    $('#btn_fcm').addClass('hide_view');
    $('.btn_fcm').on('click', callFcm);
    function callFcm(){
        $('#btn_fcm').addClass('hide_view');
        function loginBack(body, error){
            if(body != null){
                console.log("call fcm status:"+body.status);
            }else{
                console.log('error call fcm:'+error);
            }
        }
        call('/fcm', { from:userID, data:{token:tk_fcm}, action:'add_token' }, loginBack);
    }

    let callBackend = function (){
        function loginBack(body, error){
            if(body != null){
                let bodyStr = JSON.stringify(body);
                info_res.innerHTML = "response.body:   "+bodyStr;
                userID = body.data.id;
                console.log("user id:"+userID);
                updateCurrentInfoBlockAboutConfig();
                sockActivated();
                if(body.data.fcm == null || body.data.fcm !== tk_fcm){
                    $('#btn_fcm').removeClass('hide_view');
                }
            }else{
                console.log('error login:'+error);
            }
        }
        call('/login', { data:{token:tk_fb}, action:'login' }, loginBack);
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

        $('.btn_connect_sock').addClass('hide_view');
        $('.btn_connect_sock').on('click', sockReOpen);

        // socket = io(_config.sock);
        socket = io(_config.list[_config.current_list_item].sock);
        socket.on('connect', () => {
            console.log(' -- connect socket.id:'+socket.id);
            log_sock_console(' -- connect socket.id:'+socket.id);
            openedSock();
            socket.emit('login', userID);
        });
        log_sock_console(' ~ listen connect');
        socket.on('disconnect', () => {
            closedSock();
            console.log('disconnect socket');
            log_sock_console(' -- disconnect socket');
            // socket.open();
            $('.btn_connect_sock').removeClass('hide_view');
        });
        log_sock_console(' ~ listen disconnect');
        socket.on('logout', (msg) => {
            closedSock();
            console.log('logout socket');
            log_sock_console(' -- logout socket msg:'+msg);
            $('.btn_connect_sock').removeClass('hide_view');
        });
        log_sock_console(' ~ listen logout');
        socket.on('login', (msg) => {
            log_sock_console(' -- login socket msg:'+msg);
        });
        log_sock_console(' ~ listen login');
        socket.on('temp', (data) => {
            log_sock_console(' -- temp listen data:'+JSON.stringify(data));
        });
        log_sock_console(' ~ listen temp');

        for(let i=0; i<_config.listen.length; i++){
            socket.on(_config.listen[i], (data) => {
                log_sock_console(' -- '+_config.listen[i]+' listen data:'+JSON.stringify(data));
            });
            log_sock_console(' ~ listen '+_config.listen[i]);
        }
    };

    let sockReOpen = function(){
        $('.btn_connect_sock').addClass('hide_view');
        socket.open();
    };

    $('.btn_connect_sock').on('click', sockOpen);
    $('.btn_emit_sock').on('click', onEmitMsg);
    $('.btn_listen_sock').on('click', onAddListenSock);

    function onAddListenSock() {
        let formmsglisten = new FormData(  document.getElementById("sockListen")  );
        let key = formmsglisten.get('key');

        log_sock_console(' ~ add listen key:'+key);

        socket.on(key, (data) => {
            console.log(key + ' listen data:'+JSON.stringify(data));
            log_sock_console(' -- '+key + ' listen data:'+JSON.stringify(data));
        });
    }

    function log_sock_console(msg) {
        let div = document.createElement('div');
        div.className = 'info_sock_console__item';
        div.innerHTML = "<div>"+msg+"</div>";
        info_sock.appendChild(div);
    }

    function log_sock_console_clear() {
        $('#info_sock').empty();
    }

    $('#btn_clear').on('click', log_sock_console_clear);

    function onEmitMsg() {

        let formmsg = new FormData(  document.getElementById("sockForm")  );

        let msg = formmsg.get('msg');
        let body = formmsg.get('body');

        socket.emit(msg, body);
    }
};
