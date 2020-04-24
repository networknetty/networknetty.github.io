

function init_console(context) {
    let _context = context;
    let _debug_hide = false;

    let info_sock = document.getElementById('socket_console_block');

    let time = function () {
        let now = Date.now()/1000;
        let s = Math.floor(now/60);
        return "["+now+"/"+s+"]";
    };

    function log_sockOut(msg) {
        let div = document.createElement('div');
        div.className = 'console_item_sock_out';
        div.innerHTML = time()+msg+"</br>";
        info_sock.appendChild(div);
    }
    function log_sockIn(msg) {
        let div = document.createElement('div');
        div.className = 'console_item_sock_in';
        div.innerHTML = time()+msg+"</br>";
        info_sock.appendChild(div);
    }
    function log_error(msg) {
        let div = document.createElement('div');
        div.className = 'console_item_error';
        div.innerHTML = time()+msg+"</br>";
        info_sock.appendChild(div);
    }
    function log_debug(msg) {
        let div = document.createElement('div');
        let clss = 'console_item_debug';
        if(_debug_hide === true)
            clss += ' hide_view';
        div.className = clss;
        div.innerHTML = time()+msg+"</br>";
        info_sock.appendChild(div);
    }
    function log_else(msg) {
        let div = document.createElement('div');
        div.className = 'console_item_else';
        div.innerHTML = time()+msg+"</br>";
        info_sock.appendChild(div);
    }

    function log_sock_console_clear() {
        $('#socket_console_block').empty();
    }

    $('#btn_clear_socket_console').on('click', log_sock_console_clear);


    function console_toggle_debug() {
        _debug_hide = !_debug_hide;
        if(_debug_hide === true)
            $('.console_item_debug').addClass('hide_view');
        else
            $('.console_item_debug').removeClass('hide_view');
    }


    $('#btn_toggle_debug_socket_console').on('click', console_toggle_debug);

    _context.log = {
        socketOut : log_sockOut,
        socketIn : log_sockIn,
        error : log_error,
        debug : log_debug,
        else : log_else
    };
}


