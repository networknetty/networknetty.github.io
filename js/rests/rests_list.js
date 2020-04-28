

function create_rest(context, name, baseVO, group_id) {
    let _context = context;
    let _baseVO = baseVO;

    _baseVO.contextVO = {

        name : name,
        divID : "rest_"+name,

        group : group_id,

        info_hide : false,

        listen_component : {},
        list_component : {
            checkItsListForUpdate : function(trigger, value){}
        },

        updateVO : function () {},
        dispatchEvent : function (trigger, value, callback) {},
        socketEvent : function (trigger, data) {},
        addEventListener : function (trigger, func) {},
        init : function () {},
        stringify : function () {},

        respBack : function (body, error) {},
        onButtonClick : function (callback) {},

        modelCallUpdate : function (data, callBack) {}
    };

    let block = document.getElementById(group_id);
    let div = document.createElement('div');
    div.className = 'model_item';
    div.id = _baseVO.contextVO.divID;
    block.appendChild(div);

    _baseVO.contextVO.stringify = function () {

        _context.log.debug('debug stringify name:'+_baseVO.contextVO.name);

        let str = "<div class='item_model_header'>";
        str += "<input type='button' value='i' class='button_toggle' id='btn_rest_info_"+_baseVO.contextVO.name+"'>";
        str += '<span class="item_title">'+_baseVO.contextVO.name+'</span>';
        str += "<input type='button' value='>>' class='button_toggle' id='btn_"+ _baseVO.contextVO.name+"'>";
        str += '</div>';

        str += "<form class='block_toggle' name='rest_info_"+_baseVO.contextVO.name+"' id='rest_info_"+_baseVO.contextVO.name+"'>";

        for(let field in _baseVO){
            if((field !== 'setter' || _baseVO.onlySetter === true) && field !== 'contextVO' && field !== 'listen' &&  field !== 'data_form'){
                str += field + ' : '+ util_parse(_baseVO[field], '', field, _baseVO.data_form, 'rest_info_'+_baseVO.contextVO.name) + '<br>';
            }
        }

        str += "</form>";
        return str;
    };


    _baseVO.contextVO.socketEvent = function (trigger, data) {

        // if(trigger[0] === "call")
        _baseVO.contextVO.modelCallUpdate(data, _baseVO.contextVO.respBack);
    };


    _baseVO.contextVO.dispatchEvent = function (trigger, value, callback){
        _context.log.debug('rest:'+_baseVO.contextVO.name+' handler update key: '+trigger+' value: '+value);

        if(trigger === 'start'){
            _baseVO.contextVO.onButtonClick(callback);
        }else{
            if(_baseVO.data[trigger] != null){
                _baseVO.data[trigger] = value;
                _baseVO.contextVO.updateVO();
            }
            else{
                _context.log.error(' // main_rest_vo handler trigger('+trigger+') error');
            }
            if(callback != null)
                callback();
        }

    };

    let _external_callback;
    let setter_stack = [];
    let stack_value;
    let _checkNextSetterStackItem = function(){
        if(setter_stack.length > 0){
            let current = setter_stack.splice(0, 1)[0];
            let bd;
            if(stack_value != null && current.key != null){
                bd = current.key.indexOf("full") > -1 ? stack_value : stack_value[current.key[0]];
            }
            _context[current.type][current.name_vo].contextVO.dispatchEvent(
                current.trigger[0], bd, _checkNextSetterStackItem );
        }
        else{
            stack_value = null;
            if(_external_callback != null){
                _external_callback();
                _external_callback = function () {}
            }
        }
    };
    let _only_setter = function(){
        _context.log.else(' only_setter name:'+_baseVO.contextVO.name);
        for(let i=0; i<_baseVO.setter.length; i++){
            setter_stack.push(_baseVO.setter[i]);
        }
        _checkNextSetterStackItem();
    };

    _baseVO.contextVO.respBack = function (body, error) {

        _context.log.restIn(' << respBack name:'+_baseVO.contextVO.name+' body: '+JSON.stringify(body));
        $('#btn_'+_baseVO.contextVO.name).removeClass('hide_view');

        if(body != null && body.status === 'ok' && _baseVO.setter != null){
            for(let i=0; i<_baseVO.setter.length; i++){
                stack_value = body.data;
                setter_stack.push(_baseVO.setter[i]);
            }
            _checkNextSetterStackItem();
        }
        else{
            if(_external_callback != null)
                _external_callback();
        }
    };

    let getValueForm = function(value, cfg){
        if(cfg.format != null){
            if(cfg.format === "int")
                return parseInt(value);
            else if(cfg.format === "number")
                return parseFloat(value);
            else if(cfg.format === "bool")
                return value === "true";
        }
        return value;
    };

    _baseVO.contextVO.onButtonClick = function (callback) {

        _external_callback = callback;

        $('#btn_'+_baseVO.contextVO.name).addClass('hide_view');

        let data = {};

        for(let field in _baseVO.data){

            if(_baseVO.data_form != null && _baseVO.data_form[field] != null){

                let form = new FormData(  document.getElementById("rest_info_"+_baseVO.contextVO.name)  );

                if(Array.isArray(_baseVO.data[field])){
                    data[field] = [];
                    data[field].push(getValueForm(form.get("rest_info_"+_baseVO.contextVO.name+"_"+field),
                        _baseVO.data_form[field]));
                }
                else{
                    data[field] = getValueForm(form.get("rest_info_"+_baseVO.contextVO.name+"_"+field),
                        _baseVO.data_form[field]);
                }

            }
            else{
                data[field] = _baseVO.data[field];
            }

        }

        let bd = {
            from : _context.models.base.from,
            data : data,
            action : _baseVO.action
        };

        _context.log.restOut(' >> onButtonClick name:'+_baseVO.contextVO.name+' body: '+JSON.stringify(bd));

        if(_baseVO.data_form != null){
            _context.log.debug('-----debug _baseVO.data_form != null');
        }

        _context.callRest( _baseVO.endpoint, bd, _baseVO.contextVO.respBack );
    };

    _baseVO.contextVO.modelCallUpdate = function (data, callBack) {
        let id_data = {};
        for(let field in _baseVO.data){
            id_data[field] = data != null ? data : _baseVO.data[field];
        }

        let bd = {
            from : _context.models.base.from,
            data : id_data,
            action : _baseVO.action
        };

        _context.log.restOut(' >> modelCallUpdate rest name:'+_baseVO.contextVO.name+' body: '+JSON.stringify(bd));

        _context.callRest(
            _baseVO.endpoint,
            {
                from : _context.models.base.from,
                data : id_data,
                action : _baseVO.action
            },
            callBack
        );
    };

    /////////////////////////////////////////////////////////////////////////////////////
    let _toggle_info = function(duration, dontChangeBool){
        $('#rest_info_'+_baseVO.contextVO.name).animate({ height: 'toggle' }, duration);
        if(dontChangeBool !== true)
            _baseVO.contextVO.info_hide = !_baseVO.contextVO.info_hide;
    };
    /////////////////////////////////////////////////////////////////////////////////////

    _baseVO.contextVO.updateVO = function () {

        _context.log.debug("debug rest updateVO name: "+_baseVO.contextVO.name);
        let vo = document.getElementById(_baseVO.contextVO.divID);
        vo.innerHTML = _baseVO.contextVO.stringify();

        if(_baseVO.onlySetter === true){
            $('#btn_'+_baseVO.contextVO.name).on('click', _only_setter);
        }else{
            $('#btn_'+_baseVO.contextVO.name).on('click', _baseVO.contextVO.onButtonClick);
        }

        $('#btn_rest_info_'+ _baseVO.contextVO.name).on('click', _toggle_info);

        if(_baseVO.contextVO.info_hide === true){
            _toggle_info(2, true);
        }
    };

    _baseVO.contextVO.init = function () {
        initEventListeners(_context, _baseVO);
        _baseVO.contextVO.updateVO();
        _toggle_info(2);
    };

    return _baseVO;
}

