

function init_sock(context) {
    let _context = context;

    let socket;
    let sockOpen = function () {
        _context.sock.init = true;

        $('.btn_connect_sock').addClass('hide_view');
        $('.btn_connect_sock').on('click', sockReOpen);

        socket = io(_context.config.list[_context.config.current_list_item].sock);
        socket.on('connect', () => {
            _context.log.socketIn(' << connect socket.id:'+socket.id);
            _context.sock.active = true;
            $('.socket_buttons').removeClass('hide_view');
            // if(_context.sock.login === true){
                _context.sock.login = false;
                _context.socket_models_emit.login.context.run();
            // }
        });
        _context.log.debug(' ~ listen connect');
        socket.on('disconnect', () => {
            _context.log.socketIn(' << disconnect socket');
            // socket.open();
            $('.btn_connect_sock').removeClass('hide_view');
            $('.socket_buttons').addClass('hide_view');
            _context.sock.active = false;
            // _context.sock.login = false;
        });
        _context.log.debug(' ~ listen disconnect');
        socket.on('logout', (msg) => {
            _context.log.socketIn(' << logout socket msg:'+msg);
            $('.btn_connect_sock').removeClass('hide_view');


        });
        _context.log.debug(' ~ listen logout');
        socket.on('login', (msg) => {
            _context.log.socketIn(' << login socket msg:'+msg);
            if(msg === "ok"){
                _context.sock.login = true;
            }
            else if(msg === "kick"){
                _context.socket_models_emit.login.context.run();
            }
        });
        _context.log.debug(' ~ listen login');
        socket.on('temp', (data) => {
            _context.log.socketIn(' << temp listen data:'+JSON.stringify(data));
        });
        _context.log.debug(' ~ listen temp');

        activated_socket_listen_models(_context);
    };

    let sockReOpen = function(){
        $('.btn_connect_sock').addClass('hide_view');

        if(_context.sock.active === false)
            socket.open();
    };

    $('.btn_connect_sock').on('click', sockOpen);

    let addEventListener = function(msg, func){
        socket.on(msg, func);
        _context.log.debug(' ~ listen '+msg);
    };

    let emitMessage = function(msg, body){
        socket.emit(msg, body);
        _context.log.socketOut(' >> emit msg: '+msg+' body: '+JSON.stringify(body));
    };

    let externalConnect = function(){
        if(_context.sock.active === false){

            $('.btn_connect_sock').addClass('hide_view');
            if(_context.sock.init === true){
                socket.open();
            }else{
                sockOpen();
            }

        }
    };

    _context.sock = {
        init : false,
        active : false,
        login : false,
        vo : {},
        addEventListener : addEventListener,
        emit : emitMessage
    };

    _context.sock.vo.context = {
        run: function (trigger, callback, value) {
            externalConnect();
            if (callback != null)
                callback();
        }
    };

}







