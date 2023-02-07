const serverAddress = 'http://10.1.0.216:3000';

const signaling = new SignalingChannel();
let publicationForCamera;
const p2p = new Owt.P2P.P2PClient({
    audioEncodings: false,
    videoEncodings: [{
        codec: {
            name: 'h264',
        },
    }]
}, signaling);

let localStream;
let screenStream;

const getTargetId = function() {
    return $('#remote-uid').val();
};

$(document).ready(function() {
    $('#set-remote-uid').click(function() {
        p2p.allowedRemoteIds = [getTargetId()];
    });

    $('#login').click(function() {
        p2p.connect({
            host: serverAddress,
            token: $('#uid').val(),
        }).then(() => {
            $('#uid').prop('disabled', true);
        }, (error) => {
            console.log('Failed to connect to the signaling server.');
        }); // Connect to signaling server.
    });

    $('#logoff').click(function() {
        p2p.disconnect();
        $('#uid').prop('disabled', false);
    });

    $('#data-send').click(function() {
        p2p.send(getTargetId(), $('#dataSent')
            .val()); // Send data to remote endpoint.
    });
});

p2p.addEventListener('streamadded',
    function(e) { // A remote stream is available.
        e.stream.addEventListener('ended', () => {
            console.log('Stream is removed.');
        });
        if (e.stream.source.video === 'screen-cast') {
            $('#screen video').show();
            $('#screen video').get(0).srcObject = e.stream.mediaStream;
            $('#screen video').get(0).play();
        } else if (e.stream.source.audio || e.stream.source.video) {
            $('#remoteVideo').show();
            $('#remoteVideo').get(0).srcObject = e.stream.mediaStream;
            $('#remoteVideo').get(0).play();

            $('#remoteVideo1').show();
            $('#remoteVideo1').get(0).srcObject = e.stream.mediaStream;
            $('#remoteVideo1').get(0).play();

            $('#remoteVideo2').show();
            $('#remoteVideo2').get(0).srcObject = e.stream.mediaStream;
            $('#remoteVideo2').get(0).play();

            $('#remoteVideo3').show();
            $('#remoteVideo3').get(0).srcObject = e.stream.mediaStream;
            $('#remoteVideo3').get(0).play();
        }
    });

p2p.addEventListener('messagereceived',
    function(e) { // Received data from datachannel.
        $('#dataReceived').val(e.origin + ': ' + e.message);
    });

window.onbeforeunload = function() {
    p2p.stop($('#remote-uid').val());
};
