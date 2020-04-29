

window.onload = function () {
    let _context = {};

    init_console(_context);
    init_config(_context);
    init_rest(_context);
    init_sock(_context);
    init_fb(_context);

    init_models(_context);
    init_mail_models(_context);
    init_rests_with_group(_context);

    init_mix_models(_context);
    init_socket_models(_context);

    init_socket_listen_models(_context);


    activated_models(_context);
    activated_rests(_context);
    activated_mix_models(_context);
    activated_socket_models(_context);

    create_notification(_context);

};

