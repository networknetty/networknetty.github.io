

function init_fb(context) {
    let _context = context;

    let tk_fb;
    let tk_fcm;
    // let userID;

    $('.btn_send').on('click', onSend);

    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('firebase-messaging-sw.js').then(function(registration) {
    //     }).catch(function(error) {
    //         console.log('error reg service worker:', error);
    //     });
    // } else {
    //     console.log('browser service worker not sup');
    // }

    function onSend() {

        $('.buttons_cfg').addClass('hide_view');

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('firebase-messaging-sw.js').then(function(registration) {
            }).catch(function(error) {
                _context.log.error(' // error reg service worker:', error);
            });
        } else {
            _context.log.error(' // browser service worker not sup');
        }

        firebase.initializeApp(_context.config.web);
        // firebase.initializeApp(_config.web);
        let messaging = firebase.messaging();

        messaging.requestPermission()
            .then(
                function () {
                    _context.log.debug("Notification permission granted");
                    return messaging.getToken();
                }
            )
            .catch( function (err) { _context.log.error(" // Unable to get permission to notify.", err); } );

        messaging.onMessage((payload) => {
            // let msg = JSON.stringify(payload);
            // info_msg.innerHTML = 'Message received: '+ msg;
            new Notification(payload.notification.title, payload.notification);
        });

        let provider = new firebase.auth.OAuthProvider('google.com');

        firebase.auth().signInWithPopup(provider)
            .then(
                function(result) {
                    let user = result.user;
                    tk_fb = user.xa.toString();

                    messaging.getToken()
                        .then(
                            (tok)=>{
                                tk_fcm = tok;
                                _context.models.base.context.setParam('token_fb', tk_fb);
                                _context.models.base.context.setParam('token_fcm', tk_fcm);

                                //todo logs
                                logsComponentLoginDone();

                            }
                        );
                }
            ).catch(
            function(error) {
                _context.log.error(' // error: ', error);
            });
    }

}








