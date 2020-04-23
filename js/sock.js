

function init_sock(context) {
    let _context = context;

    let socket;
    let sockOpen = function () {

        $('.btn_connect_sock').addClass('hide_view');
        $('.btn_connect_sock').on('click', sockReOpen);

        socket = io(_context.config.list[_context.config.current_list_item].sock);
        socket.on('connect', () => {
            console.log(' << connect socket.id:'+socket.id);
            _context.socket_log(' << connect socket.id:'+socket.id);
            _context.sock.active = true;
            $('.socket_buttons').removeClass('hide_view');
            if(_context.sock.login === true){
                _context.sock.login = false;
                _context.socket_models_emit.login.contextVO.onButtonClick();
            }
        });
        _context.socket_log(' ~ listen connect');
        socket.on('disconnect', () => {
            console.log(' << disconnect socket');
            _context.socket_log(' << disconnect socket');
            // socket.open();
            $('.btn_connect_sock').removeClass('hide_view');
            $('.socket_buttons').addClass('hide_view');
            _context.sock.active = false;
            // _context.sock.login = false;
        });
        _context.socket_log(' ~ listen disconnect');
        socket.on('logout', (msg) => {
            console.log(' << logout socket');
            _context.socket_log(' << logout socket msg:'+msg);
            $('.btn_connect_sock').removeClass('hide_view');
        });
        _context.socket_log(' ~ listen logout');
        socket.on('login', (msg) => {
            _context.socket_log(' << login socket msg:'+msg);
            if(msg === "ok"){
                _context.sock.login = true;
            }
            else if(msg === "kick"){
                _context.socket_models_emit.login.contextVO.onButtonClick();
            }
        });
        _context.socket_log(' ~ listen login');
        socket.on('temp', (data) => {
            _context.socket_log(' << temp listen data:'+JSON.stringify(data));
        });
        _context.socket_log(' ~ listen temp');

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
        _context.socket_log(' ~ listen '+msg);
    };

    let emitMessage = function(msg, body){
        socket.emit(msg, body);
        _context.socket_log(' >> emit msg: '+msg+' body: '+JSON.stringify(body));
    };

    _context.sock = {
        active : false,
        login : false,
        addEventListener : addEventListener,
        emit : emitMessage
    };
}







