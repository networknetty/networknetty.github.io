
let _context;

let _list_logs = [];

let _logs_screen = document.getElementById("logs_screen");
$(_logs_screen).addClass('hide_view');

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

    $('#btn_open_logs_screen').on('click', () => {
        $(_logs_screen).removeClass('hide_view');
    });
    $('#btn_close_logs_screen').on('click', () => {
        $(_logs_screen).addClass('hide_view');
    });

    let _btn_get_all_logs = document.getElementById("btn_get_all_logs");
    $(_btn_get_all_logs).on('click', () => {

        $(_btn_get_all_logs).addClass('hide_view');

        //todo after first -> update lasts
        if(_list_logs.length === 0)
            _context.callRest('/admin', {data:{}, action:'get_logs_list'}, data => {

                // console.log('logs component [get logs list] data: '+JSON.parse(data));
                for(let i=0; i<data.data.length; i++)
                    _list_logs.push( createLogsBlock( data.data[i] ) );

                if(_list_logs.length > 0)
                    _list_logs[_list_logs.length-1].update();

            });
        else{
            // $(_btn_get_all_logs).removeClass('hide_view');
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

function utilCreateDom(className, parentElement, tag){
    if(!className || !parentElement)
        return;
    if(!tag)
        tag = 'div';

    let proto = {
        element : document.createElement(tag),
        html : (html) => {
            proto.element.innerHTML = html;
            return proto;
        },
        id : (id) => {
            proto.element.id = id;
            return proto;
        }
    };

    proto.element.className = className;

    // proto.html = (html) => {
    //     proto.element.innerHTML = html;
    //     return proto;
    // };

    // proto.id = (id) => {
    //     proto.element.id = id;
    //     return proto;
    // };

    parentElement.appendChild(proto.element);

    return proto;
}

let _logs_area = document.getElementById("logs_work_area");
function createLogsBlock(name) {

    let _proto = {
        name : name,
        buttons : {},
        parsed_logs_objs : [],
        parsed_logs_elems : []
    };

    function createButtonToHead(btn_name, parent) {
        let b_up = document.createElement('input');
        b_up.type = 'button';
        b_up.value = btn_name;
        b_up.className = 'buttons';
        b_up.id = 'btn_'+btn_name+'_'+name;
        parent.appendChild(b_up);
        _proto.buttons[btn_name] = b_up;
        return b_up;
    }

    let _main = utilCreateDom('logs_block', _logs_area).element;
    let _header = utilCreateDom('logs_block_header', _main).element;
    let _title = utilCreateDom('logs_block_title', _header).html(name).element;
    utilCreateDom('logs_block_title_time', _header).html(' | time: [' + new Date(Number.parseInt(name)).toLocaleString() + ']');
    let _buttons = utilCreateDom('logs_block_buttons', _header).element;
    let _content = utilCreateDom('logs_block_content', _main).id('content_'+name).element;

    _proto.update = () => {
        //todo if last block && not opened
        _context.callRest('/admin', {data:{name:name}, action:'get_log_file_by_name'}, data => {
            // console.log('logs component [get log block data] data: '+JSON.stringify(data));
            // _content.innerHTML = JSON.stringify(data);

            parseLogs(data);

            if(!_content.classList.contains('active'))
                $(_content).addClass('active');

            if(!_proto.buttons.update.classList.contains('hide_view'))
                $(_proto.buttons.update).addClass('hide_view');
            if(!_proto.buttons.open.classList.contains('hide_view'))
                $(_proto.buttons.open).addClass('hide_view');
            if(_proto.buttons.close.classList.contains('hide_view'))
                $(_proto.buttons.close).removeClass('hide_view');

            if(_list_logs[_list_logs.length - 1].name === name){
                $(createButtonToHead('next', _content)).on('click', () => {

                    console.log('check next | current file: '+name+' | last time: '+
                        _proto.parsed_logs_objs[_proto.parsed_logs_objs.length-1].time);

                    //todo if last block
                    // _context.callRest('/admin', {data:{name:name}, action:'get_log_file_by_name'}, data => {
                    //     // console.log('logs component [get log block data] data: '+JSON.stringify(data));
                    // })
                });
                $(_proto.buttons.next).addClass('logs_next_button');
            }

        })
    };

    $(createButtonToHead('update', _buttons)).on('click', _proto.update);

    _proto.open = () => {
        $(_content).addClass('active');
        if(!_proto.buttons.open.classList.contains('hide_view'))
            $(_proto.buttons.open).addClass('hide_view');
        if(_proto.buttons.close.classList.contains('hide_view'))
            $(_proto.buttons.close).removeClass('hide_view');
    };
    $(createButtonToHead('open', _buttons)).on('click', _proto.open);
    $(_proto.buttons.open).addClass('hide_view');

    _proto.close = () => {
        $(_content).removeClass('active');
        if(!_proto.buttons.close.classList.contains('hide_view'))
            $(_proto.buttons.close).addClass('hide_view');
        if(_proto.buttons.open.classList.contains('hide_view'))
            $(_proto.buttons.open).removeClass('hide_view');
    };
    $(createButtonToHead('close', _buttons)).on('click', _proto.close);
    $(_proto.buttons.close).addClass('hide_view');

    function parseLogs(data) {

        function createLog(str){
            if(str.length === 0)
                return;

            str = '{'+str+'}';
            let obj;
            try {
                obj = JSON.parse(str);
                _proto.parsed_logs_objs.push(obj);
            }catch (e) {
                console.log('catch parse log str: '+str);
                return;
            }


            let i = document.createElement('div');
            _content.appendChild(i);
            _proto.parsed_logs_elems.push(i);

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

    return _proto;
}

