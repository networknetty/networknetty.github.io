

function create_model(context, name, baseVO) {
    let _context = context;
    let _baseVO = initBaseVO(context, baseVO, name, "base_vo_"+name,
        document.getElementById('model_block'));
    _baseVO.context.info_hide = false;
    initMonoSetParams(context, _baseVO);

    _baseVO.context.stringify = function (){
        // _context.log.debug('debug stringify name:'+_baseVO.context.name);
        let str = "<div class='item_model_header'>";
        str += "<input type='button' value='i' class='button_toggle' id='btn_base_vo_info_"+_baseVO.context.name+"'>";
        str += '<span class="item_title">'+_baseVO.context.name+'</span>';
        str += '</div>';

        str += '<span class="id_title"> id: '+_baseVO.vo.id+'</span>';
        str += "<div class='block_toggle' id='base_model_block_text_"+_baseVO.context.name+"'>";

        for(let field in _baseVO.vo){
            // if(field !== 'context' && field !== 'listen' ){
                str += field + ' : '+ util_parse(_baseVO.vo[field]) + '<br>';
            // }
        }
        str += '</div>';
        return str;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    let _toggle_info = function(duration, dontChangeBool){
        $('#base_model_block_text_'+_baseVO.context.name).animate({ height: 'toggle' }, duration);
        if(dontChangeBool !== true)
            _baseVO.context.info_hide = !_baseVO.context.info_hide;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    _baseVO.context.updateVO = function () {
        _context.log.debug("debug model updateVO name: "+_baseVO.context.name);
        let vo = document.getElementById("base_vo_"+_baseVO.context.name);
        vo.innerHTML = _baseVO.context.stringify();

        $('#btn_base_vo_info_'+ _baseVO.context.name).on('click', _toggle_info);
        if(_baseVO.context.info_hide === true){
            _toggle_info(2, true);
        }
    };

    _baseVO.context.init = function () {
        _baseVO.context.initListeners();
        _baseVO.context.updateVO();
        _toggle_info(2);
    };

    return _baseVO;
}

function init_models(context) {
    let _context = context;
    _context.models = {};

    createMainRestVO(_context, _context.config.models.base);

    for(let name_model in _context.config.models){
        if(name_model !== "base")
            _context.models[name_model] = create_model(_context, name_model, _context.config.models[name_model]);
    }
    _context.log.debug('init models done');
}

function activated_models(context) {
    for(let name_model in context.models){
        context.models[name_model].context.init();
    }
}