function init_group(context, group_name, block) {
    let _context = context;

    let div = document.createElement('div');
    div.className = 'model_group_item';
    div.id = 'model_group_item_'+group_name;
    block.appendChild(div);

    let str = '<div class="item_header">';
    str += "<input type='button' value='i' class='button_toggle' id='btn_group_info_"+group_name+"'>";
    str += '<span class="model_group_item_title item_title">'+group_name+'</span>';
    str += "</div>";
    str += "<div class='group_info_block' id='group_info_block_"+group_name+"'></div>";

    div.innerHTML = str;

    for(let rest_list_item_name in _context.config.rest_list[group_name]){
        _context.rest_list[rest_list_item_name] = create_rest(_context, rest_list_item_name,
            _context.config.rest_list[group_name][rest_list_item_name], "group_info_block_"+group_name);
    }

    let _toggle_group = function(duration, dontChangeBool){
        $('#group_info_block_'+group_name).animate({ height: 'toggle' }, duration);
        // if(dontChangeBool !== true)
        //     _baseVO.contextVO.info_hide = !_baseVO.contextVO.info_hide;
    };

    $('#btn_group_info_'+group_name).on('click', _toggle_group);

    _toggle_group(2)
}

function init_rests_with_group(context) {
    let _context = context;
    _context.rest_list = {};

    let block = document.getElementById('rest_block');
    for(let rest_list_group_name in _context.config.rest_list){
        init_group(_context, rest_list_group_name, block)
    }

    _context.log.debug('init rests with group done');
}


function activated_rests(context) {
    for(let rest_list_item_name in context.rest_list){
        context.rest_list[rest_list_item_name].contextVO.init();
    }
}

