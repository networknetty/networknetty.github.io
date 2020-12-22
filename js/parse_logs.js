
$('#logs_screen').addClass('hide_view');
let _context;

let _list_logs = [];
let _btn_filter_info = document.getElementById("btn_filter_info");
let _btn_filter_socket = document.getElementById("btn_filter_socket");
let _btn_filter_request = document.getElementById("btn_filter_request");
let _btn_filter_response = document.getElementById("btn_filter_response");
let _btn_filter_response_error = document.getElementById("btn_filter_response_error");
let _btn_filter_error = document.getElementById("btn_filter_error");
let _btn_filter_debug = document.getElementById("btn_filter_debug");
let _btn_filter_warning = document.getElementById("btn_filter_warning");

let _filters_states = {};

function logsComponentLoginDone(context) {
    _context = context;

    document.getElementById("info_buttons_block").innerHTML = "<input type='button' value='LOGS' id='btn_open_logs_screen'>";

    $('#btn_open_logs_screen').on('click', openLogsScreen);
    $('#btn_close_logs_screen').on('click', closeLogsScreen);
    $('#btn_get_all_logs').on('click', () => {

        //todo after first -> update lasts
        if(_list_logs.length === 0)
            _context.callRest('/admin', {data:{}, action:'get_logs_list'}, data => {
                // console.log('logs component [get logs list] data: '+JSON.parse(data));
                updateLogsList(data.data);
            });
        else{
            console.log('need update last logs!!! last file: '+_list_logs[_list_logs.length-1]);
        }

    });

    function filterButtonToggle(element, key){
        _filters_states[key] = true;
        $(element).on('click', () => {
            if(element.classList.contains('active')){
                _filters_states[key] = false;
                $(element).removeClass('active');
                $('.'+key).addClass('hide_view');
            } else{
                _filters_states[key] = true;
                $(element).addClass('active');
                $('.'+key).removeClass('hide_view');
            }
        });
    }

    filterButtonToggle(_btn_filter_info, 'log_info');
    filterButtonToggle(_btn_filter_socket, 'log_socket');
    filterButtonToggle(_btn_filter_request, 'log_request');
    filterButtonToggle(_btn_filter_response, 'log_response');
    filterButtonToggle(_btn_filter_response_error, 'log_response_error');
    filterButtonToggle(_btn_filter_error, 'log_error');
    filterButtonToggle(_btn_filter_debug, 'log_debug');
    filterButtonToggle(_btn_filter_warning, 'log_response_warning');

}

function openLogsScreen() {
    $('#logs_screen').removeClass('hide_view');


}

function closeLogsScreen() {
    $('#logs_screen').addClass('hide_view');


}

let _logs_area = document.getElementById("logs_work_area");
function createLogsBlock(name) {

    _list_logs.push(name);

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

    let t_i = document.createElement('div');
    t_i.className = 'logs_block_title_time';
    let _t_i_d = new Date(Number.parseInt(name));
    t_i.innerHTML = ' | time: [' + _t_i_d.toLocaleString() + ']';
    h.appendChild(t_i);

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

            if(!c.classList.contains('active'))
                $(c).addClass('active');

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

                if(_filters_states['log_'+obj.type.toLowerCase()] === false)
                    i.className += ' hide_view';

                let _type_c = document.createElement('div');
                _type_c.className = 'log_item_sub log_type';
                _type_c.innerHTML = " type: [" + obj.type + "]";
                i.appendChild(_type_c);
            }


            if(obj.time){
                let _t_int = Number.parseInt(obj.time);
                let _t = new Date(_t_int);
                let _time_c = document.createElement('div');
                _time_c.className = 'log_item_sub log_time_container';
                _time_c.innerHTML = " | time: [" + obj.time + " | " + Math.trunc(_t_int/60000) + " | " + _t.toLocaleString() + "]";

                i.appendChild(_time_c);
            }

            if(obj.key){
                let _k_c = document.createElement('div');
                _k_c.className = 'log_item_sub log_key';
                _k_c.innerHTML = " | key: [" + obj.key + "]";
                i.appendChild(_k_c);
            }

            if(obj.from){
                let _f_c = document.createElement('div');
                _f_c.className = 'log_item_sub log_from';
                _f_c.innerHTML = " | from: [" + obj.from + "]";
                i.appendChild(_f_c);
            }

            if(obj.action){
                let _a_c = document.createElement('div');
                _a_c.className = 'log_item_sub log_action';
                _a_c.innerHTML = " | action: [" + obj.action + "]";
                i.appendChild(_a_c);
            }

            if(obj.data){
                let _d_c = document.createElement('div');
                _d_c.className = 'log_item_sub log_data';
                _d_c.innerHTML = " | data: [" + JSON.stringify(obj.data) + "]";
                i.appendChild(_d_c);
            }

            if(obj.msg){
                let _m_c = document.createElement('div');
                _m_c.className = 'log_item_sub log_msg';
                _m_c.innerHTML = " | msg: [" + obj.msg + "]";
                i.appendChild(_m_c);
            }

            if(obj.error){
                let _e_c = document.createElement('div');
                _e_c.className = 'log_item_sub log_error';
                _e_c.innerHTML = " | error: [" + obj.error + "]";
                i.appendChild(_e_c);
            }

            if(obj.code){
                let _ec_c = document.createElement('div');
                _ec_c.className = 'log_item_sub log_code';
                _ec_c.innerHTML = " | code: [" + obj.code + "]";
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

