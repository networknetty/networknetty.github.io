

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
                _parse(response, callback);
            });
    }

    let _parse = function(response, callback){
        if (response.ok) {
            let type = response.headers.get('content-type');
            if(type === 'application/json'){
                response.json()
                    .then( function (body) { callback(body); });
            } else if(type === 'image/jpeg'){
                let id = response.headers.get('id');
                // console.log('response id: '+id);
                let reader = new FileReader();
                reader.onload = function(e) {
                    let parent = document.getElementById('images');
                    let img = document.createElement('img');
                    img.src = 'data:image/jpeg;base64,' + btoa(e.target.result);
                    if(id != null){
                        let sp = document.createElement('span');
                        sp.className = 'image_name';
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
                _parse(response, callback);
            });
    }

    _context.callRest = call;
    _context.callRestFData = callFData;
}


