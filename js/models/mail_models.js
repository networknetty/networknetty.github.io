
function init_mail_models(context) {

    if(
        context.config.other == null ||
        context.config.other.mails == null ||
        context.config.other.mails.length === 0
    )
        return;

    let _context = context;
    let _baseVO = {};

    _baseVO.context = {
        oneItemUpdate : context.config.other.mailItemUpdate,
        arrValues : [],
        arrKeys : [],
        current : "",

        currentValue : "",

        name : "ml",
        block : document.getElementById('model_block'),
        divID : "mail_vo",
        list_component : {
            checkItsListForUpdate : function(trigger, value){}
        }
    };

    for(let i=0; i<_context.config.other.mails.length; i++){
        _baseVO.context.arrKeys.push(_context.config.other.mails[i]);
        _baseVO.context.arrValues.push("");
    }

    let div = document.createElement('div');
    div.className = 'model_item';
    div.id = _baseVO.context.divID;
    _baseVO.context.block.appendChild(div);

/////////////////////////////////////////////////////
    let obj = {};
    obj[_baseVO.context.name] = function (e) {
        let value = this.value;
        let selectedIndex = this.selectedIndex;

        _context.log.debug("debug dispatchList item_ name:"+_baseVO.context.name +
            " value: "+value+" selectedIndex: "+selectedIndex);

        if(_baseVO.context.arrKeys.length > 0){
            if(selectedIndex == null)
                selectedIndex = 0;
        }
        if(value == null){
            if(_baseVO.context.arrKeys.length > 0){
                value = _baseVO.context.arrKeys[0];
            }else{
                value = "";
            }
        }

        _context.log.debug("debug dispatchList after value: "+value+" selectedIndex: "+selectedIndex);
        _baseVO.context.list_component.setIndex(_baseVO.context.name, selectedIndex);

        _baseVO.context.current = value;
        _context.models.base.context.setParam('currentMail', _baseVO.context.current);

        _baseVO.context.currentValue = _baseVO.context.arrValues[selectedIndex];
        _context.models.base.context.setParam('externalUser', _baseVO.context.currentValue);

        _baseVO.context.updateVO();
    };

    createListComponent(_context, _baseVO, obj);
/////////////////////////////////////////////////////
    _baseVO.context.stringify = function (){
        // _context.log.debug('debug stringify name:'+_baseVO.context.name);
        let str = "<div class='mail_block'>";
        str += _baseVO.context.list_component.createListTitle(_baseVO.context.name,
            'mail_list', _baseVO.context.arrKeys);

        str += "<input type='button' value='get' class='buttons' id='btn_mail_get'>";
        str += "</div><div class='mail_block'>";
        str += "<span class=''>"+_baseVO.context.currentValue+"</span>";
        str += "</div>";
        return str;
    };

    let waitUpdateMail;
    let btnGet = function(){
        $('#btn_mail_get').addClass('hide_view');
        waitUpdateMail = _baseVO.context.current;
        _context.rest_list[_baseVO.context.oneItemUpdate].context.rest.externalRun(
            _baseVO.context.current, oneItemUpdateBack);
    };

    let oneItemUpdateBack = function(body, error){
        $('#btn_mail_get').removeClass('hide_view');
        _context.log.restIn(' << oneItemUpdateBack name:'+_baseVO.context.name+' body: '+JSON.stringify(body));

        if(body != null){
            let ix = _baseVO.context.arrKeys.indexOf(waitUpdateMail);
            if(ix > -1){
                if(typeof body.data !== 'object' && body.data.length === 24){
                    _baseVO.context.arrValues[ix] = body.data;
                    if(waitUpdateMail === _baseVO.context.current){
                        _baseVO.context.currentValue = body.data;
                        _context.models.base.context.setParam('externalUser', _baseVO.context.currentValue);
                    }
                    _baseVO.context.updateVO();
                }
            }
        }
    };

    _baseVO.context.updateVO = function () {
        _context.log.debug("debug mail_model updateVO name: "+_baseVO.context.name);
        let vo = document.getElementById(_baseVO.context.divID);
        vo.innerHTML = _baseVO.context.stringify();
        // $('.button_expand_obj').on('click', expand_reaction_obj);
        // $('.button_expand_arr').on('click', expand_reaction_arr);

        _baseVO.context.list_component.updateLists();

        $('#btn_mail_get').on('click', btnGet);
    };

    obj[_baseVO.context.name]();

    return _baseVO;
}