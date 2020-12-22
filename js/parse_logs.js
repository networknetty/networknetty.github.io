
$('#logs_screen').addClass('hide_view');
let _context;
function logsComponentLoginDone(context) {
    _context = context;
    document.getElementById("info_buttons_block").innerHTML = "<input type='button' value='LOGS' id='btn_open_logs_screen'>";
    $('#btn_open_logs_screen').on('click', openLogsScreen);
    $('#btn_close_logs_screen').on('click', closeLogsScreen);
    $('#btn_get_all_logs').on('click', fullLogsUpdate);
}

function openLogsScreen() {
    $('#logs_screen').removeClass('hide_view');


}

function closeLogsScreen() {
    $('#logs_screen').addClass('hide_view');


}

function fullLogsUpdate() {

    _context.callRest('/admin', {data:{}, action:'get_logs_list'}, data => {
        console.log('logs component [get logs list] data: '+data);
    })

}

