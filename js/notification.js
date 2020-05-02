

function create_notification0(context) {
    let _context = context;

    _context.notification = {};
    _context.notification.all = {};
    _context.notification.all.contextVO = {};

    _context.notification.all.contextVO = {
        divID : "main_notification_block"
    };

    let _div = document.getElementById(_context.notification.all.contextVO.divID);
    let closePopup = function(){
        $('#notification_block').fadeOut();
    };

    _context.notification.all.contextVO.socketEvent = function (trigger, data) {
        if(trigger[0] === "call"){
            _div.innerHTML = "<div class='notification_block' id='notification_block'>"+
                "<div class='notification_text'>"+data.notification+"</div>"+
                "<div class='notification_text_info'>"+JSON.stringify(data)+"</div></div>";
            $('#notification_block').fadeIn();
            setTimeout(closePopup, 4000);
        }

        else if(trigger[0] === "call_trigger_message"){
            _div.innerHTML = "<div class='notification_block' id='notification_block'>"+
                "<div class='notification_text'>"+trigger[1]+"</div>"+
                "<div class='notification_text_info'>"+JSON.stringify(data)+"</div></div>";
            $('#notification_block').fadeIn();
            setTimeout(closePopup, 4000);
        }
    };

    _context.notification.all.contextVO.dispatchEvent = function (trigger, data, callback) {
        if(trigger[0] === "call"){
            _div.innerHTML = "<div class='notification_block' id='notification_block'>"+
                "<div class='notification_text'>"+data.notification+"</div>"+
                "<div class='notification_text_info'>"+JSON.stringify(data)+"</div></div>";
            $('#notification_block').fadeIn();
            setTimeout(closePopup, 4000);
        }
        else if(trigger[0] === "call_trigger_message"){
            _div.innerHTML = "<div class='notification_block' id='notification_block'>"+
                "<div class='notification_text'>"+trigger[1]+"</div>"+
                "<div class='notification_text_info'>"+JSON.stringify(data)+"</div></div>";
            $('#notification_block').fadeIn();
            setTimeout(closePopup, 4000);
        }
        if(callback != null)
            callback();
    };

    // closePopup();
}

function create_notification(context) {
    let _context = context;

    _context.notification = {};
    _context.notification.all = {};
    _context.notification.all.contextVO = {};

    let _div = document.getElementById("main_notification_block");

    _context.notification.all.contextVO.socketEvent = function (trigger, data) {
        _createCloseNotification(trigger, data);
    };
    _context.notification.all.contextVO.dispatchEvent = function (trigger, data, callback) {
        _createCloseNotification(trigger, data);
        if(callback != null)
            callback();
    };

    let _createCloseNotification = function (trigger, data) {
        let ix;
        let div;

        function close(){
            let dv = document.getElementById("notification_block_"+ix);
            $('#notification_block').fadeOut(2000);
            setTimeout(dv.remove, 2000);
        }

        if(trigger[0] === "call"){
            // $('#notification_block').fadeIn();
            ix = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);

            div = document.createElement('div');
            div.className = 'notification_block';
            div.id = 'notification_block_'+ix;
            _div.appendChild(div);

            div.innerHTML = "<div class='notification_text'>"+data.notification+"</div>"+
                "<div class='notification_text_info'>"+JSON.stringify(data)+"</div>" +
                "<input type='button' value='x' class='buttons' id='btn_ntfc_close_"+ix+"'>";

            $('#btn_ntfc_close_'+ix).on('click', close);
        }
        else if(trigger[0] === "call_trigger_message"){
            ix = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);

            div = document.createElement('div');
            div.className = 'notification_block';
            div.id = 'notification_block_'+ix;
            _div.appendChild(div);

            div.innerHTML = "<div class='notification_text'>"+trigger[1]+"</div>"+
                "<div class='notification_text_info'>"+JSON.stringify(data)+"</div>";

            $('#btn_ntfc_close_'+ix).on('click', close);
        }
    };
}
