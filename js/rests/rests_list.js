

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
        dispatchEvent : function (trigger, value) {},
        socketEvent : function (trigger, data) {},
        addEventListener : function (trigger, func) {},
        init : function () {},
        stringify : function () {},

        respBack : function (body, error) {},
        onButtonClick : function () {},

        modelCallUpdate : function (data, callBack) {}
    };

    let block = document.getElementById(group_id);
    let div = document.createElement('div');
    div.className = 'model_item';
    div.id = _baseVO.contextVO.divID;
    block.appendChild(div);

    _baseVO.contextVO.stringify = function () {

        console.log('debug stringify name:'+_baseVO.contextVO.name);

        let str = "<div class='item_model_header'>";
        str += "<input type='button' value='i' class='button_toggle' id='btn_rest_info_"+_baseVO.contextVO.name+"'>";
        str += '<span class="item_title">'+_baseVO.contextVO.name+'</span>';
        str += "<input type='button' value='>>' class='button_toggle' id='btn_"+ _baseVO.contextVO.name+"'>";
        str += '</div>';

        str += "<form class='block_toggle' name='rest_info_"+_baseVO.contextVO.name+"' id='rest_info_"+_baseVO.contextVO.name+"'>";

        for(let field in _baseVO){
            if(field !== 'setter' && field !== 'contextVO' && field !== 'listen' &&  field !== 'data_form'){
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


    _baseVO.contextVO.dispatchEvent = function (trigger, value){
        console.log('rest:'+_baseVO.contextVO.name+' handler update key: '+trigger+' value: '+value);

        if(trigger === 'start'){
            _baseVO.contextVO.onButtonClick();
        }else{
            if(_baseVO.data[trigger] != null){
                _baseVO.data[trigger] = value;
                _baseVO.contextVO.updateVO();
            }
            else{
                console.log('main_rest_vo handler trigger('+trigger+') error');
            }
        }

    };

    _baseVO.contextVO.respBack = function (body, error) {
        console.log('respBack rest name:'+_baseVO.contextVO.name);
        console.log('respBack body: '+JSON.stringify(body));

        if(body != null && body.status === 'ok' && _baseVO.setter != null){

            for(let i=0; i<_baseVO.setter.length; i++){

                let bd = _baseVO.setter[i].key == null || _baseVO.setter[i].key.length === 0 ||
                    _baseVO.setter[i].key.indexOf("full") > -1 ? body.data : body.data[_baseVO.setter[i].key[0]];

                _context[_baseVO.setter[i].type][_baseVO.setter[i].name_vo].contextVO.dispatchEvent(
                        _baseVO.setter[i].trigger[0], bd );

            }

        }

    };

    _baseVO.contextVO.onButtonClick = function () {
        console.log('call rest name:'+_baseVO.contextVO.name);

        let data = {};

        for(let field in _baseVO.data){

            if(_baseVO.data_form != null && _baseVO.data_form[field] != null){

                let form = new FormData(  document.getElementById("rest_info_"+_baseVO.contextVO.name)  );

                if(Array.isArray(_baseVO.data[field])){
                    data[field] = [];
                    data[field].push(form.get("rest_info_"+_baseVO.contextVO.name+"_"+field));
                }
                else{
                    data[field] = form.get("rest_info_"+_baseVO.contextVO.name+"_"+field);
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

        if(_baseVO.data_form != null){
            console.log('-----debug call form data:'+JSON.stringify(bd));
        }

        _context.callRest( _baseVO.endpoint, bd, _baseVO.contextVO.respBack );
    };

    _baseVO.contextVO.modelCallUpdate = function (data, callBack) {
        console.log('model call update rest name:'+_baseVO.contextVO.name+' data: '+data);

        let id_data = {};
        for(let field in _baseVO.data){
            id_data[field] = data != null ? data : _baseVO.data[field];
        }

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

        console.log("debug rest updateVO name: "+_baseVO.contextVO.name);
        let vo = document.getElementById(_baseVO.contextVO.divID);
        vo.innerHTML = _baseVO.contextVO.stringify();

        $('#btn_'+_baseVO.contextVO.name).on('click', _baseVO.contextVO.onButtonClick);

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

    console.log('init rests with group done');
}


function activated_rests(context) {
    for(let rest_list_item_name in context.rest_list){
        context.rest_list[rest_list_item_name].contextVO.init();
    }
}

