
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
            // console.log('logs component [get log block data] data: '+JSON.stringify(data));
            // c.innerHTML = JSON.stringify(data);

            parseLogs(data);

        })
    });
    $(createButtonToHead('open', bb)).on('click', () => {
        $(c).addClass('active');
    });
    $(createButtonToHead('close', bb)).on('click', () => {
        $(c).removeClass('active');
    });


    function parseLogs(data) {

        function createLog(str){
            str = '{'+str+'}';
            let obj;
            try {
                obj = JSON.parse(str);
            }catch (e) {
                console.log('catch parse log str: '+str);
                return;
            }


            let i = document.createElement('div');
            c.appendChild(i);

            if(obj.type){
                i.className = 'log_item log_'+obj.type.toLowerCase();
            }


            if(obj.time){
                let _t = new Date(obj.time);
                let _time_c = document.createElement('div');
                _time_c.className = 'log_time_container';
                _time_c.innerHTML = _t.toUTCString();
                i.appendChild(_time_c);
            }

            if(obj.key){
                let _k_c = document.createElement('div');
                _k_c.className = 'log_key';
                _k_c.innerHTML = obj.key;
                i.appendChild(_k_c);
            }

            if(obj.from){
                let _f_c = document.createElement('div');
                _f_c.className = 'log_from';
                _f_c.innerHTML = obj.from;
                i.appendChild(_f_c);
            }

            if(obj.action){
                let _a_c = document.createElement('div');
                _a_c.className = 'log_action';
                _a_c.innerHTML = obj.action;
                i.appendChild(_a_c);
            }

            if(obj.data){
                let _d_c = document.createElement('div');
                _d_c.className = 'log_data';
                _d_c.innerHTML = JSON.stringify(obj.data);
                i.appendChild(_d_c);
            }

            if(obj.msg){
                let _m_c = document.createElement('div');
                _m_c.className = 'log_msg';
                _m_c.innerHTML = obj.msg;
                i.appendChild(_m_c);
            }

            if(obj.error){
                let _e_c = document.createElement('div');
                _e_c.className = 'log_error';
                _e_c.innerHTML = obj.error;
                i.appendChild(_e_c);
            }

            if(obj.code){
                let _ec_c = document.createElement('div');
                _ec_c.className = 'log_code';
                _ec_c.innerHTML = obj.code;
                i.appendChild(_ec_c);
            }
        }

        let _split_arr = data.split('/%\n');
        for(let i=0; i<_split_arr.length; i++){
            createLog(_split_arr[i]);
        }
    }
}

function updateLogsList(data) {

    for(let i=0; i<data.length; i++)
        createLogsBlock(data[i]);

}

function updateFullLogs(data) {



}

