
function createListComponent(context, vo, dispatchList) {
    let _context = context;
    let _vo = vo;
    vo.context.list_component.dispatchList = dispatchList;
    vo.context.list_component.wait_lists = {};
    vo.context.list_component.current = {};

    vo.context.list_component.createListTitle = function (list_name, id, arr) {
        let str = "<span class='list_title'>"+list_name + " :</span> <select id=" + id + "></select>";
        let list = "";
        for (let i = 0; i < arr.length; i++) {
            // list += "<option value=" + i + ">" + arr[i] + "</option>";
            list += "<option value=" + arr[i] + ">" + arr[i] + "</option>";
        }
        _vo.context.list_component.wait_lists[id] = {
                items : list,
                name : list_name
            };
        return str;
    };

    vo.context.list_component.updateLists = function () {
        _context.log.debug("debug updateLists name: "+_vo.context.name);
        for(let id in _vo.context.list_component.wait_lists){
            let wait_obj = _vo.context.list_component.wait_lists[id];
            _context.log.debug("debug updateLists $('#'+id) id: "+id+" name: "+wait_obj.name);
            $('#'+id).html(wait_obj.items);
            if(_vo.context.list_component.current[wait_obj.name] == null)
                _vo.context.list_component.current[wait_obj.name] = 0;
            document.getElementById(id).selectedIndex = _vo.context.list_component.current[wait_obj.name];
            $('#'+id).on('change', _vo.context.list_component.dispatchList[wait_obj.name]);
        }
        _vo.context.list_component.wait_lists = {};
    };

    vo.context.list_component.setIndex = function (name, value) {
        _vo.context.list_component.current[name] = value;
    };

    vo.context.list_component.checkItsListForUpdate = function (name, value) {
        if(_vo.context.list_component.dispatchList[name] != null){
            _vo.context.list_component.dispatchList[name]();
        }
    };
}
/////////////////////////////////////////////////////////////////////////////////////
function initBaseVO(context, base, name, id, parent) {

    let _context = context;
    let model = {};

    model.vo = base.vo;

    model.context = {
        name : name,
        listen : {},
        list_component : {
            checkItsListForUpdate : function(trigger, value){}
        },
        updateVO : function () {},
        init : function () {},
        stringify : function () {},
    };

    let div = document.createElement('div');
    div.className = name === 'main_rest_vo' ? 'main_rest_item' : 'model_item';
    div.id = id;
    parent.appendChild(div);

    if(base.oneItemUpdate != null)
        model.context.oneItemUpdate = base.oneItemUpdate;

    if(base.fullUpdate != null)
        model.context.fullUpdate = base.fullUpdate;

    if(base.listen != null){
        model.listen = base.listen;
    }

    if(base.data_form != null){
        model.data_form = base.data_form;
    }

    if(base.setter != null){
        model.setter = base.setter;
        initSetterComponent(_context, model);
    }

    if(base.rest != null){
        model.rest = base.rest;
    }

    if(base.onlySetter === true){
        model.context.onlySetter = true;
        initOnlySetterComponent(model);
    }

    if(base.actions != null){
        model.actions = base.actions;
    }

    model.context.listen.map = {};
    model.context.listen.checkListener = function(trigger, value) {
        if(model.context.listen.map[trigger] != null){
            for(let i=0; i<model.context.listen.map[trigger].length; i++){
                // _context.log.debug('_vo.context.listen.map[trigger] trigger('+trigger+') debug');
                if( !Array.isArray(model.context.listen.map[trigger][i].trigger) ){
                    model.context.listen.map[trigger][i].func(
                        model.context.listen.map[trigger][i].key,
                        value
                    );
                }
                else{
                    model.context.listen.map[trigger][i].func(
                        model.context.listen.map[trigger][i].key,
                        value[model.context.listen.map[trigger][i].trigger[1]]
                    );
                }

            }
        }
    };

    model.context.addEventListener = function (trigger, key, context) {
        let trigger_key = Array.isArray(trigger) ? trigger[0] : trigger;

        if(model.context.listen.map[trigger_key] == null)
            model.context.listen.map[trigger_key] = [];

        model.context.listen.map[trigger_key].push({
            trigger : trigger,
            key : key,
            func : context.setParam
        });

        model.context.listen.checkListener(trigger_key, model.vo[trigger_key]);
    };

    model.context.initListeners = function (){
        if(model.listen != null){
            for(let i=0; i<model.listen.length; i++){
                _context[model.listen[i].way[0]][model.listen[i].way[1]].context.addEventListener(
                    model.listen[i].trigger,
                    model.listen[i].key,
                    model.context
                );
            }
        }
    };

    return model;
}
/////////////////////////////////////////////////////////////////////////////////////
function initMonoSetParams(context, model) {
    let _context = context;

    model.context.setParam = function (key, value) {
        if(model.vo[key] !== value){
            model.vo[key] = value;

            model.context.updateVO();
            model.context.listen.checkListener(key, value);

            model.context.list_component.checkItsListForUpdate(key, value);
        }
    };

    model.context.setterParam = function (data, current) {//current.way[3], data
        if(model.vo[current.way[3]] !== data){
            model.vo[current.way[3]] = data;

            model.context.updateVO();
            model.context.listen.checkListener(current.way[3], data);

            model.context.list_component.checkItsListForUpdate(current.way[3], data);
        }
    };

    model.context.externalGet = function (data, current) {
        let value = _context[current.get[0]][current.get[1]].vo[current.get[2]];
        if(model.vo[current.way[3]] !== value){
            model.vo[current.way[3]] = value;

            model.context.updateVO();
            model.context.listen.checkListener(current.way[3], value);

            model.context.list_component.checkItsListForUpdate(current.way[3], value);
        }
    };

    model.context.setParams = function (vo, current) {
        for(let field in vo){
            if(model.vo[field] !== vo[field]){
                model.vo[field] = vo[field];
                model.context.listen.checkListener(field, vo[field]);
            }
        }
        model.context.updateVO();
    };
}

