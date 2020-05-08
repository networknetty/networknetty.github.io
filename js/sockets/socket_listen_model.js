

function create_socket_listen_model(context, name, baseVO) {
    if(baseVO == null)
        return null;

    let _context = context;
    let _baseVO = initBaseVO(context, baseVO, name, "socket_vo_"+name,
        document.getElementById('socket_emit_block'));
    _baseVO.context.info_hide = false;
    _baseVO.context.last_hide = false;
    initSocketListeners(context, _baseVO);

    _baseVO.context.stringify = function (){
        // _context.log.debug('debug stringify name:'+_baseVO.context.name);
        let str = '<div class="item_header">';
        str += "<input type='button' value='i' class='button_toggle' id='btn_sock_listen_info_"+ _baseVO.context.name+"'>";
        str += '<span class="item_title">'+_baseVO.context.name+'</span>';
        str += "<input type='button' value='l' class='button_toggle' id='btn_sock_listen_last_"+ _baseVO.context.name+"'>";
        str += "</div>";

        str += "<div class='block_toggle' id='sock_listen_info_"+_baseVO.context.name+"'>";
        str += 'data : '+ util_parse(_baseVO.vo) + '<br>';
        str += 'actions : '+ util_parse(_baseVO.actions) + '</div>';

        str += "<div class='block_toggle' id='sock_listen_last_"+_baseVO.context.name+"'>";
        str += 'last : '+ JSON.stringify(_baseVO.last) + '</div>';

        return str;
    };

    _baseVO.context.updateVO = function () {
        // _context.log.debug("debug model updateVO name: "+_baseVO.context.name);
        let vo = document.getElementById("socket_vo_"+name);
        vo.innerHTML = _baseVO.context.stringify();

        $('.button_expand_obj').on('click', expand_reaction_obj);
        $('.button_expand_arr').on('click', expand_reaction_arr);

        $('#btn_sock_listen_info_'+ _baseVO.context.name).on('click', _toggle_info);
        $('#btn_sock_listen_last_'+ _baseVO.context.name).on('click', _toggle_last);

        if(_baseVO.context.info_hide === true){
            _toggle_info(2, true);
        }
        if(_baseVO.context.last_hide === true){
            _toggle_last(2, true);
        }
    };

    _baseVO.context.init = function () {
        _context.sock.addEventListener(_baseVO.context.name, _baseVO.context.socketHandler);
    };


    /////////////////////////////////////////////////////////////////////////////////////
    let _toggle_info = function(duration, dontChangeBool){
        $('#sock_listen_info_'+_baseVO.context.name).animate({ height: 'toggle' }, duration);
        if(dontChangeBool !== true)
            _baseVO.context.info_hide = !_baseVO.context.info_hide;
    };
    let _toggle_last = function(duration, dontChangeBool){
        $('#sock_listen_last_'+_baseVO.context.name).animate({ height: 'toggle' }, duration);
        if(dontChangeBool !== true)
            _baseVO.context.last_hide = !_baseVO.context.last_hide;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    _baseVO.context.updateVO();

    _toggle_info(2);
    _toggle_last(2);

    return _baseVO;
}

function init_socket_listen_models(context) {
    let _context = context;
    _context.socket_models_listen = {};

    for(let name_model in _context.config.socket_models_listen){
        _context.socket_models_listen[name_model] = create_socket_listen_model(_context, name_model,
            _context.config.socket_models_listen[name_model]);
    }
    _context.log.debug('init socket_models done');
}

function activated_socket_listen_models(context) {
    for(let name_model in context.socket_models_listen){
        context.socket_models_listen[name_model].context.init();
    }
}




