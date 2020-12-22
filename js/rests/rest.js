

function init_rest(context) {
    let _context = context;

    function call(endpoint, body, callback){
        fetch(
                _context.config.list[_context.config.current_list_item].url+endpoint,
                {
                    method: 'POST', headers: { 'Content-Type' : 'application/json', 'jwt': _context.config.jwt },
                    body: JSON.stringify(body)
                }
            )
            .then( function (response) {
                _parse(response, body, callback);
            });
    }

    let _parse = function(response, req_body, callback){
        if (response.ok) {
            let type = response.headers.get('content-type');
            if(type.indexOf('application/json') > -1){
                response.json()
                    .then( body => { callback(body); });
            } else if(type.indexOf('image/jpeg') > -1){
                let id = response.headers.get('id');
                console.log('response id: '+response.headers['id']);
                let add_img = false;
                let parent = document.getElementById('images');
                if(id == null && req_body != null && req_body.data != null && req_body.data.id != null)
                    id = req_body.data.id;
                if(id != null){
                    if(_context.global.images[id] == null){
                        let sp = document.createElement('span');
                        sp.className = 'image_name';
                        sp.id = 'sp_'+id;
                        sp.innerHTML = id;
                        _context.global.images[id] = {};
                        parent.appendChild(sp);
                        add_img = true;
                    }
                }else
                    add_img = true;

                if(add_img === true){
                    let reader = new FileReader();
                    reader.onload = function(e) {
                        let img = document.createElement('img');
                        img.src = 'data:image/jpeg;base64,' + btoa(e.target.result);
                        if(id != null)
                            img.id = 'img_'+id;
                        parent.appendChild(img);
                        callback({status:'ok'});
                    };
                    response.blob().then(function(blob) {
                        reader.readAsBinaryString(blob);
                    });
                } else
                    callback({status:'ok'});
            } else if(type.indexOf('text/plain') > -1){
                console.log('content-type: text/plain');
                callback(response.toString());
            } else
                callback(null, 'content-type: '+type);
        }
        else {
            // alert("error HTTP: " + response.status);
            callback(null, response.status);
        }
    };

    function callFData(endpoint, fd, callback){
        fetch(
                _context.config.list[_context.config.current_list_item].url+endpoint,
                {
                    method: 'POST',
                    headers: { 'jwt': _context.config.jwt },
                    //headers: { 'Content-Type' : 'multipart/form-data', 'jwt': _context.config.jwt },
                    body: fd
                }
            )
            .then( function (response) {
                _parse(response, null, callback);
            });
    }

    _context.callRest = call;
    _context.callRestFData = callFData;
}