function initMixSetParams(context, model) {
    let _context = context;

    model.context.setVOParam = function (data, current) {
        let ix = model.context.arrKeys.indexOf(data[current.key]);
        if(ix > -1){
            model.context.arrVO[ix][current.way[3]] = data[current.param];
            model.context.updateVO();
        }
    };

    model.context.setCurrent = function (value) {
        if(model.context.current !== value){
            model.context.current = value;
            model.context.listen.checkListener('current', value);
            // model.context.updateVO();
        }
        model.context.updateVO();
    };

    model.context.setFull = function (arr, current) {
        model.context.arrVO = [];
        model.context.arrKeys = [];
        for(let i=0; i<arr.length; i++){
            model.context.arrVO.push(arr[i]);
            model.context.arrKeys.push(arr[i].id);
        }

        if(model.context.arrKeys.length > 0){
            model.context.current = model.context.arrKeys[0];
            model.context.listen.checkListener('current', model.context.arrKeys[0]);
        }

        model.context.updateVO();
    };

    model.context.setVO = function (vo, current) {
        let ix = model.context.arrKeys.indexOf(vo.id);
        if(ix > -1){
            model.context.arrVO[ix] = vo;
            model.context.updateVO();
        }
    };

    model.context.respOneItemAdd = function(body, error){
        _context.log.restIn(' << oneItemAddBack name: '+model.context.name+' body: '+JSON.stringify(body));
        if(body != null){
            model.context.arrVO.push(body.data);
            model.context.arrKeys.push(body.data.id);
            if(model.context.arrKeys.length === 1){
                model.context.setCurrent(model.context.arrKeys[0]);
            } else
                model.context.updateVO();
        }
    };
    model.context.respOneItemUpdate = function(body, error){
        _context.log.restIn(' << oneItemUpdateBack name:'+model.context.name+' body: '+JSON.stringify(body));
        if(body != null){
            model.context.setParams(body.data);
        }
    };

    model.context.addItem = function(data){
        _context.rest_list[model.context.oneItemUpdate].context.externalRun(data, model.context.respOneItemAdd);
    };
    model.context.updateItem = function(data){
        _context.rest_list[model.context.oneItemUpdate].context.externalRun(data, model.context.respOneItemUpdate);
    };
    model.context.removeItem = function(data){
        let ix = model.context.arrKeys.indexOf(data);
        if(ix > -1){
            model.context.arrKeys.splice(ix, 1);
            model.context.arrVO.splice(ix, 1);

            if( model.context.current === data ){
                let val = '';
                if(model.context.arrKeys.length > 0)
                    val = model.context.arrKeys[0];

                model.context.setCurrent(val);
            } else
                model.context.updateVO();
        }
    };
}
/////////////////////////////////////////////////////////////////////////////////////
function initRestComponent(context, model) {
    let _context = context;
    let _external_callback;

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

    model.context.rest = {};

    model.context.run = function (e, callback, debug_msg) {
        _external_callback = callback;

        $('#btn_'+model.context.name).addClass('hide_view');

        let data = {};

        for(let field in model.vo){
            if(model.data_form != null && model.data_form[field] != null){
                let form = new FormData(  document.getElementById("rest_info_"+model.context.name)  );
                if(Array.isArray(model.vo[field])){
                    data[field] = [];
                    data[field].push(getValueForm(form.get("rest_info_"+model.context.name+"_"+field),
                        model.data_form[field]));
                } else {
                    data[field] = getValueForm(form.get("rest_info_"+model.context.name+"_"+field),
                        model.data_form[field]);
                }
            } else {
                data[field] = model.vo[field];
            }
        }

        let bd = { from : _context.models.base.vo.from, data : data, action : model.rest.action };

        _context.log.restOut(' >> '+(debug_msg != null ? debug_msg : 'onButtonClick')+' name:'+
            model.context.name+' body: '+JSON.stringify(bd));

        // if(model.data_form != null)
        //     _context.log.debug('-----debug _baseVO.data_form != null');

        _context.callRest( model.rest.endpoint, bd, model.context.resp );
    };

    model.context.resp = function (body, error) {
        _context.log.restIn(' << respBack name:'+model.context.name+' body: '+JSON.stringify(body));
        $('#btn_'+model.context.name).removeClass('hide_view');

        if(body != null && body.status === 'ok' && model.setter != null){
            model.context.setter.runSetters(body.data, _external_callback);
        }
        else {

            _context.notification.all.context.callMsg(body, {msg:"error resp name:"+ model.context.name,
                css:"rest_notification"});

            if (_external_callback != null) {
                _external_callback(body.status === 'ok' ? null : body.status);
                _external_callback = null;
            }
        }
    };

    model.context.externalRun = function (data, callBack) {
        let id_data = {};

        let beforeBack = function (body, error) {
            if(body == null || body.status !== 'ok'){
                _context.notification.all.context.callMsg(body, {msg:"error resp externalRun name:"+
                    model.context.name, css:"rest_notification"});
            }
            if(callBack != null)
                callBack(body, error);
        };

        for(let field in model.vo){
            id_data[field] = data != null ? data : model.vo[field];
        }
        let bd = { from : _context.models.base.vo.from, data : id_data, action : model.rest.action };
        _context.log.restOut(' >> modelCallUpdate rest name:'+model.context.name+' body: '+JSON.stringify(bd));
        _context.callRest( model.rest.endpoint, bd, beforeBack );
    };

}
/////////////////////////////////////////////////////////////////////////////////////
function initSetterComponent(context, model) {
    let _context = context;
    let _setter_stack = [];
    let _data;
    let _external_callback;
    let _current;
    initRunSetter(context, model);

    model.context.setter = {};

    model.context.setter.runSetters = function(data, callback){
        _data = data;
        _external_callback = callback;
        for(let i=0; i<model.setter.length; i++){
            _setter_stack.push(model.setter[i]);
        }
        _checkNextSetterStackItem();
    };

    let _checkNextSetterStackItem = function(error){

        if(error != null && _current.else != null){
            _context.log.debug('checkNextSetterStackItem else node error: '+error);
            let setter_stack_n = [];
            for(let i=0; i<_current.else.length; i++){
                setter_stack_n.push(_current.else[i]);
            }
            _setter_stack = setter_stack_n;
        }

        if(_setter_stack.length > 0){
            _current = _setter_stack.splice(0, 1)[0];
            //check if?
            model.context.runSetter(_current, _data, _checkNextSetterStackItem);
        }
        else{
            _data = null;
            if(_external_callback != null){
                _external_callback();
                _external_callback = null;
            }
        }
    };

}

