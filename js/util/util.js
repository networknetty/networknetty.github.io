
function util_parse(obj, top_field, form_settings, form_name) {
    if (Array.isArray(obj)){
        let str = '[<input type="button" value=">" class="button_expand_arr"><div class="parse_arr_main">';

        for(let i=0; i<obj.length; i++){
            str += '<div class="parse_arr_item">'+ util_parse(obj[i]) + '</div>';
        }
        return obj.length > 0 ?
            str+'<span class="parse_arr_item_close">]</span></div>' :
            str+']</div>';
    }
    else if(typeof obj === 'object'){
        let str = '{<input type="button" value=">" class="button_expand_obj"><div class="parse_obj_main" id="">';

        for(let field in obj){
            if( top_field === 'data' && form_settings != null && form_settings[field] != null ){
                str += '<span class="parse_obj_item">'+ field + ' : ' +
                    _parse_form_obj(obj, field, form_settings, form_name) + ' </span>';
            }else
                str += '<span class="parse_obj_item">'+ field + ' : ' + util_parse(obj[field]) + ' </span>';
        }
        return str + '<span class="parse_obj_item_close">}</span></div>';
    }
    else{
        return '<span class="parse_item">'+obj+'</span>';
    }
}

let _parse_toggle_ready = true;

let toggle_activate = function(){
    _parse_toggle_ready = true;
};

let expand_reaction_obj = function(){
    if(_parse_toggle_ready === true){
        _parse_toggle_ready = false;
        setTimeout(toggle_activate, 200);
        $(this).next(".parse_obj_main").toggle();
        $(this).val($(this).val() === ">" ? "<" : ">");
    }
};

let expand_reaction_arr = function(){
    if(_parse_toggle_ready === true){
        _parse_toggle_ready = false;
        setTimeout(toggle_activate, 200);
        $(this).next(".parse_arr_main").toggle();
        $(this).val($(this).val() === ">" ? "<" : ">");
    }
};

let _parse_form_obj = function (data, field, form_settings, form_name) {
    if(form_settings[field].type === "input_text"){
        let value = 'test';
        if(form_settings[field].value === "base")
            value = data[field];
        return "<input class='input_text' type='text' size='24' value='"+value+"' name='"+form_name+"_"+field+"'>";
    }
    else if(form_settings[field].type === "select"){
        let str = "<select value='"+form_settings[field].values[0]+"' name='"+form_name+"_"+field+"'>";

        for(let i=0; i<form_settings[field].values.length; i++){
            str += "<option value='"+form_settings[field].values[i]+"'>"+form_settings[field].values[i]+"</option>";
        }

        str += "</select>";

        return str;
    }
    return '';
};
