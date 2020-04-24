

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
                    if (response.ok) {
                        response.json()
                            .then( function (body) { callback(body); });
                    }
                    else {
                        // alert("error HTTP: " + response.status);
                        callback(null, response.status);
                    }
                }
            );
    }

    _context.callRest = call;
}

