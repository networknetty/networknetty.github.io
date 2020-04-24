

function createMainRestVO(context, vo) {
    let _context = context;
    _context.models.base = vo;
    _context.models.base.contextVO = {
        name : 'main_rest_vo',

        block : document.getElementById('rest_model_block'),
        divID : "main_rest_vo",

        listen_component : {},
        list_component : {
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
    div.className = 'main_rest_item';
    div.id = _context.models.base.contextVO.divID;
    _context.models.base.contextVO.block.appendChild(div);

/////////////////////////////////////////////////////
    createListComponent(_context, _context.models.base, {
            pets : function (e) {
                let value = this.value;
                let selectedIndex = this.selectedIndex;

                _context.log.debug("debug dispatchList pets name:"+_context.models.base.contextVO.name +
                    " value: "+value+" selectedIndex: "+selectedIndex);

                if(_context.models.base.pets.length > 0){
                    if(selectedIndex == null)
                        selectedIndex = 0;
                    if(value == null)
                        value = _context.models.base.pets[0];
                }

                _context.log.debug("debug dispatchList after value: "+value+" selectedIndex: "+selectedIndex);

                _context.models.base.contextVO.list_component.setIndex('pets', selectedIndex);
                // _context.models.base.currentPetIx = Number.parseInt(this.value);
                // _context.models.base.currentPet = this.value;
                _context.models.base.contextVO.dispatchEvent('currentPet', value);
            }
        });
/////////////////////////////////////////////////////

    _context.models.base.contextVO.stringify = function () {

        _context.log.debug('debug stringify name:'+_context.models.base.contextVO.name);

        let str = '<span class="model_item_name">'+_context.models.base.contextVO.name+'</span>';

        str += "<div class='block_toggle' id='model_block_text_"+_context.models.base.contextVO.name+"'>";

        str += 'from : ' + _context.models.base.from + '<br>';
        str += _context.models.base.contextVO.list_component.createListTitle('pets',
            'main_vo_list_pets', _context.models.base.pets);
        str += '<br>currentPet : ' + _context.models.base.currentPet + '<br>';

        str += 'currentTask : ' + _context.models.base.currentTask + '<br>';
        str += 'currentFlow : ' + _context.models.base.currentFlow + '<br>';
        str += 'currentUser : ' + _context.models.base.currentUser + '<br>';
        str += 'currentMessage : ' + _context.models.base.currentMessage + '<br>';
        str += 'currentStoreItem : ' + _context.models.base.currentStoreItem + '<br>';
        str += 'userStore : ' + _context.models.base.userStore + '<br>';

        str += 'token_fb : ' + _context.models.base.token_fb + '<br>';
        str += 'token_fcm : ' + _context.models.base.token_fcm + '<br>';

        str += '</div>';

        return str;
    };

    _context.models.base.contextVO.updateVO = function (){
        _context.log.debug("debug main updateVO name: "+_context.models.base.contextVO.name);
        let vo = document.getElementById(_context.models.base.contextVO.divID);
        vo.innerHTML = _context.models.base.contextVO.stringify();
        _context.models.base.contextVO.list_component.updateLists();
    };

    initListenersBody(_context, _context.models.base);

    _context.models.base.contextVO.init = function () {
        initEventListeners(_context, _context.models.base);
        _context.models.base.contextVO.updateVO();
    };
}