function initRunSetter(context, model) {
    let _context = context;
    model.context.runSetter = function (current, data, callback) {
        if (current.way[2] === "run") {
            _context[current.way[0]][current.way[1]].context.run(null, callback, model.context.name);
        }
        else {
            _context[current.way[0]][current.way[1]].context[current.way[2]](data, current);
            if(callback != null)
                callback();
        }
    };
}
/////////////////////////////////////////////////////////////////////////////////////
function initOnlySetterComponent(model) {
    model.context.run = function () {
        model.context.setter.runSetters();
    }
}
/////////////////////////////////////////////////////////////////////////////////////
function initSocketListeners(context, model) {
    let _context = context;
    initRunSetter(context, model);
    let _activate_action = function (node, data){
        if(node.if != null){
            for(let field in node.if){
                if(node.if[field].param === "==="){
                    if(data[field] !== _context.models[node.if[field].way[0]].vo[node.if[field].way[1]]){
                        _context.log.debug('----debug socket activate_action if node: '+JSON.stringify(node.if)+' context: '+
                            _context.models[node.if[field].way[0]].vo[node.if[field].way[1]]);
                        if(node.else != null )
                            _activate_action(node.else, data);
                        return;
                    }
                }
                else if(node.if[field].param === "array_exists"){
                    if( data[field].indexOf(_context.models[node.if[field].way[0]].vo[node.if[field].way[1]]) < 0 ){
                        _context.log.debug('----debug socket activate_action if node: '+JSON.stringify(node.if)+' context: '+
                            _context.models[node.if[field].way[0]].vo[node.if[field].way[1]]);
                        if(node.else != null )
                            _activate_action(node.else, data);
                        return;
                    }
                }
                else if(node.if[field].param === "!=null"){
                    if( _context.models[node.if[field].way[0]].vo[node.if[field].way[1]] == null ){
                        _context.log.debug('----debug socket activate_action if node: '+JSON.stringify(node.if)+' context: '+
                            _context.models[node.if[field].way[0]].vo[node.if[field].way[1]]);
                        if(node.else != null )
                            _activate_action(node.else, data);
                        return;
                    }
                }
                else if(node.if[field].param === "==null"){
                    if( _context.models[node.if[field].way[0]].vo[node.if[field].way[1]] != null ){
                        _context.log.debug('----debug socket activate_action if node: '+JSON.stringify(node.if)+' context: '+
                            _context.models[node.if[field].way[0]].vo[node.if[field].way[1]]);
                        if(node.else != null )
                            _activate_action(node.else, data);
                        return;
                    }
                }
            }
        }

        let body;
        if(node.key != null){
            if(node.key !== "null"){
                body = data[node.key];
            }
        }else
            body = data;

        model.context.runSetter(node, body);
    };

    model.last = [];

    model.context.socketHandler = function(data){
        _context.log.socketIn(' << socket handler('+model.context.name+') data:'+JSON.stringify(data));

        if(model.actions[data.action] != null){
            for(let i=0; i<model.actions[data.action].length; i++){
                _activate_action(model.actions[data.action][i], data.data);
            }
        }else if(model.actions.default != null){
            for(let i=0; i<model.actions.default.length; i++){
                _activate_action(model.actions.default[i], data.data);
            }
        }

        model.last.push(data.data);
        model.context.updateVO();
    };
}
/////////////////////////////////////////////////////////////////////////////////////














