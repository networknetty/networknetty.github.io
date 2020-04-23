

function init_console(context) {
    let _context = context;

    let info_sock = document.getElementById('socket_console_block');
    function log_sock_console(msg) {
        let div = document.createElement('div');
        div.className = 'info_sock_console__item';
        div.innerHTML = "<div>"+msg+"</div>";
        info_sock.appendChild(div);
    }

    function log_sock_console_clear() {
        $('#socket_console_block').empty();
    }

    $('#btn_clear_socket_console').on('click', log_sock_console_clear);

    _context.log = log_sock_console;
    _context.socket_log = log_sock_console;
}


