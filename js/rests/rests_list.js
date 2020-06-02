

function create_rest(context, name, baseVO, group_id) {
    let _context = context;
    let _baseVO = initBaseVO(context, baseVO, name, "rest_"+name,
        document.getElementById(group_id));
    initMonoSetParams(context, _baseVO);

    if(_baseVO.context.onlySetter !== true)
        initRestComponent(context, _baseVO);

    _baseVO.context.stringify = function () {
        // _context.log.debug('debug stringify name:'+_baseVO.context.name);
        let str = "<div class='item_model_header'>";
        str += "<input type='button' value='i' class='button_toggle' id='btn_rest_info_"+_baseVO.context.name+"'>";
        str += '<span class="item_title">'+_baseVO.context.name+'</span>';
        str += "<input type='button' value='>>' class='button_toggle' id='btn_"+ _baseVO.context.name+"'>";
        str += '</div>';

        str += "<form class='block_toggle' name='rest_info_"+_baseVO.context.name+"' id='rest_info_"+_baseVO.context.name+"'>";

        if(_baseVO.context.onlySetter !== true){
            str += 'endpoint : '+ _baseVO.rest.endpoint + '<br>';
            str += 'data : '+ util_parse(_baseVO.vo, 'vo', _baseVO.data_form,
                'rest_info_'+_baseVO.context.name);
            str += 'action : '+ _baseVO.rest.action + '<br>';
        }
        else
            str += 'setter : '+ util_parse(_baseVO.setter) + '<br>';

        if(_baseVO.context.file != null && _baseVO.context.file.content != null){
            let img = 'data:image/jpeg;base64,' + btoa(_baseVO.context.file.content);
            str += "<br><span class='img_name'>"+_baseVO.context.file.name+
                "</span><img src='"+img+"' alt='img_alt'>";

        }

        str += "</form>";

        return str;
    };

    /////////////////////////////////////////////////////////////////////////////////////
    let _toggle_info = function(duration, dontChangeBool){
        $('#rest_info_'+_baseVO.context.name).animate({ height: 'toggle' }, duration);
        if(dontChangeBool !== true)
            _baseVO.context.info_hide = !_baseVO.context.info_hide;
    };
    /////////////////////////////////////////////////////////////////////////////////////

    let _load_file = function(){
        let fileInput;
        fileInput = document.createElement("input");
        fileInput.type='file';
        fileInput.style.display='none';
        fileInput.onchange = function(e) {
            let file = e.target.files[0];
            if (!file) { return; }
            let reader = new FileReader();

            // name: "test_img19203.jpg"
            // size: 428272
            // type: "image/jpeg"

            if(_baseVO.context.file == null)
                _baseVO.context.file = {};

            _baseVO.context.file.name = file.name;
            _baseVO.context.file.type = file.type;

            reader.onload = function(e) {
                document.body.removeChild(fileInput);
                if(_baseVO.context.file.type === "image/jpeg"){
                    _baseVO.context.file.content = e.target.result;
                    _baseVO.context.updateVO();
                }
            };
            // reader.readAsBinaryString(file);
            reader.readAsArrayBuffer(file);
        };
        document.body.appendChild(fileInput);
        let eventMouse = document.createEvent("MouseEvents");
        eventMouse.initMouseEvent("click", true, false, window, 0,
            0, 0, 0, 0, false, false,
            false, false, 0, null);
        fileInput.dispatchEvent(eventMouse);
    };

    let _clear_file = function(){
        if(_baseVO.context.file != null && _baseVO.context.file.content != null){
            _baseVO.context.file.content = null;
            _baseVO.context.updateVO();
        }
    };

    _baseVO.context.updateVO = function () {
        _context.log.debug("debug rest updateVO name: "+_baseVO.context.name);
        let vo = document.getElementById("rest_"+_baseVO.context.name);
        vo.innerHTML = _baseVO.context.stringify();

        if(_baseVO.context.rest_type != null && _baseVO.context.rest_type === "form-data"){
            $('#btn_load_file_rest_info_'+_baseVO.context.name).on('click', _load_file);
            $('#btn_clear_file_rest_info_'+_baseVO.context.name).on('click', _clear_file);
        }

        $('.button_expand_obj').on('click', expand_reaction_obj);
        $('.button_expand_arr').on('click', expand_reaction_arr);
        $('#btn_'+_baseVO.context.name).on('click', _baseVO.context.run);

        $('#btn_rest_info_'+ _baseVO.context.name).on('click', _toggle_info);

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
        //     _baseVO.context.info_hide = !_baseVO.context.info_hide;
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
        context.rest_list[rest_list_item_name].context.init();
    }
}

