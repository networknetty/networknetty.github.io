
$('#logs_screen').addClass('hide_view');

function logsComponentLoginDone() {
    document.getElementById("info_buttons_block").innerHTML = "<input type='button' value='LOGS' id='btn_open_logs_screen'>";
    $('#btn_open_logs_screen').on('click', openLogsScreen);
    $('#btn_close_logs_screen').on('click', closeLogsScreen);
}

function openLogsScreen() {
    $('#logs_screen').removeClass('hide_view');


}

function closeLogsScreen() {
    $('#logs_screen').addClass('hide_view');


}
