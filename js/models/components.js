

function initListenersBody(context, vo){
    let _context = context;
    let _vo = vo;
    _vo.contextVO.listen_component.listen_map = {};
    let _checkCallListener = function(trigger, value) {
        if(_vo.contextVO.listen_component.listen_map[trigger] != null){
            for(let i=0; i<_vo.contextVO.listen_component.listen_map[trigger].length; i++){
                _context.log.debug('_vo.contextVO.listen_component.listen_map[trigger] trigger('+trigger+') debug');
                if(_vo.contextVO.listen_component.listen_map[trigger][i].trigger.length === 1){
                        _vo.contextVO.listen_component.listen_map[trigger][i].func(
                            _vo.contextVO.listen_component.listen_map[trigger][i].key[0],
                            value
                        );
                }else if( _vo.contextVO.listen_component.listen_map[trigger][i].trigger.length === 2 ){
                    _vo.contextVO.listen_component.listen_map[trigger][i].func(
                            _vo.contextVO.listen_component.listen_map[trigger][i].key[0],
                            value[_vo.contextVO.listen_component.listen_map[trigger][i].trigger[1]]
                        );
                }

            }
        }
    };

    _vo.contextVO.addEventListener = function (trigger, key, func) {
        if(_vo.contextVO.listen_component.listen_map[trigger[0]] == null)
            _vo.contextVO.listen_component.listen_map[trigger[0]] = [];

        _vo.contextVO.listen_component.listen_map[trigger[0]].push({
                trigger : trigger,
                key : key,
                func : func
            });

        _checkCallListener(trigger[0], _vo[trigger[0]]);
    };

    _vo.contextVO.socketEvent = function (trigger, data) {
        _vo.contextVO.dispatchEvent(trigger[0], data);
    };

    _vo.contextVO.dispatchEvent = function (trigger, value){

        _context.log.debug('_vo:'+_vo.contextVO.name+' handler update key: '+trigger+' value: '+
            (typeof value === 'object' ? JSON.stringify(value) : value));

        if(trigger === 'full'){
            for(let field in value){
                if(_vo[field] !== value[field]){
                    _vo[field] = value[field];
                    _checkCallListener(field, value[field]);
                }
            }
            _vo.contextVO.updateVO();
        }
        else if(trigger === 'full_self'){
            _context.rest_list[_vo.contextVO.oneItemUpdate].contextVO.modelCallUpdate(_vo.id, oneItemUpdateBack);
        }
        else if(_vo[trigger] != null){

            if(value == null)
                value = "";

            if( _vo[trigger] !== value ){

                _vo[trigger] = value;
                _vo.contextVO.updateVO();
                _checkCallListener(trigger, value);

                if(_vo.contextVO.list_component != null){
                    _vo.contextVO.list_component.checkItsListForUpdate(trigger, value);
                }

            }
        }
        else{
            _context.log.debug('main_rest_vo handler trigger('+trigger+') error');
        }
    };

    let oneItemUpdateBack = function(body, error){
        // _context.log.debug('oneItemUpdateBack rest name:'+_vo.contextVO.name);
        _context.log.restIn(' << oneItemUpdateBack  name: '+_vo.contextVO.name+' body: '+JSON.stringify(body));

        if(body != null){
            _vo.contextVO.dispatchEvent('full', body.data)
        }
    };
}

function initEventListeners(context, vo){
    if(vo.listen != null){
        for(let i=0; i<vo.listen.length; i++){
            context[vo.listen[i].type][vo.listen[i].name_vo].contextVO.addEventListener(
                    vo.listen[i].trigger,
                    vo.listen[i].key,
                    vo.contextVO.dispatchEvent
                );
        }
    }
}


function createListComponent(context, vo, dispatchList) {
    let _context = context;
    let _vo = vo;
    vo.contextVO.list_component.dispatchList = dispatchList;
    vo.contextVO.list_component.wait_lists = {};
    vo.contextVO.list_component.current = {};

    vo.contextVO.list_component.createListTitle = function (list_name, id, arr) {
        let str = "<span class='list_title'>"+list_name + " :</span> <select id=" + id + "></select>";
        let list = "";
        for (let i = 0; i < arr.length; i++) {
            // list += "<option value=" + i + ">" + arr[i] + "</option>";
            list += "<option value=" + arr[i] + ">" + arr[i] + "</option>";
        }
        _vo.contextVO.list_component.wait_lists[id] = {
                items : list,
                name : list_name
            };
        return str;
    };

    vo.contextVO.list_component.updateLists = function () {
        _context.log.debug("debug updateLists name: "+_vo.contextVO.name);
        for(let id in _vo.contextVO.list_component.wait_lists){
            let wait_obj = _vo.contextVO.list_component.wait_lists[id];
            _context.log.debug("debug updateLists $('#'+id) id: "+id+" name: "+wait_obj.name);
            $('#'+id).html(wait_obj.items);
            if(_vo.contextVO.list_component.current[wait_obj.name] == null)
                _vo.contextVO.list_component.current[wait_obj.name] = 0;
            document.getElementById(id).selectedIndex = _vo.contextVO.list_component.current[wait_obj.name];
            $('#'+id).on('change', _vo.contextVO.list_component.dispatchList[wait_obj.name]);
        }
        _vo.contextVO.list_component.wait_lists = {};
    };

    vo.contextVO.list_component.setIndex = function (name, value) {
        _vo.contextVO.list_component.current[name] = value;
    };

    vo.contextVO.list_component.checkItsListForUpdate = function (name, value) {
        if(_vo.contextVO.list_component.dispatchList[name] != null){
            _vo.contextVO.list_component.dispatchList[name]();
        }
    };
}





