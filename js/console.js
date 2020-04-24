

function init_console(context) {
    let _context = context;

    let info_sock = document.getElementById('socket_console_block');

    function log_sockOut(msg) {
        let div = document.createElement('div');
        div.className = 'info_sock_console__item';
        div.innerHTML = "<div class='console_item_sock_out'>"+msg+"</div>";
        info_sock.appendChild(div);
    }
    function log_sockIn(msg) {
        let div = document.createElement('div');
        div.className = 'info_sock_console__item';
        div.innerHTML = "<div class='console_item_sock_in'>"+msg+"</div>";
        info_sock.appendChild(div);
    }
    function log_error(msg) {
        let div = document.createElement('div');
        div.className = 'info_sock_console__item';
        div.innerHTML = "<div class='console_item_error'>"+msg+"</div>";
        info_sock.appendChild(div);
    }
    function log_debug(msg) {
        let div = document.createElement('div');
        div.className = 'info_sock_console__item';
        div.innerHTML = "<div class='console_item_debug'>"+msg+"</div>";
        info_sock.appendChild(div);
    }
    function log_else(msg) {
        let div = document.createElement('div');
        div.className = 'info_sock_console__item';
        div.innerHTML = "<div class='console_item_else'>"+msg+"</div>";
        info_sock.appendChild(div);
    }

    function log_sock_console_clear() {
        $('#socket_console_block').empty();
    }

    $('#btn_clear_socket_console').on('click', log_sock_console_clear);

    _context.log = {
        socketOut : log_sockOut,
        socketIn : log_sockIn,
        error : log_error,
        debug : log_debug,
        else : log_else
    };
}


