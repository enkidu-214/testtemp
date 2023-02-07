'use strict';

import SignalingChannel from "./script/sc.websocket.js";
import owt from "./script/owt.js";
const serverAddress = "http://192.168.110.83:3000";


// class rtcStreamScheduler2 {
//     rtcStreamScheduler() {
//         this.init();
//     }

//     playMap = new Map();
//     allowRIDs = [];
//     uid = '';

//     signaling = new SignalingChannel();
//     p2p = new Owt.P2P.P2PClient(
//         {
//             audioEncodings: false,
//             videoEncodings: [
//                 {
//                     codec: {
//                         name: "h264",
//                     },
//                 },
//             ],
//         },
//         signaling
//     );

//     init() {
//         p2p.allowedRemoteIds = this.allowRIDs;

//         p2p.connect({
//             host: serverAddress,
//             token: self.uid,
//         }).then(
//                 () => {
//                     p2p.addEventListener("streamadded", function (e) {
//                         // A remote stream is available.
//                         e.stream.addEventListener("ended", () => {
//                             console.log("Stream is removed.");
//                         });

//                         console.log("Stream added.");
//                         debugger;

//                         if (e.stream.source.video === "screen-cast") {
//                             // FIXME
//                         } else if (e.stream.source.audio || e.stream.source.video) {
//                             // TODO: callback
//                             if (!playMap.has(e.stream.origin)) {
//                                 // current res has not request play 
//                                 return;
//                             }

//                             // callback mediaStream
//                             playMap.get(e.stream.origin)(e.stream.mediaStream);
//                         }
//                     });
//                     p2p.addEventListener("messagereceived", function (e) {
//                         // Received data from datachannel.

//                         console.log("Recv message:" + e.origin + ": " + e.message);
//                     });
//                 },
//                 (error) => {
//                     console.log("Failed to connect to the signaling server." + error);
//                 }
//             );
//     }

//     startPlay(resId, onStream) {
//         debugger;
//         playMap.set(resId, onSucess);
//     }

//     stopPlay(resId) {
//         if (playMap.has(resId)) {
//             playMap.delete(resId);
//         }
//     }
// };

// export default new rtcStreamScheduler()

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

export default function RtcStreamSchedule() {
    const self = this;

    let playMap = new Map();
    let allowRIDs = ['webrtc'];
    let uid = '11';

    this.init = function () {
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
    };

    this.startPlay = function (resId, onSucess) {
        playMap.set(resId, onSucess);
    }

    this.stopPlay = function (resId, onSucess) {
        if (playMap.has(resId)) {
            playMap.delete(resId);
        }
    }

}