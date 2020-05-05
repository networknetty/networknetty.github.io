

function createMainRestVO(context, base) {
    let _context = context;
    _context.models.base = initBaseVO(context, base, 'main_rest_vo', "main_rest_vo",
        document.getElementById('rest_model_block'));
    initMonoSetParams(context, _context.models.base);

/////////////////////////////////////////////////////
    createListComponent(_context, _context.models.base, {
            pets : function (e) {
                let value = this.value;
                let selectedIndex = this.selectedIndex;

                // _context.log.debug("debug dispatchList pets name:"+_context.models.base.context.name +
                //     " value: "+value+" selectedIndex: "+selectedIndex);

                if(_context.models.base.vo.pets.length > 0){
                    if(selectedIndex == null)
                        selectedIndex = 0;
                    if(value == null)
                        value = _context.models.base.vo.pets[0];
                }
                _context.log.debug("debug dispatchList after value: "+value+" selectedIndex: "+selectedIndex);

                _context.models.base.context.list_component.setIndex('pets', selectedIndex);
                _context.models.base.context.setParam('currentPet', value);
            }
        });
/////////////////////////////////////////////////////

    _context.models.base.context.stringify = function () {
        // _context.log.debug('debug stringify name:'+_context.models.base.context.name);
        let str = '<span class="model_item_name">'+_context.models.base.context.name+'</span>';
        str += "<div class='block_toggle' id='model_block_text_"+_context.models.base.context.name+"'>";
        str += 'from : ' + _context.models.base.vo.from + '<br>';

        str += _context.models.base.context.list_component.createListTitle('pets',
            'main_vo_list_pets', _context.models.base.vo.pets);

        str += '<br>currentPet : ' + _context.models.base.vo.currentPet + '<br>';
        str += 'currentTask : ' + _context.models.base.vo.currentTask + '<br>';
        str += 'currentFlow : ' + _context.models.base.vo.currentFlow + '<br>';
        str += 'currentUser : ' + _context.models.base.vo.currentUser + '<br>';
        str += 'currentMail : ' + _context.models.base.vo.currentMail + '<br>';
        str += 'externalUser : ' + _context.models.base.vo.externalUser + '<br>';
        str += 'currentMessage : ' + _context.models.base.vo.currentMessage + '<br>';
        str += 'currentInventoryItem : ' + _context.models.base.vo.currentInventoryItem + '<br>';
        str += 'userInventory : ' + _context.models.base.vo.userInventory + '<br>';

        str += 'token_fb : ' + _context.models.base.vo.token_fb + '<br>';
        str += 'token_fcm : ' + _context.models.base.vo.token_fcm + '<br>';

        str += '</div>';

        return str;
    };

    _context.models.base.context.updateVO = function (){
        _context.log.debug("debug main updateVO name: "+_context.models.base.context.name);
        let vo = document.getElementById("main_rest_vo");
        vo.innerHTML = _context.models.base.context.stringify();
        // $('.button_expand_obj').on('click', expand_reaction_obj);
        // $('.button_expand_arr').on('click', expand_reaction_arr);
        _context.models.base.context.list_component.updateLists();
    };

    _context.models.base.context.init = function () {
        _context.models.base.context.initListeners();
        _context.models.base.context.updateVO();
    };
}


