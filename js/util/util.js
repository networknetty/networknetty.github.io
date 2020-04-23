

function util_parse(obj, tab, top_field, form_settings, form_name) {
    if(tab == null)
        tab = '';
    if (Array.isArray(obj)){
        let str = '[';
        for(let i=0; i<obj.length; i++){
            if(i !== 0)
                str += ',';
            str += '<br>'+ tab + '&ensp;&ensp;' + util_parse(obj[i], tab+ '&ensp;&ensp;') + ' ';
        }
        return obj.length > 0 ? str+'<br>'+ tab + ']' : str+']';
    }
    else if(typeof obj === 'object'){
        let str = '{ <br>';//tab +

        for(let field in obj){

            if( top_field === 'data' && form_settings != null && form_settings[field] != null ){
                str += tab + '&ensp;&ensp;' + field + ' : ' + _parse_form_obj(obj, field, form_settings, form_name) + ' <br>';
            }else
                str += tab + '&ensp;&ensp;' + field + ' : ' + util_parse(obj[field], tab + '&ensp;&ensp;') + ' <br>';

        }

        return str + tab + '}';
    }
    else{
        return ''+obj;
    }
}

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
