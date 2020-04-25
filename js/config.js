

function init_config(context) {

    let _context = context;

    if (!window.localStorage) {
        _context.log.debug("!window.localStorage");
    }

    let _config_key = "config";

    let openFile = function () {
        let fileInput;
        fileInput = document.createElement("input");
        fileInput.type='file';
        fileInput.style.display='none';
        fileInput.onchange = function(e) {
            let file = e.target.files[0];
            if (!file) { return; }
            let reader = new FileReader();
            reader.onload = function(e) {
                let parseNode = JSON.parse(e.target.result);
                if(parseNode.list){
                    _config.list = parseNode.list;
                    _config.current_list_item = 0;
                }
                if(parseNode.jwt) _config.jwt = parseNode.jwt;
                if(parseNode.web) _config.web = parseNode.web;
                // if(parseNode.listen) _config.listen = parseNode.listen;

                if(parseNode.models) _config.models = parseNode.models;
                if(parseNode.mix_models) _config.mix_models = parseNode.mix_models;
                if(parseNode.rest_list) _config.rest_list = parseNode.rest_list;
                if(parseNode.socket_models_listen) _config.socket_models_listen = parseNode.socket_models_listen;
                if(parseNode.socket_models_emit) _config.socket_models_emit = parseNode.socket_models_emit;

                document.body.removeChild(fileInput);

                setLocalObject(_config_key, _config);
                changeList();
                updateCurrentInfoBlockAboutConfig();
            };
            reader.readAsText(file)
        };
        document.body.appendChild(fileInput);
        let eventMouse = document.createEvent("MouseEvents");
        eventMouse.initMouseEvent("click", true, false, window, 0,
            0, 0, 0, 0, false, false,
            false, false, 0, null);
        fileInput.dispatchEvent(eventMouse);
    };
    $('#btn_open_cfg').on('click', openFile);
    $('#btn_return').on('click', onReturn);
    function onReturn() {
        $('#form_div').addClass('hide_view');
        $('#form_info').removeClass('hide_view');
    }


//// select current server config on list
    $('#list_current').on('change', changeCurrentList);
    
    function changeList(){
        let list = "";
        for(let i=0; i<_config.list.length; i++){
            list += "<option value="+i+">"+_config.list[i].name+"</option>";
        }
        $('#list_current').html(list);
        document.getElementById("list_current").selectedIndex = _config.current_list_item;
    }
    
    function changeCurrentList(e){
        _config.current_list_item = Number.parseInt(this.value);
        setLocalObject(_config_key, _config);
        updateCurrentInfoBlockAboutConfig();
    }
////

    let setLocalObject = function(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));

        localforage.setItem(key, value)
            .then(function (value) {})
            .catch(function (error) {
                _context.log.error(' // localforage.setItem err: '+error);
            });
    };

    let getLocalObject = function(key) {
        if(!window.localStorage.hasOwnProperty(key))
            return null;
        return JSON.parse(window.localStorage.getItem(key));
    };

    let _config = getLocalObject(_config_key);
    if(_config == null){
        _config = { 
            list:[{name:"none", url:"none", sock:"none"}], 
            current_list_item:0, 
            jwt:"none", 
            web:{}, 
            // listen:[],
            models:{},
            mix_models:{},
            rest_list:{},
            socket_models_listen:{},
            socket_models_emit:{}
        };
        setLocalObject(_config_key, _config);
        onConfigEdit();
    }else{
        if(_config.list[_config.current_list_item].url === "none"){
            onConfigEdit();
        }else{
            $('#form_div').addClass('hide_view');
            updateCurrentInfoBlockAboutConfig();
        }
    }

    function updateCurrentInfoBlockAboutConfig(){
        $('.main_form_block_info').html(
            'name: '+_config.list[_config.current_list_item].name+' <br> ' +
            'url: '+_config.list[_config.current_list_item].url+' <br> ' +
            'sock: '+_config.list[_config.current_list_item].sock +' <br> '
        );
    }

    $('.btn_edit').on('click', onConfigEdit);

    function onConfigEdit() {
        changeList();
        $('#form_div').removeClass('hide_view');
        $('#form_info').addClass('hide_view');
    }
    
    _context.config = _config;
}





