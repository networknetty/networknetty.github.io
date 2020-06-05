

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
                    .then( function (body) { callback(body); });
            } else if(type.indexOf('image/jpeg') > -1){
                let id = response.headers.get('id');
                // console.log('response id: '+id);
                let reader = new FileReader();
                reader.onload = function(e) {
                    let parent = document.getElementById('images');
                    let img = document.createElement('img');
                    img.src = 'data:image/jpeg;base64,' + btoa(e.target.result);
                    if(id == null && req_body != null && req_body.id != null)
                        id = req_body.id;
                    if(id != null){
                        let sp = document.createElement('span');
                        sp.className = 'image_name';
                        sp.id = id;
                        _context.global.images[id] = {};
                        parent.appendChild(sp);
                    }
                    parent.appendChild(img);

                    callback({status:'ok'});
                };
                response.blob().then(function(blob) {
                    reader.readAsBinaryString(blob);
                });
            } else {
                callback(null, 'content-type: '+type);
            }
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


