
$('#logs_screen').addClass('hide_view');
let _context;
function logsComponentLoginDone(context) {
    _context = context;
    document.getElementById("info_buttons_block").innerHTML = "<input type='button' value='LOGS' id='btn_open_logs_screen'>";
    $('#btn_open_logs_screen').on('click', openLogsScreen);
    $('#btn_close_logs_screen').on('click', closeLogsScreen);
    $('#btn_get_all_logs').on('click', () => {
        _context.callRest('/admin', {data:{}, action:'get_logs_list'}, data => {
            // console.log('logs component [get logs list] data: '+JSON.parse(data));
            updateLogsList(data.data);
        })
    });
}

function openLogsScreen() {
    $('#logs_screen').removeClass('hide_view');


}

function closeLogsScreen() {
    $('#logs_screen').addClass('hide_view');


}

let _logs_area = document.getElementById("logs_work_area");
function createLogsBlock(name) {

    function createButtonToHead(btn_name, parent) {
        let b_up = document.createElement('input');
        b_up.type = 'button';
        b_up.value = btn_name;
        b_up.className = 'buttons';
        b_up.id = 'btn_'+btn_name+'_'+name;
        parent.appendChild(b_up);
        return b_up;
    }

    let e = document.createElement('div');
    e.className = 'logs_block';
    _logs_area.appendChild(e);

    let h = document.createElement('div');
    h.className = 'logs_block_header';
    e.appendChild(h);

    let t = document.createElement('div');
    t.className = 'logs_block_title';
    t.innerHTML = name;
    h.appendChild(t);

    let bb = document.createElement('div');
    bb.className = 'logs_block_buttons';
    h.appendChild(bb);

    let c = document.createElement('div');
    c.className = 'logs_block_content';
    c.id = 'content_'+name;
    e.appendChild(c);

    $(createButtonToHead('update', bb)).on('click', () => {
        //todo if last block && not opened
        _context.callRest('/admin', {data:{name:name}, action:'get_log_file_by_name'}, data => {
            console.log('logs component [get log block data] data: '+JSON.stringify(data));
            c.innerHTML = JSON.stringify(data);
        })
    });
    $(createButtonToHead('open', bb)).on('click', () => {
        $(c).addClass('active');
    });
    $(createButtonToHead('close', bb)).on('click', () => {
        $(c).removeClass('active');
    });


}

function updateLogsList(data) {

    for(let i=0; i<data.length; i++)
        createLogsBlock(data[i]);

}

function updateFullLogs(data) {



}

