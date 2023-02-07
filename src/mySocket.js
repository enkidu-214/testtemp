
module.exports = function (io) {
    var connectionMap = new Map();

    function disconnectClient(cid) {
        if (connectionMap.has(cid)) {
            var connection = connectionMap.get(cid);
            connection.emit('server-disconnect');
            connectionMap.delete(cid);
            connection.cid = null;
            connection.disconnect();
        }
    }

    io.sockets.on('connection', function(socket) {
        if (socket.cid) {
            var cid = socket.cid;
            disconnectClient(cid);
            connectionMap.set(cid, socket);
        }

        socket.on('authentication', function(data, cb) {
            var cid = data.token;
            disconnectClient(cid);
            socket.cid = cid;
            connectionMap.set(cid, socket);
            socket.emit('server-authenticated', {uid: cid});
            if (typeof cb == 'function') {
                cb({uid: cid});
            }
        });

        socket.on('disconnect', function() {
            if (socket.cid) {
                var cid = socket.cid;
                if (connectionMap.has(socket.cid)) {
                    delete connectionMap.delete(socket.cid);
                }
            }
        });

        socket.on('owt-message', function(data, cb) {
            if (!socket.cid) {
                socket.disconnect();
                return;
            }
            data.from = socket.cid;
            var to = data.to;
            delete data.to;

            if (connectionMap.has(to)) {
                connectionMap.get(to).emit('owt-message', data);
            }

            if (typeof cb == 'function') {
                cb();
            }
        });
    });
}
