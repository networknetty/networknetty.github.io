
function init_mail_models(context) {

    if(
        context.config.other == null ||
        context.config.other.mails == null ||
        context.config.other.mails.length === 0
    )
        return;

    let _context = context;
    let _baseVO = {};

    _baseVO.contextVO = {
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
        _baseVO.contextVO.arrKeys.push(_context.config.other.mails[i]);
        _baseVO.contextVO.arrValues.push("");
    }

    let div = document.createElement('div');
    div.className = 'model_item';
    div.id = _baseVO.contextVO.divID;
    _baseVO.contextVO.block.appendChild(div);

/////////////////////////////////////////////////////
    let obj = {};
    obj[_baseVO.contextVO.name] = function (e) {
        let value = this.value;
        let selectedIndex = this.selectedIndex;

        _context.log.debug("debug dispatchList item_ name:"+_baseVO.contextVO.name +
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

        _baseVO.contextVO.current = value;
        _context.models.base.contextVO.dispatchEvent('currentMail', _baseVO.contextVO.current);

        _baseVO.contextVO.currentValue = _baseVO.contextVO.arrValues[selectedIndex];
        _context.models.base.contextVO.dispatchEvent('externalUser', _baseVO.contextVO.currentValue);

        _baseVO.contextVO.updateVO();
    };

    createListComponent(_context, _baseVO, obj);
/////////////////////////////////////////////////////
    _baseVO.contextVO.stringify = function (){

        _context.log.debug('debug stringify name:'+_baseVO.contextVO.name);

        let str = "<div class='mail_block'>";

        str += _baseVO.contextVO.list_component.createListTitle(_baseVO.contextVO.name,
            'mail_list', _baseVO.contextVO.arrKeys);

        str += "<input type='button' value='get' class='buttons' id='btn_mail_get'>";

        str += "</div><div class='mail_block'>";
        str += "<span class=''>"+_baseVO.contextVO.currentValue+"</span>";

        // str += "<input type='button' value='<<' class='buttons' id='btn_mail_set'>";
        str += "</div>";

        return str;
    };

    let waitUpdateMail;
    let btnGet = function(){
        $('#btn_mail_get').addClass('hide_view');
        waitUpdateMail = _baseVO.contextVO.current;
        _context.rest_list[_baseVO.contextVO.oneItemUpdate].contextVO.modelCallUpdate(
            _baseVO.contextVO.current, oneItemUpdateBack);
    };

    let oneItemUpdateBack = function(body, error){
        $('#btn_mail_get').removeClass('hide_view');
        _context.log.restIn(' << oneItemUpdateBack name:'+_baseVO.contextVO.name+' body: '+JSON.stringify(body));

        if(body != null){
            let ix = _baseVO.contextVO.arrKeys.indexOf(waitUpdateMail);
            if(ix > -1){
                if(typeof body.data !== 'object' && body.data.length === 24){
                    _baseVO.contextVO.arrValues[ix] = body.data;
                    if(waitUpdateMail === _baseVO.contextVO.current){
                        _baseVO.contextVO.currentValue = body.data;
                        _context.models.base.contextVO.dispatchEvent('externalUser', _baseVO.contextVO.currentValue);
                    }
                    _baseVO.contextVO.updateVO();
                }
            }
        }
    };

    _baseVO.contextVO.updateVO = function () {
        _context.log.debug("debug mail_model updateVO name: "+_baseVO.contextVO.name);
        let vo = document.getElementById(_baseVO.contextVO.divID);
        vo.innerHTML = _baseVO.contextVO.stringify();
        _baseVO.contextVO.list_component.updateLists();

        $('#btn_mail_get').on('click', btnGet);
    };

    obj[_baseVO.contextVO.name]();

    return _baseVO;
}