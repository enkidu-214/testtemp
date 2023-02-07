'use strict';

import SignalingChannel from "./script/sc.websocket.js";
import owt from "./script/owt.js";
const serverAddress = "http://192.168.110.83:3000";


const signaling = new SignalingChannel();
const p2p = new Owt.P2P.P2PClient(
    {
        audioEncodings: false,
        videoEncodings: [
            {
                codec: {
                    name: "h264",
                },
            },
        ],
    },
    signaling
);

export default class StreamSchedule {
    constructor() {
        this.playMap = new Map();
        this.allowRIDs = ['webrtc'];
        this.uid = '11';
    }

    init() {
        p2p.allowedRemoteIds = self.allowRIDs;

        p2p.connect({
            host: serverAddress,
            token: self.uid,
        })
            .then(
                () => {
                    p2p.addEventListener("streamadded", function (e) {
                        // A remote stream is available.
                        e.stream.addEventListener("ended", () => {
                            console.log("Stream is removed.");
                        });

                        console.log("Stream added.");
                        debugger;

                        if (e.stream.source.video === "screen-cast") {
                            // FIXME
                        } else if (e.stream.source.audio || e.stream.source.video) {
                            // TODO: callback
                            if (!playMap.has(e.stream.origin)) {
                                // current res has not request play 
                                return;
                            }

                            // callback mediaStream
                            playMap.get(e.stream.origin)(e.stream.mediaStream);
                        }
                    });
                    p2p.addEventListener("messagereceived", function (e) {
                        // Received data from datachannel.

                        console.log("Recv message:" + e.origin + ": " + e.message);
                    });
                },
                (error) => {
                    console.log("Failed to connect to the signaling server." + error);
                }
            );
    }

    startPlay(resId, onSucess) {
        playMap.set(resId, onSucess);
    }

    stopPlay(resId, onSucess) {
        if (playMap.has(resId)) {
            playMap.delete(resId);
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new StreamSchedule();
            this.init();
        } else {
            console.log('Has create StreamSchedule')
            return
        }
        return this.instance
    }
}