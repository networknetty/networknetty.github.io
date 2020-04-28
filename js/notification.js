

function create_notification(context) {
    let _context = context;

    _context.notification = {};
    _context.notification.all = {};
    _context.notification.all.contextVO = {};

    _context.notification.all.contextVO = {
        divID : "notification_block"
    };

    let _div = document.getElementById(_context.notification.all.contextVO.divID);
    let closePopup = function(){
        $('#'+_context.notification.all.contextVO.divID).fadeOut();
    };

    _context.notification.all.contextVO.socketEvent = function (trigger, data) {
        if(trigger[0] === "call"){
            _div.innerHTML = "<div class='notification_text'>"+data.notification+"</div>"+
                "<div class='notification_text_info'>"+JSON.stringify(data)+"</div>";
            $('#'+_context.notification.all.contextVO.divID).fadeIn();
            setTimeout(closePopup, 4000);
        }

        else if(trigger[0] === "call_trigger_message"){
            _div.innerHTML = "<div class='notification_text'>"+trigger[1]+"</div>"+
                "<div class='notification_text_info'>"+JSON.stringify(data)+"</div>";
            $('#'+_context.notification.all.contextVO.divID).fadeIn();
            setTimeout(closePopup, 4000);
        }
    };

    _context.notification.all.contextVO.dispatchEvent = function (trigger, data, callback) {
        if(trigger[0] === "call"){
            _div.innerHTML = "<div class='notification_text'>"+data.notification+"</div>"+
                "<div class='notification_text_info'>"+JSON.stringify(data)+"</div>";
            $('#'+_context.notification.all.contextVO.divID).fadeIn();
            setTimeout(closePopup, 4000);
        }
        else if(trigger[0] === "call_trigger_message"){
            _div.innerHTML = "<div class='notification_text'>"+trigger[1]+"</div>"+
                "<div class='notification_text_info'>"+JSON.stringify(data)+"</div>";
            $('#'+_context.notification.all.contextVO.divID).fadeIn();
            setTimeout(closePopup, 4000);
        }
        if(callback != null)
            callback();
    };

    closePopup();
}
