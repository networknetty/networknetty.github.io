

function create_socket_model(context, name, baseVO) {
    let _context = context;
    let _baseVO = initBaseVO(context, baseVO, name, "socket_vo_"+name,
        document.getElementById('socket_emit_block'));

    _baseVO.context.stringify = function (){
        // _context.log.debug('debug stringify name:'+_baseVO.context.name);
        let str = "<div class='item_model_header'>";
        str += '<span class="item_title">'+_baseVO.context.name+'</span>';
        str += "<input type='button' value='>>' class='"+ (_context.sock.active !== true ? "hide_view" : "")+
            " button_toggle socket_buttons' id='btn_sock_"+ _baseVO.context.name+"'>";
        str += '</div>';
        str += "<div class='block_toggle'>";

        for(let field in _baseVO.vo){
            // if(field !== 'context' && field !== 'listen' ){
                str += field + ' : '+ util_parse(_baseVO.vo[field]) + '<br>';
            // }
        }

        str += "</div>";
        return str;
    };

    _baseVO.context.updateVO = function () {
        _context.log.debug("debug model updateVO name: "+_baseVO.context.name);
        let vo = document.getElementById("socket_vo_"+name);
        vo.innerHTML = _baseVO.context.stringify();
        // $('.button_expand_obj').on('click', expand_reaction_obj);
        // $('.button_expand_arr').on('click', expand_reaction_arr);
        $('#btn_sock_'+_baseVO.context.name).on('click', _baseVO.context.run);
    };

    _baseVO.context.run = function () {
        _context.sock.emit(_baseVO.vo.msg, _baseVO.vo.body);
    };

    _baseVO.context.init = function () {
        _baseVO.context.initListeners();
        _baseVO.context.updateVO();
    };

    _baseVO.context.setParam = function (key, value) {
        if(_baseVO.vo[key] !== value){
            _baseVO.vo[key] = value;
            _baseVO.context.updateVO();
        }
    };

    _baseVO.context.setParams = function (vo, current) {
        for(let field in vo){
            if(_baseVO.vo[field] !== vo[field]){
                _baseVO.vo[field] = vo[field];
            }
        }
        _baseVO.context.updateVO();
    };

    return _baseVO;
}

function init_socket_models(context) {
    let _context = context;
    _context.socket_models_emit = {};

    for(let name_model in _context.config.socket_models_emit){
        _context.socket_models_emit[name_model] = create_socket_model(_context, name_model,
            _context.config.socket_models_emit[name_model]);
    }
    _context.log.debug('init socket_models done');
}

function activated_socket_models(context) {
    for(let name_model in context.socket_models_emit){
        context.socket_models_emit[name_model].context.init();
    }
}




