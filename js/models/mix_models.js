

function create_mix_model(context, name, baseVO) {
    let _context = context;
    let _baseVO = initBaseVO(context, baseVO, name, "mix_vo_"+name,
        document.getElementById('model_block'));
    _baseVO.context.info_hide = false;
    _baseVO.context.arrVO = [];
    _baseVO.context.arrKeys = [];
    _baseVO.context.current = "";

    initMixSetParams(context, _baseVO);

/////////////////////////////////////////////////////
    let obj = {};
    obj[_baseVO.context.name] = function (e) {
        let value = this.value;
        let selectedIndex = this.selectedIndex;

        // _context.log.debug("debug dispatchList item_ name:"+_context.models.base.context.name +
        //     " value: "+value+" selectedIndex: "+selectedIndex);

        if(_baseVO.context.arrKeys.length > 0){
            if(selectedIndex == null)
                selectedIndex = 0;
        }
        if(value == null){
            value = _baseVO.context.arrKeys.length > 0 ? _baseVO.context.arrKeys[0] : "";
        }

        _context.log.debug("debug dispatchList after value: "+value+" selectedIndex: "+selectedIndex);
        _baseVO.context.list_component.setIndex(_baseVO.context.name, selectedIndex);
        _baseVO.context.setCurrent(value);
    };

    createListComponent(_context, _baseVO, obj);
/////////////////////////////////////////////////////

    _baseVO.context.stringify = function (){
        // _context.log.debug('debug stringify name:'+_baseVO.context.name);
        let str = "<div class='item_model_header'>";
        str += "<input type='button' value='i' class='button_toggle' id='btn_mix_vo_info_"+_baseVO.context.name+"'>";
        str += '<span class="item_title">'+_baseVO.context.name+'</span>';
        str += '</div>';

        str += _baseVO.context.list_component.createListTitle(_baseVO.context.name,
            'mix_vo_'+_baseVO.context.name+'_list', _baseVO.context.arrKeys);

        str += "<div class='block_toggle' id='mix_model_block_text_"+_baseVO.context.name+"'>";

        for(let i=0; i<_baseVO.context.arrVO.length; i++){
            str += "<div class='mix_model_item";
            if(_baseVO.context.arrVO[i].id !== _baseVO.context.current){
                str += " hide_view";
            }
            str += "' id='model_item_"+ _baseVO.context.name+"_"+i+"'>";
            for(let field in _baseVO.vo){
                // if(field !== 'context' && field !== 'listen' ){
                    str += field + ' : '+ util_parse(_baseVO.context.arrVO[i][field]) + '<br>';
                // }
            }
            str += '</div>';
        }

        str += '</div>';


        return str;
    };

////////////////////////////////////////////////////////////////////////
    let _toggle_info = function(duration, dontChangeBool){
        $('#mix_model_block_text_'+_baseVO.context.name).animate({ height: 'toggle' }, duration);
        if(dontChangeBool !== true)
            _baseVO.context.info_hide = !_baseVO.context.info_hide;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    _baseVO.context.updateVO = function () {
        _context.log.debug("debug mix_model updateVO name: "+_baseVO.context.name);
        let vo = document.getElementById("mix_vo_"+name);
        vo.innerHTML = _baseVO.context.stringify();
        $('.button_expand_obj').on('click', expand_reaction_obj);
        $('.button_expand_arr').on('click', expand_reaction_arr);

        _baseVO.context.list_component.updateLists();

        $('#btn_mix_vo_info_'+ _baseVO.context.name).on('click', _toggle_info);
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

function init_mix_models(context) {
    context.mix_models = {};
    for(let name_model in context.config.mix_models){
        context.mix_models[name_model] = create_mix_model(context, name_model, context.config.mix_models[name_model]);
    }
    context.log.debug('init mix_models done');
}

function activated_mix_models(context) {
    for(let name_model in context.mix_models){
        context.mix_models[name_model].context.init();
    }
}