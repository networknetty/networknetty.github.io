

function create_mix_model(context, name, baseVO) {

    let _context = context;
    let _baseVO = baseVO.vo;

    _baseVO.contextVO = {
        oneItemUpdate : baseVO.oneItemUpdate,
        fullUpdate : baseVO.fullUpdate,

        arrVO : [],
        arrKeys : [],
        current : "",
        name : name,
        block : document.getElementById('model_block'),
        divID : "mix_vo_"+name,

        info_hide : false,

        listen_component : {},
        list_component : {
            // createListTitle : function (name, arr){},
            // updateLists : function updateLists(){},
            // setIndex : function setIndex(name, value){},
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

/////////////////////////////////////////////////////
    let obj = {};
    obj[_baseVO.contextVO.name] = function (e) {
        let value = this.value;
        let selectedIndex = this.selectedIndex;

        _context.log.debug("debug dispatchList item_ name:"+_context.models.base.contextVO.name +
            " value: "+value+" selectedIndex: "+selectedIndex);

        if(_baseVO.contextVO.arrKeys.length > 0){
            if(selectedIndex == null)
                selectedIndex = 0;
        }
        if(value == null){
            if(_baseVO.contextVO.arrKeys.length > 0){
                value = _baseVO.contextVO.arrKeys[0];
            }else{
                value = "";
            }
        }

        _context.log.debug("debug dispatchList after value: "+value+" selectedIndex: "+selectedIndex);
        _baseVO.contextVO.list_component.setIndex(_baseVO.contextVO.name, selectedIndex);
        _baseVO.contextVO.dispatchEvent('current', value);
    };

    createListComponent(_context, _baseVO, obj);
/////////////////////////////////////////////////////

    _baseVO.contextVO.stringify = function (){

        _context.log.debug('debug stringify name:'+_baseVO.contextVO.name);

        let str = "<div class='item_model_header'>";
        str += "<input type='button' value='i' class='button_toggle' id='btn_mix_vo_info_"+_baseVO.contextVO.name+"'>";
        str += '<span class="item_title">'+_baseVO.contextVO.name+'</span>';
        str += '</div>';


        str += _baseVO.contextVO.list_component.createListTitle(_baseVO.contextVO.name,
            'mix_vo_'+_baseVO.contextVO.name+'_list', _baseVO.contextVO.arrKeys);


        str += "<div class='block_toggle' id='mix_model_block_text_"+_baseVO.contextVO.name+"'>";

        for(let i=0; i<_baseVO.contextVO.arrVO.length; i++){

            str += "<div class='mix_model_item";

            if(_baseVO.contextVO.arrVO[i].id !== _baseVO.contextVO.current){
                str += " hide_view";
            }

            str += "' id='model_item_"+ _baseVO.contextVO.name+"_"+i+"'>";


            for(let field in _baseVO){
                if(field !== 'contextVO' && field !== 'listen' ){
                    str += field + ' : '+ util_parse(_baseVO.contextVO.arrVO[i][field]) + '<br>';
                }
            }
            str += '</div>';

        }

        str += '</div>';


        return str;
    };

////////////////////////////////////////////////////////////////////////
    _baseVO.contextVO.listen_component.listen_map = {};

    let _checkCallListener = function (trigger, value) {
        if(_baseVO.contextVO.listen_component.listen_map[trigger] != null){
            for(let i=0; i<_baseVO.contextVO.listen_component.listen_map[trigger].length; i++){
                _context.log.debug('_baseVO.contextVO.listen_component.listen_map[trigger] trigger('+trigger+') debug');
                if(_baseVO.contextVO.listen_component.listen_map[trigger][i].trigger.length === 1){
                    _baseVO.contextVO.listen_component.listen_map[trigger][i].func(
                        _baseVO.contextVO.listen_component.listen_map[trigger][i].key[0],
                        value
                    );
                }else if( _baseVO.contextVO.listen_component.listen_map[trigger][i].trigger.length === 2 ){
                    _baseVO.contextVO.listen_component.listen_map[trigger][i].func(
                        _baseVO.contextVO.listen_component.listen_map[trigger][i].key[0],
                        value[_baseVO.contextVO.listen_component.listen_map[trigger][i].trigger[1]]
                    );
                }

            }
        }
    };

    _baseVO.contextVO.addEventListener = function (trigger, key, func) {
        if(_baseVO.contextVO.listen_component.listen_map[trigger[0]] == null)
            _baseVO.contextVO.listen_component.listen_map[trigger[0]] = [];

        _baseVO.contextVO.listen_component.listen_map[trigger[0]].push({
                trigger : trigger,
                key : key,
                func : func
            });

        _checkCallListener(trigger[0], _baseVO[trigger[0]]);
    };

    _baseVO.contextVO.socketEvent = function (trigger, data, field_value) {
        let ix;
        switch (trigger[0]) {

            case "remove":
                ix = _baseVO.contextVO.arrKeys.indexOf(data);
                if(ix > -1){
                    _baseVO.contextVO.arrKeys.splice(ix, 1);
                    _baseVO.contextVO.arrVO.splice(ix, 1);

                    if( _baseVO.contextVO.current === data ){
                        let val = '';
                        if(_baseVO.contextVO.arrKeys.length > 0)
                            val = _baseVO.contextVO.arrKeys[0];

                        _baseVO.contextVO.current = val;
                        _checkCallListener('current', val);
                    }

                    _baseVO.contextVO.updateVO();
                }
                break;

            case "add":
                ix = _baseVO.contextVO.arrKeys.indexOf(data);
                if(ix < 0){
                    _context.rest_list[_baseVO.contextVO.oneItemUpdate].contextVO.modelCallUpdate(data, oneItemAddBack);
                }
                break;

            case "update_one":
                ix = _baseVO.contextVO.arrKeys.indexOf(data.id);
                if(ix > -1){
                    _baseVO.contextVO.dispatchEvent('full_one', data);
                }
                break;

            case "update_one_rest":
                ix = _baseVO.contextVO.arrKeys.indexOf(data);
                if(ix > -1){
                    _context.rest_list[_baseVO.contextVO.oneItemUpdate].contextVO.modelCallUpdate(data, oneItemUpdateBack);
                }
                break;

            case "field_update":
                ix = _baseVO.contextVO.arrKeys.indexOf(data);
                if(ix > -1){
                    _baseVO.contextVO.arrVO[ix][trigger[1]] = field_value;
                    _baseVO.contextVO.updateVO();
                }
                break;

        }
    };

    let oneItemAddBack = function(body, error){
        _context.log.debug('oneItemAddBack rest name:'+_baseVO.contextVO.name);
        _context.log.socketIn('oneItemAddBack body: '+JSON.stringify(body));

        if(body != null){

            _baseVO.contextVO.arrVO.push(body.data);
            _baseVO.contextVO.arrKeys.push(body.data.id);

            if(_baseVO.contextVO.arrKeys.length === 1){
                _baseVO.contextVO.current = _baseVO.contextVO.arrKeys[0];
                _checkCallListener('current', _baseVO.contextVO.arrKeys[0]);
            }

            _baseVO.contextVO.updateVO();

        }
    };
    let oneItemUpdateBack = function(body, error){
        _context.log.debug('oneItemUpdateBack rest name:'+_baseVO.contextVO.name);
        _context.log.socketIn('oneItemUpdateBack body: '+JSON.stringify(body));

        if(body != null){

            let ix = _baseVO.contextVO.arrKeys.indexOf(body.data.id);

            if(ix > -1){
                _baseVO.contextVO.arrVO[ix] = body.data;
                _baseVO.contextVO.updateVO();
            }

        }
    };

    _baseVO.contextVO.dispatchEvent = function (trigger, value){
        _context.log.debug('mix vo:'+_baseVO.contextVO.name+' handler update trigger: '+trigger+' value: '+
            (typeof value === 'object' ? JSON.stringify(value) : value));

        if(trigger === 'full'){
            _baseVO.contextVO.arrVO = [];
            _baseVO.contextVO.arrKeys = [];
            for(let i=0; i<value.length; i++){
                _baseVO.contextVO.arrVO.push(value[i]);
                _baseVO.contextVO.arrKeys.push(value[i].id);
            }

            if(_baseVO.contextVO.arrKeys.length > 0){
                _baseVO.contextVO.current = _baseVO.contextVO.arrKeys[0];
                _checkCallListener('current', _baseVO.contextVO.arrKeys[0]);
            }

            _baseVO.contextVO.updateVO();
        }

        else if(trigger === 'current'){
            _baseVO.contextVO.current = value;
            _checkCallListener('current', value);
            _baseVO.contextVO.updateVO();
        }

        else if(trigger === 'full_one'){
            let ix = _baseVO.contextVO.arrKeys.indexOf(value.id);
            if(ix > -1){
                _baseVO.contextVO.arrVO[ix] = value;
                _baseVO.contextVO.updateVO();
            }
        }

    };
    /////////////////////////////////////////////////////////////////////////////////////
    let _toggle_info = function(duration, dontChangeBool){
        $('#mix_model_block_text_'+_baseVO.contextVO.name).animate({ height: 'toggle' }, duration);
        if(dontChangeBool !== true)
            _baseVO.contextVO.info_hide = !_baseVO.contextVO.info_hide;
    };
    /////////////////////////////////////////////////////////////////////////////////////
    _baseVO.contextVO.updateVO = function () {
        _context.log.debug("debug mix_model updateVO name: "+_baseVO.contextVO.name);
        let vo = document.getElementById(_baseVO.contextVO.divID);
        vo.innerHTML = _baseVO.contextVO.stringify();
        _baseVO.contextVO.list_component.updateLists();

        $('#btn_mix_vo_info_'+ _baseVO.contextVO.name).on('click', _toggle_info);
        if(_baseVO.contextVO.info_hide === true){
            _toggle_info(2, true);
        }
    };

    // create_listeners(_context, _baseVO);

    _baseVO.contextVO.init = function () {
        initEventListeners(_context, _baseVO);
        _baseVO.contextVO.updateVO();
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
        context.mix_models[name_model].contextVO.init();
    }
}