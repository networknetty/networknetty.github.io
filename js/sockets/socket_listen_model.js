

function create_socket_listen_model(context, name, baseVO) {

    let _context = context;
    let _baseVO = baseVO;
    _baseVO.last = [];
    _baseVO.contextVO = {

        name : name,
        block : document.getElementById('socket_emit_block'),
        divID : "socket_vo_"+name,

        info_hide : false,
        last_hide : false,

        listen_component : {},
        list_component : {
            checkItsListForUpdate : function(trigger, value){}
        },

        updateVO : function () {},
        dispatchEvent : function (trigger, value) {},
        socketEvent : function (trigger, data) {},
        addEventListener : function (trigger, func) {},
        init : function () {},
        stringify : function () {}
    };

    let div = document.createElement('div');
    div.className = 'model_item';
    div.id = _baseVO.contextVO.divID;
    _baseVO.contextVO.block.appendChild(div);

    _baseVO.contextVO.stringify = function (){

        console.log('debug stringify name:'+_baseVO.contextVO.name);


        let str = '<div class="item_header">';
        str += "<input type='button' value='i' class='button_toggle' id='btn_sock_listen_info_"+ _baseVO.contextVO.name+"'>";
        str += '<span class="item_title">'+_baseVO.contextVO.name+'</span>';
        str += "<input type='button' value='l' class='button_toggle' id='btn_sock_listen_last_"+ _baseVO.contextVO.name+"'>";
        str += "</div>";


        str += "<div class='block_toggle' id='sock_listen_info_"+_baseVO.contextVO.name+"'>";
        str += 'data : '+ util_parse(_baseVO.data) + '<br>';
        str += 'actions : '+ util_parse(_baseVO.actions) + '</div>';

        str += "<div class='block_toggle' id='sock_listen_last_"+_baseVO.contextVO.name+"'>";
        str += 'last : '+ JSON.stringify(_baseVO.last) + '</div>';


        return str;
    };

    _baseVO.contextVO.updateVO = function () {
        console.log("debug model updateVO name: "+_baseVO.contextVO.name);
        let vo = document.getElementById(_baseVO.contextVO.divID);
        vo.innerHTML = _baseVO.contextVO.stringify();

        $('#btn_sock_listen_info_'+ _baseVO.contextVO.name).on('click', _toggle_info);
        $('#btn_sock_listen_last_'+ _baseVO.contextVO.name).on('click', _toggle_last);

        if(_baseVO.contextVO.info_hide === true){
            _toggle_info(2, true);
        }
        if(_baseVO.contextVO.last_hide === true){
            _toggle_info(2, true);
        }
    };

    // initListenersBody(_baseVO);

    let activate_action = function (node, data){

        if(node.if != null){
            for(let field in node.if){
                if(node.if[field].param === "==="){
                    if(data[field] !== _context.models[node.if[field].type][node.if[field].name_vo]){
                        console.log('----debug socket activate_action if node: '+JSON.stringify(node.if)+' context: '+
                            _context.models[node.if[field].type][node.if[field].name_vo]);
                        return;
                    }
                }
                else if(node.if[field].param === "array_exists"){
                    if( data[field].indexOf(_context.models[node.if[field].type][node.if[field].name_vo]) < 0 ){
                        console.log('----debug socket activate_action if node: '+JSON.stringify(node.if)+' context: '+
                            _context.models[node.if[field].type][node.if[field].name_vo]);
                        return;
                    }
                }
            }
        }

        let body = node.key != null ? data[node.key] : data;
        _context[node.type][node.name_vo].contextVO.socketEvent(
                node.trigger,
                body,
                node.field != null ? data[node.field] : null
            );
    };

    let socketHandler = function(data){
        _context.socket_log(' << socket handler('+_baseVO.contextVO.name+') data:'+JSON.stringify(data));

        if(_baseVO.actions[data.action] != null){

            for(let i=0; i<_baseVO.actions[data.action].length; i++){
                activate_action(_baseVO.actions[data.action][i], data.data);
            }

        }else if(_baseVO.actions.default != null){

            for(let i=0; i<_baseVO.actions.default.length; i++){
                activate_action(_baseVO.actions.default[i], data.data);
            }

        }

        _baseVO.last.push(data.data);

        _baseVO.contextVO.updateVO();
    };


    _baseVO.contextVO.init = function () {
        // initEventListeners(_context, _baseVO);
        // _baseVO.contextVO.updateVO();

        _context.sock.addEventListener(_baseVO.contextVO.name, socketHandler);
    };


    /////////////////////////////////////////////////////////////////////////////////////
    let _toggle_info = function(duration, dontChangeBool){
        $('#sock_listen_info_'+_baseVO.contextVO.name).animate({ height: 'toggle' }, duration);
        if(dontChangeBool !== true)
            _baseVO.contextVO.info_hide = !_baseVO.contextVO.info_hide;
    };
    let _toggle_last = function(duration, dontChangeBool){
        $('#sock_listen_last_'+_baseVO.contextVO.name).animate({ height: 'toggle' }, duration);
        if(dontChangeBool !== true)
            _baseVO.contextVO.last_hide = !_baseVO.contextVO.last_hide;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    _baseVO.contextVO.updateVO();

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
    console.log('init socket_models done');
}

function activated_socket_listen_models(context) {
    for(let name_model in context.socket_models_listen){
        context.socket_models_listen[name_model].contextVO.init();
    }
}




