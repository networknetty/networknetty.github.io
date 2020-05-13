

function createMainRestVO(context, base) {
    let _context = context;
    if(base == null)
        return;

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

        let str = '<span class="model_item_name">'+_context.models.base.context.name+'</span>';
        str += "<div class='block_toggle' id='model_block_text_"+_context.models.base.context.name+"'>";

        str += _context.models.base.context.list_component.createListTitle('pets',
            'main_vo_list_pets', _context.models.base.vo.pets) + '<br>';

        for(let field in _context.models.base.vo){
            if(field !== 'pets' && field !== 'token_fb' && field !== 'token_fcm')
                str += field + ' : ' + _context.models.base.vo[field] + '<br>';
        }

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


