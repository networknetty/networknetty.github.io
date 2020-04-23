

function create_socket_model(context, name, baseVO) {

    let _context = context;
    let _baseVO = baseVO;

    _baseVO.contextVO = {

        name : name,
        block : document.getElementById('socket_emit_block'),
        divID : "socket_vo_"+name,

        listen_component : {},
        list_component : {
            checkItsListForUpdate : function(trigger, value){}
        },

        updateVO : function () {},
        dispatchEvent : function (trigger, value) {},
        socketEvent : function (trigger, data) {},
        addEventListener : function (trigger, func) {},
        init : function () {},
        stringify : function () {},

        onButtonClick : function () {}
    };

    let div = document.createElement('div');
    div.className = 'model_item';
    div.id = _baseVO.contextVO.divID;
    _baseVO.contextVO.block.appendChild(div);

    _baseVO.contextVO.stringify = function (){

        console.log('debug stringify name:'+_baseVO.contextVO.name);


        let str = "<div class='item_model_header'>";

        str += '<span class="item_title">'+_baseVO.contextVO.name+'</span>';
        str += "<input type='button' value='>>' class='"+ (_context.sock.active !== true ? "hide_view" : "")+
            " button_toggle socket_buttons' id='btn_sock_"+ _baseVO.contextVO.name+"'>";
        str += '</div>';



        str += "<div class='block_toggle'>";

        for(let field in _baseVO){
            if(field !== 'contextVO' && field !== 'listen' ){
                str += field + ' : '+ util_parse(_baseVO[field]) + '<br>';
            }
        }

        str += "</div>";

        return str;
    };

    _baseVO.contextVO.updateVO = function () {
        console.log("debug model updateVO name: "+_baseVO.contextVO.name);
        let vo = document.getElementById(_baseVO.contextVO.divID);
        vo.innerHTML = _baseVO.contextVO.stringify();
        $('#btn_sock_'+_baseVO.contextVO.name).on('click', _baseVO.contextVO.onButtonClick);
    };

    _baseVO.contextVO.onButtonClick = function () {
        _context.sock.emit(_baseVO.msg, _baseVO.body);
    };

    initListenersBody(_context, _baseVO);

    _baseVO.contextVO.init = function () {
        initEventListeners(_context, _baseVO);
        _baseVO.contextVO.updateVO();
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
    console.log('init socket_models done');
}

function activated_socket_models(context) {
    for(let name_model in context.socket_models_emit){
        context.socket_models_emit[name_model].contextVO.init();
    }
}




