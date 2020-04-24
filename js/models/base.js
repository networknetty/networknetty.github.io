

function create_model(context, name, baseVO) {

    let _context = context;
    let _baseVO = baseVO.vo;

    _baseVO.contextVO = {
        oneItemUpdate : baseVO.oneItemUpdate,

        name : name,
        block : document.getElementById('model_block'),
        divID : "base_vo_"+name,

        info_hide : false,

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

        _context.log.debug('debug stringify name:'+_baseVO.contextVO.name);


        let str = "<div class='item_model_header'>";

        str += "<input type='button' value='i' class='button_toggle' id='btn_base_vo_info_"+_baseVO.contextVO.name+"'>";
        str += '<span class="item_title">'+_baseVO.contextVO.name+'</span>';

        str += '</div>';

        str += "<div class='block_toggle' id='base_model_block_text_"+_baseVO.contextVO.name+"'>";

        for(let field in _baseVO){
            if(field !== 'contextVO' && field !== 'listen' ){
                str += field + ' : '+ util_parse(_baseVO[field]) + '<br>';
            }
        }

        str += '</div>';



        return str;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    let _toggle_info = function(duration, dontChangeBool){
        $('#base_model_block_text_'+_baseVO.contextVO.name).animate({ height: 'toggle' }, duration);
        if(dontChangeBool !== true)
            _baseVO.contextVO.info_hide = !_baseVO.contextVO.info_hide;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    _baseVO.contextVO.updateVO = function () {
        _context.log.debug("debug model updateVO name: "+_baseVO.contextVO.name);
        let vo = document.getElementById(_baseVO.contextVO.divID);
        vo.innerHTML = _baseVO.contextVO.stringify();

        $('#btn_base_vo_info_'+ _baseVO.contextVO.name).on('click', _toggle_info);
        if(_baseVO.contextVO.info_hide === true){
            _toggle_info(2, true);
        }
    };

    initListenersBody(_context, _baseVO);

    _baseVO.contextVO.init = function () {
        initEventListeners(_context, _baseVO);
        _baseVO.contextVO.updateVO();
        _toggle_info(2);
    };

    return _baseVO;
}

function init_models(context) {
    let _context = context;
    _context.models = {};

    createMainRestVO(_context, _context.config.models.base.vo);

    for(let name_model in _context.config.models){
        if(name_model !== "base")
            _context.models[name_model] = create_model(_context, name_model, _context.config.models[name_model]);
    }
    _context.log.debug('init models done');
}

function activated_models(context) {
    for(let name_model in context.models){
        context.models[name_model].contextVO.init();
    }
}




