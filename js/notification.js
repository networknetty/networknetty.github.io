
function create_notification(context) {
    let _context = context;

    _context.notification = {};
    _context.notification.all = {};
    _context.notification.all.context = {};

    let _div = document.getElementById("main_notification_block");

    _context.notification.all.context.call = function(data, current){
        let ix = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        let div = document.createElement('div');

        let _removeParent = function() {
            $("#notification_block_"+ix).remove();
        };

        function close(){
            $('#notification_block_'+ix).fadeOut(2000);
            setTimeout(_removeParent, 3000);
        }

        div.className = 'notification_block '+current.css;
        div.id = 'notification_block_'+ix;
        _div.appendChild(div);

        div.innerHTML = "<div class='notification_text'>"+data.notification+"</div>"+
            "<div class='notification_text_info'>"+JSON.stringify(data)+"</div>" +
            "<input type='button' value='x' class='buttons' id='btn_ntfc_close_"+ix+"'>";

        $('#btn_ntfc_close_'+ix).on('click', close);
    };

    _context.notification.all.context.callMsg = function(data, current){
        let ix = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        let div = document.createElement('div');

        let _removeParent = function() {
            $("#notification_block_"+ix).remove();
        };

        function close(){
            $('#notification_block_'+ix).fadeOut(2000);
            setTimeout(_removeParent, 3000);
        }

        div.className = 'notification_block '+current.css;
        div.id = 'notification_block_'+ix;
        _div.appendChild(div);

        div.innerHTML = "<div class='notification_text'>"+current.msg+"</div>"+
            "<div class='notification_text_info'>"+JSON.stringify(data)+"</div>" +
            "<input type='button' value='x' class='buttons' id='btn_ntfc_close_"+ix+"'>";

        $('#btn_ntfc_close_'+ix).on('click', close);
    };

}



