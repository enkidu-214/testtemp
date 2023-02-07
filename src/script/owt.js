(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Owt = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// MIT License
//
// Copyright (c) 2012 Universidad Politécnica de Madrid
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file is borrowed from lynckia/licode with some modifications.

/* global unescape*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Base64 = void 0;

var Base64 = function () {
  var END_OF_INPUT = -1;
  var base64Str;
  var base64Count;
  var i;
  var base64Chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
  var reverseBase64Chars = [];

  for (i = 0; i < base64Chars.length; i = i + 1) {
    reverseBase64Chars[base64Chars[i]] = i;
  }

  var setBase64Str = function setBase64Str(str) {
    base64Str = str;
    base64Count = 0;
  };

  var readBase64 = function readBase64() {
    if (!base64Str) {
      return END_OF_INPUT;
    }

    if (base64Count >= base64Str.length) {
      return END_OF_INPUT;
    }

    var c = base64Str.charCodeAt(base64Count) & 0xff;
    base64Count = base64Count + 1;
    return c;
  };

  var encodeBase64 = function encodeBase64(str) {
    var result;
    var done;
    setBase64Str(str);
    result = '';
    var inBuffer = new Array(3);
    done = false;

    while (!done && (inBuffer[0] = readBase64()) !== END_OF_INPUT) {
      inBuffer[1] = readBase64();
      inBuffer[2] = readBase64();
      result = result + base64Chars[inBuffer[0] >> 2];

      if (inBuffer[1] !== END_OF_INPUT) {
        result = result + base64Chars[inBuffer[0] << 4 & 0x30 | inBuffer[1] >> 4];

        if (inBuffer[2] !== END_OF_INPUT) {
          result = result + base64Chars[inBuffer[1] << 2 & 0x3c | inBuffer[2] >> 6];
          result = result + base64Chars[inBuffer[2] & 0x3F];
        } else {
          result = result + base64Chars[inBuffer[1] << 2 & 0x3c];
          result = result + '=';
          done = true;
        }
      } else {
        result = result + base64Chars[inBuffer[0] << 4 & 0x30];
        result = result + '=';
        result = result + '=';
        done = true;
      }
    }

    return result;
  };

  var readReverseBase64 = function readReverseBase64() {
    if (!base64Str) {
      return END_OF_INPUT;
    }

    while (true) {
      // eslint-disable-line no-constant-condition
      if (base64Count >= base64Str.length) {
        return END_OF_INPUT;
      }

      var nextCharacter = base64Str.charAt(base64Count);
      base64Count = base64Count + 1;

      if (reverseBase64Chars[nextCharacter]) {
        return reverseBase64Chars[nextCharacter];
      }

      if (nextCharacter === 'A') {
        return 0;
      }
    }
  };

  var ntos = function ntos(n) {
    n = n.toString(16);

    if (n.length === 1) {
      n = '0' + n;
    }

    n = '%' + n;
    return unescape(n);
  };

  var decodeBase64 = function decodeBase64(str) {
    var result;
    var done;
    setBase64Str(str);
    result = '';
    var inBuffer = new Array(4);
    done = false;

    while (!done && (inBuffer[0] = readReverseBase64()) !== END_OF_INPUT && (inBuffer[1] = readReverseBase64()) !== END_OF_INPUT) {
      inBuffer[2] = readReverseBase64();
      inBuffer[3] = readReverseBase64();
      result = result + ntos(inBuffer[0] << 2 & 0xff | inBuffer[1] >> 4);

      if (inBuffer[2] !== END_OF_INPUT) {
        result += ntos(inBuffer[1] << 4 & 0xff | inBuffer[2] >> 2);

        if (inBuffer[3] !== END_OF_INPUT) {
          result = result + ntos(inBuffer[2] << 6 & 0xff | inBuffer[3]);
        } else {
          done = true;
        }
      } else {
        done = true;
      }
    }

    return result;
  };

  return {
    encodeBase64: encodeBase64,
    decodeBase64: decodeBase64
  };
}();

exports.Base64 = Base64;

},{}],2:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';
/**
 * @class AudioCodec
 * @memberOf Owt.Base
 * @classDesc Audio codec enumeration.
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoEncodingParameters = exports.VideoCodecParameters = exports.VideoCodec = exports.AudioEncodingParameters = exports.AudioCodecParameters = exports.AudioCodec = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioCodec = {
  PCMU: 'pcmu',
  PCMA: 'pcma',
  OPUS: 'opus',
  G722: 'g722',
  ISAC: 'iSAC',
  ILBC: 'iLBC',
  AAC: 'aac',
  AC3: 'ac3',
  NELLYMOSER: 'nellymoser'
};
/**
 * @class AudioCodecParameters
 * @memberOf Owt.Base
 * @classDesc Codec parameters for an audio track.
 * @hideconstructor
 */

exports.AudioCodec = AudioCodec;

var AudioCodecParameters = // eslint-disable-next-line require-jsdoc
function AudioCodecParameters(name, channelCount, clockRate) {
  _classCallCheck(this, AudioCodecParameters);

  /**
   * @member {string} name
   * @memberof Owt.Base.AudioCodecParameters
   * @instance
   * @desc Name of a codec. Please use a value in Owt.Base.AudioCodec. However, some functions do not support all the values in Owt.Base.AudioCodec.
   */
  this.name = name;
  /**
   * @member {?number} channelCount
   * @memberof Owt.Base.AudioCodecParameters
   * @instance
   * @desc Numbers of channels for an audio track.
   */

  this.channelCount = channelCount;
  /**
   * @member {?number} clockRate
   * @memberof Owt.Base.AudioCodecParameters
   * @instance
   * @desc The codec clock rate expressed in Hertz.
   */

  this.clockRate = clockRate;
};
/**
 * @class AudioEncodingParameters
 * @memberOf Owt.Base
 * @classDesc Encoding parameters for sending an audio track.
 * @hideconstructor
 */


exports.AudioCodecParameters = AudioCodecParameters;

var AudioEncodingParameters = // eslint-disable-next-line require-jsdoc
function AudioEncodingParameters(codec, maxBitrate) {
  _classCallCheck(this, AudioEncodingParameters);

  /**
   * @member {?Owt.Base.AudioCodecParameters} codec
   * @instance
   * @memberof Owt.Base.AudioEncodingParameters
   */
  this.codec = codec;
  /**
   * @member {?number} maxBitrate
   * @instance
   * @memberof Owt.Base.AudioEncodingParameters
   * @desc Max bitrate expressed in kbps.
   */

  this.maxBitrate = maxBitrate;
};
/**
 * @class VideoCodec
 * @memberOf Owt.Base
 * @classDesc Video codec enumeration.
 * @hideconstructor
 */


exports.AudioEncodingParameters = AudioEncodingParameters;
var VideoCodec = {
  VP8: 'vp8',
  VP9: 'vp9',
  H264: 'h264',
  H265: 'h265'
};
/**
 * @class VideoCodecParameters
 * @memberOf Owt.Base
 * @classDesc Codec parameters for a video track.
 * @hideconstructor
 */

exports.VideoCodec = VideoCodec;

var VideoCodecParameters = // eslint-disable-next-line require-jsdoc
function VideoCodecParameters(name, profile) {
  _classCallCheck(this, VideoCodecParameters);

  /**
   * @member {string} name
   * @memberof Owt.Base.VideoCodecParameters
   * @instance
   * @desc Name of a codec. Please use a value in Owt.Base.VideoCodec. However, some functions do not support all the values in Owt.Base.AudioCodec.
   */
  this.name = name;
  /**
   * @member {?string} profile
   * @memberof Owt.Base.VideoCodecParameters
   * @instance
   * @desc The profile of a codec. Profile may not apply to all codecs.
   */

  this.profile = profile;
};
/**
 * @class VideoEncodingParameters
 * @memberOf Owt.Base
 * @classDesc Encoding parameters for sending a video track.
 * @hideconstructor
 */


exports.VideoCodecParameters = VideoCodecParameters;

var VideoEncodingParameters = // eslint-disable-next-line require-jsdoc
function VideoEncodingParameters(codec, maxBitrate) {
  _classCallCheck(this, VideoEncodingParameters);

  /**
   * @member {?Owt.Base.VideoCodecParameters} codec
   * @instance
   * @memberof Owt.Base.VideoEncodingParameters
   */
  this.codec = codec;
  /**
   * @member {?number} maxBitrate
   * @instance
   * @memberof Owt.Base.VideoEncodingParameters
   * @desc Max bitrate expressed in kbps.
   */

  this.maxBitrate = maxBitrate;
};

exports.VideoEncodingParameters = VideoEncodingParameters;

},{}],3:[function(require,module,exports){
// MIT License
//
// Copyright (c) 2012 Universidad Politécnica de Madrid
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file is borrowed from lynckia/licode with some modifications.
'use strict';
/**
 * @class EventDispatcher
 * @classDesc A shim for EventTarget. Might be changed to EventTarget later.
 * @memberof Owt.Base
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MuteEvent = exports.ErrorEvent = exports.MessageEvent = exports.OwtEvent = exports.EventDispatcher = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventDispatcher = function EventDispatcher() {
  // Private vars
  var spec = {};
  spec.dispatcher = {};
  spec.dispatcher.eventListeners = {};
  /**
   * @function addEventListener
   * @desc This function registers a callback function as a handler for the corresponding event. It's shortened form is on(eventType, listener). See the event description in the following table.
   * @instance
   * @memberof Owt.Base.EventDispatcher
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   */

  this.addEventListener = function (eventType, listener) {
    if (spec.dispatcher.eventListeners[eventType] === undefined) {
      spec.dispatcher.eventListeners[eventType] = [];
    }

    spec.dispatcher.eventListeners[eventType].push(listener);
  };
  /**
   * @function removeEventListener
   * @desc This function removes a registered event listener.
   * @instance
   * @memberof Owt.Base.EventDispatcher
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   */


  this.removeEventListener = function (eventType, listener) {
    if (!spec.dispatcher.eventListeners[eventType]) {
      return;
    }

    var index = spec.dispatcher.eventListeners[eventType].indexOf(listener);

    if (index !== -1) {
      spec.dispatcher.eventListeners[eventType].splice(index, 1);
    }
  };
  /**
   * @function clearEventListener
   * @desc This function removes all event listeners for one type.
   * @instance
   * @memberof Owt.Base.EventDispatcher
   * @param {string} eventType Event string.
   */


  this.clearEventListener = function (eventType) {
    spec.dispatcher.eventListeners[eventType] = [];
  }; // It dispatch a new event to the event listeners, based on the type
  // of event. All events are intended to be LicodeEvents.


  this.dispatchEvent = function (event) {
    if (!spec.dispatcher.eventListeners[event.type]) {
      return;
    }

    spec.dispatcher.eventListeners[event.type].map(function (listener) {
      listener(event);
    });
  };
};
/**
 * @class OwtEvent
 * @classDesc Class OwtEvent represents a generic Event in the library.
 * @memberof Owt.Base
 * @hideconstructor
 */


exports.EventDispatcher = EventDispatcher;

var OwtEvent = // eslint-disable-next-line require-jsdoc
function OwtEvent(type) {
  _classCallCheck(this, OwtEvent);

  this.type = type;
};
/**
 * @class MessageEvent
 * @classDesc Class MessageEvent represents a message Event in the library.
 * @memberof Owt.Base
 * @hideconstructor
 */


exports.OwtEvent = OwtEvent;

var MessageEvent =
/*#__PURE__*/
function (_OwtEvent) {
  _inherits(MessageEvent, _OwtEvent);

  // eslint-disable-next-line require-jsdoc
  function MessageEvent(type, init) {
    var _this;

    _classCallCheck(this, MessageEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MessageEvent).call(this, type));
    /**
     * @member {string} origin
     * @instance
     * @memberof Owt.Base.MessageEvent
     * @desc ID of the remote endpoint who published this stream.
     */

    _this.origin = init.origin;
    /**
     * @member {string} message
     * @instance
     * @memberof Owt.Base.MessageEvent
     */

    _this.message = init.message;
    /**
     * @member {string} to
     * @instance
     * @memberof Owt.Base.MessageEvent
     * @desc Values could be "all", "me" in conference mode, or undefined in P2P mode..
     */

    _this.to = init.to;
    return _this;
  }

  return MessageEvent;
}(OwtEvent);
/**
 * @class ErrorEvent
 * @classDesc Class ErrorEvent represents an error Event in the library.
 * @memberof Owt.Base
 * @hideconstructor
 */


exports.MessageEvent = MessageEvent;

var ErrorEvent =
/*#__PURE__*/
function (_OwtEvent2) {
  _inherits(ErrorEvent, _OwtEvent2);

  // eslint-disable-next-line require-jsdoc
  function ErrorEvent(type, init) {
    var _this2;

    _classCallCheck(this, ErrorEvent);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ErrorEvent).call(this, type));
    /**
     * @member {Error} error
     * @instance
     * @memberof Owt.Base.ErrorEvent
     */

    _this2.error = init.error;
    return _this2;
  }

  return ErrorEvent;
}(OwtEvent);
/**
 * @class MuteEvent
 * @classDesc Class MuteEvent represents a mute or unmute event.
 * @memberof Owt.Base
 * @hideconstructor
 */


exports.ErrorEvent = ErrorEvent;

var MuteEvent =
/*#__PURE__*/
function (_OwtEvent3) {
  _inherits(MuteEvent, _OwtEvent3);

  // eslint-disable-next-line require-jsdoc
  function MuteEvent(type, init) {
    var _this3;

    _classCallCheck(this, MuteEvent);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(MuteEvent).call(this, type));
    /**
     * @member {Owt.Base.TrackKind} kind
     * @instance
     * @memberof Owt.Base.MuteEvent
     */

    _this3.kind = init.kind;
    return _this3;
  }

  return MuteEvent;
}(OwtEvent);

exports.MuteEvent = MuteEvent;

},{}],4:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mediastreamFactory = require("./mediastream-factory.js");

Object.keys(_mediastreamFactory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mediastreamFactory[key];
    }
  });
});

var _stream = require("./stream.js");

Object.keys(_stream).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _stream[key];
    }
  });
});

var _mediaformat = require("./mediaformat.js");

Object.keys(_mediaformat).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mediaformat[key];
    }
  });
});

},{"./mediaformat.js":6,"./mediastream-factory.js":7,"./stream.js":10}],5:[function(require,module,exports){
// MIT License
//
// Copyright (c) 2012 Universidad Politécnica de Madrid
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file is borrowed from lynckia/licode with some modifications.

/* global console,window */
'use strict';
/*
 * API to write logs based on traditional logging mechanisms: debug, trace,
 * info, warning, error
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Logger = function () {
  var DEBUG = 0;
  var TRACE = 1;
  var INFO = 2;
  var WARNING = 3;
  var ERROR = 4;
  var NONE = 5;

  var noOp = function noOp() {}; // |that| is the object to be returned.


  var that = {
    DEBUG: DEBUG,
    TRACE: TRACE,
    INFO: INFO,
    WARNING: WARNING,
    ERROR: ERROR,
    NONE: NONE
  };
  that.log = window.console.log.bind(window.console);

  var bindType = function bindType(type) {
    if (typeof window.console[type] === 'function') {
      return window.console[type].bind(window.console);
    } else {
      return window.console.log.bind(window.console);
    }
  };

  var setLogLevel = function setLogLevel(level) {
    if (level <= DEBUG) {
      that.debug = bindType('log');
    } else {
      that.debug = noOp;
    }

    if (level <= TRACE) {
      that.trace = bindType('trace');
    } else {
      that.trace = noOp;
    }

    if (level <= INFO) {
      that.info = bindType('info');
    } else {
      that.info = noOp;
    }

    if (level <= WARNING) {
      that.warning = bindType('warn');
    } else {
      that.warning = noOp;
    }

    if (level <= ERROR) {
      that.error = bindType('error');
    } else {
      that.error = noOp;
    }
  };

  setLogLevel(DEBUG); // Default level is debug.

  that.setLogLevel = setLogLevel;
  return that;
}();

var _default = Logger;
exports.default = _default;

},{}],6:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';
/**
 * @class AudioSourceInfo
 * @classDesc Source info about an audio track. Values: 'mic', 'screen-cast', 'file', 'mixed'.
 * @memberOf Owt.Base
 * @readonly
 * @enum {string}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resolution = exports.TrackKind = exports.VideoSourceInfo = exports.AudioSourceInfo = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioSourceInfo = {
  MIC: 'mic',
  SCREENCAST: 'screen-cast',
  FILE: 'file',
  MIXED: 'mixed'
};
/**
 * @class VideoSourceInfo
 * @classDesc Source info about a video track. Values: 'camera', 'screen-cast', 'file', 'mixed'.
 * @memberOf Owt.Base
 * @readonly
 * @enum {string}
 */

exports.AudioSourceInfo = AudioSourceInfo;
var VideoSourceInfo = {
  CAMERA: 'camera',
  SCREENCAST: 'screen-cast',
  FILE: 'file',
  MIXED: 'mixed'
};
/**
 * @class TrackKind
 * @classDesc Kind of a track. Values: 'audio' for audio track, 'video' for video track, 'av' for both audio and video tracks.
 * @memberOf Owt.Base
 * @readonly
 * @enum {string}
 */

exports.VideoSourceInfo = VideoSourceInfo;
var TrackKind = {
  /**
   * Audio tracks.
   * @type string
   */
  AUDIO: 'audio',

  /**
   * Video tracks.
   * @type string
   */
  VIDEO: 'video',

  /**
   * Both audio and video tracks.
   * @type string
   */
  AUDIO_AND_VIDEO: 'av'
};
/**
 * @class Resolution
 * @memberOf Owt.Base
 * @classDesc The Resolution defines the size of a rectangle.
 * @constructor
 * @param {number} width
 * @param {number} height
 */

exports.TrackKind = TrackKind;

var Resolution = // eslint-disable-next-line require-jsdoc
function Resolution(width, height) {
  _classCallCheck(this, Resolution);

  /**
   * @member {number} width
   * @instance
   * @memberof Owt.Base.Resolution
   */
  this.width = width;
  /**
   * @member {number} height
   * @instance
   * @memberof Owt.Base.Resolution
   */

  this.height = height;
};

exports.Resolution = Resolution;

},{}],7:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

/* global console, window, Promise, chrome, navigator */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaStreamFactory = exports.StreamConstraints = exports.VideoTrackConstraints = exports.AudioTrackConstraints = void 0;

var utils = _interopRequireWildcard(require("./utils.js"));

var _logger = _interopRequireDefault(require("./logger.js"));

var MediaFormatModule = _interopRequireWildcard(require("./mediaformat.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioTrackConstraints
 * @classDesc Constraints for creating an audio MediaStreamTrack.
 * @memberof Owt.Base
 * @constructor
 * @param {Owt.Base.AudioSourceInfo} source Source info of this audio track.
 */
var AudioTrackConstraints = // eslint-disable-next-line require-jsdoc
function AudioTrackConstraints(source) {
  _classCallCheck(this, AudioTrackConstraints);

  if (!Object.values(MediaFormatModule.AudioSourceInfo).some(function (v) {
    return v === source;
  })) {
    throw new TypeError('Invalid source.');
  }
  /**
   * @member {string} source
   * @memberof Owt.Base.AudioTrackConstraints
   * @desc Values could be "mic", "screen-cast", "file" or "mixed".
   * @instance
   */


  this.source = source;
  /**
   * @member {string} deviceId
   * @memberof Owt.Base.AudioTrackConstraints
   * @desc Do not provide deviceId if source is not "mic".
   * @instance
   * @see https://w3c.github.io/mediacapture-main/#def-constraint-deviceId
   */

  this.deviceId = undefined;
};
/**
 * @class VideoTrackConstraints
 * @classDesc Constraints for creating a video MediaStreamTrack.
 * @memberof Owt.Base
 * @constructor
 * @param {Owt.Base.VideoSourceInfo} source Source info of this video track.
 */


exports.AudioTrackConstraints = AudioTrackConstraints;

var VideoTrackConstraints = // eslint-disable-next-line require-jsdoc
function VideoTrackConstraints(source) {
  _classCallCheck(this, VideoTrackConstraints);

  if (!Object.values(MediaFormatModule.VideoSourceInfo).some(function (v) {
    return v === source;
  })) {
    throw new TypeError('Invalid source.');
  }
  /**
   * @member {string} source
   * @memberof Owt.Base.VideoTrackConstraints
   * @desc Values could be "camera", "screen-cast", "file" or "mixed".
   * @instance
   */


  this.source = source;
  /**
   * @member {string} deviceId
   * @memberof Owt.Base.VideoTrackConstraints
   * @desc Do not provide deviceId if source is not "camera".
   * @instance
   * @see https://w3c.github.io/mediacapture-main/#def-constraint-deviceId
   */

  this.deviceId = undefined;
  /**
   * @member {Owt.Base.Resolution} resolution
   * @memberof Owt.Base.VideoTrackConstraints
   * @instance
   */

  this.resolution = undefined;
  /**
   * @member {number} frameRate
   * @memberof Owt.Base.VideoTrackConstraints
   * @instance
   */

  this.frameRate = undefined;
};
/**
 * @class StreamConstraints
 * @classDesc Constraints for creating a MediaStream from screen mic and camera.
 * @memberof Owt.Base
 * @constructor
 * @param {?Owt.Base.AudioTrackConstraints} audioConstraints
 * @param {?Owt.Base.VideoTrackConstraints} videoConstraints
 */


exports.VideoTrackConstraints = VideoTrackConstraints;

var StreamConstraints = // eslint-disable-next-line require-jsdoc
function StreamConstraints() {
  var audioConstraints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var videoConstraints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  _classCallCheck(this, StreamConstraints);

  /**
   * @member {Owt.Base.MediaStreamTrackDeviceConstraintsForAudio} audio
   * @memberof Owt.Base.MediaStreamDeviceConstraints
   * @instance
   */
  this.audio = audioConstraints;
  /**
   * @member {Owt.Base.MediaStreamTrackDeviceConstraintsForVideo} Video
   * @memberof Owt.Base.MediaStreamDeviceConstraints
   * @instance
   */

  this.video = videoConstraints;
}; // eslint-disable-next-line require-jsdoc


exports.StreamConstraints = StreamConstraints;

function isVideoConstrainsForScreenCast(constraints) {
  return _typeof(constraints.video) === 'object' && constraints.video.source === MediaFormatModule.VideoSourceInfo.SCREENCAST;
}
/**
 * @class MediaStreamFactory
 * @classDesc A factory to create MediaStream. You can also create MediaStream by yourself.
 * @memberof Owt.Base
 */


var MediaStreamFactory =
/*#__PURE__*/
function () {
  function MediaStreamFactory() {
    _classCallCheck(this, MediaStreamFactory);
  }

  _createClass(MediaStreamFactory, null, [{
    key: "createMediaStream",

    /**
     * @function createMediaStream
     * @static
     * @desc Create a MediaStream with given constraints. If you want to create a MediaStream for screen cast, please make sure both audio and video's source are "screen-cast".
     * @memberof Owt.Base.MediaStreamFactory
     * @returns {Promise<MediaStream, Error>} Return a promise that is resolved when stream is successfully created, or rejected if one of the following error happened:
     * - One or more parameters cannot be satisfied.
     * - Specified device is busy.
     * - Cannot obtain necessary permission or operation is canceled by user.
     * - Video source is screen cast, while audio source is not.
     * - Audio source is screen cast, while video source is disabled.
     * @param {Owt.Base.StreamConstraints} constraints
     */
    value: function createMediaStream(constraints) {
      if (_typeof(constraints) !== 'object' || !constraints.audio && !constraints.video) {
        return Promise.reject(new TypeError('Invalid constrains'));
      }

      if (!isVideoConstrainsForScreenCast(constraints) && _typeof(constraints.audio) === 'object' && constraints.audio.source === MediaFormatModule.AudioSourceInfo.SCREENCAST) {
        return Promise.reject(new TypeError('Cannot share screen without video.'));
      }

      if (isVideoConstrainsForScreenCast(constraints) && _typeof(constraints.audio) === 'object' && constraints.audio.source !== MediaFormatModule.AudioSourceInfo.SCREENCAST) {
        return Promise.reject(new TypeError('Cannot capture video from screen cast while capture audio from' + ' other source.'));
      } // Check and convert constraints.


      if (!constraints.audio && !constraints.video) {
        return Promise.reject(new TypeError('At least one of audio and video must be requested.'));
      }

      var mediaConstraints = Object.create({});

      if (_typeof(constraints.audio) === 'object' && constraints.audio.source === MediaFormatModule.AudioSourceInfo.MIC) {
        mediaConstraints.audio = Object.create({});

        if (utils.isEdge()) {
          mediaConstraints.audio.deviceId = constraints.audio.deviceId;
        } else {
          mediaConstraints.audio.deviceId = {
            exact: constraints.audio.deviceId
          };
        }
      } else {
        if (constraints.audio.source === MediaFormatModule.AudioSourceInfo.SCREENCAST) {
          mediaConstraints.audio = true;
        } else {
          mediaConstraints.audio = constraints.audio;
        }
      }

      if (_typeof(constraints.video) === 'object') {
        mediaConstraints.video = Object.create({});

        if (typeof constraints.video.frameRate === 'number') {
          mediaConstraints.video.frameRate = constraints.video.frameRate;
        }

        if (constraints.video.resolution && constraints.video.resolution.width && constraints.video.resolution.height) {
          if (constraints.video.source === MediaFormatModule.VideoSourceInfo.SCREENCAST) {
            mediaConstraints.video.width = constraints.video.resolution.width;
            mediaConstraints.video.height = constraints.video.resolution.height;
          } else {
            mediaConstraints.video.width = Object.create({});
            mediaConstraints.video.width.exact = constraints.video.resolution.width;
            mediaConstraints.video.height = Object.create({});
            mediaConstraints.video.height.exact = constraints.video.resolution.height;
          }
        }

        if (typeof constraints.video.deviceId === 'string') {
          mediaConstraints.video.deviceId = {
            exact: constraints.video.deviceId
          };
        }

        if (utils.isFirefox() && constraints.video.source === MediaFormatModule.VideoSourceInfo.SCREENCAST) {
          mediaConstraints.video.mediaSource = 'screen';
        }
      } else {
        mediaConstraints.video = constraints.video;
      }

      if (isVideoConstrainsForScreenCast(constraints)) {
        return navigator.mediaDevices.getDisplayMedia(mediaConstraints);
      } else {
        return navigator.mediaDevices.getUserMedia(mediaConstraints);
      }
    }
  }]);

  return MediaStreamFactory;
}();

exports.MediaStreamFactory = MediaStreamFactory;

},{"./logger.js":5,"./mediaformat.js":6,"./utils.js":11}],8:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PublishOptions = exports.Publication = exports.PublicationSettings = exports.VideoPublicationSettings = exports.AudioPublicationSettings = void 0;

var Utils = _interopRequireWildcard(require("./utils.js"));

var MediaFormat = _interopRequireWildcard(require("./mediaformat.js"));

var _event = require("../base/event.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioPublicationSettings
 * @memberOf Owt.Base
 * @classDesc The audio settings of a publication.
 * @hideconstructor
 */
var AudioPublicationSettings = // eslint-disable-next-line require-jsdoc
function AudioPublicationSettings(codec) {
  _classCallCheck(this, AudioPublicationSettings);

  /**
   * @member {?Owt.Base.AudioCodecParameters} codec
   * @instance
   * @memberof Owt.Base.AudioPublicationSettings
   */
  this.codec = codec;
};
/**
 * @class VideoPublicationSettings
 * @memberOf Owt.Base
 * @classDesc The video settings of a publication.
 * @hideconstructor
 */


exports.AudioPublicationSettings = AudioPublicationSettings;

var VideoPublicationSettings = // eslint-disable-next-line require-jsdoc
function VideoPublicationSettings(codec, resolution, frameRate, bitrate, keyFrameInterval, rid) {
  _classCallCheck(this, VideoPublicationSettings);

  /**
   * @member {?Owt.Base.VideoCodecParameters} codec
   * @instance
   * @memberof Owt.Base.VideoPublicationSettings
   */
  this.codec = codec,
  /**
   * @member {?Owt.Base.Resolution} resolution
   * @instance
   * @memberof Owt.Base.VideoPublicationSettings
   */
  this.resolution = resolution;
  /**
   * @member {?number} frameRates
   * @instance
   * @classDesc Frames per second.
   * @memberof Owt.Base.VideoPublicationSettings
   */

  this.frameRate = frameRate;
  /**
   * @member {?number} bitrate
   * @instance
   * @memberof Owt.Base.VideoPublicationSettings
   */

  this.bitrate = bitrate;
  /**
   * @member {?number} keyFrameIntervals
   * @instance
   * @classDesc The time interval between key frames. Unit: second.
   * @memberof Owt.Base.VideoPublicationSettings
   */

  this.keyFrameInterval = keyFrameInterval;
  /**
   * @member {?number} rid
   * @instance
   * @classDesc Restriction identifier to identify the RTP Streams within an RTP session.
   * @memberof Owt.Base.VideoPublicationSettings
   */

  this.rid = rid;
};
/**
 * @class PublicationSettings
 * @memberOf Owt.Base
 * @classDesc The settings of a publication.
 * @hideconstructor
 */


exports.VideoPublicationSettings = VideoPublicationSettings;

var PublicationSettings = // eslint-disable-next-line require-jsdoc
function PublicationSettings(audio, video) {
  _classCallCheck(this, PublicationSettings);

  /**
   * @member {Owt.Base.AudioPublicationSettings[]} audio
   * @instance
   * @memberof Owt.Base.PublicationSettings
   */
  this.audio = audio;
  /**
   * @member {Owt.Base.VideoPublicationSettings[]} video
   * @instance
   * @memberof Owt.Base.PublicationSettings
   */

  this.video = video;
};
/**
 * @class Publication
 * @extends Owt.Base.EventDispatcher
 * @memberOf Owt.Base
 * @classDesc Publication represents a sender for publishing a stream. It
 * handles the actions on a LocalStream published to a conference.
 *
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when       |
 * | ----------------| ---------------- | ---------------- |
 * | ended           | Event            | Publication is ended. |
 * | error           | ErrorEvent       | An error occurred on the publication. |
 * | mute            | MuteEvent        | Publication is muted. Client stopped sending audio and/or video data to remote endpoint. |
 * | unmute          | MuteEvent        | Publication is unmuted. Client continued sending audio and/or video data to remote endpoint. |
 *
 * `ended` event may not be fired on Safari after calling `Publication.stop()`.
 *
 * @hideconstructor
 */


exports.PublicationSettings = PublicationSettings;

var Publication =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(Publication, _EventDispatcher);

  // eslint-disable-next-line require-jsdoc
  function Publication(id, stop, getStats, mute, unmute) {
    var _this;

    _classCallCheck(this, Publication);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Publication).call(this));
    /**
     * @member {string} id
     * @instance
     * @memberof Owt.Base.Publication
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'id', {
      configurable: false,
      writable: false,
      value: id ? id : Utils.createUuid()
    });
    /**
     * @function stop
     * @instance
     * @desc Stop certain publication. Once a subscription is stopped, it cannot be recovered.
     * @memberof Owt.Base.Publication
     * @returns {undefined}
     */

    _this.stop = stop;
    /**
     * @function getStats
     * @instance
     * @desc Get stats of underlying PeerConnection.
     * @memberof Owt.Base.Publication
     * @returns {Promise<RTCStatsReport, Error>}
     */

    _this.getStats = getStats;
    /**
     * @function mute
     * @instance
     * @desc Stop sending data to remote endpoint.
     * @memberof Owt.Base.Publication
     * @param {Owt.Base.TrackKind } kind Kind of tracks to be muted.
     * @returns {Promise<undefined, Error>}
     */

    _this.mute = mute;
    /**
     * @function unmute
     * @instance
     * @desc Continue sending data to remote endpoint.
     * @memberof Owt.Base.Publication
     * @param {Owt.Base.TrackKind } kind Kind of tracks to be unmuted.
     * @returns {Promise<undefined, Error>}
     */

    _this.unmute = unmute;
    return _this;
  }

  return Publication;
}(_event.EventDispatcher);
/**
 * @class PublishOptions
 * @memberOf Owt.Base
 * @classDesc PublishOptions defines options for publishing a Owt.Base.LocalStream.
 */


exports.Publication = Publication;

var PublishOptions = // eslint-disable-next-line require-jsdoc
function PublishOptions(audio, video) {
  _classCallCheck(this, PublishOptions);

  /**
   * @member {?Array<Owt.Base.AudioEncodingParameters> | ?Array<RTCRtpEncodingParameters>} audio
   * @instance
   * @memberof Owt.Base.PublishOptions
   * @desc Parameters for audio RtpSender. Publishing with RTCRtpEncodingParameters is an experimental feature. It is subject to change.
   */
  this.audio = audio;
  /**
   * @member {?Array<Owt.Base.VideoEncodingParameters> | ?Array<RTCRtpEncodingParameters>} video
   * @instance
   * @memberof Owt.Base.PublishOptions
   * @desc Parameters for video RtpSender. Publishing with RTCRtpEncodingParameters is an experimental feature. It is subject to change.
   */

  this.video = video;
};

exports.PublishOptions = PublishOptions;

},{"../base/event.js":3,"./mediaformat.js":6,"./utils.js":11}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reorderCodecs = reorderCodecs;
exports.addLegacySimulcast = addLegacySimulcast;
exports.setMaxBitrate = setMaxBitrate;

var _logger = _interopRequireDefault(require("./logger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* More information about these options at jshint.com/docs/options */

/* eslint-disable */

/* globals  adapter, trace */

/* exported setCodecParam, iceCandidateType, formatTypePreference,
   maybeSetOpusOptions, maybePreferAudioReceiveCodec,
   maybePreferAudioSendCodec, maybeSetAudioReceiveBitRate,
   maybeSetAudioSendBitRate, maybePreferVideoReceiveCodec,
   maybePreferVideoSendCodec, maybeSetVideoReceiveBitRate,
   maybeSetVideoSendBitRate, maybeSetVideoSendInitialBitRate,
   maybeRemoveVideoFec, mergeConstraints, removeCodecParam*/

/* This file is borrowed from apprtc with some modifications. */

/* Commit hash: c6af0c25e9af527f71b3acdd6bfa1389d778f7bd + PR 530 */
'use strict';

function mergeConstraints(cons1, cons2) {
  if (!cons1 || !cons2) {
    return cons1 || cons2;
  }

  var merged = cons1;

  for (var key in cons2) {
    merged[key] = cons2[key];
  }

  return merged;
}

function iceCandidateType(candidateStr) {
  return candidateStr.split(' ')[7];
} // Turns the local type preference into a human-readable string.
// Note that this mapping is browser-specific.


function formatTypePreference(pref) {
  if (adapter.browserDetails.browser === 'chrome') {
    switch (pref) {
      case 0:
        return 'TURN/TLS';

      case 1:
        return 'TURN/TCP';

      case 2:
        return 'TURN/UDP';

      default:
        break;
    }
  } else if (adapter.browserDetails.browser === 'firefox') {
    switch (pref) {
      case 0:
        return 'TURN/TCP';

      case 5:
        return 'TURN/UDP';

      default:
        break;
    }
  }

  return '';
}

function maybeSetOpusOptions(sdp, params) {
  // Set Opus in Stereo, if stereo is true, unset it, if stereo is false, and
  // do nothing if otherwise.
  if (params.opusStereo === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'stereo', '1');
  } else if (params.opusStereo === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'stereo');
  } // Set Opus FEC, if opusfec is true, unset it, if opusfec is false, and
  // do nothing if otherwise.


  if (params.opusFec === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'useinbandfec', '1');
  } else if (params.opusFec === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'useinbandfec');
  } // Set Opus DTX, if opusdtx is true, unset it, if opusdtx is false, and
  // do nothing if otherwise.


  if (params.opusDtx === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'usedtx', '1');
  } else if (params.opusDtx === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'usedtx');
  } // Set Opus maxplaybackrate, if requested.


  if (params.opusMaxPbr) {
    sdp = setCodecParam(sdp, 'opus/48000', 'maxplaybackrate', params.opusMaxPbr);
  }

  return sdp;
}

function maybeSetAudioSendBitRate(sdp, params) {
  if (!params.audioSendBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer audio send bitrate: ' + params.audioSendBitrate);

  return preferBitRate(sdp, params.audioSendBitrate, 'audio');
}

function maybeSetAudioReceiveBitRate(sdp, params) {
  if (!params.audioRecvBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer audio receive bitrate: ' + params.audioRecvBitrate);

  return preferBitRate(sdp, params.audioRecvBitrate, 'audio');
}

function maybeSetVideoSendBitRate(sdp, params) {
  if (!params.videoSendBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer video send bitrate: ' + params.videoSendBitrate);

  return preferBitRate(sdp, params.videoSendBitrate, 'video');
}

function maybeSetVideoReceiveBitRate(sdp, params) {
  if (!params.videoRecvBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer video receive bitrate: ' + params.videoRecvBitrate);

  return preferBitRate(sdp, params.videoRecvBitrate, 'video');
} // Add a b=AS:bitrate line to the m=mediaType section.


function preferBitRate(sdp, bitrate, mediaType) {
  var sdpLines = sdp.split('\r\n'); // Find m line for the given mediaType.

  var mLineIndex = findLine(sdpLines, 'm=', mediaType);

  if (mLineIndex === null) {
    _logger.default.debug('Failed to add bandwidth line to sdp, as no m-line found');

    return sdp;
  } // Find next m-line if any.


  var nextMLineIndex = findLineInRange(sdpLines, mLineIndex + 1, -1, 'm=');

  if (nextMLineIndex === null) {
    nextMLineIndex = sdpLines.length;
  } // Find c-line corresponding to the m-line.


  var cLineIndex = findLineInRange(sdpLines, mLineIndex + 1, nextMLineIndex, 'c=');

  if (cLineIndex === null) {
    _logger.default.debug('Failed to add bandwidth line to sdp, as no c-line found');

    return sdp;
  } // Check if bandwidth line already exists between c-line and next m-line.


  var bLineIndex = findLineInRange(sdpLines, cLineIndex + 1, nextMLineIndex, 'b=AS');

  if (bLineIndex) {
    sdpLines.splice(bLineIndex, 1);
  } // Create the b (bandwidth) sdp line.


  var bwLine = 'b=AS:' + bitrate; // As per RFC 4566, the b line should follow after c-line.

  sdpLines.splice(cLineIndex + 1, 0, bwLine);
  sdp = sdpLines.join('\r\n');
  return sdp;
} // Add an a=fmtp: x-google-min-bitrate=kbps line, if videoSendInitialBitrate
// is specified. We'll also add a x-google-min-bitrate value, since the max
// must be >= the min.


function maybeSetVideoSendInitialBitRate(sdp, params) {
  var initialBitrate = parseInt(params.videoSendInitialBitrate);

  if (!initialBitrate) {
    return sdp;
  } // Validate the initial bitrate value.


  var maxBitrate = parseInt(initialBitrate);
  var bitrate = parseInt(params.videoSendBitrate);

  if (bitrate) {
    if (initialBitrate > bitrate) {
      _logger.default.debug('Clamping initial bitrate to max bitrate of ' + bitrate + ' kbps.');

      initialBitrate = bitrate;
      params.videoSendInitialBitrate = initialBitrate;
    }

    maxBitrate = bitrate;
  }

  var sdpLines = sdp.split('\r\n'); // Search for m line.

  var mLineIndex = findLine(sdpLines, 'm=', 'video');

  if (mLineIndex === null) {
    _logger.default.debug('Failed to find video m-line');

    return sdp;
  } // Figure out the first codec payload type on the m=video SDP line.


  var videoMLine = sdpLines[mLineIndex];
  var pattern = new RegExp('m=video\\s\\d+\\s[A-Z/]+\\s');
  var sendPayloadType = videoMLine.split(pattern)[1].split(' ')[0];
  var fmtpLine = sdpLines[findLine(sdpLines, 'a=rtpmap', sendPayloadType)];
  var codecName = fmtpLine.split('a=rtpmap:' + sendPayloadType)[1].split('/')[0]; // Use codec from params if specified via URL param, otherwise use from SDP.

  var codec = params.videoSendCodec || codecName;
  sdp = setCodecParam(sdp, codec, 'x-google-min-bitrate', params.videoSendInitialBitrate.toString());
  sdp = setCodecParam(sdp, codec, 'x-google-max-bitrate', maxBitrate.toString());
  return sdp;
}

function removePayloadTypeFromMline(mLine, payloadType) {
  mLine = mLine.split(' ');

  for (var i = 0; i < mLine.length; ++i) {
    if (mLine[i] === payloadType.toString()) {
      mLine.splice(i, 1);
    }
  }

  return mLine.join(' ');
}

function removeCodecByName(sdpLines, codec) {
  var index = findLine(sdpLines, 'a=rtpmap', codec);

  if (index === null) {
    return sdpLines;
  }

  var payloadType = getCodecPayloadTypeFromLine(sdpLines[index]);
  sdpLines.splice(index, 1); // Search for the video m= line and remove the codec.

  var mLineIndex = findLine(sdpLines, 'm=', 'video');

  if (mLineIndex === null) {
    return sdpLines;
  }

  sdpLines[mLineIndex] = removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
  return sdpLines;
}

function removeCodecByPayloadType(sdpLines, payloadType) {
  var index = findLine(sdpLines, 'a=rtpmap', payloadType.toString());

  if (index === null) {
    return sdpLines;
  }

  sdpLines.splice(index, 1); // Search for the video m= line and remove the codec.

  var mLineIndex = findLine(sdpLines, 'm=', 'video');

  if (mLineIndex === null) {
    return sdpLines;
  }

  sdpLines[mLineIndex] = removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
  return sdpLines;
}

function maybeRemoveVideoFec(sdp, params) {
  if (params.videoFec !== 'false') {
    return sdp;
  }

  var sdpLines = sdp.split('\r\n');
  var index = findLine(sdpLines, 'a=rtpmap', 'red');

  if (index === null) {
    return sdp;
  }

  var redPayloadType = getCodecPayloadTypeFromLine(sdpLines[index]);
  sdpLines = removeCodecByPayloadType(sdpLines, redPayloadType);
  sdpLines = removeCodecByName(sdpLines, 'ulpfec'); // Remove fmtp lines associated with red codec.

  index = findLine(sdpLines, 'a=fmtp', redPayloadType.toString());

  if (index === null) {
    return sdp;
  }

  var fmtpLine = parseFmtpLine(sdpLines[index]);
  var rtxPayloadType = fmtpLine.pt;

  if (rtxPayloadType === null) {
    return sdp;
  }

  sdpLines.splice(index, 1);
  sdpLines = removeCodecByPayloadType(sdpLines, rtxPayloadType);
  return sdpLines.join('\r\n');
} // Promotes |audioSendCodec| to be the first in the m=audio line, if set.


function maybePreferAudioSendCodec(sdp, params) {
  return maybePreferCodec(sdp, 'audio', 'send', params.audioSendCodec);
} // Promotes |audioRecvCodec| to be the first in the m=audio line, if set.


function maybePreferAudioReceiveCodec(sdp, params) {
  return maybePreferCodec(sdp, 'audio', 'receive', params.audioRecvCodec);
} // Promotes |videoSendCodec| to be the first in the m=audio line, if set.


function maybePreferVideoSendCodec(sdp, params) {
  return maybePreferCodec(sdp, 'video', 'send', params.videoSendCodec);
} // Promotes |videoRecvCodec| to be the first in the m=audio line, if set.


function maybePreferVideoReceiveCodec(sdp, params) {
  return maybePreferCodec(sdp, 'video', 'receive', params.videoRecvCodec);
} // Sets |codec| as the default |type| codec if it's present.
// The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.


function maybePreferCodec(sdp, type, dir, codec) {
  var str = type + ' ' + dir + ' codec';

  if (!codec) {
    _logger.default.debug('No preference on ' + str + '.');

    return sdp;
  }

  _logger.default.debug('Prefer ' + str + ': ' + codec);

  var sdpLines = sdp.split('\r\n'); // Search for m line.

  var mLineIndex = findLine(sdpLines, 'm=', type);

  if (mLineIndex === null) {
    return sdp;
  } // If the codec is available, set it as the default in m line.


  var payload = null;

  for (var i = 0; i < sdpLines.length; i++) {
    var index = findLineInRange(sdpLines, i, -1, 'a=rtpmap', codec);

    if (index !== null) {
      payload = getCodecPayloadTypeFromLine(sdpLines[index]);

      if (payload) {
        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], payload);
      }
    }
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
} // Set fmtp param to specific codec in SDP. If param does not exists, add it.


function setCodecParam(sdp, codec, param, value) {
  var sdpLines = sdp.split('\r\n'); // SDPs sent from MCU use \n as line break.

  if (sdpLines.length <= 1) {
    sdpLines = sdp.split('\n');
  }

  var fmtpLineIndex = findFmtpLine(sdpLines, codec);
  var fmtpObj = {};

  if (fmtpLineIndex === null) {
    var index = findLine(sdpLines, 'a=rtpmap', codec);

    if (index === null) {
      return sdp;
    }

    var payload = getCodecPayloadTypeFromLine(sdpLines[index]);
    fmtpObj.pt = payload.toString();
    fmtpObj.params = {};
    fmtpObj.params[param] = value;
    sdpLines.splice(index + 1, 0, writeFmtpLine(fmtpObj));
  } else {
    fmtpObj = parseFmtpLine(sdpLines[fmtpLineIndex]);
    fmtpObj.params[param] = value;
    sdpLines[fmtpLineIndex] = writeFmtpLine(fmtpObj);
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
} // Remove fmtp param if it exists.


function removeCodecParam(sdp, codec, param) {
  var sdpLines = sdp.split('\r\n');
  var fmtpLineIndex = findFmtpLine(sdpLines, codec);

  if (fmtpLineIndex === null) {
    return sdp;
  }

  var map = parseFmtpLine(sdpLines[fmtpLineIndex]);
  delete map.params[param];
  var newLine = writeFmtpLine(map);

  if (newLine === null) {
    sdpLines.splice(fmtpLineIndex, 1);
  } else {
    sdpLines[fmtpLineIndex] = newLine;
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
} // Split an fmtp line into an object including 'pt' and 'params'.


function parseFmtpLine(fmtpLine) {
  var fmtpObj = {};
  var spacePos = fmtpLine.indexOf(' ');
  var keyValues = fmtpLine.substring(spacePos + 1).split(';');
  var pattern = new RegExp('a=fmtp:(\\d+)');
  var result = fmtpLine.match(pattern);

  if (result && result.length === 2) {
    fmtpObj.pt = result[1];
  } else {
    return null;
  }

  var params = {};

  for (var i = 0; i < keyValues.length; ++i) {
    var pair = keyValues[i].split('=');

    if (pair.length === 2) {
      params[pair[0]] = pair[1];
    }
  }

  fmtpObj.params = params;
  return fmtpObj;
} // Generate an fmtp line from an object including 'pt' and 'params'.


function writeFmtpLine(fmtpObj) {
  if (!fmtpObj.hasOwnProperty('pt') || !fmtpObj.hasOwnProperty('params')) {
    return null;
  }

  var pt = fmtpObj.pt;
  var params = fmtpObj.params;
  var keyValues = [];
  var i = 0;

  for (var key in params) {
    keyValues[i] = key + '=' + params[key];
    ++i;
  }

  if (i === 0) {
    return null;
  }

  return 'a=fmtp:' + pt.toString() + ' ' + keyValues.join(';');
} // Find fmtp attribute for |codec| in |sdpLines|.


function findFmtpLine(sdpLines, codec) {
  // Find payload of codec.
  var payload = getCodecPayloadType(sdpLines, codec); // Find the payload in fmtp line.

  return payload ? findLine(sdpLines, 'a=fmtp:' + payload.toString()) : null;
} // Find the line in sdpLines that starts with |prefix|, and, if specified,
// contains |substr| (case-insensitive search).


function findLine(sdpLines, prefix, substr) {
  return findLineInRange(sdpLines, 0, -1, prefix, substr);
} // Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
// and, if specified, contains |substr| (case-insensitive search).


function findLineInRange(sdpLines, startLine, endLine, prefix, substr) {
  var realEndLine = endLine !== -1 ? endLine : sdpLines.length;

  for (var i = startLine; i < realEndLine; ++i) {
    if (sdpLines[i].indexOf(prefix) === 0) {
      if (!substr || sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
        return i;
      }
    }
  }

  return null;
} // Gets the codec payload type from sdp lines.


function getCodecPayloadType(sdpLines, codec) {
  var index = findLine(sdpLines, 'a=rtpmap', codec);
  return index ? getCodecPayloadTypeFromLine(sdpLines[index]) : null;
} // Gets the codec payload type from an a=rtpmap:X line.


function getCodecPayloadTypeFromLine(sdpLine) {
  var pattern = new RegExp('a=rtpmap:(\\d+) [a-zA-Z0-9-]+\\/\\d+');
  var result = sdpLine.match(pattern);
  return result && result.length === 2 ? result[1] : null;
} // Returns a new m= line with the specified codec as the first one.


function setDefaultCodec(mLine, payload) {
  var elements = mLine.split(' '); // Just copy the first three parameters; codec order starts on fourth.

  var newLine = elements.slice(0, 3); // Put target payload first and copy in the rest.

  newLine.push(payload);

  for (var i = 3; i < elements.length; i++) {
    if (elements[i] !== payload) {
      newLine.push(elements[i]);
    }
  }

  return newLine.join(' ');
}
/* Below are newly added functions */
// Following codecs will not be removed from SDP event they are not in the
// user-specified codec list.


var audioCodecWhiteList = ['CN', 'telephone-event'];
var videoCodecWhiteList = ['red', 'ulpfec']; // Returns a new m= line with the specified codec order.

function setCodecOrder(mLine, payloads) {
  var elements = mLine.split(' '); // Just copy the first three parameters; codec order starts on fourth.

  var newLine = elements.slice(0, 3); // Concat payload types.

  newLine = newLine.concat(payloads);
  return newLine.join(' ');
} // Append RTX payloads for existing payloads.


function appendRtxPayloads(sdpLines, payloads) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = payloads[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var payload = _step.value;
      var index = findLine(sdpLines, 'a=fmtp', 'apt=' + payload);

      if (index !== null) {
        var fmtpLine = parseFmtpLine(sdpLines[index]);
        payloads.push(fmtpLine.pt);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return payloads;
} // Remove a codec with all its associated a lines.


function removeCodecFramALine(sdpLines, payload) {
  var pattern = new RegExp('a=(rtpmap|rtcp-fb|fmtp):' + payload + '\\s');

  for (var i = sdpLines.length - 1; i > 0; i--) {
    if (sdpLines[i].match(pattern)) {
      sdpLines.splice(i, 1);
    }
  }

  return sdpLines;
} // Reorder codecs in m-line according the order of |codecs|. Remove codecs from
// m-line if it is not present in |codecs|
// The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.


function reorderCodecs(sdp, type, codecs) {
  if (!codecs || codecs.length === 0) {
    return sdp;
  }

  codecs = type === 'audio' ? codecs.concat(audioCodecWhiteList) : codecs.concat(videoCodecWhiteList);
  var sdpLines = sdp.split('\r\n'); // Search for m line.

  var mLineIndex = findLine(sdpLines, 'm=', type);

  if (mLineIndex === null) {
    return sdp;
  }

  var originPayloads = sdpLines[mLineIndex].split(' ');
  originPayloads.splice(0, 3); // If the codec is available, set it as the default in m line.

  var payloads = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = codecs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var codec = _step2.value;

      for (var i = 0; i < sdpLines.length; i++) {
        var index = findLineInRange(sdpLines, i, -1, 'a=rtpmap', codec);

        if (index !== null) {
          var payload = getCodecPayloadTypeFromLine(sdpLines[index]);

          if (payload) {
            payloads.push(payload);
            i = index;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  payloads = appendRtxPayloads(sdpLines, payloads);
  sdpLines[mLineIndex] = setCodecOrder(sdpLines[mLineIndex], payloads); // Remove a lines.

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = originPayloads[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _payload = _step3.value;

      if (payloads.indexOf(_payload) === -1) {
        sdpLines = removeCodecFramALine(sdpLines, _payload);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
} // Add legacy simulcast.


function addLegacySimulcast(sdp, type, numStreams) {
  var _sdpLines, _sdpLines2;

  if (!numStreams || !(numStreams > 1)) {
    return sdp;
  }

  var sdpLines = sdp.split('\r\n'); // Search for m line.

  var mLineStart = findLine(sdpLines, 'm=', type);

  if (mLineStart === null) {
    return sdp;
  }

  var mLineEnd = findLineInRange(sdpLines, mLineStart + 1, -1, 'm=');

  if (mLineEnd === null) {
    mLineEnd = sdpLines.length;
  }

  var ssrcGetter = function ssrcGetter(line) {
    var parts = line.split(' ');
    var ssrc = parts[0].split(':')[1];
    return ssrc;
  }; // Process ssrc lines from mLineIndex.


  var removes = new Set();
  var ssrcs = new Set();
  var gssrcs = new Set();
  var simLines = [];
  var simGroupLines = [];
  var i = mLineStart + 1;

  while (i < mLineEnd) {
    var line = sdpLines[i];

    if (line === '') {
      break;
    }

    if (line.indexOf('a=ssrc:') > -1) {
      var ssrc = ssrcGetter(sdpLines[i]);
      ssrcs.add(ssrc);

      if (line.indexOf('cname') > -1 || line.indexOf('msid') > -1) {
        for (var j = 1; j < numStreams; j++) {
          var nssrc = parseInt(ssrc) + j + '';
          simLines.push(line.replace(ssrc, nssrc));
        }
      } else {
        removes.add(line);
      }
    }

    if (line.indexOf('a=ssrc-group:FID') > -1) {
      var parts = line.split(' ');
      gssrcs.add(parts[2]);

      for (var _j = 1; _j < numStreams; _j++) {
        var nssrc1 = parseInt(parts[1]) + _j + '';
        var nssrc2 = parseInt(parts[2]) + _j + '';
        simGroupLines.push(line.replace(parts[1], nssrc1).replace(parts[2], nssrc2));
      }
    }

    i++;
  }

  var insertPos = i;
  ssrcs.forEach(function (ssrc) {
    if (!gssrcs.has(ssrc)) {
      var groupLine = 'a=ssrc-group:SIM';
      groupLine = groupLine + ' ' + ssrc;

      for (var _j2 = 1; _j2 < numStreams; _j2++) {
        groupLine = groupLine + ' ' + (parseInt(ssrc) + _j2);
      }

      simGroupLines.push(groupLine);
    }
  });
  simLines.sort(); // Insert simulcast ssrc lines.

  (_sdpLines = sdpLines).splice.apply(_sdpLines, [insertPos, 0].concat(simGroupLines));

  (_sdpLines2 = sdpLines).splice.apply(_sdpLines2, [insertPos, 0].concat(simLines));

  sdpLines = sdpLines.filter(function (line) {
    return !removes.has(line);
  });
  sdp = sdpLines.join('\r\n');
  return sdp;
}

function setMaxBitrate(sdp, encodingParametersList) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = encodingParametersList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var encodingParameters = _step4.value;

      if (encodingParameters.maxBitrate) {
        sdp = setCodecParam(sdp, encodingParameters.codec.name, 'x-google-max-bitrate', encodingParameters.maxBitrate.toString());
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return sdp;
}

},{"./logger.js":5}],10:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreamEvent = exports.RemoteStream = exports.LocalStream = exports.Stream = exports.StreamSourceInfo = void 0;

var _logger = _interopRequireDefault(require("./logger.js"));

var _event = require("./event.js");

var Utils = _interopRequireWildcard(require("./utils.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-next-line require-jsdoc
function isAllowedValue(obj, allowedValues) {
  return allowedValues.some(function (ele) {
    return ele === obj;
  });
}
/**
 * @class StreamSourceInfo
 * @memberOf Owt.Base
 * @classDesc Information of a stream's source.
 * @constructor
 * @description Audio source info or video source info could be undefined if a stream does not have audio/video track.
 * @param {?string} audioSourceInfo Audio source info. Accepted values are: "mic", "screen-cast", "file", "mixed" or undefined.
 * @param {?string} videoSourceInfo Video source info. Accepted values are: "camera", "screen-cast", "file", "mixed" or undefined.
 */


var StreamSourceInfo = // eslint-disable-next-line require-jsdoc
function StreamSourceInfo(audioSourceInfo, videoSourceInfo) {
  _classCallCheck(this, StreamSourceInfo);

  if (!isAllowedValue(audioSourceInfo, [undefined, 'mic', 'screen-cast', 'file', 'mixed'])) {
    throw new TypeError('Incorrect value for audioSourceInfo');
  }

  if (!isAllowedValue(videoSourceInfo, [undefined, 'camera', 'screen-cast', 'file', 'encoded-file', 'raw-file', 'mixed'])) {
    throw new TypeError('Incorrect value for videoSourceInfo');
  }

  this.audio = audioSourceInfo;
  this.video = videoSourceInfo;
};
/**
 * @class Stream
 * @memberOf Owt.Base
 * @classDesc Base class of streams.
 * @extends Owt.Base.EventDispatcher
 * @hideconstructor
 */


exports.StreamSourceInfo = StreamSourceInfo;

var Stream =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(Stream, _EventDispatcher);

  // eslint-disable-next-line require-jsdoc
  function Stream(stream, sourceInfo, attributes) {
    var _this;

    _classCallCheck(this, Stream);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Stream).call(this));

    if (stream && !(stream instanceof MediaStream) || _typeof(sourceInfo) !== 'object') {
      throw new TypeError('Invalid stream or sourceInfo.');
    }

    if (stream && (stream.getAudioTracks().length > 0 && !sourceInfo.audio || stream.getVideoTracks().length > 0 && !sourceInfo.video)) {
      throw new TypeError('Missing audio source info or video source info.');
    }
    /**
     * @member {?MediaStream} mediaStream
     * @instance
     * @memberof Owt.Base.Stream
     * @see {@link https://www.w3.org/TR/mediacapture-streams/#mediastream|MediaStream API of Media Capture and Streams}.
     */


    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'mediaStream', {
      configurable: false,
      writable: true,
      value: stream
    });
    /**
     * @member {Owt.Base.StreamSourceInfo} source
     * @instance
     * @memberof Owt.Base.Stream
     * @desc Source info of a stream.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'source', {
      configurable: false,
      writable: false,
      value: sourceInfo
    });
    /**
     * @member {object} attributes
     * @instance
     * @memberof Owt.Base.Stream
     * @desc Custom attributes of a stream.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'attributes', {
      configurable: true,
      writable: false,
      value: attributes
    });
    return _this;
  }

  return Stream;
}(_event.EventDispatcher);
/**
 * @class LocalStream
 * @classDesc Stream captured from current endpoint.
 * @memberOf Owt.Base
 * @extends Owt.Base.Stream
 * @constructor
 * @param {MediaStream} stream Underlying MediaStream.
 * @param {Owt.Base.StreamSourceInfo} sourceInfo Information about stream's source.
 * @param {object} attributes Custom attributes of the stream.
 */


exports.Stream = Stream;

var LocalStream =
/*#__PURE__*/
function (_Stream) {
  _inherits(LocalStream, _Stream);

  // eslint-disable-next-line require-jsdoc
  function LocalStream(stream, sourceInfo, attributes) {
    var _this2;

    _classCallCheck(this, LocalStream);

    if (!(stream instanceof MediaStream)) {
      throw new TypeError('Invalid stream.');
    }

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(LocalStream).call(this, stream, sourceInfo, attributes));
    /**
     * @member {string} id
     * @instance
     * @memberof Owt.Base.LocalStream
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), 'id', {
      configurable: false,
      writable: false,
      value: Utils.createUuid()
    });
    return _this2;
  }

  return LocalStream;
}(Stream);
/**
 * @class RemoteStream
 * @classDesc Stream sent from a remote endpoint.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when         |
 * | ----------------| ---------------- | ------------------ |
 * | ended           | Event            | Stream is ended.   |
 * | updated         | Event            | Stream is updated. |
 *
 * @memberOf Owt.Base
 * @extends Owt.Base.Stream
 * @hideconstructor
 */


exports.LocalStream = LocalStream;

var RemoteStream =
/*#__PURE__*/
function (_Stream2) {
  _inherits(RemoteStream, _Stream2);

  // eslint-disable-next-line require-jsdoc
  function RemoteStream(id, origin, stream, sourceInfo, attributes) {
    var _this3;

    _classCallCheck(this, RemoteStream);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(RemoteStream).call(this, stream, sourceInfo, attributes));
    /**
     * @member {string} id
     * @instance
     * @memberof Owt.Base.RemoteStream
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), 'id', {
      configurable: false,
      writable: false,
      value: id ? id : Utils.createUuid()
    });
    /**
     * @member {string} origin
     * @instance
     * @memberof Owt.Base.RemoteStream
     * @desc ID of the remote endpoint who published this stream.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), 'origin', {
      configurable: false,
      writable: false,
      value: origin
    });
    /**
     * @member {Owt.Base.PublicationSettings} settings
     * @instance
     * @memberof Owt.Base.RemoteStream
     * @desc Original settings for publishing this stream. This property is only valid in conference mode.
     */

    _this3.settings = undefined;
    /**
     * @member {Owt.Conference.SubscriptionCapabilities} extraCapabilities
     * @instance
     * @memberof Owt.Base.RemoteStream
     * @desc Extra capabilities remote endpoint provides for subscription. Extra capabilities don't include original settings. This property is only valid in conference mode.
     */

    _this3.extraCapabilities = undefined;
    return _this3;
  }

  return RemoteStream;
}(Stream);
/**
 * @class StreamEvent
 * @classDesc Event for Stream.
 * @extends Owt.Base.OwtEvent
 * @memberof Owt.Base
 * @hideconstructor
 */


exports.RemoteStream = RemoteStream;

var StreamEvent =
/*#__PURE__*/
function (_OwtEvent) {
  _inherits(StreamEvent, _OwtEvent);

  // eslint-disable-next-line require-jsdoc
  function StreamEvent(type, init) {
    var _this4;

    _classCallCheck(this, StreamEvent);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(StreamEvent).call(this, type));
    /**
     * @member {Owt.Base.Stream} stream
     * @instance
     * @memberof Owt.Base.StreamEvent
     */

    _this4.stream = init.stream;
    return _this4;
  }

  return StreamEvent;
}(_event.OwtEvent);

exports.StreamEvent = StreamEvent;

},{"./event.js":3,"./logger.js":5,"./utils.js":11}],11:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

/* global navigator, window */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFirefox = isFirefox;
exports.isChrome = isChrome;
exports.isSafari = isSafari;
exports.isEdge = isEdge;
exports.createUuid = createUuid;
exports.sysInfo = sysInfo;
var sdkVersion = '4.3.1'; // eslint-disable-next-line require-jsdoc

function isFirefox() {
  return window.navigator.userAgent.match('Firefox') !== null;
} // eslint-disable-next-line require-jsdoc


function isChrome() {
  return window.navigator.userAgent.match('Chrome') !== null;
} // eslint-disable-next-line require-jsdoc


function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
} // eslint-disable-next-line require-jsdoc


function isEdge() {
  return window.navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) !== null;
} // eslint-disable-next-line require-jsdoc


function createUuid() {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
} // Returns system information.
// Format: {sdk:{version:**, type:**}, runtime:{version:**, name:**}, os:{version:**, name:**}};
// eslint-disable-next-line require-jsdoc


function sysInfo() {
  var info = Object.create({});
  info.sdk = {
    version: sdkVersion,
    type: 'JavaScript'
  }; // Runtime info.

  var userAgent = navigator.userAgent;
  var firefoxRegex = /Firefox\/([0-9\.]+)/;
  var chromeRegex = /Chrome\/([0-9\.]+)/;
  var edgeRegex = /Edge\/([0-9\.]+)/;
  var safariVersionRegex = /Version\/([0-9\.]+) Safari/;
  var result = chromeRegex.exec(userAgent);

  if (result) {
    info.runtime = {
      name: 'Chrome',
      version: result[1]
    };
  } else if (result = firefoxRegex.exec(userAgent)) {
    info.runtime = {
      name: 'Firefox',
      version: result[1]
    };
  } else if (result = edgeRegex.exec(userAgent)) {
    info.runtime = {
      name: 'Edge',
      version: result[1]
    };
  } else if (isSafari()) {
    result = safariVersionRegex.exec(userAgent);
    info.runtime = {
      name: 'Safari'
    };
    info.runtime.version = result ? result[1] : 'Unknown';
  } else {
    info.runtime = {
      name: 'Unknown',
      version: 'Unknown'
    };
  } // OS info.


  var windowsRegex = /Windows NT ([0-9\.]+)/;
  var macRegex = /Intel Mac OS X ([0-9_\.]+)/;
  var iPhoneRegex = /iPhone OS ([0-9_\.]+)/;
  var linuxRegex = /X11; Linux/;
  var androidRegex = /Android( ([0-9\.]+))?/;
  var chromiumOsRegex = /CrOS/;

  if (result = windowsRegex.exec(userAgent)) {
    info.os = {
      name: 'Windows NT',
      version: result[1]
    };
  } else if (result = macRegex.exec(userAgent)) {
    info.os = {
      name: 'Mac OS X',
      version: result[1].replace(/_/g, '.')
    };
  } else if (result = iPhoneRegex.exec(userAgent)) {
    info.os = {
      name: 'iPhone OS',
      version: result[1].replace(/_/g, '.')
    };
  } else if (result = linuxRegex.exec(userAgent)) {
    info.os = {
      name: 'Linux',
      version: 'Unknown'
    };
  } else if (result = androidRegex.exec(userAgent)) {
    info.os = {
      name: 'Android',
      version: result[1] || 'Unknown'
    };
  } else if (result = chromiumOsRegex.exec(userAgent)) {
    info.os = {
      name: 'Chrome OS',
      version: 'Unknown'
    };
  } else {
    info.os = {
      name: 'Unknown',
      version: 'Unknown'
    };
  }

  info.capabilities = {
    continualIceGathering: false,
    unifiedPlan: true,
    streamRemovable: info.runtime.name !== 'Firefox'
  };
  return info;
}

},{}],12:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable require-jsdoc */

/* global Promise */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferencePeerConnectionChannel = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _event = require("../base/event.js");

var _mediaformat = require("../base/mediaformat.js");

var _publication = require("../base/publication.js");

var _subscription = require("./subscription.js");

var _error2 = require("./error.js");

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var SdpUtils = _interopRequireWildcard(require("../base/sdputils.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class ConferencePeerConnectionChannel
 * @classDesc A channel for a connection between client and conference server. Currently, only one stream could be tranmitted in a channel.
 * @hideconstructor
 * @private
 */
var ConferencePeerConnectionChannel =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(ConferencePeerConnectionChannel, _EventDispatcher);

  // eslint-disable-next-line require-jsdoc
  function ConferencePeerConnectionChannel(config, signaling) {
    var _this;

    _classCallCheck(this, ConferencePeerConnectionChannel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ConferencePeerConnectionChannel).call(this));
    _this._config = config;
    _this._options = null;
    _this._videoCodecs = undefined;
    _this._signaling = signaling;
    _this._pc = null;
    _this._internalId = null; // It's publication ID or subscription ID.

    _this._pendingCandidates = [];
    _this._subscribePromise = null;
    _this._publishPromise = null;
    _this._subscribedStream = null;
    _this._publishedStream = null;
    _this._publication = null;
    _this._subscription = null; // Timer for PeerConnection disconnected. Will stop connection after timer.

    _this._disconnectTimer = null;
    _this._ended = false;
    _this._stopped = false;
    return _this;
  }
  /**
   * @function onMessage
   * @desc Received a message from conference portal. Defined in client-server protocol.
   * @param {string} notification Notification type.
   * @param {object} message Message received.
   * @private
   */


  _createClass(ConferencePeerConnectionChannel, [{
    key: "onMessage",
    value: function onMessage(notification, message) {
      switch (notification) {
        case 'progress':
          if (message.status === 'soac') {
            this._sdpHandler(message.data);
          } else if (message.status === 'ready') {
            this._readyHandler();
          } else if (message.status === 'error') {
            this._errorHandler(message.data);
          }

          break;

        case 'stream':
          this._onStreamEvent(message);

          break;

        default:
          _logger.default.warning('Unknown notification from MCU.');

      }
    }
  }, {
    key: "publish",
    value: function publish(stream, options, videoCodecs) {
      var _this2 = this;

      if (options === undefined) {
        options = {
          audio: !!stream.mediaStream.getAudioTracks().length,
          video: !!stream.mediaStream.getVideoTracks().length
        };
      }

      if (_typeof(options) !== 'object') {
        return Promise.reject(new TypeError('Options should be an object.'));
      }

      if (this._isRtpEncodingParameters(options.audio) && this._isOwtEncodingParameters(options.video) || this._isOwtEncodingParameters(options.audio) && this._isRtpEncodingParameters(options.video)) {
        return Promise.reject(new _error2.ConferenceError('Mixing RTCRtpEncodingParameters and AudioEncodingParameters/VideoEncodingParameters is not allowed.'));
      }

      if (options.audio === undefined) {
        options.audio = !!stream.mediaStream.getAudioTracks().length;
      }

      if (options.video === undefined) {
        options.video = !!stream.mediaStream.getVideoTracks().length;
      }

      if (!!options.audio && !stream.mediaStream.getAudioTracks().length || !!options.video && !stream.mediaStream.getVideoTracks().length) {
        return Promise.reject(new _error2.ConferenceError('options.audio/video is inconsistent with tracks presented in the ' + 'MediaStream.'));
      }

      if ((options.audio === false || options.audio === null) && (options.video === false || options.video === null)) {
        return Promise.reject(new _error2.ConferenceError('Cannot publish a stream without audio and video.'));
      }

      if (_typeof(options.audio) === 'object') {
        if (!Array.isArray(options.audio)) {
          return Promise.reject(new TypeError('options.audio should be a boolean or an array.'));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = options.audio[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var parameters = _step.value;

            if (!parameters.codec || typeof parameters.codec.name !== 'string' || parameters.maxBitrate !== undefined && typeof parameters.maxBitrate !== 'number') {
              return Promise.reject(new TypeError('options.audio has incorrect parameters.'));
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      if (_typeof(options.video) === 'object' && !Array.isArray(options.video)) {
        return Promise.reject(new TypeError('options.video should be a boolean or an array.'));
      }

      if (this._isOwtEncodingParameters(options.video)) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = options.video[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _parameters = _step2.value;

            if (!_parameters.codec || typeof _parameters.codec.name !== 'string' || _parameters.maxBitrate !== undefined && typeof _parameters.maxBitrate !== 'number' || _parameters.codec.profile !== undefined && typeof _parameters.codec.profile !== 'string') {
              return Promise.reject(new TypeError('options.video has incorrect parameters.'));
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      this._options = options;
      var mediaOptions = {};

      this._createPeerConnection();

      if (stream.mediaStream.getAudioTracks().length > 0 && options.audio !== false && options.audio !== null) {
        if (stream.mediaStream.getAudioTracks().length > 1) {
          _logger.default.warning('Publishing a stream with multiple audio tracks is not fully' + ' supported.');
        }

        if (typeof options.audio !== 'boolean' && _typeof(options.audio) !== 'object') {
          return Promise.reject(new _error2.ConferenceError('Type of audio options should be boolean or an object.'));
        }

        mediaOptions.audio = {};
        mediaOptions.audio.source = stream.source.audio;
      } else {
        mediaOptions.audio = false;
      }

      if (stream.mediaStream.getVideoTracks().length > 0 && options.video !== false && options.video !== null) {
        if (stream.mediaStream.getVideoTracks().length > 1) {
          _logger.default.warning('Publishing a stream with multiple video tracks is not fully ' + 'supported.');
        }

        mediaOptions.video = {};
        mediaOptions.video.source = stream.source.video;
        var trackSettings = stream.mediaStream.getVideoTracks()[0].getSettings();
        mediaOptions.video.parameters = {
          resolution: {
            width: trackSettings.width,
            height: trackSettings.height
          },
          framerate: trackSettings.frameRate
        };
      } else {
        mediaOptions.video = false;
      }

      this._publishedStream = stream;

      this._signaling.sendSignalingMessage('publish', {
        media: mediaOptions,
        attributes: stream.attributes
      }).then(function (data) {
        var messageEvent = new _event.MessageEvent('id', {
          message: data.id,
          origin: _this2._remoteId
        });

        _this2.dispatchEvent(messageEvent);

        _this2._internalId = data.id;
        var offerOptions = {};

        if (typeof _this2._pc.addTransceiver === 'function') {
          var setPromise = Promise.resolve(); // |direction| seems not working on Safari.

          if (mediaOptions.audio && stream.mediaStream.getAudioTracks().length > 0) {
            var transceiverInit = {
              direction: 'sendonly'
            };

            if (_this2._isRtpEncodingParameters(options.audio)) {
              transceiverInit.sendEncodings = options.audio;
            }

            var transceiver = _this2._pc.addTransceiver(stream.mediaStream.getAudioTracks()[0], transceiverInit);

            if (Utils.isFirefox()) {
              // Firefox does not support encodings setting in addTransceiver.
              var _parameters2 = transceiver.sender.getParameters();

              _parameters2.encodings = transceiverInit.sendEncodings;
              setPromise = transceiver.sender.setParameters(_parameters2);
            }
          }

          if (mediaOptions.video && stream.mediaStream.getVideoTracks().length > 0) {
            var _transceiverInit = {
              direction: 'sendonly'
            };

            if (_this2._isRtpEncodingParameters(options.video)) {
              _transceiverInit.sendEncodings = options.video;
              _this2._videoCodecs = videoCodecs;
            }

            var _transceiver = _this2._pc.addTransceiver(stream.mediaStream.getVideoTracks()[0], _transceiverInit);

            if (Utils.isFirefox()) {
              // Firefox does not support encodings setting in addTransceiver.
              var _parameters3 = _transceiver.sender.getParameters();

              _parameters3.encodings = _transceiverInit.sendEncodings;
              setPromise = setPromise.then(function () {
                return _transceiver.sender.setParameters(_parameters3);
              });
            }
          }

          return setPromise.then(function () {
            return offerOptions;
          });
        } else {
          if (mediaOptions.audio && stream.mediaStream.getAudioTracks().length > 0) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = stream.mediaStream.getAudioTracks()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var track = _step3.value;

                _this2._pc.addTrack(track, stream.mediaStream);
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }

          if (mediaOptions.video && stream.mediaStream.getVideoTracks().length > 0) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = stream.mediaStream.getVideoTracks()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _track = _step4.value;

                _this2._pc.addTrack(_track, stream.mediaStream);
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          }

          offerOptions.offerToReceiveAudio = false;
          offerOptions.offerToReceiveVideo = false;
        }

        return offerOptions;
      }).then(function (offerOptions) {
        var localDesc;

        _this2._pc.createOffer(offerOptions).then(function (desc) {
          if (options) {
            desc.sdp = _this2._setRtpReceiverOptions(desc.sdp, options);
          }

          return desc;
        }).then(function (desc) {
          localDesc = desc;
          return _this2._pc.setLocalDescription(desc);
        }).then(function () {
          _this2._signaling.sendSignalingMessage('soac', {
            id: _this2._internalId,
            signaling: localDesc
          });
        }).catch(function (e) {
          _logger.default.error('Failed to create offer or set SDP. Message: ' + e.message);

          _this2._unpublish();

          _this2._rejectPromise(e);

          _this2._fireEndedEventOnPublicationOrSubscription();
        });
      }).catch(function (e) {
        _this2._unpublish();

        _this2._rejectPromise(e);

        _this2._fireEndedEventOnPublicationOrSubscription();
      });

      return new Promise(function (resolve, reject) {
        _this2._publishPromise = {
          resolve: resolve,
          reject: reject
        };
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(stream, options) {
      var _this3 = this;

      if (options === undefined) {
        options = {
          audio: !!stream.settings.audio,
          video: !!stream.settings.video
        };
      }

      if (_typeof(options) !== 'object') {
        return Promise.reject(new TypeError('Options should be an object.'));
      }

      if (options.audio === undefined) {
        options.audio = !!stream.settings.audio;
      }

      if (options.video === undefined) {
        options.video = !!stream.settings.video;
      }

      if (options.audio !== undefined && _typeof(options.audio) !== 'object' && typeof options.audio !== 'boolean' && options.audio !== null || options.video !== undefined && _typeof(options.video) !== 'object' && typeof options.video !== 'boolean' && options.video !== null) {
        return Promise.reject(new TypeError('Invalid options type.'));
      }

      if (options.audio && !stream.settings.audio || options.video && !stream.settings.video) {
        return Promise.reject(new _error2.ConferenceError('options.audio/video cannot be true or an object if there is no ' + 'audio/video track in remote stream.'));
      }

      if (options.audio === false && options.video === false) {
        return Promise.reject(new _error2.ConferenceError('Cannot subscribe a stream without audio and video.'));
      }

      this._options = options;
      var mediaOptions = {};

      if (options.audio) {
        if (_typeof(options.audio) === 'object' && Array.isArray(options.audio.codecs)) {
          if (options.audio.codecs.length === 0) {
            return Promise.reject(new TypeError('Audio codec cannot be an empty array.'));
          }
        }

        mediaOptions.audio = {};
        mediaOptions.audio.from = stream.id;
      } else {
        mediaOptions.audio = false;
      }

      if (options.video) {
        if (_typeof(options.video) === 'object' && Array.isArray(options.video.codecs)) {
          if (options.video.codecs.length === 0) {
            return Promise.reject(new TypeError('Video codec cannot be an empty array.'));
          }
        }

        mediaOptions.video = {};
        mediaOptions.video.from = stream.id;

        if (options.video.resolution || options.video.frameRate || options.video.bitrateMultiplier && options.video.bitrateMultiplier !== 1 || options.video.keyFrameInterval) {
          mediaOptions.video.parameters = {
            resolution: options.video.resolution,
            framerate: options.video.frameRate,
            bitrate: options.video.bitrateMultiplier ? 'x' + options.video.bitrateMultiplier.toString() : undefined,
            keyFrameInterval: options.video.keyFrameInterval
          };
        }

        if (options.video.rid) {
          mediaOptions.video.simulcastRid = options.video.rid; // Ignore other settings when RID set.

          delete mediaOptions.video.parameters;
          options.video = true;
        }
      } else {
        mediaOptions.video = false;
      }

      this._subscribedStream = stream;

      this._signaling.sendSignalingMessage('subscribe', {
        media: mediaOptions
      }).then(function (data) {
        var messageEvent = new _event.MessageEvent('id', {
          message: data.id,
          origin: _this3._remoteId
        });

        _this3.dispatchEvent(messageEvent);

        _this3._internalId = data.id;

        _this3._createPeerConnection();

        var offerOptions = {};

        if (typeof _this3._pc.addTransceiver === 'function') {
          // |direction| seems not working on Safari.
          if (mediaOptions.audio) {
            _this3._pc.addTransceiver('audio', {
              direction: 'recvonly'
            });
          }

          if (mediaOptions.video) {
            _this3._pc.addTransceiver('video', {
              direction: 'recvonly'
            });
          }
        } else {
          offerOptions.offerToReceiveAudio = !!options.audio;
          offerOptions.offerToReceiveVideo = !!options.video;
        }

        _this3._pc.createOffer(offerOptions).then(function (desc) {
          if (options) {
            desc.sdp = _this3._setRtpReceiverOptions(desc.sdp, options);
          }

          _this3._pc.setLocalDescription(desc).then(function () {
            _this3._signaling.sendSignalingMessage('soac', {
              id: _this3._internalId,
              signaling: desc
            });
          }, function (errorMessage) {
            _logger.default.error('Set local description failed. Message: ' + JSON.stringify(errorMessage));
          });
        }, function (error) {
          _logger.default.error('Create offer failed. Error info: ' + JSON.stringify(error));
        }).catch(function (e) {
          _logger.default.error('Failed to create offer or set SDP. Message: ' + e.message);

          _this3._unsubscribe();

          _this3._rejectPromise(e);

          _this3._fireEndedEventOnPublicationOrSubscription();
        });
      }).catch(function (e) {
        _this3._unsubscribe();

        _this3._rejectPromise(e);

        _this3._fireEndedEventOnPublicationOrSubscription();
      });

      return new Promise(function (resolve, reject) {
        _this3._subscribePromise = {
          resolve: resolve,
          reject: reject
        };
      });
    }
  }, {
    key: "_unpublish",
    value: function _unpublish() {
      if (!this._stopped) {
        this._stopped = true;

        this._signaling.sendSignalingMessage('unpublish', {
          id: this._internalId
        }).catch(function (e) {
          _logger.default.warning('MCU returns negative ack for unpublishing, ' + e);
        });

        if (this._pc && this._pc.signalingState !== 'closed') {
          this._pc.close();
        }
      }
    }
  }, {
    key: "_unsubscribe",
    value: function _unsubscribe() {
      if (!this._stopped) {
        this._stopped = true;

        this._signaling.sendSignalingMessage('unsubscribe', {
          id: this._internalId
        }).catch(function (e) {
          _logger.default.warning('MCU returns negative ack for unsubscribing, ' + e);
        });

        if (this._pc && this._pc.signalingState !== 'closed') {
          this._pc.close();
        }
      }
    }
  }, {
    key: "_muteOrUnmute",
    value: function _muteOrUnmute(isMute, isPub, trackKind) {
      var _this4 = this;

      var eventName = isPub ? 'stream-control' : 'subscription-control';
      var operation = isMute ? 'pause' : 'play';
      return this._signaling.sendSignalingMessage(eventName, {
        id: this._internalId,
        operation: operation,
        data: trackKind
      }).then(function () {
        if (!isPub) {
          var muteEventName = isMute ? 'mute' : 'unmute';

          _this4._subscription.dispatchEvent(new _event.MuteEvent(muteEventName, {
            kind: trackKind
          }));
        }
      });
    }
  }, {
    key: "_applyOptions",
    value: function _applyOptions(options) {
      if (_typeof(options) !== 'object' || _typeof(options.video) !== 'object') {
        return Promise.reject(new _error2.ConferenceError('Options should be an object.'));
      }

      var videoOptions = {};
      videoOptions.resolution = options.video.resolution;
      videoOptions.framerate = options.video.frameRate;
      videoOptions.bitrate = options.video.bitrateMultiplier ? 'x' + options.video.bitrateMultiplier.toString() : undefined;
      videoOptions.keyFrameInterval = options.video.keyFrameInterval;
      return this._signaling.sendSignalingMessage('subscription-control', {
        id: this._internalId,
        operation: 'update',
        data: {
          video: {
            parameters: videoOptions
          }
        }
      }).then();
    }
  }, {
    key: "_onRemoteStreamAdded",
    value: function _onRemoteStreamAdded(event) {
      _logger.default.debug('Remote stream added.');

      if (this._subscribedStream) {
        this._subscribedStream.mediaStream = event.streams[0];
      } else {
        // This is not expected path. However, this is going to happen on Safari
        // because it does not support setting direction of transceiver.
        _logger.default.warning('Received remote stream without subscription.');
      }
    }
  }, {
    key: "_onLocalIceCandidate",
    value: function _onLocalIceCandidate(event) {
      if (event.candidate) {
        if (this._pc.signalingState !== 'stable') {
          this._pendingCandidates.push(event.candidate);
        } else {
          this._sendCandidate(event.candidate);
        }
      } else {
        _logger.default.debug('Empty candidate.');
      }
    }
  }, {
    key: "_fireEndedEventOnPublicationOrSubscription",
    value: function _fireEndedEventOnPublicationOrSubscription() {
      if (this._ended) {
        return;
      }

      this._ended = true;
      var event = new _event.OwtEvent('ended');

      if (this._publication) {
        this._publication.dispatchEvent(event);

        this._publication.stop();
      } else if (this._subscription) {
        this._subscription.dispatchEvent(event);

        this._subscription.stop();
      }
    }
  }, {
    key: "_rejectPromise",
    value: function _rejectPromise(error) {
      if (!error) {
        var _error = new _error2.ConferenceError('Connection failed or closed.');
      } // Rejecting corresponding promise if publishing and subscribing is ongoing.


      if (this._publishPromise) {
        this._publishPromise.reject(error);

        this._publishPromise = undefined;
      } else if (this._subscribePromise) {
        this._subscribePromise.reject(error);

        this._subscribePromise = undefined;
      }
    }
  }, {
    key: "_onIceConnectionStateChange",
    value: function _onIceConnectionStateChange(event) {
      if (!event || !event.currentTarget) {
        return;
      }

      _logger.default.debug('ICE connection state changed to ' + event.currentTarget.iceConnectionState);

      if (event.currentTarget.iceConnectionState === 'closed' || event.currentTarget.iceConnectionState === 'failed') {
        if (event.currentTarget.iceConnectionState === 'failed') {
          this._handleError('connection failed.');
        } else {
          // Fire ended event if publication or subscription exists.
          this._fireEndedEventOnPublicationOrSubscription();
        }
      }
    }
  }, {
    key: "_onConnectionStateChange",
    value: function _onConnectionStateChange(event) {
      if (this._pc.connectionState === 'closed' || this._pc.connectionState === 'failed') {
        if (this._pc.connectionState === 'failed') {
          this._handleError('connection failed.');
        } else {
          // Fire ended event if publication or subscription exists.
          this._fireEndedEventOnPublicationOrSubscription();
        }
      }
    }
  }, {
    key: "_sendCandidate",
    value: function _sendCandidate(candidate) {
      this._signaling.sendSignalingMessage('soac', {
        id: this._internalId,
        signaling: {
          type: 'candidate',
          candidate: {
            candidate: 'a=' + candidate.candidate,
            sdpMid: candidate.sdpMid,
            sdpMLineIndex: candidate.sdpMLineIndex
          }
        }
      });
    }
  }, {
    key: "_createPeerConnection",
    value: function _createPeerConnection() {
      var _this5 = this;

      var pcConfiguration = this._config.rtcConfiguration || {};

      if (Utils.isChrome()) {
        pcConfiguration.sdpSemantics = 'unified-plan';
      }

      this._pc = new RTCPeerConnection(pcConfiguration);

      this._pc.onicecandidate = function (event) {
        _this5._onLocalIceCandidate.apply(_this5, [event]);
      };

      this._pc.ontrack = function (event) {
        _this5._onRemoteStreamAdded.apply(_this5, [event]);
      };

      this._pc.oniceconnectionstatechange = function (event) {
        _this5._onIceConnectionStateChange.apply(_this5, [event]);
      };

      this._pc.onconnectionstatechange = function (event) {
        _this5._onConnectionStateChange.apply(_this5, [event]);
      };
    }
  }, {
    key: "_getStats",
    value: function _getStats() {
      if (this._pc) {
        return this._pc.getStats();
      } else {
        return Promise.reject(new _error2.ConferenceError('PeerConnection is not available.'));
      }
    }
  }, {
    key: "_readyHandler",
    value: function _readyHandler() {
      var _this6 = this;

      if (this._subscribePromise) {
        this._subscription = new _subscription.Subscription(this._internalId, function () {
          _this6._unsubscribe();
        }, function () {
          return _this6._getStats();
        }, function (trackKind) {
          return _this6._muteOrUnmute(true, false, trackKind);
        }, function (trackKind) {
          return _this6._muteOrUnmute(false, false, trackKind);
        }, function (options) {
          return _this6._applyOptions(options);
        }); // Fire subscription's ended event when associated stream is ended.

        this._subscribedStream.addEventListener('ended', function () {
          _this6._subscription.dispatchEvent('ended', new _event.OwtEvent('ended'));
        });

        this._subscribePromise.resolve(this._subscription);
      } else if (this._publishPromise) {
        this._publication = new _publication.Publication(this._internalId, function () {
          _this6._unpublish();

          return Promise.resolve();
        }, function () {
          return _this6._getStats();
        }, function (trackKind) {
          return _this6._muteOrUnmute(true, true, trackKind);
        }, function (trackKind) {
          return _this6._muteOrUnmute(false, true, trackKind);
        });

        this._publishPromise.resolve(this._publication); // Do not fire publication's ended event when associated stream is ended.
        // It may still sending silence or black frames.
        // Refer to https://w3c.github.io/webrtc-pc/#rtcrtpsender-interface.

      }

      this._publishPromise = null;
      this._subscribePromise = null;
    }
  }, {
    key: "_sdpHandler",
    value: function _sdpHandler(sdp) {
      var _this7 = this;

      if (sdp.type === 'answer') {
        if ((this._publication || this._publishPromise) && this._options) {
          sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._options);
        }

        this._pc.setRemoteDescription(sdp).then(function () {
          if (_this7._pendingCandidates.length > 0) {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = _this7._pendingCandidates[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var candidate = _step5.value;

                _this7._sendCandidate(candidate);
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }
          }
        }, function (error) {
          _logger.default.error('Set remote description failed: ' + error);

          _this7._rejectPromise(error);

          _this7._fireEndedEventOnPublicationOrSubscription();
        });
      }
    }
  }, {
    key: "_errorHandler",
    value: function _errorHandler(errorMessage) {
      return this._handleError(errorMessage);
    }
  }, {
    key: "_handleError",
    value: function _handleError(errorMessage) {
      var error = new _error2.ConferenceError(errorMessage);
      var p = this._publishPromise || this._subscribePromise;

      if (p) {
        return this._rejectPromise(error);
      }

      if (this._ended) {
        return;
      }

      var dispatcher = this._publication || this._subscription;

      if (!dispatcher) {
        _logger.default.warning('Neither publication nor subscription is available.');

        return;
      }

      var errorEvent = new _event.ErrorEvent('error', {
        error: error
      });
      dispatcher.dispatchEvent(errorEvent); // Fire ended event when error occured

      this._fireEndedEventOnPublicationOrSubscription();
    }
  }, {
    key: "_setCodecOrder",
    value: function _setCodecOrder(sdp, options) {
      if (this._publication || this._publishPromise) {
        if (options.audio) {
          var audioCodecNames = Array.from(options.audio, function (encodingParameters) {
            return encodingParameters.codec.name;
          });
          sdp = SdpUtils.reorderCodecs(sdp, 'audio', audioCodecNames);
        }

        if (options.video) {
          var videoCodecNames = Array.from(options.video, function (encodingParameters) {
            return encodingParameters.codec.name;
          });
          sdp = SdpUtils.reorderCodecs(sdp, 'video', videoCodecNames);
        }
      } else {
        if (options.audio && options.audio.codecs) {
          var _audioCodecNames = Array.from(options.audio.codecs, function (codec) {
            return codec.name;
          });

          sdp = SdpUtils.reorderCodecs(sdp, 'audio', _audioCodecNames);
        }

        if (options.video && options.video.codecs) {
          var _videoCodecNames = Array.from(options.video.codecs, function (codec) {
            return codec.name;
          });

          sdp = SdpUtils.reorderCodecs(sdp, 'video', _videoCodecNames);
        }
      }

      return sdp;
    }
  }, {
    key: "_setMaxBitrate",
    value: function _setMaxBitrate(sdp, options) {
      if (_typeof(options.audio) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.audio);
      }

      if (_typeof(options.video) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.video);
      }

      return sdp;
    }
  }, {
    key: "_setRtpSenderOptions",
    value: function _setRtpSenderOptions(sdp, options) {
      // SDP mugling is deprecated, moving to `setParameters`.
      if (this._isRtpEncodingParameters(options.audio) || this._isRtpEncodingParameters(options.video)) {
        return sdp;
      }

      sdp = this._setMaxBitrate(sdp, options);
      return sdp;
    }
  }, {
    key: "_setRtpReceiverOptions",
    value: function _setRtpReceiverOptions(sdp, options) {
      // Add legacy simulcast in SDP for safari.
      if (this._isRtpEncodingParameters(options.video) && Utils.isSafari()) {
        if (options.video.length > 1) {
          sdp = SdpUtils.addLegacySimulcast(sdp, 'video', options.video.length);
        }
      } // _videoCodecs is a workaround for setting video codecs. It will be moved to RTCRtpSendParameters.


      if (this._isRtpEncodingParameters(options.video) && this._videoCodecs) {
        sdp = SdpUtils.reorderCodecs(sdp, 'video', this._videoCodecs);
        return sdp;
      }

      if (this._isRtpEncodingParameters(options.audio) || this._isRtpEncodingParameters(options.video)) {
        return sdp;
      }

      sdp = this._setCodecOrder(sdp, options);
      return sdp;
    } // Handle stream event sent from MCU. Some stream events should be publication
    // event or subscription event. It will be handled here.

  }, {
    key: "_onStreamEvent",
    value: function _onStreamEvent(message) {
      var eventTarget;

      if (this._publication && message.id === this._publication.id) {
        eventTarget = this._publication;
      } else if (this._subscribedStream && message.id === this._subscribedStream.id) {
        eventTarget = this._subscription;
      }

      if (!eventTarget) {
        return;
      }

      var trackKind;

      if (message.data.field === 'audio.status') {
        trackKind = _mediaformat.TrackKind.AUDIO;
      } else if (message.data.field === 'video.status') {
        trackKind = _mediaformat.TrackKind.VIDEO;
      } else {
        _logger.default.warning('Invalid data field for stream update info.');
      }

      if (message.data.value === 'active') {
        eventTarget.dispatchEvent(new _event.MuteEvent('unmute', {
          kind: trackKind
        }));
      } else if (message.data.value === 'inactive') {
        eventTarget.dispatchEvent(new _event.MuteEvent('mute', {
          kind: trackKind
        }));
      } else {
        _logger.default.warning('Invalid data value for stream update info.');
      }
    }
  }, {
    key: "_isRtpEncodingParameters",
    value: function _isRtpEncodingParameters(obj) {
      if (!Array.isArray(obj)) {
        return false;
      } // Only check the first one.


      var param = obj[0];
      return param.codecPayloadType || param.dtx || param.active || param.ptime || param.maxFramerate || param.scaleResolutionDownBy || param.rid;
    }
  }, {
    key: "_isOwtEncodingParameters",
    value: function _isOwtEncodingParameters(obj) {
      if (!Array.isArray(obj)) {
        return false;
      } // Only check the first one.


      var param = obj[0];
      return !!param.codec;
    }
  }]);

  return ConferencePeerConnectionChannel;
}(_event.EventDispatcher);

exports.ConferencePeerConnectionChannel = ConferencePeerConnectionChannel;

},{"../base/event.js":3,"../base/logger.js":5,"../base/mediaformat.js":6,"../base/publication.js":8,"../base/sdputils.js":9,"../base/utils.js":11,"./error.js":14,"./subscription.js":21}],13:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

/* global Map, Promise */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferenceClient = void 0;

var EventModule = _interopRequireWildcard(require("../base/event.js"));

var _signaling = require("./signaling.js");

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _base = require("../base/base64.js");

var _error = require("./error.js");

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var StreamModule = _interopRequireWildcard(require("../base/stream.js"));

var _participant2 = require("./participant.js");

var _info = require("./info.js");

var _channel = require("./channel.js");

var _mixedstream = require("./mixedstream.js");

var StreamUtilsModule = _interopRequireWildcard(require("./streamutils.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignalingState = {
  READY: 1,
  CONNECTING: 2,
  CONNECTED: 3
};
var protocolVersion = '1.1';
/* eslint-disable valid-jsdoc */

/**
 * @class ParticipantEvent
 * @classDesc Class ParticipantEvent represents a participant event.
   @extends Owt.Base.OwtEvent
 * @memberof Owt.Conference
 * @hideconstructor
 */

var ParticipantEvent = function ParticipantEvent(type, init) {
  var that = new EventModule.OwtEvent(type, init);
  /**
   * @member {Owt.Conference.Participant} participant
   * @instance
   * @memberof Owt.Conference.ParticipantEvent
   */

  that.participant = init.participant;
  return that;
};
/* eslint-enable valid-jsdoc */

/**
 * @class ConferenceClientConfiguration
 * @classDesc Configuration for ConferenceClient.
 * @memberOf Owt.Conference
 * @hideconstructor
 */


var ConferenceClientConfiguration = // eslint-disable-line no-unused-vars
// eslint-disable-next-line require-jsdoc
function ConferenceClientConfiguration() {
  _classCallCheck(this, ConferenceClientConfiguration);

  /**
   * @member {?RTCConfiguration} rtcConfiguration
   * @instance
   * @memberof Owt.Conference.ConferenceClientConfiguration
   * @desc It will be used for creating PeerConnection.
   * @see {@link https://www.w3.org/TR/webrtc/#rtcconfiguration-dictionary|RTCConfiguration Dictionary of WebRTC 1.0}.
   * @example
   * // Following object can be set to conferenceClientConfiguration.rtcConfiguration.
   * {
   *   iceServers: [{
   *      urls: "stun:example.com:3478"
   *   }, {
   *     urls: [
   *       "turn:example.com:3478?transport=udp",
   *       "turn:example.com:3478?transport=tcp"
   *     ],
   *      credential: "password",
   *      username: "username"
   *   }
   * }
   */
  this.rtcConfiguration = undefined;
};
/**
 * @class ConferenceClient
 * @classdesc The ConferenceClient handles PeerConnections between client and server. For conference controlling, please refer to REST API guide.
 * Events:
 *
 * | Event Name            | Argument Type                    | Fired when       |
 * | --------------------- | ---------------------------------| ---------------- |
 * | streamadded           | Owt.Base.StreamEvent             | A new stream is available in the conference. |
 * | participantjoined     | Owt.Conference.ParticipantEvent  | A new participant joined the conference. |
 * | messagereceived       | Owt.Base.MessageEvent            | A new message is received. |
 * | serverdisconnected    | Owt.Base.OwtEvent                | Disconnected from conference server. |
 *
 * @memberof Owt.Conference
 * @extends Owt.Base.EventDispatcher
 * @constructor
 * @param {?Owt.Conference.ConferenceClientConfiguration } config Configuration for ConferenceClient.
 * @param {?Owt.Conference.SioSignaling } signalingImpl Signaling channel implementation for ConferenceClient. SDK uses default signaling channel implementation if this parameter is undefined. Currently, a Socket.IO signaling channel implementation was provided as ics.conference.SioSignaling. However, it is not recommended to directly access signaling channel or customize signaling channel for ConferenceClient as this time.
 */


var ConferenceClient = function ConferenceClient(config, signalingImpl) {
  Object.setPrototypeOf(this, new EventModule.EventDispatcher());
  config = config || {};
  var self = this;
  var signalingState = SignalingState.READY;
  var signaling = signalingImpl ? signalingImpl : new _signaling.SioSignaling();
  var me;
  var room;
  var remoteStreams = new Map(); // Key is stream ID, value is a RemoteStream.

  var participants = new Map(); // Key is participant ID, value is a Participant object.

  var publishChannels = new Map(); // Key is MediaStream's ID, value is pc channel.

  var channels = new Map(); // Key is channel's internal ID, value is channel.

  /**
   * @function onSignalingMessage
   * @desc Received a message from conference portal. Defined in client-server protocol.
   * @param {string} notification Notification type.
   * @param {object} data Data received.
   * @private
   */

  function onSignalingMessage(notification, data) {
    if (notification === 'soac' || notification === 'progress') {
      if (!channels.has(data.id)) {
        _logger.default.warning('Cannot find a channel for incoming data.');

        return;
      }

      channels.get(data.id).onMessage(notification, data);
    } else if (notification === 'stream') {
      if (data.status === 'add') {
        fireStreamAdded(data.data);
      } else if (data.status === 'remove') {
        fireStreamRemoved(data);
      } else if (data.status === 'update') {
        // Broadcast audio/video update status to channel so specific events can be fired on publication or subscription.
        if (data.data.field === 'audio.status' || data.data.field === 'video.status') {
          channels.forEach(function (c) {
            c.onMessage(notification, data);
          });
        } else if (data.data.field === 'activeInput') {
          fireActiveAudioInputChange(data);
        } else if (data.data.field === 'video.layout') {
          fireLayoutChange(data);
        } else if (data.data.field === '.') {
          updateRemoteStream(data.data.value);
        } else {
          _logger.default.warning('Unknown stream event from MCU.');
        }
      }
    } else if (notification === 'text') {
      fireMessageReceived(data);
    } else if (notification === 'participant') {
      fireParticipantEvent(data);
    }
  }

  signaling.addEventListener('data', function (event) {
    onSignalingMessage(event.message.notification, event.message.data);
  });
  signaling.addEventListener('disconnect', function () {
    clean();
    signalingState = SignalingState.READY;
    self.dispatchEvent(new EventModule.OwtEvent('serverdisconnected'));
  }); // eslint-disable-next-line require-jsdoc

  function fireParticipantEvent(data) {
    if (data.action === 'join') {
      data = data.data;
      var participant = new _participant2.Participant(data.id, data.role, data.user);
      participants.set(data.id, participant);
      var event = new ParticipantEvent('participantjoined', {
        participant: participant
      });
      self.dispatchEvent(event);
    } else if (data.action === 'leave') {
      var participantId = data.data;

      if (!participants.has(participantId)) {
        _logger.default.warning('Received leave message from MCU for an unknown participant.');

        return;
      }

      var _participant = participants.get(participantId);

      participants.delete(participantId);

      _participant.dispatchEvent(new EventModule.OwtEvent('left'));
    }
  } // eslint-disable-next-line require-jsdoc


  function fireMessageReceived(data) {
    var messageEvent = new EventModule.MessageEvent('messagereceived', {
      message: data.message,
      origin: data.from,
      to: data.to
    });
    self.dispatchEvent(messageEvent);
  } // eslint-disable-next-line require-jsdoc


  function fireStreamAdded(info) {
    var stream = createRemoteStream(info);
    remoteStreams.set(stream.id, stream);
    var streamEvent = new StreamModule.StreamEvent('streamadded', {
      stream: stream
    });
    self.dispatchEvent(streamEvent);
  } // eslint-disable-next-line require-jsdoc


  function fireStreamRemoved(info) {
    if (!remoteStreams.has(info.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(info.id);
    var streamEvent = new EventModule.OwtEvent('ended');
    remoteStreams.delete(stream.id);
    stream.dispatchEvent(streamEvent);
  } // eslint-disable-next-line require-jsdoc


  function fireActiveAudioInputChange(info) {
    if (!remoteStreams.has(info.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(info.id);
    var streamEvent = new _mixedstream.ActiveAudioInputChangeEvent('activeaudioinputchange', {
      activeAudioInputStreamId: info.data.value
    });
    stream.dispatchEvent(streamEvent);
  } // eslint-disable-next-line require-jsdoc


  function fireLayoutChange(info) {
    if (!remoteStreams.has(info.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(info.id);
    var streamEvent = new _mixedstream.LayoutChangeEvent('layoutchange', {
      layout: info.data.value
    });
    stream.dispatchEvent(streamEvent);
  } // eslint-disable-next-line require-jsdoc


  function updateRemoteStream(streamInfo) {
    if (!remoteStreams.has(streamInfo.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(streamInfo.id);
    stream.settings = StreamUtilsModule.convertToPublicationSettings(streamInfo.media);
    stream.extraCapabilities = StreamUtilsModule.convertToSubscriptionCapabilities(streamInfo.media);
    var streamEvent = new EventModule.OwtEvent('updated');
    stream.dispatchEvent(streamEvent);
  } // eslint-disable-next-line require-jsdoc


  function createRemoteStream(streamInfo) {
    if (streamInfo.type === 'mixed') {
      return new _mixedstream.RemoteMixedStream(streamInfo);
    } else {
      var audioSourceInfo;
      var videoSourceInfo;

      if (streamInfo.media.audio) {
        audioSourceInfo = streamInfo.media.audio.source;
      }

      if (streamInfo.media.video) {
        videoSourceInfo = streamInfo.media.video.source;
      }

      var stream = new StreamModule.RemoteStream(streamInfo.id, streamInfo.info.owner, undefined, new StreamModule.StreamSourceInfo(audioSourceInfo, videoSourceInfo), streamInfo.info.attributes);
      stream.settings = StreamUtilsModule.convertToPublicationSettings(streamInfo.media);
      stream.extraCapabilities = StreamUtilsModule.convertToSubscriptionCapabilities(streamInfo.media);
      return stream;
    }
  } // eslint-disable-next-line require-jsdoc


  function sendSignalingMessage(type, message) {
    return signaling.send(type, message);
  } // eslint-disable-next-line require-jsdoc


  function createPeerConnectionChannel() {
    // Construct an signaling sender/receiver for ConferencePeerConnection.
    var signalingForChannel = Object.create(EventModule.EventDispatcher);
    signalingForChannel.sendSignalingMessage = sendSignalingMessage;
    var pcc = new _channel.ConferencePeerConnectionChannel(config, signalingForChannel);
    pcc.addEventListener('id', function (messageEvent) {
      channels.set(messageEvent.message, pcc);
    });
    return pcc;
  } // eslint-disable-next-line require-jsdoc


  function clean() {
    participants.clear();
    remoteStreams.clear();
  }

  Object.defineProperty(this, 'info', {
    configurable: false,
    get: function get() {
      if (!room) {
        return null;
      }

      return new _info.ConferenceInfo(room.id, Array.from(participants, function (x) {
        return x[1];
      }), Array.from(remoteStreams, function (x) {
        return x[1];
      }), me);
    }
  });
  /**
   * @function join
   * @instance
   * @desc Join a conference.
   * @memberof Owt.Conference.ConferenceClient
   * @returns {Promise<ConferenceInfo, Error>} Return a promise resolved with current conference's information if successfully join the conference. Or return a promise rejected with a newly created Owt.Error if failed to join the conference.
   * @param {string} tokenString Token is issued by conference server(nuve).
   */

  this.join = function (tokenString) {
    return new Promise(function (resolve, reject) {
      var token = JSON.parse(_base.Base64.decodeBase64(tokenString));
      var isSecured = token.secure === true;
      var host = token.host;

      if (typeof host !== 'string') {
        reject(new _error.ConferenceError('Invalid host.'));
        return;
      }

      if (host.indexOf('http') === -1) {
        host = isSecured ? 'https://' + host : 'http://' + host;
      }

      if (signalingState !== SignalingState.READY) {
        reject(new _error.ConferenceError('connection state invalid'));
        return;
      }

      signalingState = SignalingState.CONNECTING;
      var loginInfo = {
        token: tokenString,
        userAgent: Utils.sysInfo(),
        protocol: protocolVersion
      };
      signaling.connect(host, isSecured, loginInfo).then(function (resp) {
        signalingState = SignalingState.CONNECTED;
        room = resp.room;

        if (room.streams !== undefined) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = room.streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var st = _step.value;

              if (st.type === 'mixed') {
                st.viewport = st.info.label;
              }

              remoteStreams.set(st.id, createRemoteStream(st));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        if (resp.room && resp.room.participants !== undefined) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = resp.room.participants[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var p = _step2.value;
              participants.set(p.id, new _participant2.Participant(p.id, p.role, p.user));

              if (p.id === resp.id) {
                me = participants.get(p.id);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        resolve(new _info.ConferenceInfo(resp.room.id, Array.from(participants.values()), Array.from(remoteStreams.values()), me));
      }, function (e) {
        signalingState = SignalingState.READY;
        reject(new _error.ConferenceError(e));
      });
    });
  };
  /**
   * @function publish
   * @memberof Owt.Conference.ConferenceClient
   * @instance
   * @desc Publish a LocalStream to conference server. Other participants will be able to subscribe this stream when it is successfully published.
   * @param {Owt.Base.LocalStream} stream The stream to be published.
   * @param {Owt.Base.PublishOptions} options Options for publication.
   * @param {string[]} videoCodecs Video codec names for publishing. Valid values are 'VP8', 'VP9' and 'H264'. This parameter only valid when options.video is RTCRtpEncodingParameters. Publishing with RTCRtpEncodingParameters is an experimental feature. This parameter is subject to change.
   * @returns {Promise<Publication, Error>} Returned promise will be resolved with a newly created Publication once specific stream is successfully published, or rejected with a newly created Error if stream is invalid or options cannot be satisfied. Successfully published means PeerConnection is established and server is able to process media data.
   */


  this.publish = function (stream, options, videoCodecs) {
    if (!(stream instanceof StreamModule.LocalStream)) {
      return Promise.reject(new _error.ConferenceError('Invalid stream.'));
    }

    if (publishChannels.has(stream.mediaStream.id)) {
      return Promise.reject(new _error.ConferenceError('Cannot publish a published stream.'));
    }

    var channel = createPeerConnectionChannel();
    return channel.publish(stream, options, videoCodecs);
  };
  /**
   * @function subscribe
   * @memberof Owt.Conference.ConferenceClient
   * @instance
   * @desc Subscribe a RemoteStream from conference server.
   * @param {Owt.Base.RemoteStream} stream The stream to be subscribed.
   * @param {Owt.Conference.SubscribeOptions} options Options for subscription.
   * @returns {Promise<Subscription, Error>} Returned promise will be resolved with a newly created Subscription once specific stream is successfully subscribed, or rejected with a newly created Error if stream is invalid or options cannot be satisfied. Successfully subscribed means PeerConnection is established and server was started to send media data.
   */


  this.subscribe = function (stream, options) {
    if (!(stream instanceof StreamModule.RemoteStream)) {
      return Promise.reject(new _error.ConferenceError('Invalid stream.'));
    }

    var channel = createPeerConnectionChannel();
    return channel.subscribe(stream, options);
  };
  /**
   * @function send
   * @memberof Owt.Conference.ConferenceClient
   * @instance
   * @desc Send a text message to a participant or all participants.
   * @param {string} message Message to be sent.
   * @param {string} participantId Receiver of this message. Message will be sent to all participants if participantId is undefined.
   * @return {Promise<void, Error>} Returned promise will be resolved when conference server received certain message.
   */


  this.send = function (message, participantId) {
    if (participantId === undefined) {
      participantId = 'all';
    }

    return sendSignalingMessage('text', {
      to: participantId,
      message: message
    });
  };
  /**
   * @function leave
   * @memberOf Owt.Conference.ConferenceClient
   * @instance
   * @desc Leave a conference.
   * @return {Promise<void, Error>} Returned promise will be resolved with undefined once the connection is disconnected.
   */


  this.leave = function () {
    return signaling.disconnect().then(function () {
      clean();
      signalingState = SignalingState.READY;
    });
  };
};

exports.ConferenceClient = ConferenceClient;

},{"../base/base64.js":1,"../base/event.js":3,"../base/logger.js":5,"../base/stream.js":10,"../base/utils.js":11,"./channel.js":12,"./error.js":14,"./info.js":16,"./mixedstream.js":17,"./participant.js":18,"./signaling.js":19,"./streamutils.js":20}],14:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';
/**
 * @class ConferenceError
 * @classDesc The ConferenceError object represents an error in conference mode.
 * @memberOf Owt.Conference
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferenceError = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ConferenceError =
/*#__PURE__*/
function (_Error) {
  _inherits(ConferenceError, _Error);

  // eslint-disable-next-line require-jsdoc
  function ConferenceError(message) {
    _classCallCheck(this, ConferenceError);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConferenceError).call(this, message));
  }

  return ConferenceError;
}(_wrapNativeSuper(Error));

exports.ConferenceError = ConferenceError;

},{}],15:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ConferenceClient", {
  enumerable: true,
  get: function get() {
    return _client.ConferenceClient;
  }
});
Object.defineProperty(exports, "SioSignaling", {
  enumerable: true,
  get: function get() {
    return _signaling.SioSignaling;
  }
});

var _client = require("./client.js");

var _signaling = require("./signaling.js");

},{"./client.js":13,"./signaling.js":19}],16:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';
/**
 * @class ConferenceInfo
 * @classDesc Information for a conference.
 * @memberOf Owt.Conference
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferenceInfo = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConferenceInfo = // eslint-disable-next-line require-jsdoc
function ConferenceInfo(id, participants, remoteStreams, myInfo) {
  _classCallCheck(this, ConferenceInfo);

  /**
   * @member {string} id
   * @instance
   * @memberof Owt.Conference.ConferenceInfo
   * @desc Conference ID.
   */
  this.id = id;
  /**
   * @member {Array<Owt.Conference.Participant>} participants
   * @instance
   * @memberof Owt.Conference.ConferenceInfo
   * @desc Participants in the conference.
   */

  this.participants = participants;
  /**
   * @member {Array<Owt.Base.RemoteStream>} remoteStreams
   * @instance
   * @memberof Owt.Conference.ConferenceInfo
   * @desc Streams published by participants. It also includes streams published by current user.
   */

  this.remoteStreams = remoteStreams;
  /**
   * @member {Owt.Base.Participant} self
   * @instance
   * @memberof Owt.Conference.ConferenceInfo
   */

  this.self = myInfo;
};

exports.ConferenceInfo = ConferenceInfo;

},{}],17:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayoutChangeEvent = exports.ActiveAudioInputChangeEvent = exports.RemoteMixedStream = void 0;

var StreamModule = _interopRequireWildcard(require("../base/stream.js"));

var StreamUtilsModule = _interopRequireWildcard(require("./streamutils.js"));

var _event = require("../base/event.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class RemoteMixedStream
 * @classDesc Mixed stream from conference server.
 * Events:
 *
 * | Event Name             | Argument Type    | Fired when       |
 * | -----------------------| ---------------- | ---------------- |
 * | activeaudioinputchange | Event            | Audio activeness of input stream (of the mixed stream) is changed. |
 * | layoutchange           | Event            | Video's layout has been changed. It usually happens when a new video is mixed into the target mixed stream or an existing video has been removed from mixed stream. |
 *
 * @memberOf Owt.Conference
 * @extends Owt.Base.RemoteStream
 * @hideconstructor
 */
var RemoteMixedStream =
/*#__PURE__*/
function (_StreamModule$RemoteS) {
  _inherits(RemoteMixedStream, _StreamModule$RemoteS);

  // eslint-disable-next-line require-jsdoc
  function RemoteMixedStream(info) {
    var _this;

    _classCallCheck(this, RemoteMixedStream);

    if (info.type !== 'mixed') {
      throw new TypeError('Not a mixed stream');
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RemoteMixedStream).call(this, info.id, undefined, undefined, new StreamModule.StreamSourceInfo('mixed', 'mixed')));
    _this.settings = StreamUtilsModule.convertToPublicationSettings(info.media);
    _this.extraCapabilities = new StreamUtilsModule.convertToSubscriptionCapabilities(info.media);
    return _this;
  }

  return RemoteMixedStream;
}(StreamModule.RemoteStream);
/**
 * @class ActiveAudioInputChangeEvent
 * @classDesc Class ActiveAudioInputChangeEvent represents an active audio input change event.
 * @memberof Owt.Conference
 * @hideconstructor
 */


exports.RemoteMixedStream = RemoteMixedStream;

var ActiveAudioInputChangeEvent =
/*#__PURE__*/
function (_OwtEvent) {
  _inherits(ActiveAudioInputChangeEvent, _OwtEvent);

  // eslint-disable-next-line require-jsdoc
  function ActiveAudioInputChangeEvent(type, init) {
    var _this2;

    _classCallCheck(this, ActiveAudioInputChangeEvent);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ActiveAudioInputChangeEvent).call(this, type));
    /**
     * @member {string} activeAudioInputStreamId
     * @instance
     * @memberof Owt.Conference.ActiveAudioInputChangeEvent
     * @desc The ID of input stream(of the mixed stream) whose audio is active.
     */

    _this2.activeAudioInputStreamId = init.activeAudioInputStreamId;
    return _this2;
  }

  return ActiveAudioInputChangeEvent;
}(_event.OwtEvent);
/**
 * @class LayoutChangeEvent
 * @classDesc Class LayoutChangeEvent represents an video layout change event.
 * @memberof Owt.Conference
 * @hideconstructor
 */


exports.ActiveAudioInputChangeEvent = ActiveAudioInputChangeEvent;

var LayoutChangeEvent =
/*#__PURE__*/
function (_OwtEvent2) {
  _inherits(LayoutChangeEvent, _OwtEvent2);

  // eslint-disable-next-line require-jsdoc
  function LayoutChangeEvent(type, init) {
    var _this3;

    _classCallCheck(this, LayoutChangeEvent);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(LayoutChangeEvent).call(this, type));
    /**
     * @member {object} layout
     * @instance
     * @memberof Owt.Conference.LayoutChangeEvent
     * @desc Current video's layout. It's an array of map which maps each stream to a region.
     */

    _this3.layout = init.layout;
    return _this3;
  }

  return LayoutChangeEvent;
}(_event.OwtEvent);

exports.LayoutChangeEvent = LayoutChangeEvent;

},{"../base/event.js":3,"../base/stream.js":10,"./streamutils.js":20}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Participant = void 0;

var EventModule = _interopRequireWildcard(require("../base/event.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

'use strict';
/**
 * @class Participant
 * @memberOf Owt.Conference
 * @classDesc The Participant defines a participant in a conference.
 * Events:
 *
 * | Event Name      | Argument Type      | Fired when       |
 * | ----------------| ------------------ | ---------------- |
 * | left            | Owt.Base.OwtEvent  | The participant left the conference. |
 *
 * @extends Owt.Base.EventDispatcher
 * @hideconstructor
 */


var Participant =
/*#__PURE__*/
function (_EventModule$EventDis) {
  _inherits(Participant, _EventModule$EventDis);

  // eslint-disable-next-line require-jsdoc
  function Participant(id, role, userId) {
    var _this;

    _classCallCheck(this, Participant);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Participant).call(this));
    /**
     * @member {string} id
     * @instance
     * @memberof Owt.Conference.Participant
     * @desc The ID of the participant. It varies when a single user join different conferences.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'id', {
      configurable: false,
      writable: false,
      value: id
    });
    /**
     * @member {string} role
     * @instance
     * @memberof Owt.Conference.Participant
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'role', {
      configurable: false,
      writable: false,
      value: role
    });
    /**
     * @member {string} userId
     * @instance
     * @memberof Owt.Conference.Participant
     * @desc The user ID of the participant. It can be integrated into existing account management system.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'userId', {
      configurable: false,
      writable: false,
      value: userId
    });
    return _this;
  }

  return Participant;
}(EventModule.EventDispatcher);

exports.Participant = Participant;

},{"../base/event.js":3}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SioSignaling = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var EventModule = _interopRequireWildcard(require("../base/event.js"));

var _error = require("./error.js");

var _base = require("../base/base64.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

'use strict';

var reconnectionAttempts = 10; // eslint-disable-next-line require-jsdoc

function handleResponse(status, data, resolve, reject) {
  if (status === 'ok' || status === 'success') {
    resolve(data);
  } else if (status === 'error') {
    reject(data);
  } else {
    _logger.default.error('MCU returns unknown ack.');
  }
}
/**
 * @class SioSignaling
 * @classdesc Socket.IO signaling channel for ConferenceClient. It is not recommended to directly access this class.
 * @memberof Owt.Conference
 * @extends Owt.Base.EventDispatcher
 * @constructor
 */


var SioSignaling =
/*#__PURE__*/
function (_EventModule$EventDis) {
  _inherits(SioSignaling, _EventModule$EventDis);

  // eslint-disable-next-line require-jsdoc
  function SioSignaling() {
    var _this;

    _classCallCheck(this, SioSignaling);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SioSignaling).call(this));
    _this._socket = null;
    _this._loggedIn = false;
    _this._reconnectTimes = 0;
    _this._reconnectionTicket = null;
    _this._refreshReconnectionTicket = null;
    return _this;
  }
  /**
   * @function connect
   * @instance
   * @desc Connect to a portal.
   * @memberof Oms.Conference.SioSignaling
   * @return {Promise<Object, Error>} Return a promise resolved with the data returned by portal if successfully logged in. Or return a promise rejected with a newly created Oms.Error if failed.
   * @param {string} host Host of the portal.
   * @param {string} isSecured Is secure connection or not.
   * @param {string} loginInfo Infomation required for logging in.
   * @private.
   */


  _createClass(SioSignaling, [{
    key: "connect",
    value: function connect(host, isSecured, loginInfo) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var opts = {
          'reconnection': true,
          'reconnectionAttempts': reconnectionAttempts,
          'force new connection': true
        };
        _this2._socket = io(host, opts);
        ['participant', 'text', 'stream', 'progress'].forEach(function (notification) {
          _this2._socket.on(notification, function (data) {
            _this2.dispatchEvent(new EventModule.MessageEvent('data', {
              message: {
                notification: notification,
                data: data
              }
            }));
          });
        });

        _this2._socket.on('reconnecting', function () {
          _this2._reconnectTimes++;
        });

        _this2._socket.on('reconnect_failed', function () {
          if (_this2._reconnectTimes >= reconnectionAttempts) {
            _this2.dispatchEvent(new EventModule.OwtEvent('disconnect'));
          }
        });

        _this2._socket.on('connect_error', function (e) {
          reject("connect_error:".concat(host));
        });

        _this2._socket.on('drop', function () {
          _this2._reconnectTimes = reconnectionAttempts;
        });

        _this2._socket.on('disconnect', function () {
          _this2._clearReconnectionTask();

          if (_this2._reconnectTimes >= reconnectionAttempts) {
            _this2._loggedIn = false;

            _this2.dispatchEvent(new EventModule.OwtEvent('disconnect'));
          }
        });

        _this2._socket.emit('login', loginInfo, function (status, data) {
          if (status === 'ok') {
            _this2._loggedIn = true;

            _this2._onReconnectionTicket(data.reconnectionTicket);

            _this2._socket.on('connect', function () {
              // re-login with reconnection ticket.
              _this2._socket.emit('relogin', _this2._reconnectionTicket, function (status, data) {
                if (status === 'ok') {
                  _this2._reconnectTimes = 0;

                  _this2._onReconnectionTicket(data);
                } else {
                  _this2.dispatchEvent(new EventModule.OwtEvent('disconnect'));
                }
              });
            });
          }

          handleResponse(status, data, resolve, reject);
        });
      });
    }
    /**
     * @function disconnect
     * @instance
     * @desc Disconnect from a portal.
     * @memberof Oms.Conference.SioSignaling
     * @return {Promise<Object, Error>} Return a promise resolved with the data returned by portal if successfully disconnected. Or return a promise rejected with a newly created Oms.Error if failed.
     * @private.
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      var _this3 = this;

      if (!this._socket || this._socket.disconnected) {
        return Promise.reject(new _error.ConferenceError('Portal is not connected.'));
      }

      return new Promise(function (resolve, reject) {
        _this3._socket.emit('logout', function (status, data) {
          // Maximize the reconnect times to disable reconnection.
          _this3._reconnectTimes = reconnectionAttempts;

          _this3._socket.disconnect();

          handleResponse(status, data, resolve, reject);
        });
      });
    }
    /**
     * @function send
     * @instance
     * @desc Send data to portal.
     * @memberof Oms.Conference.SioSignaling
     * @return {Promise<Object, Error>} Return a promise resolved with the data returned by portal. Or return a promise rejected with a newly created Oms.Error if failed to send the message.
     * @param {string} requestName Name defined in client-server protocol.
     * @param {string} requestData Data format is defined in client-server protocol.
     * @private.
     */

  }, {
    key: "send",
    value: function send(requestName, requestData) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4._socket.emit(requestName, requestData, function (status, data) {
          handleResponse(status, data, resolve, reject);
        });
      });
    }
    /**
     * @function _onReconnectionTicket
     * @instance
     * @desc Parse reconnection ticket and schedule ticket refreshing.
     * @memberof Owt.Conference.SioSignaling
     * @private.
     */

  }, {
    key: "_onReconnectionTicket",
    value: function _onReconnectionTicket(ticketString) {
      var _this5 = this;

      this._reconnectionTicket = ticketString;
      var ticket = JSON.parse(_base.Base64.decodeBase64(ticketString)); // Refresh ticket 1 min or 10 seconds before it expires.

      var now = Date.now();
      var millisecondsInOneMinute = 60 * 1000;
      var millisecondsInTenSeconds = 10 * 1000;

      if (ticket.notAfter <= now - millisecondsInTenSeconds) {
        _logger.default.warning('Reconnection ticket expires too soon.');

        return;
      }

      var refreshAfter = ticket.notAfter - now - millisecondsInOneMinute;

      if (refreshAfter < 0) {
        refreshAfter = ticket.notAfter - now - millisecondsInTenSeconds;
      }

      this._clearReconnectionTask();

      this._refreshReconnectionTicket = setTimeout(function () {
        _this5._socket.emit('refreshReconnectionTicket', function (status, data) {
          if (status !== 'ok') {
            _logger.default.warning('Failed to refresh reconnection ticket.');

            return;
          }

          _this5._onReconnectionTicket(data);
        });
      }, refreshAfter);
    }
  }, {
    key: "_clearReconnectionTask",
    value: function _clearReconnectionTask() {
      clearTimeout(this._refreshReconnectionTicket);
      this._refreshReconnectionTicket = null;
    }
  }]);

  return SioSignaling;
}(EventModule.EventDispatcher);

exports.SioSignaling = SioSignaling;

},{"../base/base64.js":1,"../base/event.js":3,"../base/logger.js":5,"./error.js":14}],20:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file doesn't have public APIs.

/* eslint-disable valid-jsdoc */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToPublicationSettings = convertToPublicationSettings;
exports.convertToSubscriptionCapabilities = convertToSubscriptionCapabilities;

var PublicationModule = _interopRequireWildcard(require("../base/publication.js"));

var MediaFormatModule = _interopRequireWildcard(require("../base/mediaformat.js"));

var CodecModule = _interopRequireWildcard(require("../base/codec.js"));

var SubscriptionModule = _interopRequireWildcard(require("./subscription.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * @function extractBitrateMultiplier
 * @desc Extract bitrate multiplier from a string like "x0.2".
 * @return {Promise<Object, Error>} The float number after "x".
 * @private
 */
function extractBitrateMultiplier(input) {
  if (typeof input !== 'string' || !input.startsWith('x')) {
    L.Logger.warning('Invalid bitrate multiplier input.');
    return 0;
  }

  return Number.parseFloat(input.replace(/^x/, ''));
} // eslint-disable-next-line require-jsdoc


function sortNumbers(x, y) {
  return x - y;
} // eslint-disable-next-line require-jsdoc


function sortResolutions(x, y) {
  if (x.width !== y.width) {
    return x.width - y.width;
  } else {
    return x.height - y.height;
  }
}
/**
 * @function convertToPublicationSettings
 * @desc Convert mediaInfo received from server to PublicationSettings.
 * @private
 */


function convertToPublicationSettings(mediaInfo) {
  var audio = [],
      video = [];
  var audioCodec, videoCodec, resolution, framerate, bitrate, keyFrameInterval, rid;

  if (mediaInfo.audio) {
    if (mediaInfo.audio.format) {
      audioCodec = new CodecModule.AudioCodecParameters(mediaInfo.audio.format.codec, mediaInfo.audio.format.channelNum, mediaInfo.audio.format.sampleRate);
    }

    audio.push(new PublicationModule.AudioPublicationSettings(audioCodec));
  }

  if (mediaInfo.video) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = mediaInfo.video.original[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var videoInfo = _step.value;

        if (videoInfo.format) {
          videoCodec = new CodecModule.VideoCodecParameters(videoInfo.format.codec, videoInfo.format.profile);
        }

        if (videoInfo.parameters) {
          if (videoInfo.parameters.resolution) {
            resolution = new MediaFormatModule.Resolution(videoInfo.parameters.resolution.width, videoInfo.parameters.resolution.height);
          }

          framerate = videoInfo.parameters.framerate;
          bitrate = videoInfo.parameters.bitrate * 1000;
          keyFrameInterval = videoInfo.parameters.keyFrameInterval;
        }

        if (videoInfo.simulcastRid) {
          rid = videoInfo.simulcastRid;
        }

        video.push(new PublicationModule.VideoPublicationSettings(videoCodec, resolution, framerate, bitrate, keyFrameInterval, rid));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  return new PublicationModule.PublicationSettings(audio, video);
}
/**
 * @function convertToSubscriptionCapabilities
 * @desc Convert mediaInfo received from server to SubscriptionCapabilities.
 * @private
 */


function convertToSubscriptionCapabilities(mediaInfo) {
  var audio;
  var video;

  if (mediaInfo.audio) {
    var audioCodecs = [];

    if (mediaInfo.audio && mediaInfo.audio.optional && mediaInfo.audio.optional.format) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = mediaInfo.audio.optional.format[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var audioCodecInfo = _step2.value;
          var audioCodec = new CodecModule.AudioCodecParameters(audioCodecInfo.codec, audioCodecInfo.channelNum, audioCodecInfo.sampleRate);
          audioCodecs.push(audioCodec);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    audioCodecs.sort();
    audio = new SubscriptionModule.AudioSubscriptionCapabilities(audioCodecs);
  }

  if (mediaInfo.video) {
    var videoCodecs = [];

    if (mediaInfo.video && mediaInfo.video.optional && mediaInfo.video.optional.format) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = mediaInfo.video.optional.format[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var videoCodecInfo = _step3.value;
          var videoCodec = new CodecModule.VideoCodecParameters(videoCodecInfo.codec, videoCodecInfo.profile);
          videoCodecs.push(videoCodec);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    videoCodecs.sort();

    if (mediaInfo.video && mediaInfo.video.optional && mediaInfo.video.optional.parameters) {
      var resolutions = Array.from(mediaInfo.video.optional.parameters.resolution, function (r) {
        return new MediaFormatModule.Resolution(r.width, r.height);
      });
      resolutions.sort(sortResolutions);
      var bitrates = Array.from(mediaInfo.video.optional.parameters.bitrate, function (bitrate) {
        return extractBitrateMultiplier(bitrate);
      });
      bitrates.push(1.0);
      bitrates.sort(sortNumbers);
      var frameRates = JSON.parse(JSON.stringify(mediaInfo.video.optional.parameters.framerate));
      frameRates.sort(sortNumbers);
      var keyFrameIntervals = JSON.parse(JSON.stringify(mediaInfo.video.optional.parameters.keyFrameInterval));
      keyFrameIntervals.sort(sortNumbers);
      video = new SubscriptionModule.VideoSubscriptionCapabilities(videoCodecs, resolutions, frameRates, bitrates, keyFrameIntervals);
    } else {
      video = new SubscriptionModule.VideoSubscriptionCapabilities(videoCodecs, [], [], [1.0], []);
    }
  }

  return new SubscriptionModule.SubscriptionCapabilities(audio, video);
}

},{"../base/codec.js":2,"../base/mediaformat.js":6,"../base/publication.js":8,"./subscription.js":21}],21:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subscription = exports.SubscriptionUpdateOptions = exports.VideoSubscriptionUpdateOptions = exports.SubscribeOptions = exports.VideoSubscriptionConstraints = exports.AudioSubscriptionConstraints = exports.SubscriptionCapabilities = exports.VideoSubscriptionCapabilities = exports.AudioSubscriptionCapabilities = void 0;

var MediaFormatModule = _interopRequireWildcard(require("../base/mediaformat.js"));

var CodecModule = _interopRequireWildcard(require("../base/codec.js"));

var _event = require("../base/event.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioSubscriptionCapabilities
 * @memberOf Owt.Conference
 * @classDesc Represents the audio capability for subscription.
 * @hideconstructor
 */
var AudioSubscriptionCapabilities = // eslint-disable-next-line require-jsdoc
function AudioSubscriptionCapabilities(codecs) {
  _classCallCheck(this, AudioSubscriptionCapabilities);

  /**
   * @member {Array.<Owt.Base.AudioCodecParameters>} codecs
   * @instance
   * @memberof Owt.Conference.AudioSubscriptionCapabilities
   */
  this.codecs = codecs;
};
/**
 * @class VideoSubscriptionCapabilities
 * @memberOf Owt.Conference
 * @classDesc Represents the video capability for subscription.
 * @hideconstructor
 */


exports.AudioSubscriptionCapabilities = AudioSubscriptionCapabilities;

var VideoSubscriptionCapabilities = // eslint-disable-next-line require-jsdoc
function VideoSubscriptionCapabilities(codecs, resolutions, frameRates, bitrateMultipliers, keyFrameIntervals) {
  _classCallCheck(this, VideoSubscriptionCapabilities);

  /**
   * @member {Array.<Owt.Base.VideoCodecParameters>} codecs
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionCapabilities
   */
  this.codecs = codecs;
  /**
   * @member {Array.<Owt.Base.Resolution>} resolutions
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionCapabilities
   */

  this.resolutions = resolutions;
  /**
   * @member {Array.<number>} frameRates
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionCapabilities
   */

  this.frameRates = frameRates;
  /**
   * @member {Array.<number>} bitrateMultipliers
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionCapabilities
   */

  this.bitrateMultipliers = bitrateMultipliers;
  /**
   * @member {Array.<number>} keyFrameIntervals
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionCapabilities
   */

  this.keyFrameIntervals = keyFrameIntervals;
};
/**
 * @class SubscriptionCapabilities
 * @memberOf Owt.Conference
 * @classDesc Represents the capability for subscription.
 * @hideconstructor
 */


exports.VideoSubscriptionCapabilities = VideoSubscriptionCapabilities;

var SubscriptionCapabilities = // eslint-disable-next-line require-jsdoc
function SubscriptionCapabilities(audio, video) {
  _classCallCheck(this, SubscriptionCapabilities);

  /**
   * @member {?Owt.Conference.AudioSubscriptionCapabilities} audio
   * @instance
   * @memberof Owt.Conference.SubscriptionCapabilities
   */
  this.audio = audio;
  /**
   * @member {?Owt.Conference.VideoSubscriptionCapabilities} video
   * @instance
   * @memberof Owt.Conference.SubscriptionCapabilities
   */

  this.video = video;
};
/**
 * @class AudioSubscriptionConstraints
 * @memberOf Owt.Conference
 * @classDesc Represents the audio constraints for subscription.
 * @hideconstructor
 */


exports.SubscriptionCapabilities = SubscriptionCapabilities;

var AudioSubscriptionConstraints = // eslint-disable-next-line require-jsdoc
function AudioSubscriptionConstraints(codecs) {
  _classCallCheck(this, AudioSubscriptionConstraints);

  /**
   * @member {?Array.<Owt.Base.AudioCodecParameters>} codecs
   * @instance
   * @memberof Owt.Conference.AudioSubscriptionConstraints
   * @desc Codecs accepted. If none of `codecs` supported by both sides, connection fails. Leave it undefined will use all possible codecs.
   */
  this.codecs = codecs;
};
/**
 * @class VideoSubscriptionConstraints
 * @memberOf Owt.Conference
 * @classDesc Represents the video constraints for subscription.
 * @hideconstructor
 */


exports.AudioSubscriptionConstraints = AudioSubscriptionConstraints;

var VideoSubscriptionConstraints = // eslint-disable-next-line require-jsdoc
function VideoSubscriptionConstraints(codecs, resolution, frameRate, bitrateMultiplier, keyFrameInterval, rid) {
  _classCallCheck(this, VideoSubscriptionConstraints);

  /**
   * @member {?Array.<Owt.Base.VideoCodecParameters>} codecs
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionConstraints
   * @desc Codecs accepted. If none of `codecs` supported by both sides, connection fails. Leave it undefined will use all possible codecs.
   */
  this.codecs = codecs;
  /**
   * @member {?Owt.Base.Resolution} resolution
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionConstraints
   * @desc Only resolutions listed in Owt.Conference.VideoSubscriptionCapabilities are allowed.
   */

  this.resolution = resolution;
  /**
   * @member {?number} frameRate
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionConstraints
   * @desc Only frameRates listed in Owt.Conference.VideoSubscriptionCapabilities are allowed.
   */

  this.frameRate = frameRate;
  /**
   * @member {?number} bitrateMultiplier
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionConstraints
   * @desc Only bitrateMultipliers listed in Owt.Conference.VideoSubscriptionCapabilities are allowed.
   */

  this.bitrateMultiplier = bitrateMultiplier;
  /**
   * @member {?number} keyFrameInterval
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionConstraints
   * @desc Only keyFrameIntervals listed in Owt.Conference.VideoSubscriptionCapabilities are allowed.
   */

  this.keyFrameInterval = keyFrameInterval;
  /**
   * @member {?number} rid
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionConstraints
   * @desc Restriction identifier to identify the RTP Streams within an RTP session. When rid is specified, other constraints will be ignored.
   */

  this.rid = rid;
};
/**
 * @class SubscribeOptions
 * @memberOf Owt.Conference
 * @classDesc SubscribeOptions defines options for subscribing a Owt.Base.RemoteStream.
 */


exports.VideoSubscriptionConstraints = VideoSubscriptionConstraints;

var SubscribeOptions = // eslint-disable-next-line require-jsdoc
function SubscribeOptions(audio, video) {
  _classCallCheck(this, SubscribeOptions);

  /**
   * @member {?Owt.Conference.AudioSubscriptionConstraints} audio
   * @instance
   * @memberof Owt.Conference.SubscribeOptions
   */
  this.audio = audio;
  /**
   * @member {?Owt.Conference.VideoSubscriptionConstraints} video
   * @instance
   * @memberof Owt.Conference.SubscribeOptions
   */

  this.video = video;
};
/**
 * @class VideoSubscriptionUpdateOptions
 * @memberOf Owt.Conference
 * @classDesc VideoSubscriptionUpdateOptions defines options for updating a subscription's video part.
 * @hideconstructor
 */


exports.SubscribeOptions = SubscribeOptions;

var VideoSubscriptionUpdateOptions = // eslint-disable-next-line require-jsdoc
function VideoSubscriptionUpdateOptions() {
  _classCallCheck(this, VideoSubscriptionUpdateOptions);

  /**
   * @member {?Owt.Base.Resolution} resolution
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionUpdateOptions
   * @desc Only resolutions listed in VideoSubscriptionCapabilities are allowed.
   */
  this.resolution = undefined;
  /**
   * @member {?number} frameRates
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionUpdateOptions
   * @desc Only frameRates listed in VideoSubscriptionCapabilities are allowed.
   */

  this.frameRate = undefined;
  /**
   * @member {?number} bitrateMultipliers
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionUpdateOptions
   * @desc Only bitrateMultipliers listed in VideoSubscriptionCapabilities are allowed.
   */

  this.bitrateMultipliers = undefined;
  /**
   * @member {?number} keyFrameIntervals
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionUpdateOptions
   * @desc Only keyFrameIntervals listed in VideoSubscriptionCapabilities are allowed.
   */

  this.keyFrameInterval = undefined;
};
/**
 * @class SubscriptionUpdateOptions
 * @memberOf Owt.Conference
 * @classDesc SubscriptionUpdateOptions defines options for updating a subscription.
 * @hideconstructor
 */


exports.VideoSubscriptionUpdateOptions = VideoSubscriptionUpdateOptions;

var SubscriptionUpdateOptions = // eslint-disable-next-line require-jsdoc
function SubscriptionUpdateOptions() {
  _classCallCheck(this, SubscriptionUpdateOptions);

  /**
   * @member {?VideoSubscriptionUpdateOptions} video
   * @instance
   * @memberof Owt.Conference.SubscriptionUpdateOptions
   */
  this.video = undefined;
};
/**
 * @class Subscription
 * @memberof Owt.Conference
 * @classDesc Subscription is a receiver for receiving a stream.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when       |
 * | ----------------| ---------------- | ---------------- |
 * | ended           | Event            | Subscription is ended. |
 * | error           | ErrorEvent       | An error occurred on the subscription. |
 * | mute            | MuteEvent        | Publication is muted. Remote side stopped sending audio and/or video data. |
 * | unmute          | MuteEvent        | Publication is unmuted. Remote side continued sending audio and/or video data. |
 *
 * @extends Owt.Base.EventDispatcher
 * @hideconstructor
 */


exports.SubscriptionUpdateOptions = SubscriptionUpdateOptions;

var Subscription =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(Subscription, _EventDispatcher);

  // eslint-disable-next-line require-jsdoc
  function Subscription(id, stop, getStats, mute, unmute, applyOptions) {
    var _this;

    _classCallCheck(this, Subscription);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Subscription).call(this));

    if (!id) {
      throw new TypeError('ID cannot be null or undefined.');
    }
    /**
     * @member {string} id
     * @instance
     * @memberof Owt.Conference.Subscription
     */


    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'id', {
      configurable: false,
      writable: false,
      value: id
    });
    /**
     * @function stop
     * @instance
     * @desc Stop certain subscription. Once a subscription is stopped, it cannot be recovered.
     * @memberof Owt.Conference.Subscription
     * @returns {undefined}
     */

    _this.stop = stop;
    /**
     * @function getStats
     * @instance
     * @desc Get stats of underlying PeerConnection.
     * @memberof Owt.Conference.Subscription
     * @returns {Promise<RTCStatsReport, Error>}
     */

    _this.getStats = getStats;
    /**
     * @function mute
     * @instance
     * @desc Stop reeving data from remote endpoint.
     * @memberof Owt.Conference.Subscription
     * @param {Owt.Base.TrackKind } kind Kind of tracks to be muted.
     * @returns {Promise<undefined, Error>}
     */

    _this.mute = mute;
    /**
     * @function unmute
     * @instance
     * @desc Continue reeving data from remote endpoint.
     * @memberof Owt.Conference.Subscription
     * @param {Owt.Base.TrackKind } kind Kind of tracks to be unmuted.
     * @returns {Promise<undefined, Error>}
     */

    _this.unmute = unmute;
    /**
     * @function applyOptions
     * @instance
     * @desc Update subscription with given options.
     * @memberof Owt.Conference.Subscription
     * @param {Owt.Conference.SubscriptionUpdateOptions } options Subscription update options.
     * @returns {Promise<undefined, Error>}
     */

    _this.applyOptions = applyOptions;
    return _this;
  }

  return Subscription;
}(_event.EventDispatcher);

exports.Subscription = Subscription;

},{"../base/codec.js":2,"../base/event.js":3,"../base/mediaformat.js":6}],22:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Conference = exports.P2P = exports.Base = void 0;

var base = _interopRequireWildcard(require("./base/export.js"));

var p2p = _interopRequireWildcard(require("./p2p/export.js"));

var conference = _interopRequireWildcard(require("./conference/export.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Base objects for both P2P and conference.
 * @namespace Owt.Base
 */
var Base = base;
/**
 * P2P WebRTC connections.
 * @namespace Owt.P2P
 */

exports.Base = Base;
var P2P = p2p;
/**
 * WebRTC connections with conference server.
 * @namespace Owt.Conference
 */

exports.P2P = P2P;
var Conference = conference;
exports.Conference = Conference;

},{"./base/export.js":4,"./conference/export.js":15,"./p2p/export.js":24}],23:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorByCode = getErrorByCode;
exports.P2PError = exports.errors = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var errors = {
  // 2100-2999 for P2P errors
  // 2100-2199 for connection errors
  // 2100-2109 for server errors
  P2P_CONN_SERVER_UNKNOWN: {
    code: 2100,
    message: 'Server unknown error.'
  },
  P2P_CONN_SERVER_UNAVAILABLE: {
    code: 2101,
    message: 'Server is unavaliable.'
  },
  P2P_CONN_SERVER_BUSY: {
    code: 2102,
    message: 'Server is too busy.'
  },
  P2P_CONN_SERVER_NOT_SUPPORTED: {
    code: 2103,
    message: 'Method has not been supported by server.'
  },
  // 2110-2119 for client errors
  P2P_CONN_CLIENT_UNKNOWN: {
    code: 2110,
    message: 'Client unknown error.'
  },
  P2P_CONN_CLIENT_NOT_INITIALIZED: {
    code: 2111,
    message: 'Connection is not initialized.'
  },
  // 2120-2129 for authentication errors
  P2P_CONN_AUTH_UNKNOWN: {
    code: 2120,
    message: 'Authentication unknown error.'
  },
  P2P_CONN_AUTH_FAILED: {
    code: 2121,
    message: 'Wrong username or token.'
  },
  // 2200-2299 for message transport errors
  P2P_MESSAGING_TARGET_UNREACHABLE: {
    code: 2201,
    message: 'Remote user cannot be reached.'
  },
  P2P_CLIENT_DENIED: {
    code: 2202,
    message: 'User is denied.'
  },
  // 2301-2399 for chat room errors
  // 2401-2499 for client errors
  P2P_CLIENT_UNKNOWN: {
    code: 2400,
    message: 'Unknown errors.'
  },
  P2P_CLIENT_UNSUPPORTED_METHOD: {
    code: 2401,
    message: 'This method is unsupported in current browser.'
  },
  P2P_CLIENT_ILLEGAL_ARGUMENT: {
    code: 2402,
    message: 'Illegal argument.'
  },
  P2P_CLIENT_INVALID_STATE: {
    code: 2403,
    message: 'Invalid peer state.'
  },
  P2P_CLIENT_NOT_ALLOWED: {
    code: 2404,
    message: 'Remote user is not allowed.'
  },
  // 2501-2599 for WebRTC erros.
  P2P_WEBRTC_UNKNOWN: {
    code: 2500,
    message: 'WebRTC error.'
  },
  P2P_WEBRTC_SDP: {
    code: 2502,
    message: 'SDP error.'
  }
};
/**
 * @function getErrorByCode
 * @desc Get error object by error code.
 * @param {string} errorCode Error code.
 * @return {Owt.P2P.Error} Error object
 * @private
 */

exports.errors = errors;

function getErrorByCode(errorCode) {
  var codeErrorMap = {
    2100: errors.P2P_CONN_SERVER_UNKNOWN,
    2101: errors.P2P_CONN_SERVER_UNAVAILABLE,
    2102: errors.P2P_CONN_SERVER_BUSY,
    2103: errors.P2P_CONN_SERVER_NOT_SUPPORTED,
    2110: errors.P2P_CONN_CLIENT_UNKNOWN,
    2111: errors.P2P_CONN_CLIENT_NOT_INITIALIZED,
    2120: errors.P2P_CONN_AUTH_UNKNOWN,
    2121: errors.P2P_CONN_AUTH_FAILED,
    2201: errors.P2P_MESSAGING_TARGET_UNREACHABLE,
    2400: errors.P2P_CLIENT_UNKNOWN,
    2401: errors.P2P_CLIENT_UNSUPPORTED_METHOD,
    2402: errors.P2P_CLIENT_ILLEGAL_ARGUMENT,
    2403: errors.P2P_CLIENT_INVALID_STATE,
    2404: errors.P2P_CLIENT_NOT_ALLOWED,
    2500: errors.P2P_WEBRTC_UNKNOWN,
    2501: errors.P2P_WEBRTC_SDP
  };
  return codeErrorMap[errorCode];
}
/**
 * @class P2PError
 * @classDesc The P2PError object represents an error in P2P mode.
 * @memberOf Owt.P2P
 * @hideconstructor
 */


var P2PError =
/*#__PURE__*/
function (_Error) {
  _inherits(P2PError, _Error);

  // eslint-disable-next-line require-jsdoc
  function P2PError(error, message) {
    var _this;

    _classCallCheck(this, P2PError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(P2PError).call(this, message));

    if (typeof error === 'number') {
      _this.code = error;
    } else {
      _this.code = error.code;
    }

    return _this;
  }

  return P2PError;
}(_wrapNativeSuper(Error));

exports.P2PError = P2PError;

},{}],24:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "P2PClient", {
  enumerable: true,
  get: function get() {
    return _p2pclient.default;
  }
});
Object.defineProperty(exports, "P2PError", {
  enumerable: true,
  get: function get() {
    return _error.P2PError;
  }
});

var _p2pclient = _interopRequireDefault(require("./p2pclient.js"));

var _error = require("./error.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./error.js":23,"./p2pclient.js":25}],25:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

/* global Map, Promise */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _event = require("../base/event.js");

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var ErrorModule = _interopRequireWildcard(require("./error.js"));

var _peerconnectionChannel = _interopRequireDefault(require("./peerconnection-channel.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConnectionState = {
  READY: 1,
  CONNECTING: 2,
  CONNECTED: 3
};
/* eslint-disable no-unused-vars */

/**
 * @class P2PClientConfiguration
 * @classDesc Configuration for P2PClient.
 * @memberOf Owt.P2P
 * @hideconstructor
 */

var P2PClientConfiguration = function P2PClientConfiguration() {
  /**
   * @member {?Array<Owt.Base.AudioEncodingParameters>} audioEncoding
   * @instance
   * @desc Encoding parameters for publishing audio tracks.
   * @memberof Owt.P2P.P2PClientConfiguration
   */
  this.audioEncoding = undefined;
  /**
   * @member {?Array<Owt.Base.VideoEncodingParameters>} videoEncoding
   * @instance
   * @desc Encoding parameters for publishing video tracks.
   * @memberof Owt.P2P.P2PClientConfiguration
   */

  this.videoEncoding = undefined;
  /**
   * @member {?RTCConfiguration} rtcConfiguration
   * @instance
   * @memberof Owt.P2P.P2PClientConfiguration
   * @desc It will be used for creating PeerConnection.
   * @see {@link https://www.w3.org/TR/webrtc/#rtcconfiguration-dictionary|RTCConfiguration Dictionary of WebRTC 1.0}.
   * @example
   * // Following object can be set to p2pClientConfiguration.rtcConfiguration.
   * {
   *   iceServers: [{
   *      urls: "stun:example.com:3478"
   *   }, {
   *     urls: [
   *       "turn:example.com:3478?transport=udp",
   *       "turn:example.com:3478?transport=tcp"
   *     ],
   *      credential: "password",
   *      username: "username"
   *   }
   * }
   */

  this.rtcConfiguration = undefined;
};
/* eslint-enable no-unused-vars */

/**
 * @class P2PClient
 * @classDesc The P2PClient handles PeerConnections between different clients.
 * Events:
 *
 * | Event Name            | Argument Type    | Fired when       |
 * | --------------------- | ---------------- | ---------------- |
 * | streamadded           | StreamEvent      | A new stream is sent from remote endpoint. |
 * | messagereceived       | MessageEvent     | A new message is received. |
 * | serverdisconnected    | OwtEvent         | Disconnected from signaling server. |
 *
 * @memberof Owt.P2P
 * @extends Owt.Base.EventDispatcher
 * @constructor
 * @param {?Owt.P2P.P2PClientConfiguration } configuration Configuration for Owt.P2P.P2PClient.
 * @param {Object} signalingChannel A channel for sending and receiving signaling messages.
 */


var P2PClient = function P2PClient(configuration, signalingChannel) {
  Object.setPrototypeOf(this, new _event.EventDispatcher());
  var config = configuration;
  var signaling = signalingChannel;
  var channels = new Map(); // Map of PeerConnectionChannels.

  var self = this;
  var state = ConnectionState.READY;
  var myId;

  signaling.onMessage = function (origin, message) {
    _logger.default.debug('Received signaling message from ' + origin + ': ' + message);

    var data = JSON.parse(message);

    if (data.type === 'chat-closed') {
      if (channels.has(origin)) {
        getOrCreateChannel(origin).onMessage(data);
        channels.delete(origin);
      }

      return;
    }

    if (self.allowedRemoteIds.indexOf(origin) >= 0) {
      getOrCreateChannel(origin).onMessage(data);
    } else {
      sendSignalingMessage(origin, 'chat-closed', ErrorModule.errors.P2P_CLIENT_DENIED);
    }
  };

  signaling.onServerDisconnected = function () {
    state = ConnectionState.READY;
    self.dispatchEvent(new _event.OwtEvent('serverdisconnected'));
  };
  /**
   * @member {array} allowedRemoteIds
   * @memberof Owt.P2P.P2PClient
   * @instance
   * @desc Only allowed remote endpoint IDs are able to publish stream or send message to current endpoint. Removing an ID from allowedRemoteIds does stop existing connection with certain endpoint. Please call stop to stop the PeerConnection.
   */


  this.allowedRemoteIds = [];
  /**
   * @function connect
   * @instance
   * @desc Connect to signaling server. Since signaling can be customized, this method does not define how a token looks like. SDK passes token to signaling channel without changes.
   * @memberof Owt.P2P.P2PClient
   * @param {string} token A token for connecting to signaling server. The format of this token depends on signaling server's requirement.
   * @return {Promise<object, Error>} It returns a promise resolved with an object returned by signaling channel once signaling channel reports connection has been established.
   */

  this.connect = function (token) {
    if (state === ConnectionState.READY) {
      state = ConnectionState.CONNECTING;
    } else {
      _logger.default.warning('Invalid connection state: ' + state);

      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE));
    }

    return new Promise(function (resolve, reject) {
      signaling.connect(token).then(function (id) {
        myId = id;
        state = ConnectionState.CONNECTED;
        resolve(myId);
      }, function (errCode) {
        reject(new ErrorModule.P2PError(ErrorModule.getErrorByCode(errCode)));
      });
    });
  };
  /**
   * @function disconnect
   * @instance
   * @desc Disconnect from the signaling channel. It stops all existing sessions with remote endpoints.
   * @memberof Owt.P2P.P2PClient
   * @returns {Promise<undefined, Error>}
   */


  this.disconnect = function () {
    if (state == ConnectionState.READY) {
      return;
    }

    channels.forEach(function (channel) {
      channel.stop();
    });
    channels.clear();
    signaling.disconnect();
  };
  /**
   * @function publish
   * @instance
   * @desc Publish a stream to a remote endpoint.
   * @memberof Owt.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @param {Owt.Base.LocalStream} stream An Owt.Base.LocalStream to be published.
   * @return {Promise<Owt.Base.Publication, Error>} A promised that resolves when remote side received the certain stream. However, remote endpoint may not display this stream, or ignore it.
   */


  this.publish = function (remoteId, stream) {
    if (state !== ConnectionState.CONNECTED) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'P2P Client is not connected to signaling channel.'));
    }

    if (this.allowedRemoteIds.indexOf(remoteId) < 0) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_NOT_ALLOWED));
    }

    return Promise.resolve(getOrCreateChannel(remoteId).publish(stream));
  };
  /**
   * @function send
   * @instance
   * @desc Send a message to remote endpoint.
   * @memberof Owt.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @param {string} message Message to be sent. It should be a string.
   * @return {Promise<undefined, Error>} It returns a promise resolved when remote endpoint received certain message.
   */


  this.send = function (remoteId, message) {
    if (state !== ConnectionState.CONNECTED) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'P2P Client is not connected to signaling channel.'));
    }

    if (this.allowedRemoteIds.indexOf(remoteId) < 0) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_NOT_ALLOWED));
    }

    return Promise.resolve(getOrCreateChannel(remoteId).send(message));
  };
  /**
   * @function stop
   * @instance
   * @desc Clean all resources associated with given remote endpoint. It may include RTCPeerConnection, RTCRtpTransceiver and RTCDataChannel. It still possible to publish a stream, or send a message to given remote endpoint after stop.
   * @memberof Owt.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @return {undefined}
   */


  this.stop = function (remoteId) {
    if (!channels.has(remoteId)) {
      _logger.default.warning('No PeerConnection between current endpoint and specific remote ' + 'endpoint.');

      return;
    }

    channels.get(remoteId).stop();
    channels.delete(remoteId);
  };
  /**
   * @function getStats
   * @instance
   * @desc Get stats of underlying PeerConnection.
   * @memberof Owt.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @return {Promise<RTCStatsReport, Error>} It returns a promise resolved with an RTCStatsReport or reject with an Error if there is no connection with specific user.
   */


  this.getStats = function (remoteId) {
    if (!channels.has(remoteId)) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'No PeerConnection between current endpoint and specific remote ' + 'endpoint.'));
    }

    return channels.get(remoteId).getStats();
  };

  var sendSignalingMessage = function sendSignalingMessage(remoteId, type, message) {
    var msg = {
      type: type
    };

    if (message) {
      msg.data = message;
    }

    return signaling.send(remoteId, JSON.stringify(msg)).catch(function (e) {
      if (typeof e === 'number') {
        throw ErrorModule.getErrorByCode(e);
      }
    });
  };

  var getOrCreateChannel = function getOrCreateChannel(remoteId) {
    if (!channels.has(remoteId)) {
      // Construct an signaling sender/receiver for P2PPeerConnection.
      var signalingForChannel = Object.create(_event.EventDispatcher);
      signalingForChannel.sendSignalingMessage = sendSignalingMessage;
      var pcc = new _peerconnectionChannel.default(config, myId, remoteId, signalingForChannel);
      pcc.addEventListener('streamadded', function (streamEvent) {
        self.dispatchEvent(streamEvent);
      });
      pcc.addEventListener('messagereceived', function (messageEvent) {
        self.dispatchEvent(messageEvent);
      });
      pcc.addEventListener('ended', function () {
        channels.delete(remoteId);
      });
      channels.set(remoteId, pcc);
    }

    return channels.get(remoteId);
  };
};

var _default = P2PClient;
exports.default = _default;

},{"../base/event.js":3,"../base/logger.js":5,"../base/utils.js":11,"./error.js":23,"./peerconnection-channel.js":26}],26:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file doesn't have public APIs.

/* eslint-disable valid-jsdoc */

/* eslint-disable require-jsdoc */

/* global Event, Map, Promise, RTCIceCandidate */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.P2PPeerConnectionChannelEvent = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _event = require("../base/event.js");

var _publication = require("../base/publication.js");

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var ErrorModule = _interopRequireWildcard(require("./error.js"));

var StreamModule = _interopRequireWildcard(require("../base/stream.js"));

var SdpUtils = _interopRequireWildcard(require("../base/sdputils.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * @class P2PPeerConnectionChannelEvent
 * @desc Event for Stream.
 * @memberOf Owt.P2P
 * @private
 * */
var P2PPeerConnectionChannelEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(P2PPeerConnectionChannelEvent, _Event);

  /* eslint-disable-next-line require-jsdoc */
  function P2PPeerConnectionChannelEvent(init) {
    var _this;

    _classCallCheck(this, P2PPeerConnectionChannelEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(P2PPeerConnectionChannelEvent).call(this, init));
    _this.stream = init.stream;
    return _this;
  }

  return P2PPeerConnectionChannelEvent;
}(_wrapNativeSuper(Event));

exports.P2PPeerConnectionChannelEvent = P2PPeerConnectionChannelEvent;
var DataChannelLabel = {
  MESSAGE: 'message',
  FILE: 'file'
};
var SignalingType = {
  DENIED: 'chat-denied',
  CLOSED: 'chat-closed',
  NEGOTIATION_NEEDED: 'chat-negotiation-needed',
  TRACK_SOURCES: 'chat-track-sources',
  STREAM_INFO: 'chat-stream-info',
  SDP: 'chat-signal',
  TRACKS_ADDED: 'chat-tracks-added',
  TRACKS_REMOVED: 'chat-tracks-removed',
  DATA_RECEIVED: 'chat-data-received',
  UA: 'chat-ua'
};
var sysInfo = Utils.sysInfo();
/**
 * @class P2PPeerConnectionChannel
 * @desc A P2PPeerConnectionChannel handles all interactions between this endpoint and a remote endpoint.
 * @memberOf Owt.P2P
 * @private
 */

var P2PPeerConnectionChannel =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(P2PPeerConnectionChannel, _EventDispatcher);

  // |signaling| is an object has a method |sendSignalingMessage|.

  /* eslint-disable-next-line require-jsdoc */
  function P2PPeerConnectionChannel(config, localId, remoteId, signaling) {
    var _this2;

    _classCallCheck(this, P2PPeerConnectionChannel);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(P2PPeerConnectionChannel).call(this));
    _this2._config = config;
    _this2._localId = localId;
    _this2._remoteId = remoteId;
    _this2._signaling = signaling;
    _this2._pc = null;
    _this2._publishedStreams = new Map(); // Key is streams published, value is its publication.

    _this2._pendingStreams = []; // Streams going to be added to PeerConnection.

    _this2._publishingStreams = []; // Streams have been added to PeerConnection, but does not receive ack from remote side.

    _this2._pendingUnpublishStreams = []; // Streams going to be removed.
    // Key is MediaStream's ID, value is an object {source:{audio:string, video:string}, attributes: object, stream: RemoteStream, mediaStream: MediaStream}. `stream` and `mediaStream` will be set when `track` event is fired on `RTCPeerConnection`. `mediaStream` will be `null` after `streamadded` event is fired on `P2PClient`. Other propertes will be set upon `STREAM_INFO` event from signaling channel.

    _this2._remoteStreamInfo = new Map();
    _this2._remoteStreams = [];
    _this2._remoteTrackSourceInfo = new Map(); // Key is MediaStreamTrack's ID, value is source info.

    _this2._publishPromises = new Map(); // Key is MediaStream's ID, value is an object has |resolve| and |reject|.

    _this2._unpublishPromises = new Map(); // Key is MediaStream's ID, value is an object has |resolve| and |reject|.

    _this2._publishingStreamTracks = new Map(); // Key is MediaStream's ID, value is an array of the ID of its MediaStreamTracks that haven't been acked.

    _this2._publishedStreamTracks = new Map(); // Key is MediaStream's ID, value is an array of the ID of its MediaStreamTracks that haven't been removed.

    _this2._isNegotiationNeeded = false;
    _this2._remoteSideSupportsRemoveStream = true;
    _this2._remoteSideSupportsPlanB = true;
    _this2._remoteSideSupportsUnifiedPlan = true;
    _this2._remoteIceCandidates = [];
    _this2._dataChannels = new Map(); // Key is data channel's label, value is a RTCDataChannel.

    _this2._pendingMessages = [];
    _this2._dataSeq = 1; // Sequence number for data channel messages.

    _this2._sendDataPromises = new Map(); // Key is data sequence number, value is an object has |resolve| and |reject|.

    _this2._addedTrackIds = []; // Tracks that have been added after receiving remote SDP but before connection is established. Draining these messages when ICE connection state is connected.

    _this2._isCaller = true;
    _this2._infoSent = false;
    _this2._disposed = false;

    _this2._createPeerConnection();

    return _this2;
  }
  /**
   * @function publish
   * @desc Publish a stream to the remote endpoint.
   * @private
   */


  _createClass(P2PPeerConnectionChannel, [{
    key: "publish",
    value: function publish(stream) {
      var _this3 = this;

      if (!(stream instanceof StreamModule.LocalStream)) {
        return Promise.reject(new TypeError('Invalid stream.'));
      }

      if (this._publishedStreams.has(stream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT, 'Duplicated stream.'));
      }

      if (this._areAllTracksEnded(stream.mediaStream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'All tracks are ended.'));
      }

      return Promise.all([this._sendClosedMsgIfNecessary(), this._sendSysInfoIfNecessary(), this._sendStreamInfo(stream)]).then(function () {
        return new Promise(function (resolve, reject) {
          // Replace |addStream| with PeerConnection.addTrack when all browsers are ready.
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = stream.mediaStream.getTracks()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var track = _step.value;

              _this3._pc.addTrack(track, stream.mediaStream);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          _this3._onNegotiationneeded();

          _this3._publishingStreams.push(stream);

          var trackIds = Array.from(stream.mediaStream.getTracks(), function (track) {
            return track.id;
          });

          _this3._publishingStreamTracks.set(stream.mediaStream.id, trackIds);

          _this3._publishPromises.set(stream.mediaStream.id, {
            resolve: resolve,
            reject: reject
          });
        });
      });
    }
    /**
     * @function send
     * @desc Send a message to the remote endpoint.
     * @private
     */

  }, {
    key: "send",
    value: function send(message) {
      var _this4 = this;

      if (!(typeof message === 'string')) {
        return Promise.reject(new TypeError('Invalid message.'));
      }

      var data = {
        id: this._dataSeq++,
        data: message
      };
      var promise = new Promise(function (resolve, reject) {
        _this4._sendDataPromises.set(data.id, {
          resolve: resolve,
          reject: reject
        });
      });

      if (!this._dataChannels.has(DataChannelLabel.MESSAGE)) {
        this._createDataChannel(DataChannelLabel.MESSAGE);
      }

      this._sendClosedMsgIfNecessary().catch(function (err) {
        _logger.default.debug('Failed to send closed message.' + err.message);
      });

      this._sendSysInfoIfNecessary().catch(function (err) {
        _logger.default.debug('Failed to send sysInfo.' + err.message);
      });

      var dc = this._dataChannels.get(DataChannelLabel.MESSAGE);

      if (dc.readyState === 'open') {
        this._dataChannels.get(DataChannelLabel.MESSAGE).send(JSON.stringify(data));
      } else {
        this._pendingMessages.push(data);
      }

      return promise;
    }
    /**
     * @function stop
     * @desc Stop the connection with remote endpoint.
     * @private
     */

  }, {
    key: "stop",
    value: function stop() {
      this._stop(undefined, true);
    }
    /**
     * @function getStats
     * @desc Get stats for a specific MediaStream.
     * @private
     */

  }, {
    key: "getStats",
    value: function getStats(mediaStream) {
      var _this5 = this;

      if (this._pc) {
        if (mediaStream === undefined) {
          return this._pc.getStats();
        } else {
          var tracksStatsReports = [];
          return Promise.all([mediaStream.getTracks().forEach(function (track) {
            _this5._getStats(track, tracksStatsReports);
          })]).then(function () {
            return new Promise(function (resolve, reject) {
              resolve(tracksStatsReports);
            });
          });
        }
      } else {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE));
      }
    }
  }, {
    key: "_getStats",
    value: function _getStats(mediaStreamTrack, reportsResult) {
      return this._pc.getStats(mediaStreamTrack).then(function (statsReport) {
        reportsResult.push(statsReport);
      });
    }
    /**
     * @function onMessage
     * @desc This method is called by P2PClient when there is new signaling message arrived.
     * @private
     */

  }, {
    key: "onMessage",
    value: function onMessage(message) {
      this._SignalingMesssageHandler(message);
    }
  }, {
    key: "_sendSdp",
    value: function _sendSdp(sdp) {
      return this._signaling.sendSignalingMessage(this._remoteId, SignalingType.SDP, sdp);
    }
  }, {
    key: "_sendSignalingMessage",
    value: function _sendSignalingMessage(type, message) {
      return this._signaling.sendSignalingMessage(this._remoteId, type, message);
    }
  }, {
    key: "_SignalingMesssageHandler",
    value: function _SignalingMesssageHandler(message) {
      _logger.default.debug('Channel received message: ' + message);

      switch (message.type) {
        case SignalingType.UA:
          this._handleRemoteCapability(message.data);

          this._sendSysInfoIfNecessary();

          break;

        case SignalingType.TRACK_SOURCES:
          this._trackSourcesHandler(message.data);

          break;

        case SignalingType.STREAM_INFO:
          this._streamInfoHandler(message.data);

          break;

        case SignalingType.SDP:
          this._sdpHandler(message.data);

          break;

        case SignalingType.TRACKS_ADDED:
          this._tracksAddedHandler(message.data);

          break;

        case SignalingType.TRACKS_REMOVED:
          this._tracksRemovedHandler(message.data);

          break;

        case SignalingType.DATA_RECEIVED:
          this._dataReceivedHandler(message.data);

          break;

        case SignalingType.CLOSED:
          this._chatClosedHandler(message.data);

          break;

        default:
          _logger.default.error('Invalid signaling message received. Type: ' + message.type);

      }
    }
    /**
     * @function _tracksAddedHandler
     * @desc Handle track added event from remote side.
     * @private
     */

  }, {
    key: "_tracksAddedHandler",
    value: function _tracksAddedHandler(ids) {
      var _this6 = this;

      // Currently, |ids| contains all track IDs of a MediaStream. Following algorithm also handles |ids| is a part of a MediaStream's tracks.
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop = function _loop() {
          var id = _step2.value;

          // It could be a problem if there is a track published with different MediaStreams.
          _this6._publishingStreamTracks.forEach(function (mediaTrackIds, mediaStreamId) {
            for (var i = 0; i < mediaTrackIds.length; i++) {
              if (mediaTrackIds[i] === id) {
                // Move this track from publishing tracks to published tracks.
                if (!_this6._publishedStreamTracks.has(mediaStreamId)) {
                  _this6._publishedStreamTracks.set(mediaStreamId, []);
                }

                _this6._publishedStreamTracks.get(mediaStreamId).push(mediaTrackIds[i]);

                mediaTrackIds.splice(i, 1);
              } // Resolving certain publish promise when remote endpoint received all tracks of a MediaStream.


              if (mediaTrackIds.length == 0) {
                var _ret = function () {
                  if (!_this6._publishPromises.has(mediaStreamId)) {
                    _logger.default.warning('Cannot find the promise for publishing ' + mediaStreamId);

                    return "continue";
                  }

                  var targetStreamIndex = _this6._publishingStreams.findIndex(function (element) {
                    return element.mediaStream.id == mediaStreamId;
                  });

                  var targetStream = _this6._publishingStreams[targetStreamIndex];

                  _this6._publishingStreams.splice(targetStreamIndex, 1);

                  var publication = new _publication.Publication(id, function () {
                    _this6._unpublish(targetStream).then(function () {
                      publication.dispatchEvent(new _event.OwtEvent('ended'));
                    }, function (err) {
                      // Use debug mode because this error usually doesn't block stopping a publication.
                      _logger.default.debug('Something wrong happened during stopping a ' + 'publication. ' + err.message);
                    });
                  }, function () {
                    if (!targetStream || !targetStream.mediaStream) {
                      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'Publication is not available.'));
                    }

                    return _this6.getStats(targetStream.mediaStream);
                  });

                  _this6._publishedStreams.set(targetStream, publication);

                  _this6._publishPromises.get(mediaStreamId).resolve(publication);

                  _this6._publishPromises.delete(mediaStreamId);
                }();

                if (_ret === "continue") continue;
              }
            }
          });
        };

        for (var _iterator2 = ids[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
    /**
     * @function _tracksRemovedHandler
     * @desc Handle track removed event from remote side.
     * @private
     */

  }, {
    key: "_tracksRemovedHandler",
    value: function _tracksRemovedHandler(ids) {
      var _this7 = this;

      // Currently, |ids| contains all track IDs of a MediaStream. Following algorithm also handles |ids| is a part of a MediaStream's tracks.
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        var _loop2 = function _loop2() {
          var id = _step3.value;

          // It could be a problem if there is a track published with different MediaStreams.
          _this7._publishedStreamTracks.forEach(function (mediaTrackIds, mediaStreamId) {
            for (var i = 0; i < mediaTrackIds.length; i++) {
              if (mediaTrackIds[i] === id) {
                mediaTrackIds.splice(i, 1);
              }
            }
          });
        };

        for (var _iterator3 = ids[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          _loop2();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
    /**
     * @function _dataReceivedHandler
     * @desc Handle data received event from remote side.
     * @private
     */

  }, {
    key: "_dataReceivedHandler",
    value: function _dataReceivedHandler(id) {
      if (!this._sendDataPromises.has(id)) {
        _logger.default.warning('Received unknown data received message. ID: ' + id);

        return;
      } else {
        this._sendDataPromises.get(id).resolve();
      }
    }
    /**
     * @function _sdpHandler
     * @desc Handle SDP received event from remote side.
     * @private
     */

  }, {
    key: "_sdpHandler",
    value: function _sdpHandler(sdp) {
      if (sdp.type === 'offer') {
        this._onOffer(sdp);
      } else if (sdp.type === 'answer') {
        this._onAnswer(sdp);
      } else if (sdp.type === 'candidates') {
        this._onRemoteIceCandidate(sdp);
      }
    }
    /**
     * @function _trackSourcesHandler
     * @desc Received track source information from remote side.
     * @private
     */

  }, {
    key: "_trackSourcesHandler",
    value: function _trackSourcesHandler(data) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var info = _step4.value;

          this._remoteTrackSourceInfo.set(info.id, info.source);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
    /**
     * @function _streamInfoHandler
     * @desc Received stream information from remote side.
     * @private
     */

  }, {
    key: "_streamInfoHandler",
    value: function _streamInfoHandler(data) {
      if (!data) {
        _logger.default.warning('Unexpected stream info.');

        return;
      }

      this._remoteStreamInfo.set(data.id, {
        source: data.source,
        attributes: data.attributes,
        stream: null,
        mediaStream: null,
        trackIds: data.tracks // Track IDs may not match at sender and receiver sides. Keep it for legacy porposes.

      });
    }
    /**
     * @function _chatClosedHandler
     * @desc Received chat closed event from remote side.
     * @private
     */

  }, {
    key: "_chatClosedHandler",
    value: function _chatClosedHandler(data) {
      this._disposed = true;

      this._stop(data, false);
    }
  }, {
    key: "_onOffer",
    value: function _onOffer(sdp) {
      var _this8 = this;

      _logger.default.debug('About to set remote description. Signaling state: ' + this._pc.signalingState);

      sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._config); // Firefox only has one codec in answer, which does not truly reflect its
      // decoding capability. So we set codec preference to remote offer, and let
      // Firefox choose its preferred codec.
      // Reference: https://bugzilla.mozilla.org/show_bug.cgi?id=814227.

      if (Utils.isFirefox()) {
        sdp.sdp = this._setCodecOrder(sdp.sdp);
      }

      var sessionDescription = new RTCSessionDescription(sdp);

      this._pc.setRemoteDescription(sessionDescription).then(function () {
        _this8._createAndSendAnswer();
      }, function (error) {
        _logger.default.debug('Set remote description failed. Message: ' + error.message);

        _this8._stop(error, true);
      });
    }
  }, {
    key: "_onAnswer",
    value: function _onAnswer(sdp) {
      var _this9 = this;

      _logger.default.debug('About to set remote description. Signaling state: ' + this._pc.signalingState);

      sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._config);
      var sessionDescription = new RTCSessionDescription(sdp);

      this._pc.setRemoteDescription(new RTCSessionDescription(sessionDescription)).then(function () {
        _logger.default.debug('Set remote descripiton successfully.');

        _this9._drainPendingMessages();
      }, function (error) {
        _logger.default.debug('Set remote description failed. Message: ' + error.message);

        _this9._stop(error, true);
      });
    }
  }, {
    key: "_onLocalIceCandidate",
    value: function _onLocalIceCandidate(event) {
      if (event.candidate) {
        this._sendSdp({
          type: 'candidates',
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex
        }).catch(function (e) {
          _logger.default.warning('Failed to send candidate.');
        });
      } else {
        _logger.default.debug('Empty candidate.');
      }
    }
  }, {
    key: "_onRemoteTrackAdded",
    value: function _onRemoteTrackAdded(event) {
      _logger.default.debug('Remote track added.');

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = event.streams[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var stream = _step5.value;

          if (!this._remoteStreamInfo.has(stream.id)) {
            _logger.default.warning('Missing stream info.');

            return;
          }

          if (!this._remoteStreamInfo.get(stream.id).stream) {
            this._setStreamToRemoteStreamInfo(stream);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      if (this._pc.iceConnectionState === 'connected' || this._pc.iceConnectionState === 'completed') {
        this._checkIceConnectionStateAndFireEvent();
      } else {
        this._addedTrackIds.concat(event.track.id);
      }
    }
  }, {
    key: "_onRemoteStreamAdded",
    value: function _onRemoteStreamAdded(event) {
      _logger.default.debug('Remote stream added.');

      if (!this._remoteStreamInfo.has(event.stream.id)) {
        _logger.default.warning('Cannot find source info for stream ' + event.stream.id);

        return;
      }

      if (this._pc.iceConnectionState === 'connected' || this._pc.iceConnectionState === 'completed') {
        this._sendSignalingMessage(SignalingType.TRACKS_ADDED, this._remoteStreamInfo.get(event.stream.id).trackIds);
      } else {
        this._addedTrackIds = this._addedTrackIds.concat(this._remoteStreamInfo.get(event.stream.id).trackIds);
      }

      var audioTrackSource = this._remoteStreamInfo.get(event.stream.id).source.audio;

      var videoTrackSource = this._remoteStreamInfo.get(event.stream.id).source.video;

      var sourceInfo = new StreamModule.StreamSourceInfo(audioTrackSource, videoTrackSource);

      if (Utils.isSafari()) {
        if (!sourceInfo.audio) {
          event.stream.getAudioTracks().forEach(function (track) {
            event.stream.removeTrack(track);
          });
        }

        if (!sourceInfo.video) {
          event.stream.getVideoTracks().forEach(function (track) {
            event.stream.removeTrack(track);
          });
        }
      }

      var attributes = this._remoteStreamInfo.get(event.stream.id).attributes;

      var stream = new StreamModule.RemoteStream(undefined, this._remoteId, event.stream, sourceInfo, attributes);

      if (stream) {
        this._remoteStreams.push(stream);

        var streamEvent = new StreamModule.StreamEvent('streamadded', {
          stream: stream
        });
        this.dispatchEvent(streamEvent);
      }
    }
  }, {
    key: "_onRemoteStreamRemoved",
    value: function _onRemoteStreamRemoved(event) {
      _logger.default.debug('Remote stream removed.');

      var i = this._remoteStreams.findIndex(function (s) {
        return s.mediaStream.id === event.stream.id;
      });

      if (i !== -1) {
        var stream = this._remoteStreams[i];

        this._streamRemoved(stream);

        this._remoteStreams.splice(i, 1);
      }
    }
  }, {
    key: "_onNegotiationneeded",
    value: function _onNegotiationneeded() {
      // This is intented to be executed when onnegotiationneeded event is fired.
      // However, onnegotiationneeded may fire mutiple times when more than one
      // track is added/removed. So we manually execute this function after
      // adding/removing track and creating data channel.
      _logger.default.debug('On negotiation needed.');

      if (this._pc.signalingState === 'stable') {
        this._doNegotiate();
      } else {
        this._isNegotiationNeeded = true;
      }
    }
  }, {
    key: "_onRemoteIceCandidate",
    value: function _onRemoteIceCandidate(candidateInfo) {
      var candidate = new RTCIceCandidate({
        candidate: candidateInfo.candidate,
        sdpMid: candidateInfo.sdpMid,
        sdpMLineIndex: candidateInfo.sdpMLineIndex
      });

      if (this._pc.remoteDescription && this._pc.remoteDescription.sdp !== '') {
        _logger.default.debug('Add remote ice candidates.');

        this._pc.addIceCandidate(candidate).catch(function (error) {
          _logger.default.warning('Error processing ICE candidate: ' + error);
        });
      } else {
        _logger.default.debug('Cache remote ice candidates.');

        this._remoteIceCandidates.push(candidate);
      }
    }
  }, {
    key: "_onSignalingStateChange",
    value: function _onSignalingStateChange(event) {
      _logger.default.debug('Signaling state changed: ' + this._pc.signalingState);

      if (this._pc.signalingState === 'closed') {// stopChatLocally(peer, peer.id);
      } else if (this._pc.signalingState === 'stable') {
        this._negotiating = false;

        if (this._isNegotiationNeeded) {
          this._onNegotiationneeded();
        } else {
          this._drainPendingStreams();

          this._drainPendingMessages();
        }
      } else if (this._pc.signalingState === 'have-remote-offer') {
        this._drainPendingRemoteIceCandidates();
      }
    }
  }, {
    key: "_onIceConnectionStateChange",
    value: function _onIceConnectionStateChange(event) {
      if (event.currentTarget.iceConnectionState === 'closed' || event.currentTarget.iceConnectionState === 'failed') {
        var _error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_UNKNOWN, 'ICE connection failed or closed.');

        this._stop(_error, true);
      } else if (event.currentTarget.iceConnectionState === 'connected' || event.currentTarget.iceConnectionState === 'completed') {
        this._sendSignalingMessage(SignalingType.TRACKS_ADDED, this._addedTrackIds);

        this._addedTrackIds = [];

        this._checkIceConnectionStateAndFireEvent();
      }
    }
  }, {
    key: "_onDataChannelMessage",
    value: function _onDataChannelMessage(event) {
      var message = JSON.parse(event.data);

      _logger.default.debug('Data channel message received: ' + message.data);

      this._sendSignalingMessage(SignalingType.DATA_RECEIVED, message.id);

      var messageEvent = new _event.MessageEvent('messagereceived', {
        message: message.data,
        origin: this._remoteId
      });
      this.dispatchEvent(messageEvent);
    }
  }, {
    key: "_onDataChannelOpen",
    value: function _onDataChannelOpen(event) {
      _logger.default.debug('Data Channel is opened.');

      if (event.target.label === DataChannelLabel.MESSAGE) {
        _logger.default.debug('Data channel for messages is opened.');

        this._drainPendingMessages();
      }
    }
  }, {
    key: "_onDataChannelClose",
    value: function _onDataChannelClose(event) {
      _logger.default.debug('Data Channel is closed.');
    }
  }, {
    key: "_streamRemoved",
    value: function _streamRemoved(stream) {
      if (!this._remoteStreamInfo.has(stream.mediaStream.id)) {
        _logger.default.warning('Cannot find stream info.');
      }

      this._sendSignalingMessage(SignalingType.TRACKS_REMOVED, this._remoteStreamInfo.get(stream.mediaStream.id).trackIds);

      var event = new _event.OwtEvent('ended');
      stream.dispatchEvent(event);
    }
  }, {
    key: "_isUnifiedPlan",
    value: function _isUnifiedPlan() {
      if (Utils.isFirefox()) {
        return true;
      }

      var pc = new RTCPeerConnection({
        sdpSemantics: 'unified-plan'
      });
      return pc.getConfiguration() && pc.getConfiguration().sdpSemantics === 'plan-b';
    }
  }, {
    key: "_createPeerConnection",
    value: function _createPeerConnection() {
      var _this10 = this;

      var pcConfiguration = this._config.rtcConfiguration || {};

      if (Utils.isChrome()) {
        pcConfiguration.sdpSemantics = 'unified-plan';
      }

      this._pc = new RTCPeerConnection(pcConfiguration); // Firefox 59 implemented addTransceiver. However, mid in SDP will differ from track's ID in this case. And transceiver's mid is null.

      if (typeof this._pc.addTransceiver === 'function' && Utils.isSafari()) {
        this._pc.addTransceiver('audio');

        this._pc.addTransceiver('video');
      }

      if (!this._isUnifiedPlan() && !Utils.isSafari()) {
        this._pc.onaddstream = function (event) {
          // TODO: Legacy API, should be removed when all UAs implemented WebRTC 1.0.
          _this10._onRemoteStreamAdded.apply(_this10, [event]);
        };

        this._pc.onremovestream = function (event) {
          _this10._onRemoteStreamRemoved.apply(_this10, [event]);
        };
      } else {
        this._pc.ontrack = function (event) {
          _this10._onRemoteTrackAdded.apply(_this10, [event]);
        };
      }

      this._pc.onicecandidate = function (event) {
        _this10._onLocalIceCandidate.apply(_this10, [event]);
      };

      this._pc.onsignalingstatechange = function (event) {
        _this10._onSignalingStateChange.apply(_this10, [event]);
      };

      this._pc.ondatachannel = function (event) {
        _logger.default.debug('On data channel.'); // Save remote created data channel.


        if (!_this10._dataChannels.has(event.channel.label)) {
          _this10._dataChannels.set(event.channel.label, event.channel);

          _logger.default.debug('Save remote created data channel.');
        }

        _this10._bindEventsToDataChannel(event.channel);
      };

      this._pc.oniceconnectionstatechange = function (event) {
        _this10._onIceConnectionStateChange.apply(_this10, [event]);
      };
      /*
      this._pc.oniceChannelStatechange = function(event) {
        _onIceChannelStateChange(peer, event);
      };
       = function() {
        onNegotiationneeded(peers[peer.id]);
      };
       //DataChannel
      this._pc.ondatachannel = function(event) {
        Logger.debug(myId + ': On data channel');
        // Save remote created data channel.
        if (!peer.dataChannels[event.channel.label]) {
          peer.dataChannels[event.channel.label] = event.channel;
          Logger.debug('Save remote created data channel.');
        }
        bindEventsToDataChannel(event.channel, peer);
      };*/

    }
  }, {
    key: "_drainPendingStreams",
    value: function _drainPendingStreams() {
      var negotiationNeeded = false;

      _logger.default.debug('Draining pending streams.');

      if (this._pc && this._pc.signalingState === 'stable') {
        _logger.default.debug('Peer connection is ready for draining pending streams.');

        for (var i = 0; i < this._pendingStreams.length; i++) {
          var stream = this._pendingStreams[i]; // OnNegotiationNeeded event will be triggered immediately after adding stream to PeerConnection in Firefox.
          // And OnNegotiationNeeded handler will execute drainPendingStreams. To avoid add the same stream multiple times,
          // shift it from pending stream list before adding it to PeerConnection.

          this._pendingStreams.shift();

          if (!stream.mediaStream) {
            continue;
          }

          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = stream.mediaStream.getTracks()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var track = _step6.value;

              this._pc.addTrack(track, stream.mediaStream);

              negotiationNeeded = true;
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          _logger.default.debug('Added stream to peer connection.');

          this._publishingStreams.push(stream);
        }

        this._pendingStreams.length = 0;

        for (var j = 0; j < this._pendingUnpublishStreams.length; j++) {
          if (!this._pendingUnpublishStreams[j].mediaStream) {
            continue;
          }

          this._pc.removeStream(this._pendingUnpublishStreams[j].mediaStream);

          negotiationNeeded = true;

          this._unpublishPromises.get(this._pendingUnpublishStreams[j].mediaStream.id).resolve();

          this._publishedStreams.delete(this._pendingUnpublishStreams[j]);

          _logger.default.debug('Remove stream.');
        }

        this._pendingUnpublishStreams.length = 0;
      }

      if (negotiationNeeded) {
        this._onNegotiationneeded();
      }
    }
  }, {
    key: "_drainPendingRemoteIceCandidates",
    value: function _drainPendingRemoteIceCandidates() {
      for (var i = 0; i < this._remoteIceCandidates.length; i++) {
        _logger.default.debug('Add candidate');

        this._pc.addIceCandidate(this._remoteIceCandidates[i]).catch(function (error) {
          _logger.default.warning('Error processing ICE candidate: ' + error);
        });
      }

      this._remoteIceCandidates.length = 0;
    }
  }, {
    key: "_drainPendingMessages",
    value: function _drainPendingMessages() {
      _logger.default.debug('Draining pending messages.');

      if (this._pendingMessages.length == 0) {
        return;
      }

      var dc = this._dataChannels.get(DataChannelLabel.MESSAGE);

      if (dc && dc.readyState === 'open') {
        for (var i = 0; i < this._pendingMessages.length; i++) {
          _logger.default.debug('Sending message via data channel: ' + this._pendingMessages[i]);

          dc.send(JSON.stringify(this._pendingMessages[i]));
        }

        this._pendingMessages.length = 0;
      } else if (this._pc && !dc) {
        this._createDataChannel(DataChannelLabel.MESSAGE);
      }
    }
  }, {
    key: "_sendStreamInfo",
    value: function _sendStreamInfo(stream) {
      if (!stream || !stream.mediaStream) {
        return new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }

      var info = [];
      stream.mediaStream.getTracks().map(function (track) {
        info.push({
          id: track.id,
          source: stream.source[track.kind]
        });
      });
      return Promise.all([this._sendSignalingMessage(SignalingType.TRACK_SOURCES, info), this._sendSignalingMessage(SignalingType.STREAM_INFO, {
        id: stream.mediaStream.id,
        attributes: stream.attributes,
        // Track IDs may not match at sender and receiver sides.
        tracks: Array.from(info, function (item) {
          return item.id;
        }),
        // This is a workaround for Safari. Please use track-sources if possible.
        source: stream.source
      })]);
    }
  }, {
    key: "_sendSysInfoIfNecessary",
    value: function _sendSysInfoIfNecessary() {
      if (this._infoSent) {
        return Promise.resolve();
      }

      this._infoSent = true;
      return this._sendSignalingMessage(SignalingType.UA, sysInfo);
    }
  }, {
    key: "_sendClosedMsgIfNecessary",
    value: function _sendClosedMsgIfNecessary() {
      if (this._pc.remoteDescription === null || this._pc.remoteDescription.sdp === '') {
        return this._sendSignalingMessage(SignalingType.CLOSED);
      }

      return Promise.resolve();
    }
  }, {
    key: "_handleRemoteCapability",
    value: function _handleRemoteCapability(ua) {
      if (ua.sdk && ua.sdk && ua.sdk.type === 'JavaScript' && ua.runtime && ua.runtime.name === 'Firefox') {
        this._remoteSideSupportsRemoveStream = false;
        this._remoteSideSupportsPlanB = false;
        this._remoteSideSupportsUnifiedPlan = true;
      } else {
        // Remote side is iOS/Android/C++ which uses Google's WebRTC stack.
        this._remoteSideSupportsRemoveStream = true;
        this._remoteSideSupportsPlanB = true;
        this._remoteSideSupportsUnifiedPlan = false;
      }
    }
  }, {
    key: "_doNegotiate",
    value: function _doNegotiate() {
      this._createAndSendOffer();
    }
  }, {
    key: "_setCodecOrder",
    value: function _setCodecOrder(sdp) {
      if (this._config.audioEncodings) {
        var audioCodecNames = Array.from(this._config.audioEncodings, function (encodingParameters) {
          return encodingParameters.codec.name;
        });
        sdp = SdpUtils.reorderCodecs(sdp, 'audio', audioCodecNames);
      }

      if (this._config.videoEncodings) {
        var videoCodecNames = Array.from(this._config.videoEncodings, function (encodingParameters) {
          return encodingParameters.codec.name;
        });
        sdp = SdpUtils.reorderCodecs(sdp, 'video', videoCodecNames);
      }

      return sdp;
    }
  }, {
    key: "_setMaxBitrate",
    value: function _setMaxBitrate(sdp, options) {
      if (_typeof(options.audioEncodings) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.audioEncodings);
      }

      if (_typeof(options.videoEncodings) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.videoEncodings);
      }

      return sdp;
    }
  }, {
    key: "_setRtpSenderOptions",
    value: function _setRtpSenderOptions(sdp, options) {
      sdp = this._setMaxBitrate(sdp, options);
      return sdp;
    }
  }, {
    key: "_setRtpReceiverOptions",
    value: function _setRtpReceiverOptions(sdp) {
      sdp = this._setCodecOrder(sdp);
      return sdp;
    }
  }, {
    key: "_createAndSendOffer",
    value: function _createAndSendOffer() {
      var _this11 = this;

      if (!this._pc) {
        _logger.default.error('Peer connection have not been created.');

        return;
      }

      this._isNegotiationNeeded = false;
      this._isCaller = true;
      var localDesc;

      this._pc.createOffer().then(function (desc) {
        desc.sdp = _this11._setRtpReceiverOptions(desc.sdp);
        localDesc = desc;

        if (_this11._pc.signalingState === 'stable') {
          return _this11._pc.setLocalDescription(desc).then(function () {
            return _this11._sendSdp(localDesc);
          });
        }
      }).catch(function (e) {
        _logger.default.error(e.message + ' Please check your codec settings.');

        var error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_SDP, e.message);

        _this11._stop(error, true);
      });
    }
  }, {
    key: "_createAndSendAnswer",
    value: function _createAndSendAnswer() {
      var _this12 = this;

      this._drainPendingStreams();

      this._isNegotiationNeeded = false;
      this._isCaller = false;
      var localDesc;

      this._pc.createAnswer().then(function (desc) {
        desc.sdp = _this12._setRtpReceiverOptions(desc.sdp);
        localDesc = desc;

        _this12._logCurrentAndPendingLocalDescription();

        return _this12._pc.setLocalDescription(desc);
      }).then(function () {
        return _this12._sendSdp(localDesc);
      }).catch(function (e) {
        _logger.default.error(e.message + ' Please check your codec settings.');

        var error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_SDP, e.message);

        _this12._stop(error, true);
      });
    }
  }, {
    key: "_logCurrentAndPendingLocalDescription",
    value: function _logCurrentAndPendingLocalDescription() {
      _logger.default.info('Current description: ' + this._pc.currentLocalDescription);

      _logger.default.info('Pending description: ' + this._pc.pendingLocalDescription);
    }
  }, {
    key: "_getAndDeleteTrackSourceInfo",
    value: function _getAndDeleteTrackSourceInfo(tracks) {
      if (tracks.length > 0) {
        var trackId = tracks[0].id;

        if (this._remoteTrackSourceInfo.has(trackId)) {
          var sourceInfo = this._remoteTrackSourceInfo.get(trackId);

          this._remoteTrackSourceInfo.delete(trackId);

          return sourceInfo;
        } else {
          _logger.default.warning('Cannot find source info for ' + trackId);
        }
      }
    }
  }, {
    key: "_unpublish",
    value: function _unpublish(stream) {
      var _this13 = this;

      if (navigator.mozGetUserMedia || !this._remoteSideSupportsRemoveStream) {
        // Actually unpublish is supported. It is a little bit complex since Firefox implemented WebRTC spec while Chrome implemented an old API.
        _logger.default.error('Stopping a publication is not supported on Firefox. Please use P2PClient.stop() to stop the connection with remote endpoint.');

        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_UNSUPPORTED_METHOD));
      }

      if (!this._publishedStreams.has(stream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT));
      }

      this._pendingUnpublishStreams.push(stream);

      return new Promise(function (resolve, reject) {
        _this13._unpublishPromises.set(stream.mediaStream.id, {
          resolve: resolve,
          reject: reject
        });

        _this13._drainPendingStreams();
      });
    } // Make sure |_pc| is available before calling this method.

  }, {
    key: "_createDataChannel",
    value: function _createDataChannel(label) {
      if (this._dataChannels.has(label)) {
        _logger.default.warning('Data channel labeled ' + label + ' already exists.');

        return;
      }

      if (!this._pc) {
        _logger.default.debug('PeerConnection is not available before creating DataChannel.');

        return;
      }

      _logger.default.debug('Create data channel.');

      var dc = this._pc.createDataChannel(label);

      this._bindEventsToDataChannel(dc);

      this._dataChannels.set(DataChannelLabel.MESSAGE, dc);

      this._onNegotiationneeded();
    }
  }, {
    key: "_bindEventsToDataChannel",
    value: function _bindEventsToDataChannel(dc) {
      var _this14 = this;

      dc.onmessage = function (event) {
        _this14._onDataChannelMessage.apply(_this14, [event]);
      };

      dc.onopen = function (event) {
        _this14._onDataChannelOpen.apply(_this14, [event]);
      };

      dc.onclose = function (event) {
        _this14._onDataChannelClose.apply(_this14, [event]);
      };

      dc.onerror = function (event) {
        _logger.default.debug('Data Channel Error:', error);
      };
    } // Returns all MediaStreams it belongs to.

  }, {
    key: "_getStreamByTrack",
    value: function _getStreamByTrack(mediaStreamTrack) {
      var streams = [];
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this._remoteStreamInfo[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _step7$value = _slicedToArray(_step7.value, 2),
              id = _step7$value[0],
              info = _step7$value[1];

          if (!info.stream || !info.stream.mediaStream) {
            continue;
          }

          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = info.stream.mediaStream.getTracks()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var track = _step8.value;

              if (mediaStreamTrack === track) {
                streams.push(info.stream.mediaStream);
              }
            }
          } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
                _iterator8.return();
              }
            } finally {
              if (_didIteratorError8) {
                throw _iteratorError8;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      return streams;
    }
  }, {
    key: "_areAllTracksEnded",
    value: function _areAllTracksEnded(mediaStream) {
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = mediaStream.getTracks()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var track = _step9.value;

          if (track.readyState === 'live') {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      return true;
    }
  }, {
    key: "_stop",
    value: function _stop(error, notifyRemote) {
      var promiseError = error;

      if (!promiseError) {
        promiseError = new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_UNKNOWN);
      }

      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = this._dataChannels[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var _step10$value = _slicedToArray(_step10.value, 2),
              label = _step10$value[0],
              dc = _step10$value[1];

          dc.close();
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }

      this._dataChannels.clear();

      if (this._pc && this._pc.iceConnectionState !== 'closed') {
        this._pc.close();
      }

      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;
      var _iteratorError11 = undefined;

      try {
        for (var _iterator11 = this._publishPromises[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
          var _step11$value = _slicedToArray(_step11.value, 2),
              id = _step11$value[0],
              promise = _step11$value[1];

          promise.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
            _iterator11.return();
          }
        } finally {
          if (_didIteratorError11) {
            throw _iteratorError11;
          }
        }
      }

      this._publishPromises.clear();

      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = this._unpublishPromises[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var _step12$value = _slicedToArray(_step12.value, 2),
              id = _step12$value[0],
              promise = _step12$value[1];

          promise.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }

      this._unpublishPromises.clear();

      var _iteratorNormalCompletion13 = true;
      var _didIteratorError13 = false;
      var _iteratorError13 = undefined;

      try {
        for (var _iterator13 = this._sendDataPromises[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
          var _step13$value = _slicedToArray(_step13.value, 2),
              id = _step13$value[0],
              promise = _step13$value[1];

          promise.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion13 && _iterator13.return != null) {
            _iterator13.return();
          }
        } finally {
          if (_didIteratorError13) {
            throw _iteratorError13;
          }
        }
      }

      this._sendDataPromises.clear(); // Fire ended event if publication or remote stream exists.


      this._publishedStreams.forEach(function (publication) {
        publication.dispatchEvent(new _event.OwtEvent('ended'));
      });

      this._publishedStreams.clear();

      this._remoteStreams.forEach(function (stream) {
        stream.dispatchEvent(new _event.OwtEvent('ended'));
      });

      this._remoteStreams = [];

      if (!this._disposed) {
        if (notifyRemote) {
          var sendError;

          if (error) {
            sendError = JSON.parse(JSON.stringify(error)); // Avoid to leak detailed error to remote side.

            sendError.message = 'Error happened at remote side.';
          }

          this._sendSignalingMessage(SignalingType.CLOSED, sendError).catch(function (err) {
            _logger.default.debug('Failed to send close.' + err.message);
          });
        }

        this.dispatchEvent(new Event('ended'));
      }
    }
  }, {
    key: "_setStreamToRemoteStreamInfo",
    value: function _setStreamToRemoteStreamInfo(mediaStream) {
      var info = this._remoteStreamInfo.get(mediaStream.id);

      var attributes = info.attributes;
      var sourceInfo = new StreamModule.StreamSourceInfo(this._remoteStreamInfo.get(mediaStream.id).source.audio, this._remoteStreamInfo.get(mediaStream.id).source.video);
      info.stream = new StreamModule.RemoteStream(undefined, this._remoteId, mediaStream, sourceInfo, attributes);
      info.mediaStream = mediaStream;
      var stream = info.stream;

      if (stream) {
        this._remoteStreams.push(stream);
      } else {
        _logger.default.warning('Failed to create RemoteStream.');
      }
    }
  }, {
    key: "_checkIceConnectionStateAndFireEvent",
    value: function _checkIceConnectionStateAndFireEvent() {
      var _this15 = this;

      if (this._pc.iceConnectionState === 'connected' || this._pc.iceConnectionState === 'completed') {
        var _iteratorNormalCompletion14 = true;
        var _didIteratorError14 = false;
        var _iteratorError14 = undefined;

        try {
          for (var _iterator14 = this._remoteStreamInfo[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
            var _step14$value = _slicedToArray(_step14.value, 2),
                id = _step14$value[0],
                info = _step14$value[1];

            if (info.mediaStream) {
              var streamEvent = new StreamModule.StreamEvent('streamadded', {
                stream: info.stream
              });

              if (this._isUnifiedPlan()) {
                var _iteratorNormalCompletion15 = true;
                var _didIteratorError15 = false;
                var _iteratorError15 = undefined;

                try {
                  for (var _iterator15 = info.mediaStream.getTracks()[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                    var track = _step15.value;
                    track.addEventListener('ended', function (event) {
                      var mediaStreams = _this15._getStreamByTrack(event.target);

                      var _iteratorNormalCompletion16 = true;
                      var _didIteratorError16 = false;
                      var _iteratorError16 = undefined;

                      try {
                        for (var _iterator16 = mediaStreams[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                          var mediaStream = _step16.value;

                          if (_this15._areAllTracksEnded(mediaStream)) {
                            _this15._onRemoteStreamRemoved(mediaStream);
                          }
                        }
                      } catch (err) {
                        _didIteratorError16 = true;
                        _iteratorError16 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion16 && _iterator16.return != null) {
                            _iterator16.return();
                          }
                        } finally {
                          if (_didIteratorError16) {
                            throw _iteratorError16;
                          }
                        }
                      }
                    });
                  }
                } catch (err) {
                  _didIteratorError15 = true;
                  _iteratorError15 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion15 && _iterator15.return != null) {
                      _iterator15.return();
                    }
                  } finally {
                    if (_didIteratorError15) {
                      throw _iteratorError15;
                    }
                  }
                }
              }

              this._sendSignalingMessage(SignalingType.TRACKS_ADDED, info.trackIds);

              this._remoteStreamInfo.get(info.mediaStream.id).mediaStream = null;
              this.dispatchEvent(streamEvent);
            }
          }
        } catch (err) {
          _didIteratorError14 = true;
          _iteratorError14 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion14 && _iterator14.return != null) {
              _iterator14.return();
            }
          } finally {
            if (_didIteratorError14) {
              throw _iteratorError14;
            }
          }
        }
      }
    }
  }]);

  return P2PPeerConnectionChannel;
}(_event.EventDispatcher);

var _default = P2PPeerConnectionChannel;
exports.default = _default;

},{"../base/event.js":3,"../base/logger.js":5,"../base/publication.js":8,"../base/sdputils.js":9,"../base/stream.js":10,"../base/utils.js":11,"./error.js":23}]},{},[22])(22)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2RrL2Jhc2UvYmFzZTY0LmpzIiwic3JjL3Nkay9iYXNlL2NvZGVjLmpzIiwic3JjL3Nkay9iYXNlL2V2ZW50LmpzIiwic3JjL3Nkay9iYXNlL2V4cG9ydC5qcyIsInNyYy9zZGsvYmFzZS9sb2dnZXIuanMiLCJzcmMvc2RrL2Jhc2UvbWVkaWFmb3JtYXQuanMiLCJzcmMvc2RrL2Jhc2UvbWVkaWFzdHJlYW0tZmFjdG9yeS5qcyIsInNyYy9zZGsvYmFzZS9wdWJsaWNhdGlvbi5qcyIsInNyYy9zZGsvYmFzZS9zZHB1dGlscy5qcyIsInNyYy9zZGsvYmFzZS9zdHJlYW0uanMiLCJzcmMvc2RrL2Jhc2UvdXRpbHMuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvY2hhbm5lbC5qcyIsInNyYy9zZGsvY29uZmVyZW5jZS9jbGllbnQuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvZXJyb3IuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvZXhwb3J0LmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL2luZm8uanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvbWl4ZWRzdHJlYW0uanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvcGFydGljaXBhbnQuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2Uvc2lnbmFsaW5nLmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL3N0cmVhbXV0aWxzLmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL3N1YnNjcmlwdGlvbi5qcyIsInNyYy9zZGsvZXhwb3J0LmpzIiwic3JjL3Nkay9wMnAvZXJyb3IuanMiLCJzcmMvc2RrL3AycC9leHBvcnQuanMiLCJzcmMvc2RrL3AycC9wMnBjbGllbnQuanMiLCJzcmMvc2RrL3AycC9wZWVyY29ubmVjdGlvbi1jaGFubmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBNSVQgTGljZW5zZVxuLy9cbi8vIENvcHlyaWdodCAoYykgMjAxMiBVbml2ZXJzaWRhZCBQb2xpdMOpY25pY2EgZGUgTWFkcmlkXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuLy8gY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4vLyBTT0ZUV0FSRS5cblxuLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4vLyBUaGlzIGZpbGUgaXMgYm9ycm93ZWQgZnJvbSBseW5ja2lhL2xpY29kZSB3aXRoIHNvbWUgbW9kaWZpY2F0aW9ucy5cblxuLyogZ2xvYmFsIHVuZXNjYXBlKi9cbid1c2Ugc3RyaWN0JztcbmV4cG9ydCBjb25zdCBCYXNlNjQgPSAoZnVuY3Rpb24oKSB7XG4gIGNvbnN0IEVORF9PRl9JTlBVVCA9IC0xO1xuICBsZXQgYmFzZTY0U3RyO1xuICBsZXQgYmFzZTY0Q291bnQ7XG5cbiAgbGV0IGk7XG5cbiAgY29uc3QgYmFzZTY0Q2hhcnMgPSBbXG4gICAgJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsXG4gICAgJ0knLCAnSicsICdLJywgJ0wnLCAnTScsICdOJywgJ08nLCAnUCcsXG4gICAgJ1EnLCAnUicsICdTJywgJ1QnLCAnVScsICdWJywgJ1cnLCAnWCcsXG4gICAgJ1knLCAnWicsICdhJywgJ2InLCAnYycsICdkJywgJ2UnLCAnZicsXG4gICAgJ2cnLCAnaCcsICdpJywgJ2onLCAnaycsICdsJywgJ20nLCAnbicsXG4gICAgJ28nLCAncCcsICdxJywgJ3InLCAncycsICd0JywgJ3UnLCAndicsXG4gICAgJ3cnLCAneCcsICd5JywgJ3onLCAnMCcsICcxJywgJzInLCAnMycsXG4gICAgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5JywgJysnLCAnLycsXG4gIF07XG5cbiAgY29uc3QgcmV2ZXJzZUJhc2U2NENoYXJzID0gW107XG5cbiAgZm9yIChpID0gMDsgaSA8IGJhc2U2NENoYXJzLmxlbmd0aDsgaSA9IGkgKyAxKSB7XG4gICAgcmV2ZXJzZUJhc2U2NENoYXJzW2Jhc2U2NENoYXJzW2ldXSA9IGk7XG4gIH1cblxuICBjb25zdCBzZXRCYXNlNjRTdHIgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBiYXNlNjRTdHIgPSBzdHI7XG4gICAgYmFzZTY0Q291bnQgPSAwO1xuICB9O1xuXG4gIGNvbnN0IHJlYWRCYXNlNjQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWJhc2U2NFN0cikge1xuICAgICAgcmV0dXJuIEVORF9PRl9JTlBVVDtcbiAgICB9XG4gICAgaWYgKGJhc2U2NENvdW50ID49IGJhc2U2NFN0ci5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBFTkRfT0ZfSU5QVVQ7XG4gICAgfVxuICAgIGNvbnN0IGMgPSBiYXNlNjRTdHIuY2hhckNvZGVBdChiYXNlNjRDb3VudCkgJiAweGZmO1xuICAgIGJhc2U2NENvdW50ID0gYmFzZTY0Q291bnQgKyAxO1xuICAgIHJldHVybiBjO1xuICB9O1xuXG4gIGNvbnN0IGVuY29kZUJhc2U2NCA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGxldCByZXN1bHQ7XG4gICAgbGV0IGRvbmU7XG4gICAgc2V0QmFzZTY0U3RyKHN0cik7XG4gICAgcmVzdWx0ID0gJyc7XG4gICAgY29uc3QgaW5CdWZmZXIgPSBuZXcgQXJyYXkoMyk7XG4gICAgZG9uZSA9IGZhbHNlO1xuICAgIHdoaWxlICghZG9uZSAmJiAoaW5CdWZmZXJbMF0gPSByZWFkQmFzZTY0KCkpICE9PSBFTkRfT0ZfSU5QVVQpIHtcbiAgICAgIGluQnVmZmVyWzFdID0gcmVhZEJhc2U2NCgpO1xuICAgICAgaW5CdWZmZXJbMl0gPSByZWFkQmFzZTY0KCk7XG4gICAgICByZXN1bHQgPSByZXN1bHQgKyAoYmFzZTY0Q2hhcnNbaW5CdWZmZXJbMF0gPj4gMl0pO1xuICAgICAgaWYgKGluQnVmZmVyWzFdICE9PSBFTkRfT0ZfSU5QVVQpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKGJhc2U2NENoYXJzWygoaW5CdWZmZXJbMF0gPDwgNCkgJiAweDMwKSB8IChcbiAgICAgICAgICBpbkJ1ZmZlclsxXSA+PiA0KV0pO1xuICAgICAgICBpZiAoaW5CdWZmZXJbMl0gIT09IEVORF9PRl9JTlBVVCkge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIChiYXNlNjRDaGFyc1soKGluQnVmZmVyWzFdIDw8IDIpICYgMHgzYykgfCAoXG4gICAgICAgICAgICBpbkJ1ZmZlclsyXSA+PiA2KV0pO1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIChiYXNlNjRDaGFyc1tpbkJ1ZmZlclsyXSAmIDB4M0ZdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAoYmFzZTY0Q2hhcnNbKChpbkJ1ZmZlclsxXSA8PCAyKSAmIDB4M2MpXSk7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKCc9Jyk7XG4gICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIChiYXNlNjRDaGFyc1soKGluQnVmZmVyWzBdIDw8IDQpICYgMHgzMCldKTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKCc9Jyk7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCArICgnPScpO1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBjb25zdCByZWFkUmV2ZXJzZUJhc2U2NCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghYmFzZTY0U3RyKSB7XG4gICAgICByZXR1cm4gRU5EX09GX0lOUFVUO1xuICAgIH1cbiAgICB3aGlsZSAodHJ1ZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgaWYgKGJhc2U2NENvdW50ID49IGJhc2U2NFN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIEVORF9PRl9JTlBVVDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5leHRDaGFyYWN0ZXIgPSBiYXNlNjRTdHIuY2hhckF0KGJhc2U2NENvdW50KTtcbiAgICAgIGJhc2U2NENvdW50ID0gYmFzZTY0Q291bnQgKyAxO1xuICAgICAgaWYgKHJldmVyc2VCYXNlNjRDaGFyc1tuZXh0Q2hhcmFjdGVyXSkge1xuICAgICAgICByZXR1cm4gcmV2ZXJzZUJhc2U2NENoYXJzW25leHRDaGFyYWN0ZXJdO1xuICAgICAgfVxuICAgICAgaWYgKG5leHRDaGFyYWN0ZXIgPT09ICdBJykge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgbnRvcyA9IGZ1bmN0aW9uKG4pIHtcbiAgICBuID0gbi50b1N0cmluZygxNik7XG4gICAgaWYgKG4ubGVuZ3RoID09PSAxKSB7XG4gICAgICBuID0gJzAnICsgbjtcbiAgICB9XG4gICAgbiA9ICclJyArIG47XG4gICAgcmV0dXJuIHVuZXNjYXBlKG4pO1xuICB9O1xuXG4gIGNvbnN0IGRlY29kZUJhc2U2NCA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGxldCByZXN1bHQ7XG4gICAgbGV0IGRvbmU7XG4gICAgc2V0QmFzZTY0U3RyKHN0cik7XG4gICAgcmVzdWx0ID0gJyc7XG4gICAgY29uc3QgaW5CdWZmZXIgPSBuZXcgQXJyYXkoNCk7XG4gICAgZG9uZSA9IGZhbHNlO1xuICAgIHdoaWxlICghZG9uZSAmJiAoaW5CdWZmZXJbMF0gPSByZWFkUmV2ZXJzZUJhc2U2NCgpKSAhPT0gRU5EX09GX0lOUFVUICYmXG4gICAgICAoaW5CdWZmZXJbMV0gPSByZWFkUmV2ZXJzZUJhc2U2NCgpKSAhPT0gRU5EX09GX0lOUFVUKSB7XG4gICAgICBpbkJ1ZmZlclsyXSA9IHJlYWRSZXZlcnNlQmFzZTY0KCk7XG4gICAgICBpbkJ1ZmZlclszXSA9IHJlYWRSZXZlcnNlQmFzZTY0KCk7XG4gICAgICByZXN1bHQgPSByZXN1bHQgKyBudG9zKCgoKGluQnVmZmVyWzBdIDw8IDIpICYgMHhmZikgfCBpbkJ1ZmZlclsxXSA+PlxuICAgICAgICA0KSk7XG4gICAgICBpZiAoaW5CdWZmZXJbMl0gIT09IEVORF9PRl9JTlBVVCkge1xuICAgICAgICByZXN1bHQgKz0gbnRvcygoKChpbkJ1ZmZlclsxXSA8PCA0KSAmIDB4ZmYpIHwgaW5CdWZmZXJbMl0gPj4gMikpO1xuICAgICAgICBpZiAoaW5CdWZmZXJbM10gIT09IEVORF9PRl9JTlBVVCkge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIG50b3MoKCgoaW5CdWZmZXJbMl0gPDwgNikgJiAweGZmKSB8IGluQnVmZmVyW1xuICAgICAgICAgICAgICAzXSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGVuY29kZUJhc2U2NDogZW5jb2RlQmFzZTY0LFxuICAgIGRlY29kZUJhc2U2NDogZGVjb2RlQmFzZTY0LFxuICB9O1xufSgpKTtcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBjbGFzcyBBdWRpb0NvZGVjXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBjbGFzc0Rlc2MgQXVkaW8gY29kZWMgZW51bWVyYXRpb24uXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjb25zdCBBdWRpb0NvZGVjID0ge1xuICBQQ01VOiAncGNtdScsXG4gIFBDTUE6ICdwY21hJyxcbiAgT1BVUzogJ29wdXMnLFxuICBHNzIyOiAnZzcyMicsXG4gIElTQUM6ICdpU0FDJyxcbiAgSUxCQzogJ2lMQkMnLFxuICBBQUM6ICdhYWMnLFxuICBBQzM6ICdhYzMnLFxuICBORUxMWU1PU0VSOiAnbmVsbHltb3NlcicsXG59O1xuLyoqXG4gKiBAY2xhc3MgQXVkaW9Db2RlY1BhcmFtZXRlcnNcbiAqIEBtZW1iZXJPZiBPd3QuQmFzZVxuICogQGNsYXNzRGVzYyBDb2RlYyBwYXJhbWV0ZXJzIGZvciBhbiBhdWRpbyB0cmFjay5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEF1ZGlvQ29kZWNQYXJhbWV0ZXJzIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IobmFtZSwgY2hhbm5lbENvdW50LCBjbG9ja1JhdGUpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBOYW1lIG9mIGEgY29kZWMuIFBsZWFzZSB1c2UgYSB2YWx1ZSBpbiBPd3QuQmFzZS5BdWRpb0NvZGVjLiBIb3dldmVyLCBzb21lIGZ1bmN0aW9ucyBkbyBub3Qgc3VwcG9ydCBhbGwgdGhlIHZhbHVlcyBpbiBPd3QuQmFzZS5BdWRpb0NvZGVjLlxuICAgICAqL1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gY2hhbm5lbENvdW50XG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLkF1ZGlvQ29kZWNQYXJhbWV0ZXJzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgTnVtYmVycyBvZiBjaGFubmVscyBmb3IgYW4gYXVkaW8gdHJhY2suXG4gICAgICovXG4gICAgdGhpcy5jaGFubmVsQ291bnQgPSBjaGFubmVsQ291bnQ7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gY2xvY2tSYXRlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLkF1ZGlvQ29kZWNQYXJhbWV0ZXJzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgVGhlIGNvZGVjIGNsb2NrIHJhdGUgZXhwcmVzc2VkIGluIEhlcnR6LlxuICAgICAqL1xuICAgIHRoaXMuY2xvY2tSYXRlID0gY2xvY2tSYXRlO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvRW5jb2RpbmdQYXJhbWV0ZXJzXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBjbGFzc0Rlc2MgRW5jb2RpbmcgcGFyYW1ldGVycyBmb3Igc2VuZGluZyBhbiBhdWRpbyB0cmFjay5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEF1ZGlvRW5jb2RpbmdQYXJhbWV0ZXJzIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoY29kZWMsIG1heEJpdHJhdGUpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/T3d0LkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnN9IGNvZGVjXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLkF1ZGlvRW5jb2RpbmdQYXJhbWV0ZXJzXG4gICAgICovXG4gICAgdGhpcy5jb2RlYyA9IGNvZGVjO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IG1heEJpdHJhdGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuQXVkaW9FbmNvZGluZ1BhcmFtZXRlcnNcbiAgICAgKiBAZGVzYyBNYXggYml0cmF0ZSBleHByZXNzZWQgaW4ga2Jwcy5cbiAgICAgKi9cbiAgICB0aGlzLm1heEJpdHJhdGUgPSBtYXhCaXRyYXRlO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFZpZGVvQ29kZWNcbiAqIEBtZW1iZXJPZiBPd3QuQmFzZVxuICogQGNsYXNzRGVzYyBWaWRlbyBjb2RlYyBlbnVtZXJhdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNvbnN0IFZpZGVvQ29kZWMgPSB7XG4gIFZQODogJ3ZwOCcsXG4gIFZQOTogJ3ZwOScsXG4gIEgyNjQ6ICdoMjY0JyxcbiAgSDI2NTogJ2gyNjUnLFxufTtcblxuLyoqXG4gKiBAY2xhc3MgVmlkZW9Db2RlY1BhcmFtZXRlcnNcbiAqIEBtZW1iZXJPZiBPd3QuQmFzZVxuICogQGNsYXNzRGVzYyBDb2RlYyBwYXJhbWV0ZXJzIGZvciBhIHZpZGVvIHRyYWNrLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9Db2RlY1BhcmFtZXRlcnMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihuYW1lLCBwcm9maWxlKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBuYW1lXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlZpZGVvQ29kZWNQYXJhbWV0ZXJzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgTmFtZSBvZiBhIGNvZGVjLiBQbGVhc2UgdXNlIGEgdmFsdWUgaW4gT3d0LkJhc2UuVmlkZW9Db2RlYy4gSG93ZXZlciwgc29tZSBmdW5jdGlvbnMgZG8gbm90IHN1cHBvcnQgYWxsIHRoZSB2YWx1ZXMgaW4gT3d0LkJhc2UuQXVkaW9Db2RlYy5cbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9zdHJpbmd9IHByb2ZpbGVcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9Db2RlY1BhcmFtZXRlcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBUaGUgcHJvZmlsZSBvZiBhIGNvZGVjLiBQcm9maWxlIG1heSBub3QgYXBwbHkgdG8gYWxsIGNvZGVjcy5cbiAgICAgKi9cbiAgICB0aGlzLnByb2ZpbGUgPSBwcm9maWxlO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFZpZGVvRW5jb2RpbmdQYXJhbWV0ZXJzXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBjbGFzc0Rlc2MgRW5jb2RpbmcgcGFyYW1ldGVycyBmb3Igc2VuZGluZyBhIHZpZGVvIHRyYWNrLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcihjb2RlYywgbWF4Qml0cmF0ZSkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9Pd3QuQmFzZS5WaWRlb0NvZGVjUGFyYW1ldGVyc30gY29kZWNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnNcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjID0gY29kZWM7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gbWF4Qml0cmF0ZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5WaWRlb0VuY29kaW5nUGFyYW1ldGVyc1xuICAgICAqIEBkZXNjIE1heCBiaXRyYXRlIGV4cHJlc3NlZCBpbiBrYnBzLlxuICAgICAqL1xuICAgIHRoaXMubWF4Qml0cmF0ZSA9IG1heEJpdHJhdGU7XG4gIH1cbn1cbiIsIi8vIE1JVCBMaWNlbnNlXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDEyIFVuaXZlcnNpZGFkIFBvbGl0w6ljbmljYSBkZSBNYWRyaWRcbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4vLyBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbi8vIFNPRlRXQVJFLlxuXG4vLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8vIFRoaXMgZmlsZSBpcyBib3Jyb3dlZCBmcm9tIGx5bmNraWEvbGljb2RlIHdpdGggc29tZSBtb2RpZmljYXRpb25zLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQGNsYXNzIEV2ZW50RGlzcGF0Y2hlclxuICogQGNsYXNzRGVzYyBBIHNoaW0gZm9yIEV2ZW50VGFyZ2V0LiBNaWdodCBiZSBjaGFuZ2VkIHRvIEV2ZW50VGFyZ2V0IGxhdGVyLlxuICogQG1lbWJlcm9mIE93dC5CYXNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjb25zdCBFdmVudERpc3BhdGNoZXIgPSBmdW5jdGlvbigpIHtcbiAgLy8gUHJpdmF0ZSB2YXJzXG4gIGNvbnN0IHNwZWMgPSB7fTtcbiAgc3BlYy5kaXNwYXRjaGVyID0ge307XG4gIHNwZWMuZGlzcGF0Y2hlci5ldmVudExpc3RlbmVycyA9IHt9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lclxuICAgKiBAZGVzYyBUaGlzIGZ1bmN0aW9uIHJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIGFzIGEgaGFuZGxlciBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgZXZlbnQuIEl0J3Mgc2hvcnRlbmVkIGZvcm0gaXMgb24oZXZlbnRUeXBlLCBsaXN0ZW5lcikuIFNlZSB0aGUgZXZlbnQgZGVzY3JpcHRpb24gaW4gdGhlIGZvbGxvd2luZyB0YWJsZS5cbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBFdmVudCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIENhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgdGhpcy5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lcikge1xuICAgIGlmIChzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXSA9IFtdO1xuICAgIH1cbiAgICBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICogQGRlc2MgVGhpcyBmdW5jdGlvbiByZW1vdmVzIGEgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lci5cbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBFdmVudCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIENhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lcikge1xuICAgIGlmICghc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50VHlwZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5kZXggPSBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXS5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGNsZWFyRXZlbnRMaXN0ZW5lclxuICAgKiBAZGVzYyBUaGlzIGZ1bmN0aW9uIHJlbW92ZXMgYWxsIGV2ZW50IGxpc3RlbmVycyBmb3Igb25lIHR5cGUuXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgRXZlbnQgc3RyaW5nLlxuICAgKi9cbiAgdGhpcy5jbGVhckV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudFR5cGUpIHtcbiAgICBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXSA9IFtdO1xuICB9O1xuXG4gIC8vIEl0IGRpc3BhdGNoIGEgbmV3IGV2ZW50IHRvIHRoZSBldmVudCBsaXN0ZW5lcnMsIGJhc2VkIG9uIHRoZSB0eXBlXG4gIC8vIG9mIGV2ZW50LiBBbGwgZXZlbnRzIGFyZSBpbnRlbmRlZCB0byBiZSBMaWNvZGVFdmVudHMuXG4gIHRoaXMuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKCFzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnQudHlwZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50LnR5cGVdLm1hcChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgbGlzdGVuZXIoZXZlbnQpO1xuICAgIH0pO1xuICB9O1xufTtcblxuLyoqXG4gKiBAY2xhc3MgT3d0RXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgT3d0RXZlbnQgcmVwcmVzZW50cyBhIGdlbmVyaWMgRXZlbnQgaW4gdGhlIGxpYnJhcnkuXG4gKiBAbWVtYmVyb2YgT3d0LkJhc2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIE93dEV2ZW50IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IodHlwZSkge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgTWVzc2FnZUV2ZW50XG4gKiBAY2xhc3NEZXNjIENsYXNzIE1lc3NhZ2VFdmVudCByZXByZXNlbnRzIGEgbWVzc2FnZSBFdmVudCBpbiB0aGUgbGlicmFyeS5cbiAqIEBtZW1iZXJvZiBPd3QuQmFzZVxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgTWVzc2FnZUV2ZW50IGV4dGVuZHMgT3d0RXZlbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBvcmlnaW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuTWVzc2FnZUV2ZW50XG4gICAgICogQGRlc2MgSUQgb2YgdGhlIHJlbW90ZSBlbmRwb2ludCB3aG8gcHVibGlzaGVkIHRoaXMgc3RyZWFtLlxuICAgICAqL1xuICAgIHRoaXMub3JpZ2luID0gaW5pdC5vcmlnaW47XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBtZXNzYWdlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLk1lc3NhZ2VFdmVudFxuICAgICAqL1xuICAgIHRoaXMubWVzc2FnZSA9IGluaXQubWVzc2FnZTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IHRvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLk1lc3NhZ2VFdmVudFxuICAgICAqIEBkZXNjIFZhbHVlcyBjb3VsZCBiZSBcImFsbFwiLCBcIm1lXCIgaW4gY29uZmVyZW5jZSBtb2RlLCBvciB1bmRlZmluZWQgaW4gUDJQIG1vZGUuLlxuICAgICAqL1xuICAgIHRoaXMudG8gPSBpbml0LnRvO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIEVycm9yRXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgRXJyb3JFdmVudCByZXByZXNlbnRzIGFuIGVycm9yIEV2ZW50IGluIHRoZSBsaWJyYXJ5LlxuICogQG1lbWJlcm9mIE93dC5CYXNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBFcnJvckV2ZW50IGV4dGVuZHMgT3d0RXZlbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7RXJyb3J9IGVycm9yXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLkVycm9yRXZlbnRcbiAgICAgKi9cbiAgICB0aGlzLmVycm9yID0gaW5pdC5lcnJvcjtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBNdXRlRXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgTXV0ZUV2ZW50IHJlcHJlc2VudHMgYSBtdXRlIG9yIHVubXV0ZSBldmVudC5cbiAqIEBtZW1iZXJvZiBPd3QuQmFzZVxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgTXV0ZUV2ZW50IGV4dGVuZHMgT3d0RXZlbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T3d0LkJhc2UuVHJhY2tLaW5kfSBraW5kXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLk11dGVFdmVudFxuICAgICAqL1xuICAgIHRoaXMua2luZCA9IGluaXQua2luZDtcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbWVkaWFzdHJlYW0tZmFjdG9yeS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL3N0cmVhbS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL21lZGlhZm9ybWF0LmpzJztcbiIsIi8vIE1JVCBMaWNlbnNlXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDEyIFVuaXZlcnNpZGFkIFBvbGl0w6ljbmljYSBkZSBNYWRyaWRcbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4vLyBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbi8vIFNPRlRXQVJFLlxuXG4vLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8vIFRoaXMgZmlsZSBpcyBib3Jyb3dlZCBmcm9tIGx5bmNraWEvbGljb2RlIHdpdGggc29tZSBtb2RpZmljYXRpb25zLlxuXG4vKiBnbG9iYWwgY29uc29sZSx3aW5kb3cgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICogQVBJIHRvIHdyaXRlIGxvZ3MgYmFzZWQgb24gdHJhZGl0aW9uYWwgbG9nZ2luZyBtZWNoYW5pc21zOiBkZWJ1ZywgdHJhY2UsXG4gKiBpbmZvLCB3YXJuaW5nLCBlcnJvclxuICovXG5jb25zdCBMb2dnZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGNvbnN0IERFQlVHID0gMDtcbiAgY29uc3QgVFJBQ0UgPSAxO1xuICBjb25zdCBJTkZPID0gMjtcbiAgY29uc3QgV0FSTklORyA9IDM7XG4gIGNvbnN0IEVSUk9SID0gNDtcbiAgY29uc3QgTk9ORSA9IDU7XG5cbiAgY29uc3Qgbm9PcCA9IGZ1bmN0aW9uKCkge307XG5cbiAgLy8gfHRoYXR8IGlzIHRoZSBvYmplY3QgdG8gYmUgcmV0dXJuZWQuXG4gIGNvbnN0IHRoYXQgPSB7XG4gICAgREVCVUc6IERFQlVHLFxuICAgIFRSQUNFOiBUUkFDRSxcbiAgICBJTkZPOiBJTkZPLFxuICAgIFdBUk5JTkc6IFdBUk5JTkcsXG4gICAgRVJST1I6IEVSUk9SLFxuICAgIE5PTkU6IE5PTkUsXG4gIH07XG5cbiAgdGhhdC5sb2cgPSB3aW5kb3cuY29uc29sZS5sb2cuYmluZCh3aW5kb3cuY29uc29sZSk7XG5cbiAgY29uc3QgYmluZFR5cGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuY29uc29sZVt0eXBlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHdpbmRvdy5jb25zb2xlW3R5cGVdLmJpbmQod2luZG93LmNvbnNvbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gd2luZG93LmNvbnNvbGUubG9nLmJpbmQod2luZG93LmNvbnNvbGUpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzZXRMb2dMZXZlbCA9IGZ1bmN0aW9uKGxldmVsKSB7XG4gICAgaWYgKGxldmVsIDw9IERFQlVHKSB7XG4gICAgICB0aGF0LmRlYnVnID0gYmluZFR5cGUoJ2xvZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0LmRlYnVnID0gbm9PcDtcbiAgICB9XG4gICAgaWYgKGxldmVsIDw9IFRSQUNFKSB7XG4gICAgICB0aGF0LnRyYWNlID0gYmluZFR5cGUoJ3RyYWNlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQudHJhY2UgPSBub09wO1xuICAgIH1cbiAgICBpZiAobGV2ZWwgPD0gSU5GTykge1xuICAgICAgdGhhdC5pbmZvID0gYmluZFR5cGUoJ2luZm8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5pbmZvID0gbm9PcDtcbiAgICB9XG4gICAgaWYgKGxldmVsIDw9IFdBUk5JTkcpIHtcbiAgICAgIHRoYXQud2FybmluZyA9IGJpbmRUeXBlKCd3YXJuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQud2FybmluZyA9IG5vT3A7XG4gICAgfVxuICAgIGlmIChsZXZlbCA8PSBFUlJPUikge1xuICAgICAgdGhhdC5lcnJvciA9IGJpbmRUeXBlKCdlcnJvcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0LmVycm9yID0gbm9PcDtcbiAgICB9XG4gIH07XG5cbiAgc2V0TG9nTGV2ZWwoREVCVUcpOyAvLyBEZWZhdWx0IGxldmVsIGlzIGRlYnVnLlxuXG4gIHRoYXQuc2V0TG9nTGV2ZWwgPSBzZXRMb2dMZXZlbDtcblxuICByZXR1cm4gdGhhdDtcbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvZ2dlcjtcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAY2xhc3MgQXVkaW9Tb3VyY2VJbmZvXG4gKiBAY2xhc3NEZXNjIFNvdXJjZSBpbmZvIGFib3V0IGFuIGF1ZGlvIHRyYWNrLiBWYWx1ZXM6ICdtaWMnLCAnc2NyZWVuLWNhc3QnLCAnZmlsZScsICdtaXhlZCcuXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IEF1ZGlvU291cmNlSW5mbyA9IHtcbiAgTUlDOiAnbWljJyxcbiAgU0NSRUVOQ0FTVDogJ3NjcmVlbi1jYXN0JyxcbiAgRklMRTogJ2ZpbGUnLFxuICBNSVhFRDogJ21peGVkJyxcbn07XG5cbi8qKlxuICogQGNsYXNzIFZpZGVvU291cmNlSW5mb1xuICogQGNsYXNzRGVzYyBTb3VyY2UgaW5mbyBhYm91dCBhIHZpZGVvIHRyYWNrLiBWYWx1ZXM6ICdjYW1lcmEnLCAnc2NyZWVuLWNhc3QnLCAnZmlsZScsICdtaXhlZCcuXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IFZpZGVvU291cmNlSW5mbyA9IHtcbiAgQ0FNRVJBOiAnY2FtZXJhJyxcbiAgU0NSRUVOQ0FTVDogJ3NjcmVlbi1jYXN0JyxcbiAgRklMRTogJ2ZpbGUnLFxuICBNSVhFRDogJ21peGVkJyxcbn07XG5cbi8qKlxuICogQGNsYXNzIFRyYWNrS2luZFxuICogQGNsYXNzRGVzYyBLaW5kIG9mIGEgdHJhY2suIFZhbHVlczogJ2F1ZGlvJyBmb3IgYXVkaW8gdHJhY2ssICd2aWRlbycgZm9yIHZpZGVvIHRyYWNrLCAnYXYnIGZvciBib3RoIGF1ZGlvIGFuZCB2aWRlbyB0cmFja3MuXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IFRyYWNrS2luZCA9IHtcbiAgLyoqXG4gICAqIEF1ZGlvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBBVURJTzogJ2F1ZGlvJyxcbiAgLyoqXG4gICAqIFZpZGVvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBWSURFTzogJ3ZpZGVvJyxcbiAgLyoqXG4gICAqIEJvdGggYXVkaW8gYW5kIHZpZGVvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBBVURJT19BTkRfVklERU86ICdhdicsXG59O1xuLyoqXG4gKiBAY2xhc3MgUmVzb2x1dGlvblxuICogQG1lbWJlck9mIE93dC5CYXNlXG4gKiBAY2xhc3NEZXNjIFRoZSBSZXNvbHV0aW9uIGRlZmluZXMgdGhlIHNpemUgb2YgYSByZWN0YW5nbGUuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICovXG5leHBvcnQgY2xhc3MgUmVzb2x1dGlvbiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IHdpZHRoXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlJlc29sdXRpb25cbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7bnVtYmVyfSBoZWlnaHRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuUmVzb2x1dGlvblxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8qIGdsb2JhbCBjb25zb2xlLCB3aW5kb3csIFByb21pc2UsIGNocm9tZSwgbmF2aWdhdG9yICovXG5cbid1c2Ugc3RyaWN0JztcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlci5qcyc7XG5pbXBvcnQgKiBhcyBNZWRpYUZvcm1hdE1vZHVsZSBmcm9tICcuL21lZGlhZm9ybWF0LmpzJztcblxuLyoqXG4gKiBAY2xhc3MgQXVkaW9UcmFja0NvbnN0cmFpbnRzXG4gKiBAY2xhc3NEZXNjIENvbnN0cmFpbnRzIGZvciBjcmVhdGluZyBhbiBhdWRpbyBNZWRpYVN0cmVhbVRyYWNrLlxuICogQG1lbWJlcm9mIE93dC5CYXNlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T3d0LkJhc2UuQXVkaW9Tb3VyY2VJbmZvfSBzb3VyY2UgU291cmNlIGluZm8gb2YgdGhpcyBhdWRpbyB0cmFjay5cbiAqL1xuZXhwb3J0IGNsYXNzIEF1ZGlvVHJhY2tDb25zdHJhaW50cyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuICAgIGlmICghT2JqZWN0LnZhbHVlcyhNZWRpYUZvcm1hdE1vZHVsZS5BdWRpb1NvdXJjZUluZm8pXG4gICAgICAgIC5zb21lKCh2KSA9PiB2ID09PSBzb3VyY2UpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHNvdXJjZS4nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBzb3VyY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuQXVkaW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgVmFsdWVzIGNvdWxkIGJlIFwibWljXCIsIFwic2NyZWVuLWNhc3RcIiwgXCJmaWxlXCIgb3IgXCJtaXhlZFwiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gZGV2aWNlSWRcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuQXVkaW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgRG8gbm90IHByb3ZpZGUgZGV2aWNlSWQgaWYgc291cmNlIGlzIG5vdCBcIm1pY1wiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBzZWUgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL21lZGlhY2FwdHVyZS1tYWluLyNkZWYtY29uc3RyYWludC1kZXZpY2VJZFxuICAgICAqL1xuICAgIHRoaXMuZGV2aWNlSWQgPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gKiBAY2xhc3NEZXNjIENvbnN0cmFpbnRzIGZvciBjcmVhdGluZyBhIHZpZGVvIE1lZGlhU3RyZWFtVHJhY2suXG4gKiBAbWVtYmVyb2YgT3d0LkJhc2VcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPd3QuQmFzZS5WaWRlb1NvdXJjZUluZm99IHNvdXJjZSBTb3VyY2UgaW5mbyBvZiB0aGlzIHZpZGVvIHRyYWNrLlxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9UcmFja0NvbnN0cmFpbnRzIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3Ioc291cmNlKSB7XG4gICAgaWYgKCFPYmplY3QudmFsdWVzKE1lZGlhRm9ybWF0TW9kdWxlLlZpZGVvU291cmNlSW5mbylcbiAgICAgIC5zb21lKCh2KSA9PiB2ID09PSBzb3VyY2UpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHNvdXJjZS4nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBzb3VyY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgVmFsdWVzIGNvdWxkIGJlIFwiY2FtZXJhXCIsIFwic2NyZWVuLWNhc3RcIiwgXCJmaWxlXCIgb3IgXCJtaXhlZFwiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gZGV2aWNlSWRcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgRG8gbm90IHByb3ZpZGUgZGV2aWNlSWQgaWYgc291cmNlIGlzIG5vdCBcImNhbWVyYVwiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBzZWUgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL21lZGlhY2FwdHVyZS1tYWluLyNkZWYtY29uc3RyYWludC1kZXZpY2VJZFxuICAgICAqL1xuXG4gICAgdGhpcy5kZXZpY2VJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge093dC5CYXNlLlJlc29sdXRpb259IHJlc29sdXRpb25cbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9uID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7bnVtYmVyfSBmcmFtZVJhdGVcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgdGhpcy5mcmFtZVJhdGUgPSB1bmRlZmluZWQ7XG4gIH1cbn1cbi8qKlxuICogQGNsYXNzIFN0cmVhbUNvbnN0cmFpbnRzXG4gKiBAY2xhc3NEZXNjIENvbnN0cmFpbnRzIGZvciBjcmVhdGluZyBhIE1lZGlhU3RyZWFtIGZyb20gc2NyZWVuIG1pYyBhbmQgY2FtZXJhLlxuICogQG1lbWJlcm9mIE93dC5CYXNlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7P093dC5CYXNlLkF1ZGlvVHJhY2tDb25zdHJhaW50c30gYXVkaW9Db25zdHJhaW50c1xuICogQHBhcmFtIHs/T3d0LkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzfSB2aWRlb0NvbnN0cmFpbnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJlYW1Db25zdHJhaW50cyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGF1ZGlvQ29uc3RyYWludHMgPSBmYWxzZSwgdmlkZW9Db25zdHJhaW50cyA9IGZhbHNlKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T3d0LkJhc2UuTWVkaWFTdHJlYW1UcmFja0RldmljZUNvbnN0cmFpbnRzRm9yQXVkaW99IGF1ZGlvXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLk1lZGlhU3RyZWFtRGV2aWNlQ29uc3RyYWludHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICB0aGlzLmF1ZGlvID0gYXVkaW9Db25zdHJhaW50cztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtPd3QuQmFzZS5NZWRpYVN0cmVhbVRyYWNrRGV2aWNlQ29uc3RyYWludHNGb3JWaWRlb30gVmlkZW9cbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuTWVkaWFTdHJlYW1EZXZpY2VDb25zdHJhaW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMudmlkZW8gPSB2aWRlb0NvbnN0cmFpbnRzO1xuICB9XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG5mdW5jdGlvbiBpc1ZpZGVvQ29uc3RyYWluc0ZvclNjcmVlbkNhc3QoY29uc3RyYWludHMpIHtcbiAgcmV0dXJuICh0eXBlb2YgY29uc3RyYWludHMudmlkZW8gPT09ICdvYmplY3QnICYmIGNvbnN0cmFpbnRzLnZpZGVvLnNvdXJjZSA9PT1cbiAgICBNZWRpYUZvcm1hdE1vZHVsZS5WaWRlb1NvdXJjZUluZm8uU0NSRUVOQ0FTVCk7XG59XG5cbi8qKlxuICogQGNsYXNzIE1lZGlhU3RyZWFtRmFjdG9yeVxuICogQGNsYXNzRGVzYyBBIGZhY3RvcnkgdG8gY3JlYXRlIE1lZGlhU3RyZWFtLiBZb3UgY2FuIGFsc28gY3JlYXRlIE1lZGlhU3RyZWFtIGJ5IHlvdXJzZWxmLlxuICogQG1lbWJlcm9mIE93dC5CYXNlXG4gKi9cbmV4cG9ydCBjbGFzcyBNZWRpYVN0cmVhbUZhY3Rvcnkge1xuICAvKipcbiAgICogQGZ1bmN0aW9uIGNyZWF0ZU1lZGlhU3RyZWFtXG4gICAqIEBzdGF0aWNcbiAgICogQGRlc2MgQ3JlYXRlIGEgTWVkaWFTdHJlYW0gd2l0aCBnaXZlbiBjb25zdHJhaW50cy4gSWYgeW91IHdhbnQgdG8gY3JlYXRlIGEgTWVkaWFTdHJlYW0gZm9yIHNjcmVlbiBjYXN0LCBwbGVhc2UgbWFrZSBzdXJlIGJvdGggYXVkaW8gYW5kIHZpZGVvJ3Mgc291cmNlIGFyZSBcInNjcmVlbi1jYXN0XCIuXG4gICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5NZWRpYVN0cmVhbUZhY3RvcnlcbiAgICogQHJldHVybnMge1Byb21pc2U8TWVkaWFTdHJlYW0sIEVycm9yPn0gUmV0dXJuIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gc3RyZWFtIGlzIHN1Y2Nlc3NmdWxseSBjcmVhdGVkLCBvciByZWplY3RlZCBpZiBvbmUgb2YgdGhlIGZvbGxvd2luZyBlcnJvciBoYXBwZW5lZDpcbiAgICogLSBPbmUgb3IgbW9yZSBwYXJhbWV0ZXJzIGNhbm5vdCBiZSBzYXRpc2ZpZWQuXG4gICAqIC0gU3BlY2lmaWVkIGRldmljZSBpcyBidXN5LlxuICAgKiAtIENhbm5vdCBvYnRhaW4gbmVjZXNzYXJ5IHBlcm1pc3Npb24gb3Igb3BlcmF0aW9uIGlzIGNhbmNlbGVkIGJ5IHVzZXIuXG4gICAqIC0gVmlkZW8gc291cmNlIGlzIHNjcmVlbiBjYXN0LCB3aGlsZSBhdWRpbyBzb3VyY2UgaXMgbm90LlxuICAgKiAtIEF1ZGlvIHNvdXJjZSBpcyBzY3JlZW4gY2FzdCwgd2hpbGUgdmlkZW8gc291cmNlIGlzIGRpc2FibGVkLlxuICAgKiBAcGFyYW0ge093dC5CYXNlLlN0cmVhbUNvbnN0cmFpbnRzfSBjb25zdHJhaW50c1xuICAgKi9cbiAgc3RhdGljIGNyZWF0ZU1lZGlhU3RyZWFtKGNvbnN0cmFpbnRzKSB7XG4gICAgaWYgKHR5cGVvZiBjb25zdHJhaW50cyAhPT0gJ29iamVjdCcgfHxcbiAgICAgICAgKCFjb25zdHJhaW50cy5hdWRpbyAmJiAhY29uc3RyYWludHMudmlkZW8pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignSW52YWxpZCBjb25zdHJhaW5zJykpO1xuICAgIH1cbiAgICBpZiAoIWlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykgJiZcbiAgICAgICAgKHR5cGVvZiBjb25zdHJhaW50cy5hdWRpbyA9PT0gJ29iamVjdCcpICYmXG4gICAgICAgIGNvbnN0cmFpbnRzLmF1ZGlvLnNvdXJjZSA9PT1cbiAgICAgICAgICAgIE1lZGlhRm9ybWF0TW9kdWxlLkF1ZGlvU291cmNlSW5mby5TQ1JFRU5DQVNUKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgICAgbmV3IFR5cGVFcnJvcignQ2Fubm90IHNoYXJlIHNjcmVlbiB3aXRob3V0IHZpZGVvLicpKTtcbiAgICB9XG4gICAgaWYgKGlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykgJiZcbiAgICAgICAgdHlwZW9mIGNvbnN0cmFpbnRzLmF1ZGlvID09PSAnb2JqZWN0JyAmJlxuICAgICAgICBjb25zdHJhaW50cy5hdWRpby5zb3VyY2UgIT09XG4gICAgICAgICAgICBNZWRpYUZvcm1hdE1vZHVsZS5BdWRpb1NvdXJjZUluZm8uU0NSRUVOQ0FTVCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBjYXB0dXJlIHZpZGVvIGZyb20gc2NyZWVuIGNhc3Qgd2hpbGUgY2FwdHVyZSBhdWRpbyBmcm9tJ1xuICAgICAgICAgICsgJyBvdGhlciBzb3VyY2UuJykpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGFuZCBjb252ZXJ0IGNvbnN0cmFpbnRzLlxuICAgIGlmICghY29uc3RyYWludHMuYXVkaW8gJiYgIWNvbnN0cmFpbnRzLnZpZGVvKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0F0IGxlYXN0IG9uZSBvZiBhdWRpbyBhbmQgdmlkZW8gbXVzdCBiZSByZXF1ZXN0ZWQuJykpO1xuICAgIH1cbiAgICBjb25zdCBtZWRpYUNvbnN0cmFpbnRzID0gT2JqZWN0LmNyZWF0ZSh7fSk7XG4gICAgaWYgKHR5cGVvZiBjb25zdHJhaW50cy5hdWRpbyA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgY29uc3RyYWludHMuYXVkaW8uc291cmNlID09PSBNZWRpYUZvcm1hdE1vZHVsZS5BdWRpb1NvdXJjZUluZm8uTUlDKSB7XG4gICAgICBtZWRpYUNvbnN0cmFpbnRzLmF1ZGlvID0gT2JqZWN0LmNyZWF0ZSh7fSk7XG4gICAgICBpZiAodXRpbHMuaXNFZGdlKCkpIHtcbiAgICAgICAgbWVkaWFDb25zdHJhaW50cy5hdWRpby5kZXZpY2VJZCA9IGNvbnN0cmFpbnRzLmF1ZGlvLmRldmljZUlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVkaWFDb25zdHJhaW50cy5hdWRpby5kZXZpY2VJZCA9IHtcbiAgICAgICAgICBleGFjdDogY29uc3RyYWludHMuYXVkaW8uZGV2aWNlSWQsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb25zdHJhaW50cy5hdWRpby5zb3VyY2UgPT09IE1lZGlhRm9ybWF0TW9kdWxlLkF1ZGlvU291cmNlSW5mby5TQ1JFRU5DQVNUKSB7XG4gICAgICAgIG1lZGlhQ29uc3RyYWludHMuYXVkaW8gPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVkaWFDb25zdHJhaW50cy5hdWRpbyA9IGNvbnN0cmFpbnRzLmF1ZGlvO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnRzLnZpZGVvID09PSAnb2JqZWN0Jykge1xuICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlbyA9IE9iamVjdC5jcmVhdGUoe30pO1xuICAgICAgaWYgKHR5cGVvZiBjb25zdHJhaW50cy52aWRlby5mcmFtZVJhdGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8uZnJhbWVSYXRlID0gY29uc3RyYWludHMudmlkZW8uZnJhbWVSYXRlO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24gJiZcbiAgICAgICAgICBjb25zdHJhaW50cy52aWRlby5yZXNvbHV0aW9uLndpZHRoICYmXG4gICAgICAgICAgY29uc3RyYWludHMudmlkZW8ucmVzb2x1dGlvbi5oZWlnaHQpIHtcbiAgICAgICAgICAgIGlmIChjb25zdHJhaW50cy52aWRlby5zb3VyY2UgPT09XG4gICAgICAgICAgICAgIE1lZGlhRm9ybWF0TW9kdWxlLlZpZGVvU291cmNlSW5mby5TQ1JFRU5DQVNUKSB7XG4gICAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ud2lkdGggPVxuICAgICAgICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24ud2lkdGg7XG4gICAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8uaGVpZ2h0ID1cbiAgICAgICAgICAgICAgICBjb25zdHJhaW50cy52aWRlby5yZXNvbHV0aW9uLmhlaWdodDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ud2lkdGggPSBPYmplY3QuY3JlYXRlKHt9KTtcbiAgICAgICAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby53aWR0aC5leGFjdCA9XG4gICAgICAgICAgICAgICAgICBjb25zdHJhaW50cy52aWRlby5yZXNvbHV0aW9uLndpZHRoO1xuICAgICAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLmhlaWdodCA9IE9iamVjdC5jcmVhdGUoe30pO1xuICAgICAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLmhlaWdodC5leGFjdCA9XG4gICAgICAgICAgICAgICAgICBjb25zdHJhaW50cy52aWRlby5yZXNvbHV0aW9uLmhlaWdodDtcblxuICAgICAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBjb25zdHJhaW50cy52aWRlby5kZXZpY2VJZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby5kZXZpY2VJZCA9IHsgZXhhY3Q6IGNvbnN0cmFpbnRzLnZpZGVvLmRldmljZUlkIH07XG4gICAgICB9XG4gICAgICBpZiAodXRpbHMuaXNGaXJlZm94KCkgJiZcbiAgICAgICAgICBjb25zdHJhaW50cy52aWRlby5zb3VyY2UgPT09XG4gICAgICAgICAgICAgIE1lZGlhRm9ybWF0TW9kdWxlLlZpZGVvU291cmNlSW5mby5TQ1JFRU5DQVNUKSB7XG4gICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ubWVkaWFTb3VyY2UgPSAnc2NyZWVuJztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlbyA9IGNvbnN0cmFpbnRzLnZpZGVvO1xuICAgIH1cblxuICAgIGlmIChpc1ZpZGVvQ29uc3RyYWluc0ZvclNjcmVlbkNhc3QoY29uc3RyYWludHMpKSB7XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXREaXNwbGF5TWVkaWEobWVkaWFDb25zdHJhaW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShtZWRpYUNvbnN0cmFpbnRzKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIE1lZGlhRm9ybWF0IGZyb20gJy4vbWVkaWFmb3JtYXQuanMnO1xuaW1wb3J0IHtFdmVudERpc3BhdGNoZXJ9IGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnO1xuXG4vKipcbiAqIEBjbGFzcyBBdWRpb1B1YmxpY2F0aW9uU2V0dGluZ3NcbiAqIEBtZW1iZXJPZiBPd3QuQmFzZVxuICogQGNsYXNzRGVzYyBUaGUgYXVkaW8gc2V0dGluZ3Mgb2YgYSBwdWJsaWNhdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEF1ZGlvUHVibGljYXRpb25TZXR0aW5ncyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGNvZGVjKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P093dC5CYXNlLkF1ZGlvQ29kZWNQYXJhbWV0ZXJzfSBjb2RlY1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5BdWRpb1B1YmxpY2F0aW9uU2V0dGluZ3NcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjID0gY29kZWM7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBjbGFzc0Rlc2MgVGhlIHZpZGVvIHNldHRpbmdzIG9mIGEgcHVibGljYXRpb24uXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWRlb1B1YmxpY2F0aW9uU2V0dGluZ3Mge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcihjb2RlYywgcmVzb2x1dGlvbiwgZnJhbWVSYXRlLCBiaXRyYXRlLCBrZXlGcmFtZUludGVydmFsLCByaWQpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/T3d0LkJhc2UuVmlkZW9Db2RlY1BhcmFtZXRlcnN9IGNvZGVjXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuY29kZWM9Y29kZWMsXG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P093dC5CYXNlLlJlc29sdXRpb259IHJlc29sdXRpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9uPXJlc29sdXRpb247XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gZnJhbWVSYXRlc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBjbGFzc0Rlc2MgRnJhbWVzIHBlciBzZWNvbmQuXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuZnJhbWVSYXRlPWZyYW1lUmF0ZTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBiaXRyYXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuYml0cmF0ZT1iaXRyYXRlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGtleUZyYW1lSW50ZXJ2YWxzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGNsYXNzRGVzYyBUaGUgdGltZSBpbnRlcnZhbCBiZXR3ZWVuIGtleSBmcmFtZXMuIFVuaXQ6IHNlY29uZC5cbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy5rZXlGcmFtZUludGVydmFsPWtleUZyYW1lSW50ZXJ2YWw7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gcmlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGNsYXNzRGVzYyBSZXN0cmljdGlvbiBpZGVudGlmaWVyIHRvIGlkZW50aWZ5IHRoZSBSVFAgU3RyZWFtcyB3aXRoaW4gYW4gUlRQIHNlc3Npb24uXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMucmlkPXJpZDtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBQdWJsaWNhdGlvblNldHRpbmdzXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBjbGFzc0Rlc2MgVGhlIHNldHRpbmdzIG9mIGEgcHVibGljYXRpb24uXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBQdWJsaWNhdGlvblNldHRpbmdzIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoYXVkaW8sIHZpZGVvKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T3d0LkJhc2UuQXVkaW9QdWJsaWNhdGlvblNldHRpbmdzW119IGF1ZGlvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlB1YmxpY2F0aW9uU2V0dGluZ3NcbiAgICAgKi9cbiAgICB0aGlzLmF1ZGlvPWF1ZGlvO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge093dC5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1tdfSB2aWRlb1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy52aWRlbz12aWRlbztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBQdWJsaWNhdGlvblxuICogQGV4dGVuZHMgT3d0LkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBjbGFzc0Rlc2MgUHVibGljYXRpb24gcmVwcmVzZW50cyBhIHNlbmRlciBmb3IgcHVibGlzaGluZyBhIHN0cmVhbS4gSXRcbiAqIGhhbmRsZXMgdGhlIGFjdGlvbnMgb24gYSBMb2NhbFN0cmVhbSBwdWJsaXNoZWQgdG8gYSBjb25mZXJlbmNlLlxuICpcbiAqIEV2ZW50czpcbiAqXG4gKiB8IEV2ZW50IE5hbWUgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgfCBGaXJlZCB3aGVuICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0tLS0tLXwgLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBlbmRlZCAgICAgICAgICAgfCBFdmVudCAgICAgICAgICAgIHwgUHVibGljYXRpb24gaXMgZW5kZWQuIHxcbiAqIHwgZXJyb3IgICAgICAgICAgIHwgRXJyb3JFdmVudCAgICAgICB8IEFuIGVycm9yIG9jY3VycmVkIG9uIHRoZSBwdWJsaWNhdGlvbi4gfFxuICogfCBtdXRlICAgICAgICAgICAgfCBNdXRlRXZlbnQgICAgICAgIHwgUHVibGljYXRpb24gaXMgbXV0ZWQuIENsaWVudCBzdG9wcGVkIHNlbmRpbmcgYXVkaW8gYW5kL29yIHZpZGVvIGRhdGEgdG8gcmVtb3RlIGVuZHBvaW50LiB8XG4gKiB8IHVubXV0ZSAgICAgICAgICB8IE11dGVFdmVudCAgICAgICAgfCBQdWJsaWNhdGlvbiBpcyB1bm11dGVkLiBDbGllbnQgY29udGludWVkIHNlbmRpbmcgYXVkaW8gYW5kL29yIHZpZGVvIGRhdGEgdG8gcmVtb3RlIGVuZHBvaW50LiB8XG4gKlxuICogYGVuZGVkYCBldmVudCBtYXkgbm90IGJlIGZpcmVkIG9uIFNhZmFyaSBhZnRlciBjYWxsaW5nIGBQdWJsaWNhdGlvbi5zdG9wKClgLlxuICpcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFB1YmxpY2F0aW9uIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoaWQsIHN0b3AsIGdldFN0YXRzLCBtdXRlLCB1bm11dGUpIHtcbiAgICBzdXBlcigpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gaWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuUHVibGljYXRpb25cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2lkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBpZCA/IGlkIDogVXRpbHMuY3JlYXRlVXVpZCgpLFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBzdG9wXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCBjZXJ0YWluIHB1YmxpY2F0aW9uLiBPbmNlIGEgc3Vic2NyaXB0aW9uIGlzIHN0b3BwZWQsIGl0IGNhbm5vdCBiZSByZWNvdmVyZWQuXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlB1YmxpY2F0aW9uXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICB0aGlzLnN0b3AgPSBzdG9wO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBnZXRTdGF0c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIEdldCBzdGF0cyBvZiB1bmRlcmx5aW5nIFBlZXJDb25uZWN0aW9uLlxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5QdWJsaWNhdGlvblxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFJUQ1N0YXRzUmVwb3J0LCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5nZXRTdGF0cyA9IGdldFN0YXRzO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBtdXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCBzZW5kaW5nIGRhdGEgdG8gcmVtb3RlIGVuZHBvaW50LlxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5QdWJsaWNhdGlvblxuICAgICAqIEBwYXJhbSB7T3d0LkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSBtdXRlZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn1cbiAgICAgKi9cbiAgICB0aGlzLm11dGUgPSBtdXRlO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiB1bm11dGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBDb250aW51ZSBzZW5kaW5nIGRhdGEgdG8gcmVtb3RlIGVuZHBvaW50LlxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5QdWJsaWNhdGlvblxuICAgICAqIEBwYXJhbSB7T3d0LkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSB1bm11dGVkLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHVuZGVmaW5lZCwgRXJyb3I+fVxuICAgICAqL1xuICAgIHRoaXMudW5tdXRlID0gdW5tdXRlO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFB1Ymxpc2hPcHRpb25zXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBjbGFzc0Rlc2MgUHVibGlzaE9wdGlvbnMgZGVmaW5lcyBvcHRpb25zIGZvciBwdWJsaXNoaW5nIGEgT3d0LkJhc2UuTG9jYWxTdHJlYW0uXG4gKi9cbmV4cG9ydCBjbGFzcyBQdWJsaXNoT3B0aW9ucyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGF1ZGlvLCB2aWRlbykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9BcnJheTxPd3QuQmFzZS5BdWRpb0VuY29kaW5nUGFyYW1ldGVycz4gfCA/QXJyYXk8UlRDUnRwRW5jb2RpbmdQYXJhbWV0ZXJzPn0gYXVkaW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuUHVibGlzaE9wdGlvbnNcbiAgICAgKiBAZGVzYyBQYXJhbWV0ZXJzIGZvciBhdWRpbyBSdHBTZW5kZXIuIFB1Ymxpc2hpbmcgd2l0aCBSVENSdHBFbmNvZGluZ1BhcmFtZXRlcnMgaXMgYW4gZXhwZXJpbWVudGFsIGZlYXR1cmUuIEl0IGlzIHN1YmplY3QgdG8gY2hhbmdlLlxuICAgICAqL1xuICAgIHRoaXMuYXVkaW8gPSBhdWRpbztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/QXJyYXk8T3d0LkJhc2UuVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnM+IHwgP0FycmF5PFJUQ1J0cEVuY29kaW5nUGFyYW1ldGVycz59IHZpZGVvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlB1Ymxpc2hPcHRpb25zXG4gICAgICogQGRlc2MgUGFyYW1ldGVycyBmb3IgdmlkZW8gUnRwU2VuZGVyLiBQdWJsaXNoaW5nIHdpdGggUlRDUnRwRW5jb2RpbmdQYXJhbWV0ZXJzIGlzIGFuIGV4cGVyaW1lbnRhbCBmZWF0dXJlLiBJdCBpcyBzdWJqZWN0IHRvIGNoYW5nZS5cbiAgICAgKi9cbiAgICB0aGlzLnZpZGVvID0gdmlkZW87XG4gIH1cbn1cbiIsIi8qXG4gKiAgQ29weXJpZ2h0IChjKSAyMDE0IFRoZSBXZWJSVEMgcHJvamVjdCBhdXRob3JzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhIEJTRC1zdHlsZSBsaWNlbnNlXG4gKiAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBvZiB0aGUgc291cmNlXG4gKiAgdHJlZS5cbiAqL1xuXG4vKiBNb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZXNlIG9wdGlvbnMgYXQganNoaW50LmNvbS9kb2NzL29wdGlvbnMgKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuLyogZ2xvYmFscyAgYWRhcHRlciwgdHJhY2UgKi9cbi8qIGV4cG9ydGVkIHNldENvZGVjUGFyYW0sIGljZUNhbmRpZGF0ZVR5cGUsIGZvcm1hdFR5cGVQcmVmZXJlbmNlLFxuICAgbWF5YmVTZXRPcHVzT3B0aW9ucywgbWF5YmVQcmVmZXJBdWRpb1JlY2VpdmVDb2RlYyxcbiAgIG1heWJlUHJlZmVyQXVkaW9TZW5kQ29kZWMsIG1heWJlU2V0QXVkaW9SZWNlaXZlQml0UmF0ZSxcbiAgIG1heWJlU2V0QXVkaW9TZW5kQml0UmF0ZSwgbWF5YmVQcmVmZXJWaWRlb1JlY2VpdmVDb2RlYyxcbiAgIG1heWJlUHJlZmVyVmlkZW9TZW5kQ29kZWMsIG1heWJlU2V0VmlkZW9SZWNlaXZlQml0UmF0ZSxcbiAgIG1heWJlU2V0VmlkZW9TZW5kQml0UmF0ZSwgbWF5YmVTZXRWaWRlb1NlbmRJbml0aWFsQml0UmF0ZSxcbiAgIG1heWJlUmVtb3ZlVmlkZW9GZWMsIG1lcmdlQ29uc3RyYWludHMsIHJlbW92ZUNvZGVjUGFyYW0qL1xuXG4vKiBUaGlzIGZpbGUgaXMgYm9ycm93ZWQgZnJvbSBhcHBydGMgd2l0aCBzb21lIG1vZGlmaWNhdGlvbnMuICovXG4vKiBDb21taXQgaGFzaDogYzZhZjBjMjVlOWFmNTI3ZjcxYjNhY2RkNmJmYTEzODlkNzc4ZjdiZCArIFBSIDUzMCAqL1xuXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyLmpzJztcblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBtZXJnZUNvbnN0cmFpbnRzKGNvbnMxLCBjb25zMikge1xuICBpZiAoIWNvbnMxIHx8ICFjb25zMikge1xuICAgIHJldHVybiBjb25zMSB8fCBjb25zMjtcbiAgfVxuICBjb25zdCBtZXJnZWQgPSBjb25zMTtcbiAgZm9yIChjb25zdCBrZXkgaW4gY29uczIpIHtcbiAgICBtZXJnZWRba2V5XSA9IGNvbnMyW2tleV07XG4gIH1cbiAgcmV0dXJuIG1lcmdlZDtcbn1cblxuZnVuY3Rpb24gaWNlQ2FuZGlkYXRlVHlwZShjYW5kaWRhdGVTdHIpIHtcbiAgcmV0dXJuIGNhbmRpZGF0ZVN0ci5zcGxpdCgnICcpWzddO1xufVxuXG4vLyBUdXJucyB0aGUgbG9jYWwgdHlwZSBwcmVmZXJlbmNlIGludG8gYSBodW1hbi1yZWFkYWJsZSBzdHJpbmcuXG4vLyBOb3RlIHRoYXQgdGhpcyBtYXBwaW5nIGlzIGJyb3dzZXItc3BlY2lmaWMuXG5mdW5jdGlvbiBmb3JtYXRUeXBlUHJlZmVyZW5jZShwcmVmKSB7XG4gIGlmIChhZGFwdGVyLmJyb3dzZXJEZXRhaWxzLmJyb3dzZXIgPT09ICdjaHJvbWUnKSB7XG4gICAgc3dpdGNoIChwcmVmKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiAnVFVSTi9UTFMnO1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gJ1RVUk4vVENQJztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuICdUVVJOL1VEUCc7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0gZWxzZSBpZiAoYWRhcHRlci5icm93c2VyRGV0YWlscy5icm93c2VyID09PSAnZmlyZWZveCcpIHtcbiAgICBzd2l0Y2ggKHByZWYpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuICdUVVJOL1RDUCc7XG4gICAgICBjYXNlIDU6XG4gICAgICAgIHJldHVybiAnVFVSTi9VRFAnO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gbWF5YmVTZXRPcHVzT3B0aW9ucyhzZHAsIHBhcmFtcykge1xuICAvLyBTZXQgT3B1cyBpbiBTdGVyZW8sIGlmIHN0ZXJlbyBpcyB0cnVlLCB1bnNldCBpdCwgaWYgc3RlcmVvIGlzIGZhbHNlLCBhbmRcbiAgLy8gZG8gbm90aGluZyBpZiBvdGhlcndpc2UuXG4gIGlmIChwYXJhbXMub3B1c1N0ZXJlbyA9PT0gJ3RydWUnKSB7XG4gICAgc2RwID0gc2V0Q29kZWNQYXJhbShzZHAsICdvcHVzLzQ4MDAwJywgJ3N0ZXJlbycsICcxJyk7XG4gIH0gZWxzZSBpZiAocGFyYW1zLm9wdXNTdGVyZW8gPT09ICdmYWxzZScpIHtcbiAgICBzZHAgPSByZW1vdmVDb2RlY1BhcmFtKHNkcCwgJ29wdXMvNDgwMDAnLCAnc3RlcmVvJyk7XG4gIH1cblxuICAvLyBTZXQgT3B1cyBGRUMsIGlmIG9wdXNmZWMgaXMgdHJ1ZSwgdW5zZXQgaXQsIGlmIG9wdXNmZWMgaXMgZmFsc2UsIGFuZFxuICAvLyBkbyBub3RoaW5nIGlmIG90aGVyd2lzZS5cbiAgaWYgKHBhcmFtcy5vcHVzRmVjID09PSAndHJ1ZScpIHtcbiAgICBzZHAgPSBzZXRDb2RlY1BhcmFtKHNkcCwgJ29wdXMvNDgwMDAnLCAndXNlaW5iYW5kZmVjJywgJzEnKTtcbiAgfSBlbHNlIGlmIChwYXJhbXMub3B1c0ZlYyA9PT0gJ2ZhbHNlJykge1xuICAgIHNkcCA9IHJlbW92ZUNvZGVjUGFyYW0oc2RwLCAnb3B1cy80ODAwMCcsICd1c2VpbmJhbmRmZWMnKTtcbiAgfVxuXG4gIC8vIFNldCBPcHVzIERUWCwgaWYgb3B1c2R0eCBpcyB0cnVlLCB1bnNldCBpdCwgaWYgb3B1c2R0eCBpcyBmYWxzZSwgYW5kXG4gIC8vIGRvIG5vdGhpbmcgaWYgb3RoZXJ3aXNlLlxuICBpZiAocGFyYW1zLm9wdXNEdHggPT09ICd0cnVlJykge1xuICAgIHNkcCA9IHNldENvZGVjUGFyYW0oc2RwLCAnb3B1cy80ODAwMCcsICd1c2VkdHgnLCAnMScpO1xuICB9IGVsc2UgaWYgKHBhcmFtcy5vcHVzRHR4ID09PSAnZmFsc2UnKSB7XG4gICAgc2RwID0gcmVtb3ZlQ29kZWNQYXJhbShzZHAsICdvcHVzLzQ4MDAwJywgJ3VzZWR0eCcpO1xuICB9XG5cbiAgLy8gU2V0IE9wdXMgbWF4cGxheWJhY2tyYXRlLCBpZiByZXF1ZXN0ZWQuXG4gIGlmIChwYXJhbXMub3B1c01heFBicikge1xuICAgIHNkcCA9IHNldENvZGVjUGFyYW0oXG4gICAgICAgIHNkcCwgJ29wdXMvNDgwMDAnLCAnbWF4cGxheWJhY2tyYXRlJywgcGFyYW1zLm9wdXNNYXhQYnIpO1xuICB9XG4gIHJldHVybiBzZHA7XG59XG5cbmZ1bmN0aW9uIG1heWJlU2V0QXVkaW9TZW5kQml0UmF0ZShzZHAsIHBhcmFtcykge1xuICBpZiAoIXBhcmFtcy5hdWRpb1NlbmRCaXRyYXRlKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuICBMb2dnZXIuZGVidWcoJ1ByZWZlciBhdWRpbyBzZW5kIGJpdHJhdGU6ICcgKyBwYXJhbXMuYXVkaW9TZW5kQml0cmF0ZSk7XG4gIHJldHVybiBwcmVmZXJCaXRSYXRlKHNkcCwgcGFyYW1zLmF1ZGlvU2VuZEJpdHJhdGUsICdhdWRpbycpO1xufVxuXG5mdW5jdGlvbiBtYXliZVNldEF1ZGlvUmVjZWl2ZUJpdFJhdGUoc2RwLCBwYXJhbXMpIHtcbiAgaWYgKCFwYXJhbXMuYXVkaW9SZWN2Qml0cmF0ZSkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgTG9nZ2VyLmRlYnVnKCdQcmVmZXIgYXVkaW8gcmVjZWl2ZSBiaXRyYXRlOiAnICsgcGFyYW1zLmF1ZGlvUmVjdkJpdHJhdGUpO1xuICByZXR1cm4gcHJlZmVyQml0UmF0ZShzZHAsIHBhcmFtcy5hdWRpb1JlY3ZCaXRyYXRlLCAnYXVkaW8nKTtcbn1cblxuZnVuY3Rpb24gbWF5YmVTZXRWaWRlb1NlbmRCaXRSYXRlKHNkcCwgcGFyYW1zKSB7XG4gIGlmICghcGFyYW1zLnZpZGVvU2VuZEJpdHJhdGUpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG4gIExvZ2dlci5kZWJ1ZygnUHJlZmVyIHZpZGVvIHNlbmQgYml0cmF0ZTogJyArIHBhcmFtcy52aWRlb1NlbmRCaXRyYXRlKTtcbiAgcmV0dXJuIHByZWZlckJpdFJhdGUoc2RwLCBwYXJhbXMudmlkZW9TZW5kQml0cmF0ZSwgJ3ZpZGVvJyk7XG59XG5cbmZ1bmN0aW9uIG1heWJlU2V0VmlkZW9SZWNlaXZlQml0UmF0ZShzZHAsIHBhcmFtcykge1xuICBpZiAoIXBhcmFtcy52aWRlb1JlY3ZCaXRyYXRlKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuICBMb2dnZXIuZGVidWcoJ1ByZWZlciB2aWRlbyByZWNlaXZlIGJpdHJhdGU6ICcgKyBwYXJhbXMudmlkZW9SZWN2Qml0cmF0ZSk7XG4gIHJldHVybiBwcmVmZXJCaXRSYXRlKHNkcCwgcGFyYW1zLnZpZGVvUmVjdkJpdHJhdGUsICd2aWRlbycpO1xufVxuXG4vLyBBZGQgYSBiPUFTOmJpdHJhdGUgbGluZSB0byB0aGUgbT1tZWRpYVR5cGUgc2VjdGlvbi5cbmZ1bmN0aW9uIHByZWZlckJpdFJhdGUoc2RwLCBiaXRyYXRlLCBtZWRpYVR5cGUpIHtcbiAgY29uc3Qgc2RwTGluZXMgPSBzZHAuc3BsaXQoJ1xcclxcbicpO1xuXG4gIC8vIEZpbmQgbSBsaW5lIGZvciB0aGUgZ2l2ZW4gbWVkaWFUeXBlLlxuICBjb25zdCBtTGluZUluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdtPScsIG1lZGlhVHlwZSk7XG4gIGlmIChtTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdGYWlsZWQgdG8gYWRkIGJhbmR3aWR0aCBsaW5lIHRvIHNkcCwgYXMgbm8gbS1saW5lIGZvdW5kJyk7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIC8vIEZpbmQgbmV4dCBtLWxpbmUgaWYgYW55LlxuICBsZXQgbmV4dE1MaW5lSW5kZXggPSBmaW5kTGluZUluUmFuZ2Uoc2RwTGluZXMsIG1MaW5lSW5kZXggKyAxLCAtMSwgJ209Jyk7XG4gIGlmIChuZXh0TUxpbmVJbmRleCA9PT0gbnVsbCkge1xuICAgIG5leHRNTGluZUluZGV4ID0gc2RwTGluZXMubGVuZ3RoO1xuICB9XG5cbiAgLy8gRmluZCBjLWxpbmUgY29ycmVzcG9uZGluZyB0byB0aGUgbS1saW5lLlxuICBjb25zdCBjTGluZUluZGV4ID0gZmluZExpbmVJblJhbmdlKHNkcExpbmVzLCBtTGluZUluZGV4ICsgMSxcbiAgICAgIG5leHRNTGluZUluZGV4LCAnYz0nKTtcbiAgaWYgKGNMaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0ZhaWxlZCB0byBhZGQgYmFuZHdpZHRoIGxpbmUgdG8gc2RwLCBhcyBubyBjLWxpbmUgZm91bmQnKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgYmFuZHdpZHRoIGxpbmUgYWxyZWFkeSBleGlzdHMgYmV0d2VlbiBjLWxpbmUgYW5kIG5leHQgbS1saW5lLlxuICBjb25zdCBiTGluZUluZGV4ID0gZmluZExpbmVJblJhbmdlKHNkcExpbmVzLCBjTGluZUluZGV4ICsgMSxcbiAgICAgIG5leHRNTGluZUluZGV4LCAnYj1BUycpO1xuICBpZiAoYkxpbmVJbmRleCkge1xuICAgIHNkcExpbmVzLnNwbGljZShiTGluZUluZGV4LCAxKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSB0aGUgYiAoYmFuZHdpZHRoKSBzZHAgbGluZS5cbiAgY29uc3QgYndMaW5lID0gJ2I9QVM6JyArIGJpdHJhdGU7XG4gIC8vIEFzIHBlciBSRkMgNDU2NiwgdGhlIGIgbGluZSBzaG91bGQgZm9sbG93IGFmdGVyIGMtbGluZS5cbiAgc2RwTGluZXMuc3BsaWNlKGNMaW5lSW5kZXggKyAxLCAwLCBid0xpbmUpO1xuICBzZHAgPSBzZHBMaW5lcy5qb2luKCdcXHJcXG4nKTtcbiAgcmV0dXJuIHNkcDtcbn1cblxuLy8gQWRkIGFuIGE9Zm10cDogeC1nb29nbGUtbWluLWJpdHJhdGU9a2JwcyBsaW5lLCBpZiB2aWRlb1NlbmRJbml0aWFsQml0cmF0ZVxuLy8gaXMgc3BlY2lmaWVkLiBXZSdsbCBhbHNvIGFkZCBhIHgtZ29vZ2xlLW1pbi1iaXRyYXRlIHZhbHVlLCBzaW5jZSB0aGUgbWF4XG4vLyBtdXN0IGJlID49IHRoZSBtaW4uXG5mdW5jdGlvbiBtYXliZVNldFZpZGVvU2VuZEluaXRpYWxCaXRSYXRlKHNkcCwgcGFyYW1zKSB7XG4gIGxldCBpbml0aWFsQml0cmF0ZSA9IHBhcnNlSW50KHBhcmFtcy52aWRlb1NlbmRJbml0aWFsQml0cmF0ZSk7XG4gIGlmICghaW5pdGlhbEJpdHJhdGUpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgLy8gVmFsaWRhdGUgdGhlIGluaXRpYWwgYml0cmF0ZSB2YWx1ZS5cbiAgbGV0IG1heEJpdHJhdGUgPSBwYXJzZUludChpbml0aWFsQml0cmF0ZSk7XG4gIGNvbnN0IGJpdHJhdGUgPSBwYXJzZUludChwYXJhbXMudmlkZW9TZW5kQml0cmF0ZSk7XG4gIGlmIChiaXRyYXRlKSB7XG4gICAgaWYgKGluaXRpYWxCaXRyYXRlID4gYml0cmF0ZSkge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdDbGFtcGluZyBpbml0aWFsIGJpdHJhdGUgdG8gbWF4IGJpdHJhdGUgb2YgJyArIGJpdHJhdGUgKyAnIGticHMuJyk7XG4gICAgICBpbml0aWFsQml0cmF0ZSA9IGJpdHJhdGU7XG4gICAgICBwYXJhbXMudmlkZW9TZW5kSW5pdGlhbEJpdHJhdGUgPSBpbml0aWFsQml0cmF0ZTtcbiAgICB9XG4gICAgbWF4Qml0cmF0ZSA9IGJpdHJhdGU7XG4gIH1cblxuICBjb25zdCBzZHBMaW5lcyA9IHNkcC5zcGxpdCgnXFxyXFxuJyk7XG5cbiAgLy8gU2VhcmNoIGZvciBtIGxpbmUuXG4gIGNvbnN0IG1MaW5lSW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ209JywgJ3ZpZGVvJyk7XG4gIGlmIChtTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdGYWlsZWQgdG8gZmluZCB2aWRlbyBtLWxpbmUnKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG4gIC8vIEZpZ3VyZSBvdXQgdGhlIGZpcnN0IGNvZGVjIHBheWxvYWQgdHlwZSBvbiB0aGUgbT12aWRlbyBTRFAgbGluZS5cbiAgY29uc3QgdmlkZW9NTGluZSA9IHNkcExpbmVzW21MaW5lSW5kZXhdO1xuICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cCgnbT12aWRlb1xcXFxzXFxcXGQrXFxcXHNbQS1aL10rXFxcXHMnKTtcbiAgY29uc3Qgc2VuZFBheWxvYWRUeXBlID0gdmlkZW9NTGluZS5zcGxpdChwYXR0ZXJuKVsxXS5zcGxpdCgnICcpWzBdO1xuICBjb25zdCBmbXRwTGluZSA9IHNkcExpbmVzW2ZpbmRMaW5lKHNkcExpbmVzLCAnYT1ydHBtYXAnLCBzZW5kUGF5bG9hZFR5cGUpXTtcbiAgY29uc3QgY29kZWNOYW1lID0gZm10cExpbmUuc3BsaXQoJ2E9cnRwbWFwOicgK1xuICAgICAgc2VuZFBheWxvYWRUeXBlKVsxXS5zcGxpdCgnLycpWzBdO1xuXG4gIC8vIFVzZSBjb2RlYyBmcm9tIHBhcmFtcyBpZiBzcGVjaWZpZWQgdmlhIFVSTCBwYXJhbSwgb3RoZXJ3aXNlIHVzZSBmcm9tIFNEUC5cbiAgY29uc3QgY29kZWMgPSBwYXJhbXMudmlkZW9TZW5kQ29kZWMgfHwgY29kZWNOYW1lO1xuICBzZHAgPSBzZXRDb2RlY1BhcmFtKHNkcCwgY29kZWMsICd4LWdvb2dsZS1taW4tYml0cmF0ZScsXG4gICAgICBwYXJhbXMudmlkZW9TZW5kSW5pdGlhbEJpdHJhdGUudG9TdHJpbmcoKSk7XG4gIHNkcCA9IHNldENvZGVjUGFyYW0oc2RwLCBjb2RlYywgJ3gtZ29vZ2xlLW1heC1iaXRyYXRlJyxcbiAgICAgIG1heEJpdHJhdGUudG9TdHJpbmcoKSk7XG5cbiAgcmV0dXJuIHNkcDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUGF5bG9hZFR5cGVGcm9tTWxpbmUobUxpbmUsIHBheWxvYWRUeXBlKSB7XG4gIG1MaW5lID0gbUxpbmUuc3BsaXQoJyAnKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtTGluZS5sZW5ndGg7ICsraSkge1xuICAgIGlmIChtTGluZVtpXSA9PT0gcGF5bG9hZFR5cGUudG9TdHJpbmcoKSkge1xuICAgICAgbUxpbmUuc3BsaWNlKGksIDEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbUxpbmUuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVDb2RlY0J5TmFtZShzZHBMaW5lcywgY29kZWMpIHtcbiAgY29uc3QgaW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ2E9cnRwbWFwJywgY29kZWMpO1xuICBpZiAoaW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwTGluZXM7XG4gIH1cbiAgY29uc3QgcGF5bG9hZFR5cGUgPSBnZXRDb2RlY1BheWxvYWRUeXBlRnJvbUxpbmUoc2RwTGluZXNbaW5kZXhdKTtcbiAgc2RwTGluZXMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAvLyBTZWFyY2ggZm9yIHRoZSB2aWRlbyBtPSBsaW5lIGFuZCByZW1vdmUgdGhlIGNvZGVjLlxuICBjb25zdCBtTGluZUluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdtPScsICd2aWRlbycpO1xuICBpZiAobUxpbmVJbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHBMaW5lcztcbiAgfVxuICBzZHBMaW5lc1ttTGluZUluZGV4XSA9IHJlbW92ZVBheWxvYWRUeXBlRnJvbU1saW5lKHNkcExpbmVzW21MaW5lSW5kZXhdLFxuICAgICAgcGF5bG9hZFR5cGUpO1xuICByZXR1cm4gc2RwTGluZXM7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNvZGVjQnlQYXlsb2FkVHlwZShzZHBMaW5lcywgcGF5bG9hZFR5cGUpIHtcbiAgY29uc3QgaW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ2E9cnRwbWFwJywgcGF5bG9hZFR5cGUudG9TdHJpbmcoKSk7XG4gIGlmIChpbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHBMaW5lcztcbiAgfVxuICBzZHBMaW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gIC8vIFNlYXJjaCBmb3IgdGhlIHZpZGVvIG09IGxpbmUgYW5kIHJlbW92ZSB0aGUgY29kZWMuXG4gIGNvbnN0IG1MaW5lSW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ209JywgJ3ZpZGVvJyk7XG4gIGlmIChtTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcExpbmVzO1xuICB9XG4gIHNkcExpbmVzW21MaW5lSW5kZXhdID0gcmVtb3ZlUGF5bG9hZFR5cGVGcm9tTWxpbmUoc2RwTGluZXNbbUxpbmVJbmRleF0sXG4gICAgICBwYXlsb2FkVHlwZSk7XG4gIHJldHVybiBzZHBMaW5lcztcbn1cblxuZnVuY3Rpb24gbWF5YmVSZW1vdmVWaWRlb0ZlYyhzZHAsIHBhcmFtcykge1xuICBpZiAocGFyYW1zLnZpZGVvRmVjICE9PSAnZmFsc2UnKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIGxldCBzZHBMaW5lcyA9IHNkcC5zcGxpdCgnXFxyXFxuJyk7XG5cbiAgbGV0IGluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdhPXJ0cG1hcCcsICdyZWQnKTtcbiAgaWYgKGluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuICBjb25zdCByZWRQYXlsb2FkVHlwZSA9IGdldENvZGVjUGF5bG9hZFR5cGVGcm9tTGluZShzZHBMaW5lc1tpbmRleF0pO1xuICBzZHBMaW5lcyA9IHJlbW92ZUNvZGVjQnlQYXlsb2FkVHlwZShzZHBMaW5lcywgcmVkUGF5bG9hZFR5cGUpO1xuXG4gIHNkcExpbmVzID0gcmVtb3ZlQ29kZWNCeU5hbWUoc2RwTGluZXMsICd1bHBmZWMnKTtcblxuICAvLyBSZW1vdmUgZm10cCBsaW5lcyBhc3NvY2lhdGVkIHdpdGggcmVkIGNvZGVjLlxuICBpbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnYT1mbXRwJywgcmVkUGF5bG9hZFR5cGUudG9TdHJpbmcoKSk7XG4gIGlmIChpbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgY29uc3QgZm10cExpbmUgPSBwYXJzZUZtdHBMaW5lKHNkcExpbmVzW2luZGV4XSk7XG4gIGNvbnN0IHJ0eFBheWxvYWRUeXBlID0gZm10cExpbmUucHQ7XG4gIGlmIChydHhQYXlsb2FkVHlwZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgc2RwTGluZXMuc3BsaWNlKGluZGV4LCAxKTtcblxuICBzZHBMaW5lcyA9IHJlbW92ZUNvZGVjQnlQYXlsb2FkVHlwZShzZHBMaW5lcywgcnR4UGF5bG9hZFR5cGUpO1xuICByZXR1cm4gc2RwTGluZXMuam9pbignXFxyXFxuJyk7XG59XG5cbi8vIFByb21vdGVzIHxhdWRpb1NlbmRDb2RlY3wgdG8gYmUgdGhlIGZpcnN0IGluIHRoZSBtPWF1ZGlvIGxpbmUsIGlmIHNldC5cbmZ1bmN0aW9uIG1heWJlUHJlZmVyQXVkaW9TZW5kQ29kZWMoc2RwLCBwYXJhbXMpIHtcbiAgcmV0dXJuIG1heWJlUHJlZmVyQ29kZWMoc2RwLCAnYXVkaW8nLCAnc2VuZCcsIHBhcmFtcy5hdWRpb1NlbmRDb2RlYyk7XG59XG5cbi8vIFByb21vdGVzIHxhdWRpb1JlY3ZDb2RlY3wgdG8gYmUgdGhlIGZpcnN0IGluIHRoZSBtPWF1ZGlvIGxpbmUsIGlmIHNldC5cbmZ1bmN0aW9uIG1heWJlUHJlZmVyQXVkaW9SZWNlaXZlQ29kZWMoc2RwLCBwYXJhbXMpIHtcbiAgcmV0dXJuIG1heWJlUHJlZmVyQ29kZWMoc2RwLCAnYXVkaW8nLCAncmVjZWl2ZScsIHBhcmFtcy5hdWRpb1JlY3ZDb2RlYyk7XG59XG5cbi8vIFByb21vdGVzIHx2aWRlb1NlbmRDb2RlY3wgdG8gYmUgdGhlIGZpcnN0IGluIHRoZSBtPWF1ZGlvIGxpbmUsIGlmIHNldC5cbmZ1bmN0aW9uIG1heWJlUHJlZmVyVmlkZW9TZW5kQ29kZWMoc2RwLCBwYXJhbXMpIHtcbiAgcmV0dXJuIG1heWJlUHJlZmVyQ29kZWMoc2RwLCAndmlkZW8nLCAnc2VuZCcsIHBhcmFtcy52aWRlb1NlbmRDb2RlYyk7XG59XG5cbi8vIFByb21vdGVzIHx2aWRlb1JlY3ZDb2RlY3wgdG8gYmUgdGhlIGZpcnN0IGluIHRoZSBtPWF1ZGlvIGxpbmUsIGlmIHNldC5cbmZ1bmN0aW9uIG1heWJlUHJlZmVyVmlkZW9SZWNlaXZlQ29kZWMoc2RwLCBwYXJhbXMpIHtcbiAgcmV0dXJuIG1heWJlUHJlZmVyQ29kZWMoc2RwLCAndmlkZW8nLCAncmVjZWl2ZScsIHBhcmFtcy52aWRlb1JlY3ZDb2RlYyk7XG59XG5cbi8vIFNldHMgfGNvZGVjfCBhcyB0aGUgZGVmYXVsdCB8dHlwZXwgY29kZWMgaWYgaXQncyBwcmVzZW50LlxuLy8gVGhlIGZvcm1hdCBvZiB8Y29kZWN8IGlzICdOQU1FL1JBVEUnLCBlLmcuICdvcHVzLzQ4MDAwJy5cbmZ1bmN0aW9uIG1heWJlUHJlZmVyQ29kZWMoc2RwLCB0eXBlLCBkaXIsIGNvZGVjKSB7XG4gIGNvbnN0IHN0ciA9IHR5cGUgKyAnICcgKyBkaXIgKyAnIGNvZGVjJztcbiAgaWYgKCFjb2RlYykge1xuICAgIExvZ2dlci5kZWJ1ZygnTm8gcHJlZmVyZW5jZSBvbiAnICsgc3RyICsgJy4nKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgTG9nZ2VyLmRlYnVnKCdQcmVmZXIgJyArIHN0ciArICc6ICcgKyBjb2RlYyk7XG5cbiAgY29uc3Qgc2RwTGluZXMgPSBzZHAuc3BsaXQoJ1xcclxcbicpO1xuXG4gIC8vIFNlYXJjaCBmb3IgbSBsaW5lLlxuICBjb25zdCBtTGluZUluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdtPScsIHR5cGUpO1xuICBpZiAobUxpbmVJbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICAvLyBJZiB0aGUgY29kZWMgaXMgYXZhaWxhYmxlLCBzZXQgaXQgYXMgdGhlIGRlZmF1bHQgaW4gbSBsaW5lLlxuICBsZXQgcGF5bG9hZCA9IG51bGw7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2RwTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBpbmRleCA9IGZpbmRMaW5lSW5SYW5nZShzZHBMaW5lcywgaSwgLTEsICdhPXJ0cG1hcCcsIGNvZGVjKTtcbiAgICBpZiAoaW5kZXggIT09IG51bGwpIHtcbiAgICAgIHBheWxvYWQgPSBnZXRDb2RlY1BheWxvYWRUeXBlRnJvbUxpbmUoc2RwTGluZXNbaW5kZXhdKTtcbiAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgIHNkcExpbmVzW21MaW5lSW5kZXhdID0gc2V0RGVmYXVsdENvZGVjKHNkcExpbmVzW21MaW5lSW5kZXhdLCBwYXlsb2FkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZHAgPSBzZHBMaW5lcy5qb2luKCdcXHJcXG4nKTtcbiAgcmV0dXJuIHNkcDtcbn1cblxuLy8gU2V0IGZtdHAgcGFyYW0gdG8gc3BlY2lmaWMgY29kZWMgaW4gU0RQLiBJZiBwYXJhbSBkb2VzIG5vdCBleGlzdHMsIGFkZCBpdC5cbmZ1bmN0aW9uIHNldENvZGVjUGFyYW0oc2RwLCBjb2RlYywgcGFyYW0sIHZhbHVlKSB7XG4gIGxldCBzZHBMaW5lcyA9IHNkcC5zcGxpdCgnXFxyXFxuJyk7XG4gIC8vIFNEUHMgc2VudCBmcm9tIE1DVSB1c2UgXFxuIGFzIGxpbmUgYnJlYWsuXG4gIGlmIChzZHBMaW5lcy5sZW5ndGggPD0gMSkge1xuICAgIHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXG4nKTtcbiAgfVxuXG4gIGNvbnN0IGZtdHBMaW5lSW5kZXggPSBmaW5kRm10cExpbmUoc2RwTGluZXMsIGNvZGVjKTtcblxuICBsZXQgZm10cE9iaiA9IHt9O1xuICBpZiAoZm10cExpbmVJbmRleCA9PT0gbnVsbCkge1xuICAgIGNvbnN0IGluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdhPXJ0cG1hcCcsIGNvZGVjKTtcbiAgICBpZiAoaW5kZXggPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBzZHA7XG4gICAgfVxuICAgIGNvbnN0IHBheWxvYWQgPSBnZXRDb2RlY1BheWxvYWRUeXBlRnJvbUxpbmUoc2RwTGluZXNbaW5kZXhdKTtcbiAgICBmbXRwT2JqLnB0ID0gcGF5bG9hZC50b1N0cmluZygpO1xuICAgIGZtdHBPYmoucGFyYW1zID0ge307XG4gICAgZm10cE9iai5wYXJhbXNbcGFyYW1dID0gdmFsdWU7XG4gICAgc2RwTGluZXMuc3BsaWNlKGluZGV4ICsgMSwgMCwgd3JpdGVGbXRwTGluZShmbXRwT2JqKSk7XG4gIH0gZWxzZSB7XG4gICAgZm10cE9iaiA9IHBhcnNlRm10cExpbmUoc2RwTGluZXNbZm10cExpbmVJbmRleF0pO1xuICAgIGZtdHBPYmoucGFyYW1zW3BhcmFtXSA9IHZhbHVlO1xuICAgIHNkcExpbmVzW2ZtdHBMaW5lSW5kZXhdID0gd3JpdGVGbXRwTGluZShmbXRwT2JqKTtcbiAgfVxuXG4gIHNkcCA9IHNkcExpbmVzLmpvaW4oJ1xcclxcbicpO1xuICByZXR1cm4gc2RwO1xufVxuXG4vLyBSZW1vdmUgZm10cCBwYXJhbSBpZiBpdCBleGlzdHMuXG5mdW5jdGlvbiByZW1vdmVDb2RlY1BhcmFtKHNkcCwgY29kZWMsIHBhcmFtKSB7XG4gIGNvbnN0IHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXHJcXG4nKTtcblxuICBjb25zdCBmbXRwTGluZUluZGV4ID0gZmluZEZtdHBMaW5lKHNkcExpbmVzLCBjb2RlYyk7XG4gIGlmIChmbXRwTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIGNvbnN0IG1hcCA9IHBhcnNlRm10cExpbmUoc2RwTGluZXNbZm10cExpbmVJbmRleF0pO1xuICBkZWxldGUgbWFwLnBhcmFtc1twYXJhbV07XG5cbiAgY29uc3QgbmV3TGluZSA9IHdyaXRlRm10cExpbmUobWFwKTtcbiAgaWYgKG5ld0xpbmUgPT09IG51bGwpIHtcbiAgICBzZHBMaW5lcy5zcGxpY2UoZm10cExpbmVJbmRleCwgMSk7XG4gIH0gZWxzZSB7XG4gICAgc2RwTGluZXNbZm10cExpbmVJbmRleF0gPSBuZXdMaW5lO1xuICB9XG5cbiAgc2RwID0gc2RwTGluZXMuam9pbignXFxyXFxuJyk7XG4gIHJldHVybiBzZHA7XG59XG5cbi8vIFNwbGl0IGFuIGZtdHAgbGluZSBpbnRvIGFuIG9iamVjdCBpbmNsdWRpbmcgJ3B0JyBhbmQgJ3BhcmFtcycuXG5mdW5jdGlvbiBwYXJzZUZtdHBMaW5lKGZtdHBMaW5lKSB7XG4gIGNvbnN0IGZtdHBPYmogPSB7fTtcbiAgY29uc3Qgc3BhY2VQb3MgPSBmbXRwTGluZS5pbmRleE9mKCcgJyk7XG4gIGNvbnN0IGtleVZhbHVlcyA9IGZtdHBMaW5lLnN1YnN0cmluZyhzcGFjZVBvcyArIDEpLnNwbGl0KCc7Jyk7XG5cbiAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoJ2E9Zm10cDooXFxcXGQrKScpO1xuICBjb25zdCByZXN1bHQgPSBmbXRwTGluZS5tYXRjaChwYXR0ZXJuKTtcbiAgaWYgKHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID09PSAyKSB7XG4gICAgZm10cE9iai5wdCA9IHJlc3VsdFsxXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHBhcmFtcyA9IHt9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGtleVZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgIGNvbnN0IHBhaXIgPSBrZXlWYWx1ZXNbaV0uc3BsaXQoJz0nKTtcbiAgICBpZiAocGFpci5sZW5ndGggPT09IDIpIHtcbiAgICAgIHBhcmFtc1twYWlyWzBdXSA9IHBhaXJbMV07XG4gICAgfVxuICB9XG4gIGZtdHBPYmoucGFyYW1zID0gcGFyYW1zO1xuXG4gIHJldHVybiBmbXRwT2JqO1xufVxuXG4vLyBHZW5lcmF0ZSBhbiBmbXRwIGxpbmUgZnJvbSBhbiBvYmplY3QgaW5jbHVkaW5nICdwdCcgYW5kICdwYXJhbXMnLlxuZnVuY3Rpb24gd3JpdGVGbXRwTGluZShmbXRwT2JqKSB7XG4gIGlmICghZm10cE9iai5oYXNPd25Qcm9wZXJ0eSgncHQnKSB8fCAhZm10cE9iai5oYXNPd25Qcm9wZXJ0eSgncGFyYW1zJykpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBwdCA9IGZtdHBPYmoucHQ7XG4gIGNvbnN0IHBhcmFtcyA9IGZtdHBPYmoucGFyYW1zO1xuICBjb25zdCBrZXlWYWx1ZXMgPSBbXTtcbiAgbGV0IGkgPSAwO1xuICBmb3IgKGNvbnN0IGtleSBpbiBwYXJhbXMpIHtcbiAgICBrZXlWYWx1ZXNbaV0gPSBrZXkgKyAnPScgKyBwYXJhbXNba2V5XTtcbiAgICArK2k7XG4gIH1cbiAgaWYgKGkgPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gJ2E9Zm10cDonICsgcHQudG9TdHJpbmcoKSArICcgJyArIGtleVZhbHVlcy5qb2luKCc7Jyk7XG59XG5cbi8vIEZpbmQgZm10cCBhdHRyaWJ1dGUgZm9yIHxjb2RlY3wgaW4gfHNkcExpbmVzfC5cbmZ1bmN0aW9uIGZpbmRGbXRwTGluZShzZHBMaW5lcywgY29kZWMpIHtcbiAgLy8gRmluZCBwYXlsb2FkIG9mIGNvZGVjLlxuICBjb25zdCBwYXlsb2FkID0gZ2V0Q29kZWNQYXlsb2FkVHlwZShzZHBMaW5lcywgY29kZWMpO1xuICAvLyBGaW5kIHRoZSBwYXlsb2FkIGluIGZtdHAgbGluZS5cbiAgcmV0dXJuIHBheWxvYWQgPyBmaW5kTGluZShzZHBMaW5lcywgJ2E9Zm10cDonICsgcGF5bG9hZC50b1N0cmluZygpKSA6IG51bGw7XG59XG5cbi8vIEZpbmQgdGhlIGxpbmUgaW4gc2RwTGluZXMgdGhhdCBzdGFydHMgd2l0aCB8cHJlZml4fCwgYW5kLCBpZiBzcGVjaWZpZWQsXG4vLyBjb250YWlucyB8c3Vic3RyfCAoY2FzZS1pbnNlbnNpdGl2ZSBzZWFyY2gpLlxuZnVuY3Rpb24gZmluZExpbmUoc2RwTGluZXMsIHByZWZpeCwgc3Vic3RyKSB7XG4gIHJldHVybiBmaW5kTGluZUluUmFuZ2Uoc2RwTGluZXMsIDAsIC0xLCBwcmVmaXgsIHN1YnN0cik7XG59XG5cbi8vIEZpbmQgdGhlIGxpbmUgaW4gc2RwTGluZXNbc3RhcnRMaW5lLi4uZW5kTGluZSAtIDFdIHRoYXQgc3RhcnRzIHdpdGggfHByZWZpeHxcbi8vIGFuZCwgaWYgc3BlY2lmaWVkLCBjb250YWlucyB8c3Vic3RyfCAoY2FzZS1pbnNlbnNpdGl2ZSBzZWFyY2gpLlxuZnVuY3Rpb24gZmluZExpbmVJblJhbmdlKHNkcExpbmVzLCBzdGFydExpbmUsIGVuZExpbmUsIHByZWZpeCwgc3Vic3RyKSB7XG4gIGNvbnN0IHJlYWxFbmRMaW5lID0gZW5kTGluZSAhPT0gLTEgPyBlbmRMaW5lIDogc2RwTGluZXMubGVuZ3RoO1xuICBmb3IgKGxldCBpID0gc3RhcnRMaW5lOyBpIDwgcmVhbEVuZExpbmU7ICsraSkge1xuICAgIGlmIChzZHBMaW5lc1tpXS5pbmRleE9mKHByZWZpeCkgPT09IDApIHtcbiAgICAgIGlmICghc3Vic3RyIHx8XG4gICAgICAgICAgc2RwTGluZXNbaV0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHN1YnN0ci50b0xvd2VyQ2FzZSgpKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBHZXRzIHRoZSBjb2RlYyBwYXlsb2FkIHR5cGUgZnJvbSBzZHAgbGluZXMuXG5mdW5jdGlvbiBnZXRDb2RlY1BheWxvYWRUeXBlKHNkcExpbmVzLCBjb2RlYykge1xuICBjb25zdCBpbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnYT1ydHBtYXAnLCBjb2RlYyk7XG4gIHJldHVybiBpbmRleCA/IGdldENvZGVjUGF5bG9hZFR5cGVGcm9tTGluZShzZHBMaW5lc1tpbmRleF0pIDogbnVsbDtcbn1cblxuLy8gR2V0cyB0aGUgY29kZWMgcGF5bG9hZCB0eXBlIGZyb20gYW4gYT1ydHBtYXA6WCBsaW5lLlxuZnVuY3Rpb24gZ2V0Q29kZWNQYXlsb2FkVHlwZUZyb21MaW5lKHNkcExpbmUpIHtcbiAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoJ2E9cnRwbWFwOihcXFxcZCspIFthLXpBLVowLTktXStcXFxcL1xcXFxkKycpO1xuICBjb25zdCByZXN1bHQgPSBzZHBMaW5lLm1hdGNoKHBhdHRlcm4pO1xuICByZXR1cm4gKHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID09PSAyKSA/IHJlc3VsdFsxXSA6IG51bGw7XG59XG5cbi8vIFJldHVybnMgYSBuZXcgbT0gbGluZSB3aXRoIHRoZSBzcGVjaWZpZWQgY29kZWMgYXMgdGhlIGZpcnN0IG9uZS5cbmZ1bmN0aW9uIHNldERlZmF1bHRDb2RlYyhtTGluZSwgcGF5bG9hZCkge1xuICBjb25zdCBlbGVtZW50cyA9IG1MaW5lLnNwbGl0KCcgJyk7XG5cbiAgLy8gSnVzdCBjb3B5IHRoZSBmaXJzdCB0aHJlZSBwYXJhbWV0ZXJzOyBjb2RlYyBvcmRlciBzdGFydHMgb24gZm91cnRoLlxuICBjb25zdCBuZXdMaW5lID0gZWxlbWVudHMuc2xpY2UoMCwgMyk7XG5cbiAgLy8gUHV0IHRhcmdldCBwYXlsb2FkIGZpcnN0IGFuZCBjb3B5IGluIHRoZSByZXN0LlxuICBuZXdMaW5lLnB1c2gocGF5bG9hZCk7XG4gIGZvciAobGV0IGkgPSAzOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZWxlbWVudHNbaV0gIT09IHBheWxvYWQpIHtcbiAgICAgIG5ld0xpbmUucHVzaChlbGVtZW50c1tpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXdMaW5lLmpvaW4oJyAnKTtcbn1cblxuLyogQmVsb3cgYXJlIG5ld2x5IGFkZGVkIGZ1bmN0aW9ucyAqL1xuXG4vLyBGb2xsb3dpbmcgY29kZWNzIHdpbGwgbm90IGJlIHJlbW92ZWQgZnJvbSBTRFAgZXZlbnQgdGhleSBhcmUgbm90IGluIHRoZVxuLy8gdXNlci1zcGVjaWZpZWQgY29kZWMgbGlzdC5cbmNvbnN0IGF1ZGlvQ29kZWNXaGl0ZUxpc3QgPSBbJ0NOJywgJ3RlbGVwaG9uZS1ldmVudCddO1xuY29uc3QgdmlkZW9Db2RlY1doaXRlTGlzdCA9IFsncmVkJywgJ3VscGZlYyddO1xuXG4vLyBSZXR1cm5zIGEgbmV3IG09IGxpbmUgd2l0aCB0aGUgc3BlY2lmaWVkIGNvZGVjIG9yZGVyLlxuZnVuY3Rpb24gc2V0Q29kZWNPcmRlcihtTGluZSwgcGF5bG9hZHMpIHtcbiAgY29uc3QgZWxlbWVudHMgPSBtTGluZS5zcGxpdCgnICcpO1xuXG4gIC8vIEp1c3QgY29weSB0aGUgZmlyc3QgdGhyZWUgcGFyYW1ldGVyczsgY29kZWMgb3JkZXIgc3RhcnRzIG9uIGZvdXJ0aC5cbiAgbGV0IG5ld0xpbmUgPSBlbGVtZW50cy5zbGljZSgwLCAzKTtcblxuICAvLyBDb25jYXQgcGF5bG9hZCB0eXBlcy5cbiAgbmV3TGluZSA9IG5ld0xpbmUuY29uY2F0KHBheWxvYWRzKTtcblxuICByZXR1cm4gbmV3TGluZS5qb2luKCcgJyk7XG59XG5cbi8vIEFwcGVuZCBSVFggcGF5bG9hZHMgZm9yIGV4aXN0aW5nIHBheWxvYWRzLlxuZnVuY3Rpb24gYXBwZW5kUnR4UGF5bG9hZHMoc2RwTGluZXMsIHBheWxvYWRzKSB7XG4gIGZvciAoY29uc3QgcGF5bG9hZCBvZiBwYXlsb2Fkcykge1xuICAgIGNvbnN0IGluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdhPWZtdHAnLCAnYXB0PScgKyBwYXlsb2FkKTtcbiAgICBpZiAoaW5kZXggIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGZtdHBMaW5lID0gcGFyc2VGbXRwTGluZShzZHBMaW5lc1tpbmRleF0pO1xuICAgICAgcGF5bG9hZHMucHVzaChmbXRwTGluZS5wdCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXlsb2Fkcztcbn1cblxuLy8gUmVtb3ZlIGEgY29kZWMgd2l0aCBhbGwgaXRzIGFzc29jaWF0ZWQgYSBsaW5lcy5cbmZ1bmN0aW9uIHJlbW92ZUNvZGVjRnJhbUFMaW5lKHNkcExpbmVzLCBwYXlsb2FkKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKCdhPShydHBtYXB8cnRjcC1mYnxmbXRwKTonK3BheWxvYWQrJ1xcXFxzJyk7XG4gIGZvciAobGV0IGk9c2RwTGluZXMubGVuZ3RoLTE7IGk+MDsgaS0tKSB7XG4gICAgaWYgKHNkcExpbmVzW2ldLm1hdGNoKHBhdHRlcm4pKSB7XG4gICAgICBzZHBMaW5lcy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzZHBMaW5lcztcbn1cblxuLy8gUmVvcmRlciBjb2RlY3MgaW4gbS1saW5lIGFjY29yZGluZyB0aGUgb3JkZXIgb2YgfGNvZGVjc3wuIFJlbW92ZSBjb2RlY3MgZnJvbVxuLy8gbS1saW5lIGlmIGl0IGlzIG5vdCBwcmVzZW50IGluIHxjb2RlY3N8XG4vLyBUaGUgZm9ybWF0IG9mIHxjb2RlY3wgaXMgJ05BTUUvUkFURScsIGUuZy4gJ29wdXMvNDgwMDAnLlxuZXhwb3J0IGZ1bmN0aW9uIHJlb3JkZXJDb2RlY3Moc2RwLCB0eXBlLCBjb2RlY3MpIHtcbiAgaWYgKCFjb2RlY3MgfHwgY29kZWNzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBjb2RlY3MgPSB0eXBlID09PSAnYXVkaW8nID8gY29kZWNzLmNvbmNhdChhdWRpb0NvZGVjV2hpdGVMaXN0KSA6IGNvZGVjcy5jb25jYXQoXG4gICAgICB2aWRlb0NvZGVjV2hpdGVMaXN0KTtcblxuICBsZXQgc2RwTGluZXMgPSBzZHAuc3BsaXQoJ1xcclxcbicpO1xuXG4gIC8vIFNlYXJjaCBmb3IgbSBsaW5lLlxuICBjb25zdCBtTGluZUluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdtPScsIHR5cGUpO1xuICBpZiAobUxpbmVJbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBjb25zdCBvcmlnaW5QYXlsb2FkcyA9IHNkcExpbmVzW21MaW5lSW5kZXhdLnNwbGl0KCcgJyk7XG4gIG9yaWdpblBheWxvYWRzLnNwbGljZSgwLCAzKTtcblxuICAvLyBJZiB0aGUgY29kZWMgaXMgYXZhaWxhYmxlLCBzZXQgaXQgYXMgdGhlIGRlZmF1bHQgaW4gbSBsaW5lLlxuICBsZXQgcGF5bG9hZHMgPSBbXTtcbiAgZm9yIChjb25zdCBjb2RlYyBvZiBjb2RlY3MpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNkcExpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGZpbmRMaW5lSW5SYW5nZShzZHBMaW5lcywgaSwgLTEsICdhPXJ0cG1hcCcsIGNvZGVjKTtcbiAgICAgIGlmIChpbmRleCAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gZ2V0Q29kZWNQYXlsb2FkVHlwZUZyb21MaW5lKHNkcExpbmVzW2luZGV4XSk7XG4gICAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgICAgcGF5bG9hZHMucHVzaChwYXlsb2FkKTtcbiAgICAgICAgICBpID0gaW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcGF5bG9hZHMgPSBhcHBlbmRSdHhQYXlsb2FkcyhzZHBMaW5lcywgcGF5bG9hZHMpO1xuICBzZHBMaW5lc1ttTGluZUluZGV4XSA9IHNldENvZGVjT3JkZXIoc2RwTGluZXNbbUxpbmVJbmRleF0sIHBheWxvYWRzKTtcblxuICAvLyBSZW1vdmUgYSBsaW5lcy5cbiAgZm9yIChjb25zdCBwYXlsb2FkIG9mIG9yaWdpblBheWxvYWRzKSB7XG4gICAgaWYgKHBheWxvYWRzLmluZGV4T2YocGF5bG9hZCk9PT0tMSkge1xuICAgICAgc2RwTGluZXMgPSByZW1vdmVDb2RlY0ZyYW1BTGluZShzZHBMaW5lcywgcGF5bG9hZCk7XG4gICAgfVxuICB9XG5cbiAgc2RwID0gc2RwTGluZXMuam9pbignXFxyXFxuJyk7XG4gIHJldHVybiBzZHA7XG59XG5cbi8vIEFkZCBsZWdhY3kgc2ltdWxjYXN0LlxuZXhwb3J0IGZ1bmN0aW9uIGFkZExlZ2FjeVNpbXVsY2FzdChzZHAsIHR5cGUsIG51bVN0cmVhbXMpIHtcbiAgaWYgKCFudW1TdHJlYW1zIHx8ICEobnVtU3RyZWFtcyA+IDEpKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIGxldCBzZHBMaW5lcyA9IHNkcC5zcGxpdCgnXFxyXFxuJyk7XG4gIC8vIFNlYXJjaCBmb3IgbSBsaW5lLlxuICBjb25zdCBtTGluZVN0YXJ0ID0gZmluZExpbmUoc2RwTGluZXMsICdtPScsIHR5cGUpO1xuICBpZiAobUxpbmVTdGFydCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgbGV0IG1MaW5lRW5kID0gZmluZExpbmVJblJhbmdlKHNkcExpbmVzLCBtTGluZVN0YXJ0ICsgMSwgLTEsICdtPScpO1xuICBpZiAobUxpbmVFbmQgPT09IG51bGwpIHtcbiAgICBtTGluZUVuZCA9IHNkcExpbmVzLmxlbmd0aDtcbiAgfVxuXG4gIGNvbnN0IHNzcmNHZXR0ZXIgPSAobGluZSkgPT4ge1xuICAgIGNvbnN0IHBhcnRzID0gbGluZS5zcGxpdCgnICcpO1xuICAgIGNvbnN0IHNzcmMgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xuICAgIHJldHVybiBzc3JjO1xuICB9O1xuXG4gIC8vIFByb2Nlc3Mgc3NyYyBsaW5lcyBmcm9tIG1MaW5lSW5kZXguXG4gIGNvbnN0IHJlbW92ZXMgPSBuZXcgU2V0KCk7XG4gIGNvbnN0IHNzcmNzID0gbmV3IFNldCgpO1xuICBjb25zdCBnc3NyY3MgPSBuZXcgU2V0KCk7XG4gIGNvbnN0IHNpbUxpbmVzID0gW107XG4gIGNvbnN0IHNpbUdyb3VwTGluZXMgPSBbXTtcbiAgbGV0IGkgPSBtTGluZVN0YXJ0ICsgMTtcbiAgd2hpbGUgKGkgPCBtTGluZUVuZCkge1xuICAgIGNvbnN0IGxpbmUgPSBzZHBMaW5lc1tpXTtcbiAgICBpZiAobGluZSA9PT0gJycpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAobGluZS5pbmRleE9mKCdhPXNzcmM6JykgPiAtMSkge1xuICAgICAgY29uc3Qgc3NyYyA9IHNzcmNHZXR0ZXIoc2RwTGluZXNbaV0pO1xuICAgICAgc3NyY3MuYWRkKHNzcmMpO1xuICAgICAgaWYgKGxpbmUuaW5kZXhPZignY25hbWUnKSA+IC0xIHx8IGxpbmUuaW5kZXhPZignbXNpZCcpID4gLTEpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCBudW1TdHJlYW1zOyBqKyspIHtcbiAgICAgICAgICBjb25zdCBuc3NyYyA9IChwYXJzZUludChzc3JjKSArIGopICsgJyc7XG4gICAgICAgICAgc2ltTGluZXMucHVzaChsaW5lLnJlcGxhY2Uoc3NyYywgbnNzcmMpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtb3Zlcy5hZGQobGluZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChsaW5lLmluZGV4T2YoJ2E9c3NyYy1ncm91cDpGSUQnKSA+IC0xKSB7XG4gICAgICBjb25zdCBwYXJ0cyA9IGxpbmUuc3BsaXQoJyAnKTtcbiAgICAgIGdzc3Jjcy5hZGQocGFydHNbMl0pO1xuICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCBudW1TdHJlYW1zOyBqKyspIHtcbiAgICAgICAgY29uc3QgbnNzcmMxID0gKHBhcnNlSW50KHBhcnRzWzFdKSArIGopICsgJyc7XG4gICAgICAgIGNvbnN0IG5zc3JjMiA9IChwYXJzZUludChwYXJ0c1syXSkgKyBqKSArICcnO1xuICAgICAgICBzaW1Hcm91cExpbmVzLnB1c2goXG4gICAgICAgICAgbGluZS5yZXBsYWNlKHBhcnRzWzFdLCBuc3NyYzEpLnJlcGxhY2UocGFydHNbMl0sIG5zc3JjMikpO1xuICAgICAgfVxuICAgIH1cbiAgICBpKys7XG4gIH1cblxuICBjb25zdCBpbnNlcnRQb3MgPSBpO1xuICBzc3Jjcy5mb3JFYWNoKHNzcmMgPT4ge1xuICAgIGlmICghZ3NzcmNzLmhhcyhzc3JjKSkge1xuICAgICAgbGV0IGdyb3VwTGluZSA9ICdhPXNzcmMtZ3JvdXA6U0lNJztcbiAgICAgIGdyb3VwTGluZSA9IGdyb3VwTGluZSArICcgJyArIHNzcmM7XG4gICAgICBmb3IgKGxldCBqID0gMTsgaiA8IG51bVN0cmVhbXM7IGorKykge1xuICAgICAgICBncm91cExpbmUgPSBncm91cExpbmUgKyAnICcgKyAocGFyc2VJbnQoc3NyYykgKyBqKTtcbiAgICAgIH1cbiAgICAgIHNpbUdyb3VwTGluZXMucHVzaChncm91cExpbmUpO1xuICAgIH1cbiAgfSk7XG5cbiAgc2ltTGluZXMuc29ydCgpO1xuICAvLyBJbnNlcnQgc2ltdWxjYXN0IHNzcmMgbGluZXMuXG4gIHNkcExpbmVzLnNwbGljZShpbnNlcnRQb3MsIDAsIC4uLnNpbUdyb3VwTGluZXMpO1xuICBzZHBMaW5lcy5zcGxpY2UoaW5zZXJ0UG9zLCAwLCAuLi5zaW1MaW5lcyk7XG4gIHNkcExpbmVzID0gc2RwTGluZXMuZmlsdGVyKGxpbmUgPT4gIXJlbW92ZXMuaGFzKGxpbmUpKTtcblxuICBzZHAgPSBzZHBMaW5lcy5qb2luKCdcXHJcXG4nKTtcbiAgcmV0dXJuIHNkcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1heEJpdHJhdGUoc2RwLCBlbmNvZGluZ1BhcmFtZXRlcnNMaXN0KSB7XG4gIGZvciAoY29uc3QgZW5jb2RpbmdQYXJhbWV0ZXJzIG9mIGVuY29kaW5nUGFyYW1ldGVyc0xpc3QpIHtcbiAgICBpZiAoZW5jb2RpbmdQYXJhbWV0ZXJzLm1heEJpdHJhdGUpIHtcbiAgICAgIHNkcCA9IHNldENvZGVjUGFyYW0oXG4gICAgICAgICAgc2RwLCBlbmNvZGluZ1BhcmFtZXRlcnMuY29kZWMubmFtZSwgJ3gtZ29vZ2xlLW1heC1iaXRyYXRlJyxcbiAgICAgICAgICAoZW5jb2RpbmdQYXJhbWV0ZXJzLm1heEJpdHJhdGUpLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc2RwO1xufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyLmpzJ1xuaW1wb3J0IHtPd3RFdmVudH0gZnJvbSAnLi9ldmVudC5qcydcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnXG5pbXBvcnQgeyBFdmVudERpc3BhdGNoZXJ9IGZyb20gJy4vZXZlbnQuanMnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuZnVuY3Rpb24gaXNBbGxvd2VkVmFsdWUob2JqLCBhbGxvd2VkVmFsdWVzKSB7XG4gIHJldHVybiAoYWxsb3dlZFZhbHVlcy5zb21lKChlbGUpID0+IHtcbiAgICByZXR1cm4gZWxlID09PSBvYmo7XG4gIH0pKTtcbn1cbi8qKlxuICogQGNsYXNzIFN0cmVhbVNvdXJjZUluZm9cbiAqIEBtZW1iZXJPZiBPd3QuQmFzZVxuICogQGNsYXNzRGVzYyBJbmZvcm1hdGlvbiBvZiBhIHN0cmVhbSdzIHNvdXJjZS5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGRlc2NyaXB0aW9uIEF1ZGlvIHNvdXJjZSBpbmZvIG9yIHZpZGVvIHNvdXJjZSBpbmZvIGNvdWxkIGJlIHVuZGVmaW5lZCBpZiBhIHN0cmVhbSBkb2VzIG5vdCBoYXZlIGF1ZGlvL3ZpZGVvIHRyYWNrLlxuICogQHBhcmFtIHs/c3RyaW5nfSBhdWRpb1NvdXJjZUluZm8gQXVkaW8gc291cmNlIGluZm8uIEFjY2VwdGVkIHZhbHVlcyBhcmU6IFwibWljXCIsIFwic2NyZWVuLWNhc3RcIiwgXCJmaWxlXCIsIFwibWl4ZWRcIiBvciB1bmRlZmluZWQuXG4gKiBAcGFyYW0gez9zdHJpbmd9IHZpZGVvU291cmNlSW5mbyBWaWRlbyBzb3VyY2UgaW5mby4gQWNjZXB0ZWQgdmFsdWVzIGFyZTogXCJjYW1lcmFcIiwgXCJzY3JlZW4tY2FzdFwiLCBcImZpbGVcIiwgXCJtaXhlZFwiIG9yIHVuZGVmaW5lZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmVhbVNvdXJjZUluZm8ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihhdWRpb1NvdXJjZUluZm8sIHZpZGVvU291cmNlSW5mbykge1xuICAgIGlmICghaXNBbGxvd2VkVmFsdWUoYXVkaW9Tb3VyY2VJbmZvLCBbdW5kZWZpbmVkLCAnbWljJywgJ3NjcmVlbi1jYXN0JyxcbiAgICAgICdmaWxlJywgJ21peGVkJ10pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmNvcnJlY3QgdmFsdWUgZm9yIGF1ZGlvU291cmNlSW5mbycpO1xuICAgIH1cbiAgICBpZiAoIWlzQWxsb3dlZFZhbHVlKHZpZGVvU291cmNlSW5mbywgW3VuZGVmaW5lZCwgJ2NhbWVyYScsICdzY3JlZW4tY2FzdCcsXG4gICAgICAnZmlsZScsICdlbmNvZGVkLWZpbGUnLCAncmF3LWZpbGUnLCAnbWl4ZWQnXSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0luY29ycmVjdCB2YWx1ZSBmb3IgdmlkZW9Tb3VyY2VJbmZvJyk7XG4gICAgfVxuICAgIHRoaXMuYXVkaW8gPSBhdWRpb1NvdXJjZUluZm87XG4gICAgdGhpcy52aWRlbyA9IHZpZGVvU291cmNlSW5mbztcbiAgfVxufVxuLyoqXG4gKiBAY2xhc3MgU3RyZWFtXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBjbGFzc0Rlc2MgQmFzZSBjbGFzcyBvZiBzdHJlYW1zLlxuICogQGV4dGVuZHMgT3d0LkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJlYW0gZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihzdHJlYW0sIHNvdXJjZUluZm8sIGF0dHJpYnV0ZXMpIHtcbiAgICBzdXBlcigpO1xuICAgIGlmICgoc3RyZWFtICYmICEoc3RyZWFtIGluc3RhbmNlb2YgTWVkaWFTdHJlYW0pKSB8fCAodHlwZW9mIHNvdXJjZUluZm8gIT09XG4gICAgICAgICdvYmplY3QnKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBzdHJlYW0gb3Igc291cmNlSW5mby4nKTtcbiAgICB9XG4gICAgaWYgKHN0cmVhbSAmJiAoKHN0cmVhbS5nZXRBdWRpb1RyYWNrcygpLmxlbmd0aCA+IDAgJiYgIXNvdXJjZUluZm8uYXVkaW8pIHx8XG4gICAgICAgIHN0cmVhbS5nZXRWaWRlb1RyYWNrcygpLmxlbmd0aCA+IDAgJiYgIXNvdXJjZUluZm8udmlkZW8pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdNaXNzaW5nIGF1ZGlvIHNvdXJjZSBpbmZvIG9yIHZpZGVvIHNvdXJjZSBpbmZvLicpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/TWVkaWFTdHJlYW19IG1lZGlhU3RyZWFtXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlN0cmVhbVxuICAgICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9tZWRpYWNhcHR1cmUtc3RyZWFtcy8jbWVkaWFzdHJlYW18TWVkaWFTdHJlYW0gQVBJIG9mIE1lZGlhIENhcHR1cmUgYW5kIFN0cmVhbXN9LlxuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWVkaWFTdHJlYW0nLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogc3RyZWFtLFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge093dC5CYXNlLlN0cmVhbVNvdXJjZUluZm99IHNvdXJjZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5TdHJlYW1cbiAgICAgKiBAZGVzYyBTb3VyY2UgaW5mbyBvZiBhIHN0cmVhbS5cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3NvdXJjZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc291cmNlSW5mbyxcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9IGF0dHJpYnV0ZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuU3RyZWFtXG4gICAgICogQGRlc2MgQ3VzdG9tIGF0dHJpYnV0ZXMgb2YgYSBzdHJlYW0uXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdhdHRyaWJ1dGVzJywge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IGF0dHJpYnV0ZXMsXG4gICAgfSk7XG4gIH1cbn1cbi8qKlxuICogQGNsYXNzIExvY2FsU3RyZWFtXG4gKiBAY2xhc3NEZXNjIFN0cmVhbSBjYXB0dXJlZCBmcm9tIGN1cnJlbnQgZW5kcG9pbnQuXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBleHRlbmRzIE93dC5CYXNlLlN0cmVhbVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge01lZGlhU3RyZWFtfSBzdHJlYW0gVW5kZXJseWluZyBNZWRpYVN0cmVhbS5cbiAqIEBwYXJhbSB7T3d0LkJhc2UuU3RyZWFtU291cmNlSW5mb30gc291cmNlSW5mbyBJbmZvcm1hdGlvbiBhYm91dCBzdHJlYW0ncyBzb3VyY2UuXG4gKiBAcGFyYW0ge29iamVjdH0gYXR0cmlidXRlcyBDdXN0b20gYXR0cmlidXRlcyBvZiB0aGUgc3RyZWFtLlxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxTdHJlYW0gZXh0ZW5kcyBTdHJlYW0ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihzdHJlYW0sIHNvdXJjZUluZm8sIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAoIShzdHJlYW0gaW5zdGFuY2VvZiBNZWRpYVN0cmVhbSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgc3RyZWFtLicpO1xuICAgIH1cbiAgICBzdXBlcihzdHJlYW0sIHNvdXJjZUluZm8sIGF0dHJpYnV0ZXMpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gaWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuTG9jYWxTdHJlYW1cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2lkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBVdGlscy5jcmVhdGVVdWlkKCksXG4gICAgfSk7XG4gIH1cbn1cbi8qKlxuICogQGNsYXNzIFJlbW90ZVN0cmVhbVxuICogQGNsYXNzRGVzYyBTdHJlYW0gc2VudCBmcm9tIGEgcmVtb3RlIGVuZHBvaW50LlxuICogRXZlbnRzOlxuICpcbiAqIHwgRXZlbnQgTmFtZSAgICAgIHwgQXJndW1lbnQgVHlwZSAgICB8IEZpcmVkIHdoZW4gICAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tLS0tLS18IC0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBlbmRlZCAgICAgICAgICAgfCBFdmVudCAgICAgICAgICAgIHwgU3RyZWFtIGlzIGVuZGVkLiAgIHxcbiAqIHwgdXBkYXRlZCAgICAgICAgIHwgRXZlbnQgICAgICAgICAgICB8IFN0cmVhbSBpcyB1cGRhdGVkLiB8XG4gKlxuICogQG1lbWJlck9mIE93dC5CYXNlXG4gKiBAZXh0ZW5kcyBPd3QuQmFzZS5TdHJlYW1cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFJlbW90ZVN0cmVhbSBleHRlbmRzIFN0cmVhbSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGlkLCBvcmlnaW4sIHN0cmVhbSwgc291cmNlSW5mbywgYXR0cmlidXRlcykge1xuICAgIHN1cGVyKHN0cmVhbSwgc291cmNlSW5mbywgYXR0cmlidXRlcyk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBpZFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5SZW1vdGVTdHJlYW1cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2lkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBpZCA/IGlkIDogVXRpbHMuY3JlYXRlVXVpZCgpLFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gb3JpZ2luXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlJlbW90ZVN0cmVhbVxuICAgICAqIEBkZXNjIElEIG9mIHRoZSByZW1vdGUgZW5kcG9pbnQgd2hvIHB1Ymxpc2hlZCB0aGlzIHN0cmVhbS5cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ29yaWdpbicsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogb3JpZ2luLFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge093dC5CYXNlLlB1YmxpY2F0aW9uU2V0dGluZ3N9IHNldHRpbmdzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlJlbW90ZVN0cmVhbVxuICAgICAqIEBkZXNjIE9yaWdpbmFsIHNldHRpbmdzIGZvciBwdWJsaXNoaW5nIHRoaXMgc3RyZWFtLiBUaGlzIHByb3BlcnR5IGlzIG9ubHkgdmFsaWQgaW4gY29uZmVyZW5jZSBtb2RlLlxuICAgICAqL1xuICAgIHRoaXMuc2V0dGluZ3MgPSB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T3d0LkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzfSBleHRyYUNhcGFiaWxpdGllc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5SZW1vdGVTdHJlYW1cbiAgICAgKiBAZGVzYyBFeHRyYSBjYXBhYmlsaXRpZXMgcmVtb3RlIGVuZHBvaW50IHByb3ZpZGVzIGZvciBzdWJzY3JpcHRpb24uIEV4dHJhIGNhcGFiaWxpdGllcyBkb24ndCBpbmNsdWRlIG9yaWdpbmFsIHNldHRpbmdzLiBUaGlzIHByb3BlcnR5IGlzIG9ubHkgdmFsaWQgaW4gY29uZmVyZW5jZSBtb2RlLlxuICAgICAqL1xuICAgIHRoaXMuZXh0cmFDYXBhYmlsaXRpZXMgPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgU3RyZWFtRXZlbnRcbiAqIEBjbGFzc0Rlc2MgRXZlbnQgZm9yIFN0cmVhbS5cbiAqIEBleHRlbmRzIE93dC5CYXNlLk93dEV2ZW50XG4gKiBAbWVtYmVyb2YgT3d0LkJhc2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmVhbUV2ZW50IGV4dGVuZHMgT3d0RXZlbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T3d0LkJhc2UuU3RyZWFtfSBzdHJlYW1cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuU3RyZWFtRXZlbnRcbiAgICAgKi9cbiAgICB0aGlzLnN0cmVhbSA9IGluaXQuc3RyZWFtO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8qIGdsb2JhbCBuYXZpZ2F0b3IsIHdpbmRvdyAqL1xuXG4ndXNlIHN0cmljdCc7XG5jb25zdCBzZGtWZXJzaW9uID0gJzQuMy4xJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbmV4cG9ydCBmdW5jdGlvbiBpc0ZpcmVmb3goKSB7XG4gIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgnRmlyZWZveCcpICE9PSBudWxsO1xufVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbmV4cG9ydCBmdW5jdGlvbiBpc0Nocm9tZSgpIHtcbiAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKCdDaHJvbWUnKSAhPT0gbnVsbDtcbn1cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG5leHBvcnQgZnVuY3Rpb24gaXNTYWZhcmkoKSB7XG4gIHJldHVybiAvXigoPyFjaHJvbWV8YW5kcm9pZCkuKSpzYWZhcmkvaS50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbn1cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG5leHBvcnQgZnVuY3Rpb24gaXNFZGdlKCkge1xuICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0VkZ2VcXC8oXFxkKykuKFxcZCspJC8pICE9PSBudWxsO1xufVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVVdWlkKCkge1xuICByZXR1cm4gJ3h4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcbiAgICBjb25zdCByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMDtcbiAgICBjb25zdCB2ID0gYyA9PT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KTtcbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufVxuXG4vLyBSZXR1cm5zIHN5c3RlbSBpbmZvcm1hdGlvbi5cbi8vIEZvcm1hdDoge3Nkazp7dmVyc2lvbjoqKiwgdHlwZToqKn0sIHJ1bnRpbWU6e3ZlcnNpb246KiosIG5hbWU6Kip9LCBvczp7dmVyc2lvbjoqKiwgbmFtZToqKn19O1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbmV4cG9ydCBmdW5jdGlvbiBzeXNJbmZvKCkge1xuICBjb25zdCBpbmZvID0gT2JqZWN0LmNyZWF0ZSh7fSk7XG4gIGluZm8uc2RrID0ge1xuICAgIHZlcnNpb246IHNka1ZlcnNpb24sXG4gICAgdHlwZTogJ0phdmFTY3JpcHQnLFxuICB9O1xuICAvLyBSdW50aW1lIGluZm8uXG4gIGNvbnN0IHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIGNvbnN0IGZpcmVmb3hSZWdleCA9IC9GaXJlZm94XFwvKFswLTlcXC5dKykvO1xuICBjb25zdCBjaHJvbWVSZWdleCA9IC9DaHJvbWVcXC8oWzAtOVxcLl0rKS87XG4gIGNvbnN0IGVkZ2VSZWdleCA9IC9FZGdlXFwvKFswLTlcXC5dKykvO1xuICBjb25zdCBzYWZhcmlWZXJzaW9uUmVnZXggPSAvVmVyc2lvblxcLyhbMC05XFwuXSspIFNhZmFyaS87XG4gIGxldCByZXN1bHQgPSBjaHJvbWVSZWdleC5leGVjKHVzZXJBZ2VudCk7XG4gIGlmIChyZXN1bHQpIHtcbiAgICBpbmZvLnJ1bnRpbWUgPSB7XG4gICAgICBuYW1lOiAnQ2hyb21lJyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXSxcbiAgICB9O1xuICB9IGVsc2UgaWYgKHJlc3VsdCA9IGZpcmVmb3hSZWdleC5leGVjKHVzZXJBZ2VudCkpIHtcbiAgICBpbmZvLnJ1bnRpbWUgPSB7XG4gICAgICBuYW1lOiAnRmlyZWZveCcsXG4gICAgICB2ZXJzaW9uOiByZXN1bHRbMV0sXG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPSBlZGdlUmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5ydW50aW1lID0ge1xuICAgICAgbmFtZTogJ0VkZ2UnLFxuICAgICAgdmVyc2lvbjogcmVzdWx0WzFdLFxuICAgIH07XG4gIH0gZWxzZSBpZiAoaXNTYWZhcmkoKSkge1xuICAgIHJlc3VsdCA9IHNhZmFyaVZlcnNpb25SZWdleC5leGVjKHVzZXJBZ2VudCk7XG4gICAgaW5mby5ydW50aW1lID0ge1xuICAgICAgbmFtZTogJ1NhZmFyaScsXG4gICAgfTtcbiAgICBpbmZvLnJ1bnRpbWUudmVyc2lvbiA9IHJlc3VsdCA/IHJlc3VsdFsxXSA6ICdVbmtub3duJztcbiAgfSBlbHNlIHtcbiAgICBpbmZvLnJ1bnRpbWUgPSB7XG4gICAgICBuYW1lOiAnVW5rbm93bicsXG4gICAgICB2ZXJzaW9uOiAnVW5rbm93bicsXG4gICAgfTtcbiAgfVxuICAvLyBPUyBpbmZvLlxuICBjb25zdCB3aW5kb3dzUmVnZXggPSAvV2luZG93cyBOVCAoWzAtOVxcLl0rKS87XG4gIGNvbnN0IG1hY1JlZ2V4ID0gL0ludGVsIE1hYyBPUyBYIChbMC05X1xcLl0rKS87XG4gIGNvbnN0IGlQaG9uZVJlZ2V4ID0gL2lQaG9uZSBPUyAoWzAtOV9cXC5dKykvO1xuICBjb25zdCBsaW51eFJlZ2V4ID0gL1gxMTsgTGludXgvO1xuICBjb25zdCBhbmRyb2lkUmVnZXggPSAvQW5kcm9pZCggKFswLTlcXC5dKykpPy87XG4gIGNvbnN0IGNocm9taXVtT3NSZWdleCA9IC9Dck9TLztcbiAgaWYgKHJlc3VsdCA9IHdpbmRvd3NSZWdleC5leGVjKHVzZXJBZ2VudCkpIHtcbiAgICBpbmZvLm9zID0ge1xuICAgICAgbmFtZTogJ1dpbmRvd3MgTlQnLFxuICAgICAgdmVyc2lvbjogcmVzdWx0WzFdLFxuICAgIH07XG4gIH0gZWxzZSBpZiAocmVzdWx0ID0gbWFjUmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdNYWMgT1MgWCcsXG4gICAgICB2ZXJzaW9uOiByZXN1bHRbMV0ucmVwbGFjZSgvXy9nLCAnLicpLFxuICAgIH07XG4gIH0gZWxzZSBpZiAocmVzdWx0ID0gaVBob25lUmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdpUGhvbmUgT1MnLFxuICAgICAgdmVyc2lvbjogcmVzdWx0WzFdLnJlcGxhY2UoL18vZywgJy4nKSxcbiAgICB9O1xuICB9IGVsc2UgaWYgKHJlc3VsdCA9IGxpbnV4UmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdMaW51eCcsXG4gICAgICB2ZXJzaW9uOiAnVW5rbm93bicsXG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPSBhbmRyb2lkUmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdBbmRyb2lkJyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXSB8fCAnVW5rbm93bicsXG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPSBjaHJvbWl1bU9zUmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdDaHJvbWUgT1MnLFxuICAgICAgdmVyc2lvbjogJ1Vua25vd24nLFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdVbmtub3duJyxcbiAgICAgIHZlcnNpb246ICdVbmtub3duJyxcbiAgICB9O1xuICB9XG4gIGluZm8uY2FwYWJpbGl0aWVzID0ge1xuICAgIGNvbnRpbnVhbEljZUdhdGhlcmluZzogZmFsc2UsXG4gICAgdW5pZmllZFBsYW46IHRydWUsXG4gICAgc3RyZWFtUmVtb3ZhYmxlOiBpbmZvLnJ1bnRpbWUubmFtZSAhPT0gJ0ZpcmVmb3gnLFxuICB9O1xuICByZXR1cm4gaW5mbztcbn1cbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuLyogZXNsaW50LWRpc2FibGUgcmVxdWlyZS1qc2RvYyAqL1xuLyogZ2xvYmFsIFByb21pc2UgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL2Jhc2UvbG9nZ2VyLmpzJztcbmltcG9ydCB7XG4gIEV2ZW50RGlzcGF0Y2hlcixcbiAgTWVzc2FnZUV2ZW50LFxuICBPd3RFdmVudCxcbiAgRXJyb3JFdmVudCxcbiAgTXV0ZUV2ZW50XG59IGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnO1xuaW1wb3J0IHsgVHJhY2tLaW5kIH0gZnJvbSAnLi4vYmFzZS9tZWRpYWZvcm1hdC5qcydcbmltcG9ydCB7IFB1YmxpY2F0aW9uIH0gZnJvbSAnLi4vYmFzZS9wdWJsaWNhdGlvbi5qcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL3N1YnNjcmlwdGlvbi5qcydcbmltcG9ydCB7IENvbmZlcmVuY2VFcnJvciB9IGZyb20gJy4vZXJyb3IuanMnXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuLi9iYXNlL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIFNkcFV0aWxzIGZyb20gJy4uL2Jhc2Uvc2RwdXRpbHMuanMnO1xuXG4vKipcbiAqIEBjbGFzcyBDb25mZXJlbmNlUGVlckNvbm5lY3Rpb25DaGFubmVsXG4gKiBAY2xhc3NEZXNjIEEgY2hhbm5lbCBmb3IgYSBjb25uZWN0aW9uIGJldHdlZW4gY2xpZW50IGFuZCBjb25mZXJlbmNlIHNlcnZlci4gQ3VycmVudGx5LCBvbmx5IG9uZSBzdHJlYW0gY291bGQgYmUgdHJhbm1pdHRlZCBpbiBhIGNoYW5uZWwuXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgQ29uZmVyZW5jZVBlZXJDb25uZWN0aW9uQ2hhbm5lbCBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgc2lnbmFsaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG51bGw7XG4gICAgdGhpcy5fdmlkZW9Db2RlY3MgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fc2lnbmFsaW5nID0gc2lnbmFsaW5nO1xuICAgIHRoaXMuX3BjID0gbnVsbDtcbiAgICB0aGlzLl9pbnRlcm5hbElkID0gbnVsbDsgLy8gSXQncyBwdWJsaWNhdGlvbiBJRCBvciBzdWJzY3JpcHRpb24gSUQuXG4gICAgdGhpcy5fcGVuZGluZ0NhbmRpZGF0ZXMgPSBbXTtcbiAgICB0aGlzLl9zdWJzY3JpYmVQcm9taXNlID0gbnVsbDtcbiAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZSA9IG51bGw7XG4gICAgdGhpcy5fc3Vic2NyaWJlZFN0cmVhbSA9IG51bGw7XG4gICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtID0gbnVsbDtcbiAgICB0aGlzLl9wdWJsaWNhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICAvLyBUaW1lciBmb3IgUGVlckNvbm5lY3Rpb24gZGlzY29ubmVjdGVkLiBXaWxsIHN0b3AgY29ubmVjdGlvbiBhZnRlciB0aW1lci5cbiAgICB0aGlzLl9kaXNjb25uZWN0VGltZXIgPSBudWxsO1xuICAgIHRoaXMuX2VuZGVkID0gZmFsc2U7XG4gICAgdGhpcy5fc3RvcHBlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBvbk1lc3NhZ2VcbiAgICogQGRlc2MgUmVjZWl2ZWQgYSBtZXNzYWdlIGZyb20gY29uZmVyZW5jZSBwb3J0YWwuIERlZmluZWQgaW4gY2xpZW50LXNlcnZlciBwcm90b2NvbC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb24gdHlwZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IG1lc3NhZ2UgTWVzc2FnZSByZWNlaXZlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uTWVzc2FnZShub3RpZmljYXRpb24sIG1lc3NhZ2UpIHtcbiAgICBzd2l0Y2ggKG5vdGlmaWNhdGlvbikge1xuICAgICAgY2FzZSAncHJvZ3Jlc3MnOlxuICAgICAgICBpZiAobWVzc2FnZS5zdGF0dXMgPT09ICdzb2FjJykge1xuICAgICAgICAgIHRoaXMuX3NkcEhhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlLnN0YXR1cyA9PT0gJ3JlYWR5Jykge1xuICAgICAgICAgIHRoaXMuX3JlYWR5SGFuZGxlcigpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2Uuc3RhdHVzID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJlYW0nOlxuICAgICAgICB0aGlzLl9vblN0cmVhbUV2ZW50KG1lc3NhZ2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIExvZ2dlci53YXJuaW5nKCdVbmtub3duIG5vdGlmaWNhdGlvbiBmcm9tIE1DVS4nKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaXNoKHN0cmVhbSwgb3B0aW9ucywgdmlkZW9Db2RlY3MpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zID0ge2F1ZGlvOiAhIXN0cmVhbS5tZWRpYVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpLmxlbmd0aCwgdmlkZW86ICEhc3RyZWFtXG4gICAgICAgICAgLm1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkubGVuZ3RofTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ09wdGlvbnMgc2hvdWxkIGJlIGFuIG9iamVjdC4nKSk7XG4gICAgfVxuICAgIGlmICgodGhpcy5faXNSdHBFbmNvZGluZ1BhcmFtZXRlcnMob3B0aW9ucy5hdWRpbykgJiZcbiAgICAgICAgIHRoaXMuX2lzT3d0RW5jb2RpbmdQYXJhbWV0ZXJzKG9wdGlvbnMudmlkZW8pKSB8fFxuICAgICAgICAodGhpcy5faXNPd3RFbmNvZGluZ1BhcmFtZXRlcnMob3B0aW9ucy5hdWRpbykgJiZcbiAgICAgICAgIHRoaXMuX2lzUnRwRW5jb2RpbmdQYXJhbWV0ZXJzKG9wdGlvbnMudmlkZW8pKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICAgJ01peGluZyBSVENSdHBFbmNvZGluZ1BhcmFtZXRlcnMgYW5kIEF1ZGlvRW5jb2RpbmdQYXJhbWV0ZXJzL1ZpZGVvRW5jb2RpbmdQYXJhbWV0ZXJzIGlzIG5vdCBhbGxvd2VkLicpKVxuICAgIH1cbiAgICBpZiAob3B0aW9ucy5hdWRpbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zLmF1ZGlvID0gISFzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKS5sZW5ndGg7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnZpZGVvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMudmlkZW8gPSAhIXN0cmVhbS5tZWRpYVN0cmVhbS5nZXRWaWRlb1RyYWNrcygpLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKCghIW9wdGlvbnMuYXVkaW8gJiYgIXN0cmVhbS5tZWRpYVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpLmxlbmd0aCkgfHxcbiAgICAgICAgKCEhb3B0aW9ucy52aWRlbyAmJiAhc3RyZWFtLm1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICAgJ29wdGlvbnMuYXVkaW8vdmlkZW8gaXMgaW5jb25zaXN0ZW50IHdpdGggdHJhY2tzIHByZXNlbnRlZCBpbiB0aGUgJyArXG4gICAgICAgICAgJ01lZGlhU3RyZWFtLidcbiAgICAgICkpO1xuICAgIH1cbiAgICBpZiAoKG9wdGlvbnMuYXVkaW8gPT09IGZhbHNlIHx8IG9wdGlvbnMuYXVkaW8gPT09IG51bGwpICYmXG4gICAgICAob3B0aW9ucy52aWRlbyA9PT0gZmFsc2UgfHwgb3B0aW9ucy52aWRlbyA9PT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKFxuICAgICAgICAgICdDYW5ub3QgcHVibGlzaCBhIHN0cmVhbSB3aXRob3V0IGF1ZGlvIGFuZCB2aWRlby4nKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hdWRpbyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShvcHRpb25zLmF1ZGlvKSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICdvcHRpb25zLmF1ZGlvIHNob3VsZCBiZSBhIGJvb2xlYW4gb3IgYW4gYXJyYXkuJykpO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBwYXJhbWV0ZXJzIG9mIG9wdGlvbnMuYXVkaW8pIHtcbiAgICAgICAgaWYgKCFwYXJhbWV0ZXJzLmNvZGVjIHx8IHR5cGVvZiBwYXJhbWV0ZXJzLmNvZGVjLm5hbWUgIT09ICdzdHJpbmcnIHx8IChcbiAgICAgICAgICBwYXJhbWV0ZXJzLm1heEJpdHJhdGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcGFyYW1ldGVycy5tYXhCaXRyYXRlXG4gICAgICAgICAgIT09ICdudW1iZXInKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAnb3B0aW9ucy5hdWRpbyBoYXMgaW5jb3JyZWN0IHBhcmFtZXRlcnMuJykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy52aWRlbyA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkob3B0aW9ucy52aWRlbykpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFxuICAgICAgICAnb3B0aW9ucy52aWRlbyBzaG91bGQgYmUgYSBib29sZWFuIG9yIGFuIGFycmF5LicpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzT3d0RW5jb2RpbmdQYXJhbWV0ZXJzKG9wdGlvbnMudmlkZW8pKSB7XG4gICAgICBmb3IgKGNvbnN0IHBhcmFtZXRlcnMgb2Ygb3B0aW9ucy52aWRlbykge1xuICAgICAgICBpZiAoIXBhcmFtZXRlcnMuY29kZWMgfHwgdHlwZW9mIHBhcmFtZXRlcnMuY29kZWMubmFtZSAhPT0gJ3N0cmluZycgfHxcbiAgICAgICAgICAoXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLm1heEJpdHJhdGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcGFyYW1ldGVyc1xuICAgICAgICAgICAgLm1heEJpdHJhdGUgIT09XG4gICAgICAgICAgICAnbnVtYmVyJykgfHwgKHBhcmFtZXRlcnMuY29kZWMucHJvZmlsZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB0eXBlb2YgcGFyYW1ldGVycy5jb2RlYy5wcm9maWxlICE9PSAnc3RyaW5nJykpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICdvcHRpb25zLnZpZGVvIGhhcyBpbmNvcnJlY3QgcGFyYW1ldGVycy4nKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgY29uc3QgbWVkaWFPcHRpb25zID0ge307XG4gICAgdGhpcy5fY3JlYXRlUGVlckNvbm5lY3Rpb24oKTtcbiAgICBpZiAoc3RyZWFtLm1lZGlhU3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkubGVuZ3RoID4gMCAmJiBvcHRpb25zLmF1ZGlvICE9PVxuICAgICAgZmFsc2UgJiYgb3B0aW9ucy5hdWRpbyAhPT0gbnVsbCkge1xuICAgICAgaWYgKHN0cmVhbS5tZWRpYVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoXG4gICAgICAgICAgICAnUHVibGlzaGluZyBhIHN0cmVhbSB3aXRoIG11bHRpcGxlIGF1ZGlvIHRyYWNrcyBpcyBub3QgZnVsbHknXG4gICAgICAgICAgICArICcgc3VwcG9ydGVkLidcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hdWRpbyAhPT0gJ2Jvb2xlYW4nICYmIHR5cGVvZiBvcHRpb25zLmF1ZGlvICE9PVxuICAgICAgICAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgICAgICdUeXBlIG9mIGF1ZGlvIG9wdGlvbnMgc2hvdWxkIGJlIGJvb2xlYW4gb3IgYW4gb2JqZWN0LidcbiAgICAgICAgKSk7XG4gICAgICB9XG4gICAgICBtZWRpYU9wdGlvbnMuYXVkaW8gPSB7fTtcbiAgICAgIG1lZGlhT3B0aW9ucy5hdWRpby5zb3VyY2UgPSBzdHJlYW0uc291cmNlLmF1ZGlvO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZWRpYU9wdGlvbnMuYXVkaW8gPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHN0cmVhbS5tZWRpYVN0cmVhbS5nZXRWaWRlb1RyYWNrcygpLmxlbmd0aCA+IDAgJiYgb3B0aW9ucy52aWRlbyAhPT1cbiAgICAgIGZhbHNlICYmIG9wdGlvbnMudmlkZW8gIT09IG51bGwpIHtcbiAgICAgIGlmIChzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKS5sZW5ndGggPiAxKSB7XG4gICAgICAgIExvZ2dlci53YXJuaW5nKFxuICAgICAgICAgICAgJ1B1Ymxpc2hpbmcgYSBzdHJlYW0gd2l0aCBtdWx0aXBsZSB2aWRlbyB0cmFja3MgaXMgbm90IGZ1bGx5ICdcbiAgICAgICAgICAgICsgJ3N1cHBvcnRlZC4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8gPSB7fTtcbiAgICAgIG1lZGlhT3B0aW9ucy52aWRlby5zb3VyY2UgPSBzdHJlYW0uc291cmNlLnZpZGVvO1xuICAgICAgY29uc3QgdHJhY2tTZXR0aW5ncyA9IHN0cmVhbS5tZWRpYVN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdXG4gICAgICAgICAgLmdldFNldHRpbmdzKCk7XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8ucGFyYW1ldGVycyA9IHtcbiAgICAgICAgcmVzb2x1dGlvbjoge1xuICAgICAgICAgIHdpZHRoOiB0cmFja1NldHRpbmdzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdHJhY2tTZXR0aW5ncy5oZWlnaHQsXG4gICAgICAgIH0sXG4gICAgICAgIGZyYW1lcmF0ZTogdHJhY2tTZXR0aW5ncy5mcmFtZVJhdGUsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtID0gc3RyZWFtO1xuICAgIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSgncHVibGlzaCcsIHtcbiAgICAgIG1lZGlhOiBtZWRpYU9wdGlvbnMsXG4gICAgICBhdHRyaWJ1dGVzOiBzdHJlYW0uYXR0cmlidXRlcyxcbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlRXZlbnQgPSBuZXcgTWVzc2FnZUV2ZW50KCdpZCcsIHtcbiAgICAgICAgbWVzc2FnZTogZGF0YS5pZCxcbiAgICAgICAgb3JpZ2luOiB0aGlzLl9yZW1vdGVJZCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG1lc3NhZ2VFdmVudCk7XG4gICAgICB0aGlzLl9pbnRlcm5hbElkID0gZGF0YS5pZDtcbiAgICAgIGNvbnN0IG9mZmVyT3B0aW9ucyA9IHt9O1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLl9wYy5hZGRUcmFuc2NlaXZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsZXQgc2V0UHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAvLyB8ZGlyZWN0aW9ufCBzZWVtcyBub3Qgd29ya2luZyBvbiBTYWZhcmkuXG4gICAgICAgIGlmIChtZWRpYU9wdGlvbnMuYXVkaW8gJiYgc3RyZWFtLm1lZGlhU3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkubGVuZ3RoID5cbiAgICAgICAgICAwKSB7XG4gICAgICAgICAgY29uc3QgdHJhbnNjZWl2ZXJJbml0ID0ge1xuICAgICAgICAgICAgZGlyZWN0aW9uOiAnc2VuZG9ubHknXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAodGhpcy5faXNSdHBFbmNvZGluZ1BhcmFtZXRlcnMob3B0aW9ucy5hdWRpbykpIHtcbiAgICAgICAgICAgIHRyYW5zY2VpdmVySW5pdC5zZW5kRW5jb2RpbmdzID0gb3B0aW9ucy5hdWRpbztcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgdHJhbnNjZWl2ZXIgPSB0aGlzLl9wYy5hZGRUcmFuc2NlaXZlcihzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKVswXSxcbiAgICAgICAgICAgIHRyYW5zY2VpdmVySW5pdCk7XG5cbiAgICAgICAgICBpZiAoVXRpbHMuaXNGaXJlZm94KCkpIHtcbiAgICAgICAgICAgIC8vIEZpcmVmb3ggZG9lcyBub3Qgc3VwcG9ydCBlbmNvZGluZ3Mgc2V0dGluZyBpbiBhZGRUcmFuc2NlaXZlci5cbiAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB0cmFuc2NlaXZlci5zZW5kZXIuZ2V0UGFyYW1ldGVycygpO1xuICAgICAgICAgICAgcGFyYW1ldGVycy5lbmNvZGluZ3MgPSB0cmFuc2NlaXZlckluaXQuc2VuZEVuY29kaW5ncztcbiAgICAgICAgICAgIHNldFByb21pc2UgPSB0cmFuc2NlaXZlci5zZW5kZXIuc2V0UGFyYW1ldGVycyhwYXJhbWV0ZXJzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lZGlhT3B0aW9ucy52aWRlbyAmJiBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKS5sZW5ndGggPlxuICAgICAgICAgIDApIHtcbiAgICAgICAgICBjb25zdCB0cmFuc2NlaXZlckluaXQgPSB7XG4gICAgICAgICAgICBkaXJlY3Rpb246ICdzZW5kb25seSdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmICh0aGlzLl9pc1J0cEVuY29kaW5nUGFyYW1ldGVycyhvcHRpb25zLnZpZGVvKSkge1xuICAgICAgICAgICAgdHJhbnNjZWl2ZXJJbml0LnNlbmRFbmNvZGluZ3MgPSBvcHRpb25zLnZpZGVvO1xuICAgICAgICAgICAgdGhpcy5fdmlkZW9Db2RlY3MgPSB2aWRlb0NvZGVjcztcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgdHJhbnNjZWl2ZXIgPSB0aGlzLl9wYy5hZGRUcmFuc2NlaXZlcihzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXSxcbiAgICAgICAgICAgIHRyYW5zY2VpdmVySW5pdCk7XG5cbiAgICAgICAgICBpZiAoVXRpbHMuaXNGaXJlZm94KCkpIHtcbiAgICAgICAgICAgIC8vIEZpcmVmb3ggZG9lcyBub3Qgc3VwcG9ydCBlbmNvZGluZ3Mgc2V0dGluZyBpbiBhZGRUcmFuc2NlaXZlci5cbiAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB0cmFuc2NlaXZlci5zZW5kZXIuZ2V0UGFyYW1ldGVycygpO1xuICAgICAgICAgICAgcGFyYW1ldGVycy5lbmNvZGluZ3MgPSB0cmFuc2NlaXZlckluaXQuc2VuZEVuY29kaW5ncztcbiAgICAgICAgICAgIHNldFByb21pc2UgPSBzZXRQcm9taXNlLnRoZW4oXG4gICAgICAgICAgICAgICgpID0+IHRyYW5zY2VpdmVyLnNlbmRlci5zZXRQYXJhbWV0ZXJzKHBhcmFtZXRlcnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNldFByb21pc2UudGhlbigoKSA9PiBvZmZlck9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG1lZGlhT3B0aW9ucy5hdWRpbyAmJiBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yIChjb25zdCB0cmFjayBvZiBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKSlcbiAgICAgICAgICAgIHRoaXMuX3BjLmFkZFRyYWNrKHRyYWNrLCBzdHJlYW0ubWVkaWFTdHJlYW0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZWRpYU9wdGlvbnMudmlkZW8gJiYgc3RyZWFtLm1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAoY29uc3QgdHJhY2sgb2Ygc3RyZWFtLm1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkpXG4gICAgICAgICAgICB0aGlzLl9wYy5hZGRUcmFjayh0cmFjaywgc3RyZWFtLm1lZGlhU3RyZWFtKTtcbiAgICAgICAgfVxuICAgICAgICBvZmZlck9wdGlvbnMub2ZmZXJUb1JlY2VpdmVBdWRpbyA9IGZhbHNlO1xuICAgICAgICBvZmZlck9wdGlvbnMub2ZmZXJUb1JlY2VpdmVWaWRlbyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9mZmVyT3B0aW9ucztcbiAgICB9KS50aGVuKChvZmZlck9wdGlvbnMpID0+IHtcbiAgICAgIGxldCBsb2NhbERlc2M7XG4gICAgICB0aGlzLl9wYy5jcmVhdGVPZmZlcihvZmZlck9wdGlvbnMpLnRoZW4oKGRlc2MpID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICBkZXNjLnNkcCA9IHRoaXMuX3NldFJ0cFJlY2VpdmVyT3B0aW9ucyhkZXNjLnNkcCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlc2M7XG4gICAgICB9KS50aGVuKChkZXNjKSA9PiB7XG4gICAgICAgIGxvY2FsRGVzYyA9IGRlc2M7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYy5zZXRMb2NhbERlc2NyaXB0aW9uKGRlc2MpO1xuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSgnc29hYycsIHtcbiAgICAgICAgICBpZDogdGhpc1xuICAgICAgICAgICAgICAuX2ludGVybmFsSWQsXG4gICAgICAgICAgc2lnbmFsaW5nOiBsb2NhbERlc2MsXG4gICAgICAgIH0pO1xuICAgICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgTG9nZ2VyLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIG9mZmVyIG9yIHNldCBTRFAuIE1lc3NhZ2U6ICdcbiAgICAgICAgICAgICsgZS5tZXNzYWdlKTtcbiAgICAgICAgdGhpcy5fdW5wdWJsaXNoKCk7XG4gICAgICAgIHRoaXMuX3JlamVjdFByb21pc2UoZSk7XG4gICAgICAgIHRoaXMuX2ZpcmVFbmRlZEV2ZW50T25QdWJsaWNhdGlvbk9yU3Vic2NyaXB0aW9uKCk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgdGhpcy5fdW5wdWJsaXNoKCk7XG4gICAgICB0aGlzLl9yZWplY3RQcm9taXNlKGUpO1xuICAgICAgdGhpcy5fZmlyZUVuZGVkRXZlbnRPblB1YmxpY2F0aW9uT3JTdWJzY3JpcHRpb24oKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fcHVibGlzaFByb21pc2UgPSB7cmVzb2x2ZTogcmVzb2x2ZSwgcmVqZWN0OiByZWplY3R9O1xuICAgIH0pO1xuICB9XG5cbiAgc3Vic2NyaWJlKHN0cmVhbSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIGF1ZGlvOiAhIXN0cmVhbS5zZXR0aW5ncy5hdWRpbyxcbiAgICAgICAgdmlkZW86ICEhc3RyZWFtLnNldHRpbmdzLnZpZGVvLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ09wdGlvbnMgc2hvdWxkIGJlIGFuIG9iamVjdC4nKSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF1ZGlvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMuYXVkaW8gPSAhIXN0cmVhbS5zZXR0aW5ncy5hdWRpbztcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMudmlkZW8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0aW9ucy52aWRlbyA9ICEhc3RyZWFtLnNldHRpbmdzLnZpZGVvO1xuICAgIH1cbiAgICBpZiAoKG9wdGlvbnMuYXVkaW8gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5hdWRpbyAhPT0gJ29iamVjdCcgJiZcbiAgICAgICAgdHlwZW9mIG9wdGlvbnMuYXVkaW8gIT09ICdib29sZWFuJyAmJiBvcHRpb25zLmF1ZGlvICE9PSBudWxsKSB8fCAoXG4gICAgICBvcHRpb25zLnZpZGVvICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9wdGlvbnMudmlkZW8gIT09ICdvYmplY3QnICYmXG4gICAgICAgIHR5cGVvZiBvcHRpb25zLnZpZGVvICE9PSAnYm9vbGVhbicgJiYgb3B0aW9ucy52aWRlbyAhPT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG9wdGlvbnMgdHlwZS4nKSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF1ZGlvICYmICFzdHJlYW0uc2V0dGluZ3MuYXVkaW8gfHwgKG9wdGlvbnMudmlkZW8gJiZcbiAgICAgICAgIXN0cmVhbS5zZXR0aW5ncy52aWRlbykpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKFxuICAgICAgICAgICdvcHRpb25zLmF1ZGlvL3ZpZGVvIGNhbm5vdCBiZSB0cnVlIG9yIGFuIG9iamVjdCBpZiB0aGVyZSBpcyBubyAnXG4gICAgICAgICAgKyAnYXVkaW8vdmlkZW8gdHJhY2sgaW4gcmVtb3RlIHN0cmVhbS4nXG4gICAgICApKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYXVkaW8gPT09IGZhbHNlICYmIG9wdGlvbnMudmlkZW8gPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IHN1YnNjcmliZSBhIHN0cmVhbSB3aXRob3V0IGF1ZGlvIGFuZCB2aWRlby4nKSk7XG4gICAgfVxuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgIGNvbnN0IG1lZGlhT3B0aW9ucyA9IHt9O1xuICAgIGlmIChvcHRpb25zLmF1ZGlvKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuYXVkaW8gPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgQXJyYXkuaXNBcnJheShvcHRpb25zLmF1ZGlvLmNvZGVjcykpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYXVkaW8uY29kZWNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAnQXVkaW8gY29kZWMgY2Fubm90IGJlIGFuIGVtcHR5IGFycmF5LicpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbWVkaWFPcHRpb25zLmF1ZGlvID0ge307XG4gICAgICBtZWRpYU9wdGlvbnMuYXVkaW8uZnJvbSA9IHN0cmVhbS5pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVkaWFPcHRpb25zLmF1ZGlvID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnZpZGVvKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMudmlkZW8gPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgQXJyYXkuaXNBcnJheShvcHRpb25zLnZpZGVvLmNvZGVjcykpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMudmlkZW8uY29kZWNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAnVmlkZW8gY29kZWMgY2Fubm90IGJlIGFuIGVtcHR5IGFycmF5LicpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbWVkaWFPcHRpb25zLnZpZGVvID0ge307XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8uZnJvbSA9IHN0cmVhbS5pZDtcbiAgICAgIGlmIChvcHRpb25zLnZpZGVvLnJlc29sdXRpb24gfHwgb3B0aW9ucy52aWRlby5mcmFtZVJhdGUgfHwgKG9wdGlvbnMudmlkZW9cbiAgICAgICAgICAuYml0cmF0ZU11bHRpcGxpZXIgJiYgb3B0aW9ucy52aWRlby5iaXRyYXRlTXVsdGlwbGllciAhPT0gMSkgfHxcbiAgICAgICAgb3B0aW9ucy52aWRlby5rZXlGcmFtZUludGVydmFsKSB7XG4gICAgICAgIG1lZGlhT3B0aW9ucy52aWRlby5wYXJhbWV0ZXJzID0ge1xuICAgICAgICAgIHJlc29sdXRpb246IG9wdGlvbnMudmlkZW8ucmVzb2x1dGlvbixcbiAgICAgICAgICBmcmFtZXJhdGU6IG9wdGlvbnMudmlkZW8uZnJhbWVSYXRlLFxuICAgICAgICAgIGJpdHJhdGU6IG9wdGlvbnMudmlkZW8uYml0cmF0ZU11bHRpcGxpZXIgPyAneCdcbiAgICAgICAgICAgICAgKyBvcHRpb25zLnZpZGVvLmJpdHJhdGVNdWx0aXBsaWVyLnRvU3RyaW5nKCkgOiB1bmRlZmluZWQsXG4gICAgICAgICAga2V5RnJhbWVJbnRlcnZhbDogb3B0aW9ucy52aWRlby5rZXlGcmFtZUludGVydmFsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy52aWRlby5yaWQpIHtcbiAgICAgICAgbWVkaWFPcHRpb25zLnZpZGVvLnNpbXVsY2FzdFJpZCA9IG9wdGlvbnMudmlkZW8ucmlkO1xuICAgICAgICAvLyBJZ25vcmUgb3RoZXIgc2V0dGluZ3Mgd2hlbiBSSUQgc2V0LlxuICAgICAgICBkZWxldGUgbWVkaWFPcHRpb25zLnZpZGVvLnBhcmFtZXRlcnM7XG4gICAgICAgIG9wdGlvbnMudmlkZW8gPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8gPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLl9zdWJzY3JpYmVkU3RyZWFtID0gc3RyZWFtO1xuICAgIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSgnc3Vic2NyaWJlJywge1xuICAgICAgbWVkaWE6IG1lZGlhT3B0aW9ucyxcbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlRXZlbnQgPSBuZXcgTWVzc2FnZUV2ZW50KCdpZCcsIHtcbiAgICAgICAgbWVzc2FnZTogZGF0YS5pZCxcbiAgICAgICAgb3JpZ2luOiB0aGlzLl9yZW1vdGVJZCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG1lc3NhZ2VFdmVudCk7XG4gICAgICB0aGlzLl9pbnRlcm5hbElkID0gZGF0YS5pZDtcbiAgICAgIHRoaXMuX2NyZWF0ZVBlZXJDb25uZWN0aW9uKCk7XG4gICAgICBjb25zdCBvZmZlck9wdGlvbnMgPSB7fTtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gfGRpcmVjdGlvbnwgc2VlbXMgbm90IHdvcmtpbmcgb24gU2FmYXJpLlxuICAgICAgICBpZiAobWVkaWFPcHRpb25zLmF1ZGlvKSB7XG4gICAgICAgICAgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ2F1ZGlvJywge2RpcmVjdGlvbjogJ3JlY3Zvbmx5J30pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZWRpYU9wdGlvbnMudmlkZW8pIHtcbiAgICAgICAgICB0aGlzLl9wYy5hZGRUcmFuc2NlaXZlcigndmlkZW8nLCB7ZGlyZWN0aW9uOiAncmVjdm9ubHknfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9mZmVyT3B0aW9ucy5vZmZlclRvUmVjZWl2ZUF1ZGlvID0gISFvcHRpb25zLmF1ZGlvO1xuICAgICAgICBvZmZlck9wdGlvbnMub2ZmZXJUb1JlY2VpdmVWaWRlbyA9ICEhb3B0aW9ucy52aWRlbztcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcGMuY3JlYXRlT2ZmZXIob2ZmZXJPcHRpb25zKS50aGVuKChkZXNjKSA9PiB7XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgZGVzYy5zZHAgPSB0aGlzLl9zZXRSdHBSZWNlaXZlck9wdGlvbnMoZGVzYy5zZHAsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BjLnNldExvY2FsRGVzY3JpcHRpb24oZGVzYykudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKCdzb2FjJywge1xuICAgICAgICAgICAgaWQ6IHRoaXNcbiAgICAgICAgICAgICAgICAuX2ludGVybmFsSWQsXG4gICAgICAgICAgICBzaWduYWxpbmc6IGRlc2MsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yTWVzc2FnZSkge1xuICAgICAgICAgIExvZ2dlci5lcnJvcignU2V0IGxvY2FsIGRlc2NyaXB0aW9uIGZhaWxlZC4gTWVzc2FnZTogJyArXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShlcnJvck1lc3NhZ2UpKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBMb2dnZXIuZXJyb3IoJ0NyZWF0ZSBvZmZlciBmYWlsZWQuIEVycm9yIGluZm86ICcgKyBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIGVycm9yKSk7XG4gICAgICB9KS5jYXRjaCgoZSk9PntcbiAgICAgICAgTG9nZ2VyLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIG9mZmVyIG9yIHNldCBTRFAuIE1lc3NhZ2U6ICdcbiAgICAgICAgICAgICsgZS5tZXNzYWdlKTtcbiAgICAgICAgdGhpcy5fdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5fcmVqZWN0UHJvbWlzZShlKTtcbiAgICAgICAgdGhpcy5fZmlyZUVuZGVkRXZlbnRPblB1YmxpY2F0aW9uT3JTdWJzY3JpcHRpb24oKTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICB0aGlzLl91bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fcmVqZWN0UHJvbWlzZShlKTtcbiAgICAgIHRoaXMuX2ZpcmVFbmRlZEV2ZW50T25QdWJsaWNhdGlvbk9yU3Vic2NyaXB0aW9uKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVByb21pc2UgPSB7cmVzb2x2ZTogcmVzb2x2ZSwgcmVqZWN0OiByZWplY3R9O1xuICAgIH0pO1xuICB9XG5cbiAgX3VucHVibGlzaCgpIHtcbiAgICBpZiAoIXRoaXMuX3N0b3BwZWQpIHtcbiAgICAgIHRoaXMuX3N0b3BwZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKCd1bnB1Ymxpc2gnLCB7aWQ6IHRoaXMuX2ludGVybmFsSWR9KVxuICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ01DVSByZXR1cm5zIG5lZ2F0aXZlIGFjayBmb3IgdW5wdWJsaXNoaW5nLCAnICsgZSk7XG4gICAgICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5fcGMgJiYgdGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgIT09ICdjbG9zZWQnKSB7XG4gICAgICAgIHRoaXMuX3BjLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIGlmICghdGhpcy5fc3RvcHBlZCkge1xuICAgICAgdGhpcy5fc3RvcHBlZCA9IHRydWU7XG4gICAgICB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3Vuc3Vic2NyaWJlJywge1xuICAgICAgICBpZDogdGhpcy5faW50ZXJuYWxJZCxcbiAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICBMb2dnZXIud2FybmluZygnTUNVIHJldHVybnMgbmVnYXRpdmUgYWNrIGZvciB1bnN1YnNjcmliaW5nLCAnICsgZSk7XG4gICAgICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5fcGMgJiYgdGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgIT09ICdjbG9zZWQnKSB7XG4gICAgICAgIHRoaXMuX3BjLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX211dGVPclVubXV0ZShpc011dGUsIGlzUHViLCB0cmFja0tpbmQpIHtcbiAgICBjb25zdCBldmVudE5hbWUgPSBpc1B1YiA/ICdzdHJlYW0tY29udHJvbCcgOlxuICAgICAgJ3N1YnNjcmlwdGlvbi1jb250cm9sJztcbiAgICBjb25zdCBvcGVyYXRpb24gPSBpc011dGUgPyAncGF1c2UnIDogJ3BsYXknO1xuICAgIHJldHVybiB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoZXZlbnROYW1lLCB7XG4gICAgICBpZDogdGhpcy5faW50ZXJuYWxJZCxcbiAgICAgIG9wZXJhdGlvbjogb3BlcmF0aW9uLFxuICAgICAgZGF0YTogdHJhY2tLaW5kLFxuICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKCFpc1B1Yikge1xuICAgICAgICBjb25zdCBtdXRlRXZlbnROYW1lID0gaXNNdXRlID8gJ211dGUnIDogJ3VubXV0ZSc7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbi5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgICAgbmV3IE11dGVFdmVudChtdXRlRXZlbnROYW1lLCB7a2luZDogdHJhY2tLaW5kfSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2FwcGx5T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb3B0aW9ucy52aWRlbyAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKFxuICAgICAgICAgICdPcHRpb25zIHNob3VsZCBiZSBhbiBvYmplY3QuJykpO1xuICAgIH1cbiAgICBjb25zdCB2aWRlb09wdGlvbnMgPSB7fTtcbiAgICB2aWRlb09wdGlvbnMucmVzb2x1dGlvbiA9IG9wdGlvbnMudmlkZW8ucmVzb2x1dGlvbjtcbiAgICB2aWRlb09wdGlvbnMuZnJhbWVyYXRlID0gb3B0aW9ucy52aWRlby5mcmFtZVJhdGU7XG4gICAgdmlkZW9PcHRpb25zLmJpdHJhdGUgPSBvcHRpb25zLnZpZGVvLmJpdHJhdGVNdWx0aXBsaWVyID8gJ3gnICsgb3B0aW9ucy52aWRlb1xuICAgICAgICAuYml0cmF0ZU11bHRpcGxpZXJcbiAgICAgICAgLnRvU3RyaW5nKCkgOiB1bmRlZmluZWQ7XG4gICAgdmlkZW9PcHRpb25zLmtleUZyYW1lSW50ZXJ2YWwgPSBvcHRpb25zLnZpZGVvLmtleUZyYW1lSW50ZXJ2YWw7XG4gICAgcmV0dXJuIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSgnc3Vic2NyaXB0aW9uLWNvbnRyb2wnLCB7XG4gICAgICBpZDogdGhpcy5faW50ZXJuYWxJZCxcbiAgICAgIG9wZXJhdGlvbjogJ3VwZGF0ZScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHZpZGVvOiB7cGFyYW1ldGVyczogdmlkZW9PcHRpb25zfSxcbiAgICAgIH0sXG4gICAgfSkudGhlbigpO1xuICB9XG5cbiAgX29uUmVtb3RlU3RyZWFtQWRkZWQoZXZlbnQpIHtcbiAgICBMb2dnZXIuZGVidWcoJ1JlbW90ZSBzdHJlYW0gYWRkZWQuJyk7XG4gICAgaWYgKHRoaXMuX3N1YnNjcmliZWRTdHJlYW0pIHtcbiAgICAgIHRoaXMuX3N1YnNjcmliZWRTdHJlYW0ubWVkaWFTdHJlYW0gPSBldmVudC5zdHJlYW1zWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGlzIGlzIG5vdCBleHBlY3RlZCBwYXRoLiBIb3dldmVyLCB0aGlzIGlzIGdvaW5nIHRvIGhhcHBlbiBvbiBTYWZhcmlcbiAgICAgIC8vIGJlY2F1c2UgaXQgZG9lcyBub3Qgc3VwcG9ydCBzZXR0aW5nIGRpcmVjdGlvbiBvZiB0cmFuc2NlaXZlci5cbiAgICAgIExvZ2dlci53YXJuaW5nKCdSZWNlaXZlZCByZW1vdGUgc3RyZWFtIHdpdGhvdXQgc3Vic2NyaXB0aW9uLicpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkxvY2FsSWNlQ2FuZGlkYXRlKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmNhbmRpZGF0ZSkge1xuICAgICAgaWYgKHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlICE9PSAnc3RhYmxlJykge1xuICAgICAgICB0aGlzLl9wZW5kaW5nQ2FuZGlkYXRlcy5wdXNoKGV2ZW50LmNhbmRpZGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zZW5kQ2FuZGlkYXRlKGV2ZW50LmNhbmRpZGF0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnRW1wdHkgY2FuZGlkYXRlLicpO1xuICAgIH1cbiAgfVxuXG4gIF9maXJlRW5kZWRFdmVudE9uUHVibGljYXRpb25PclN1YnNjcmlwdGlvbigpIHtcbiAgICBpZiAodGhpcy5fZW5kZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fZW5kZWQgPSB0cnVlO1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE93dEV2ZW50KCdlbmRlZCcpO1xuICAgIGlmICh0aGlzLl9wdWJsaWNhdGlvbikge1xuICAgICAgdGhpcy5fcHVibGljYXRpb24uZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICB0aGlzLl9wdWJsaWNhdGlvbi5zdG9wKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbi5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbi5zdG9wKCk7XG4gICAgfVxuICB9XG5cbiAgX3JlamVjdFByb21pc2UoZXJyb3IpIHtcbiAgICBpZiAoIWVycm9yKSB7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBDb25mZXJlbmNlRXJyb3IoJ0Nvbm5lY3Rpb24gZmFpbGVkIG9yIGNsb3NlZC4nKTtcbiAgICB9XG4gICAgLy8gUmVqZWN0aW5nIGNvcnJlc3BvbmRpbmcgcHJvbWlzZSBpZiBwdWJsaXNoaW5nIGFuZCBzdWJzY3JpYmluZyBpcyBvbmdvaW5nLlxuICAgIGlmICh0aGlzLl9wdWJsaXNoUHJvbWlzZSkge1xuICAgICAgdGhpcy5fcHVibGlzaFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlID0gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc3Vic2NyaWJlUHJvbWlzZSkge1xuICAgICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBfb25JY2VDb25uZWN0aW9uU3RhdGVDaGFuZ2UoZXZlbnQpIHtcbiAgICBpZiAoIWV2ZW50IHx8ICFldmVudC5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgTG9nZ2VyLmRlYnVnKCdJQ0UgY29ubmVjdGlvbiBzdGF0ZSBjaGFuZ2VkIHRvICcgK1xuICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSk7XG4gICAgaWYgKGV2ZW50LmN1cnJlbnRUYXJnZXQuaWNlQ29ubmVjdGlvblN0YXRlID09PSAnY2xvc2VkJyB8fFxuICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2ZhaWxlZCcpIHtcbiAgICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2ZhaWxlZCcpIHtcbiAgICAgICAgdGhpcy5faGFuZGxlRXJyb3IoJ2Nvbm5lY3Rpb24gZmFpbGVkLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRmlyZSBlbmRlZCBldmVudCBpZiBwdWJsaWNhdGlvbiBvciBzdWJzY3JpcHRpb24gZXhpc3RzLlxuICAgICAgICB0aGlzLl9maXJlRW5kZWRFdmVudE9uUHVibGljYXRpb25PclN1YnNjcmlwdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9vbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZShldmVudCkge1xuICAgIGlmICh0aGlzLl9wYy5jb25uZWN0aW9uU3RhdGUgPT09ICdjbG9zZWQnIHx8XG4gICAgICAgIHRoaXMuX3BjLmNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2ZhaWxlZCcpIHtcbiAgICAgIGlmICh0aGlzLl9wYy5jb25uZWN0aW9uU3RhdGUgPT09ICdmYWlsZWQnKSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKCdjb25uZWN0aW9uIGZhaWxlZC4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZpcmUgZW5kZWQgZXZlbnQgaWYgcHVibGljYXRpb24gb3Igc3Vic2NyaXB0aW9uIGV4aXN0cy5cbiAgICAgICAgdGhpcy5fZmlyZUVuZGVkRXZlbnRPblB1YmxpY2F0aW9uT3JTdWJzY3JpcHRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfc2VuZENhbmRpZGF0ZShjYW5kaWRhdGUpIHtcbiAgICB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3NvYWMnLCB7XG4gICAgICBpZDogdGhpcy5faW50ZXJuYWxJZCxcbiAgICAgIHNpZ25hbGluZzoge1xuICAgICAgICB0eXBlOiAnY2FuZGlkYXRlJyxcbiAgICAgICAgY2FuZGlkYXRlOiB7XG4gICAgICAgICAgY2FuZGlkYXRlOiAnYT0nICsgY2FuZGlkYXRlLmNhbmRpZGF0ZSxcbiAgICAgICAgICBzZHBNaWQ6IGNhbmRpZGF0ZS5zZHBNaWQsXG4gICAgICAgICAgc2RwTUxpbmVJbmRleDogY2FuZGlkYXRlLnNkcE1MaW5lSW5kZXgsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgX2NyZWF0ZVBlZXJDb25uZWN0aW9uKCkge1xuICAgIGNvbnN0IHBjQ29uZmlndXJhdGlvbiA9IHRoaXMuX2NvbmZpZy5ydGNDb25maWd1cmF0aW9uIHx8IHt9O1xuICAgIGlmIChVdGlscy5pc0Nocm9tZSgpKSB7XG4gICAgICBwY0NvbmZpZ3VyYXRpb24uc2RwU2VtYW50aWNzID0gJ3VuaWZpZWQtcGxhbic7XG4gICAgfVxuICAgIHRoaXMuX3BjID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHBjQ29uZmlndXJhdGlvbik7XG4gICAgdGhpcy5fcGMub25pY2VjYW5kaWRhdGUgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uTG9jYWxJY2VDYW5kaWRhdGUuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICB0aGlzLl9wYy5vbnRyYWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vblJlbW90ZVN0cmVhbUFkZGVkLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgdGhpcy5fcGMub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uSWNlQ29ubmVjdGlvblN0YXRlQ2hhbmdlLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgdGhpcy5fcGMub25jb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uQ29ubmVjdGlvblN0YXRlQ2hhbmdlLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gIH1cblxuICBfZ2V0U3RhdHMoKSB7XG4gICAgaWYgKHRoaXMuX3BjKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGMuZ2V0U3RhdHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICAgJ1BlZXJDb25uZWN0aW9uIGlzIG5vdCBhdmFpbGFibGUuJykpO1xuICAgIH1cbiAgfVxuXG4gIF9yZWFkeUhhbmRsZXIoKSB7XG4gICAgaWYgKHRoaXMuX3N1YnNjcmliZVByb21pc2UpIHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24odGhpcy5faW50ZXJuYWxJZCwgKCkgPT4ge1xuICAgICAgICB0aGlzLl91bnN1YnNjcmliZSgpO1xuICAgICAgfSwgKCkgPT4gdGhpcy5fZ2V0U3RhdHMoKSxcbiAgICAgICh0cmFja0tpbmQpID0+IHRoaXMuX211dGVPclVubXV0ZSh0cnVlLCBmYWxzZSwgdHJhY2tLaW5kKSxcbiAgICAgICh0cmFja0tpbmQpID0+IHRoaXMuX211dGVPclVubXV0ZShmYWxzZSwgZmFsc2UsIHRyYWNrS2luZCksXG4gICAgICAob3B0aW9ucykgPT4gdGhpcy5fYXBwbHlPcHRpb25zKG9wdGlvbnMpKTtcbiAgICAgIC8vIEZpcmUgc3Vic2NyaXB0aW9uJ3MgZW5kZWQgZXZlbnQgd2hlbiBhc3NvY2lhdGVkIHN0cmVhbSBpcyBlbmRlZC5cbiAgICAgIHRoaXMuX3N1YnNjcmliZWRTdHJlYW0uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbi5kaXNwYXRjaEV2ZW50KCdlbmRlZCcsIG5ldyBPd3RFdmVudCgnZW5kZWQnKSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVByb21pc2UucmVzb2x2ZSh0aGlzLl9zdWJzY3JpcHRpb24pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fcHVibGlzaFByb21pc2UpIHtcbiAgICAgIHRoaXMuX3B1YmxpY2F0aW9uID0gbmV3IFB1YmxpY2F0aW9uKHRoaXMuX2ludGVybmFsSWQsICgpID0+IHtcbiAgICAgICAgdGhpcy5fdW5wdWJsaXNoKCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH0sICgpID0+IHRoaXMuX2dldFN0YXRzKCksXG4gICAgICAodHJhY2tLaW5kKSA9PiB0aGlzLl9tdXRlT3JVbm11dGUodHJ1ZSwgdHJ1ZSwgdHJhY2tLaW5kKSxcbiAgICAgICh0cmFja0tpbmQpID0+IHRoaXMuX211dGVPclVubXV0ZShmYWxzZSwgdHJ1ZSwgdHJhY2tLaW5kKSk7XG4gICAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZS5yZXNvbHZlKHRoaXMuX3B1YmxpY2F0aW9uKTtcbiAgICAgIC8vIERvIG5vdCBmaXJlIHB1YmxpY2F0aW9uJ3MgZW5kZWQgZXZlbnQgd2hlbiBhc3NvY2lhdGVkIHN0cmVhbSBpcyBlbmRlZC5cbiAgICAgIC8vIEl0IG1heSBzdGlsbCBzZW5kaW5nIHNpbGVuY2Ugb3IgYmxhY2sgZnJhbWVzLlxuICAgICAgLy8gUmVmZXIgdG8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYnJ0Yy1wYy8jcnRjcnRwc2VuZGVyLWludGVyZmFjZS5cbiAgICB9XG4gICAgdGhpcy5fcHVibGlzaFByb21pc2UgPSBudWxsO1xuICAgIHRoaXMuX3N1YnNjcmliZVByb21pc2UgPSBudWxsO1xuICB9XG5cbiAgX3NkcEhhbmRsZXIoc2RwKSB7XG4gICAgaWYgKHNkcC50eXBlID09PSAnYW5zd2VyJykge1xuICAgICAgaWYgKCh0aGlzLl9wdWJsaWNhdGlvbiB8fCB0aGlzLl9wdWJsaXNoUHJvbWlzZSkgJiYgdGhpcy5fb3B0aW9ucykge1xuICAgICAgICBzZHAuc2RwID0gdGhpcy5fc2V0UnRwU2VuZGVyT3B0aW9ucyhzZHAuc2RwLCB0aGlzLl9vcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3BjLnNldFJlbW90ZURlc2NyaXB0aW9uKHNkcCkudGhlbigoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9wZW5kaW5nQ2FuZGlkYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgdGhpcy5fcGVuZGluZ0NhbmRpZGF0ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbmRDYW5kaWRhdGUoY2FuZGlkYXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBMb2dnZXIuZXJyb3IoJ1NldCByZW1vdGUgZGVzY3JpcHRpb24gZmFpbGVkOiAnICsgZXJyb3IpO1xuICAgICAgICB0aGlzLl9yZWplY3RQcm9taXNlKGVycm9yKTtcbiAgICAgICAgdGhpcy5fZmlyZUVuZGVkRXZlbnRPblB1YmxpY2F0aW9uT3JTdWJzY3JpcHRpb24oKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9lcnJvckhhbmRsZXIoZXJyb3JNZXNzYWdlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hhbmRsZUVycm9yKGVycm9yTWVzc2FnZSk7XG4gIH1cblxuICBfaGFuZGxlRXJyb3IoZXJyb3JNZXNzYWdlKXtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBDb25mZXJlbmNlRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICBjb25zdCBwID0gdGhpcy5fcHVibGlzaFByb21pc2UgfHwgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZTtcbiAgICBpZiAocCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlamVjdFByb21pc2UoZXJyb3IpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZW5kZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGlzcGF0Y2hlciA9IHRoaXMuX3B1YmxpY2F0aW9uIHx8IHRoaXMuX3N1YnNjcmlwdGlvbjtcbiAgICBpZiAoIWRpc3BhdGNoZXIpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdOZWl0aGVyIHB1YmxpY2F0aW9uIG5vciBzdWJzY3JpcHRpb24gaXMgYXZhaWxhYmxlLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlcnJvckV2ZW50ID0gbmV3IEVycm9yRXZlbnQoJ2Vycm9yJywge1xuICAgICAgZXJyb3I6IGVycm9yLFxuICAgIH0pO1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChlcnJvckV2ZW50KTtcbiAgICAvLyBGaXJlIGVuZGVkIGV2ZW50IHdoZW4gZXJyb3Igb2NjdXJlZFxuICAgIHRoaXMuX2ZpcmVFbmRlZEV2ZW50T25QdWJsaWNhdGlvbk9yU3Vic2NyaXB0aW9uKCk7XG4gIH1cblxuICBfc2V0Q29kZWNPcmRlcihzZHAsIG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5fcHVibGljYXRpb24gfHwgdGhpcy5fcHVibGlzaFByb21pc2UpIHtcbiAgICAgIGlmIChvcHRpb25zLmF1ZGlvKSB7XG4gICAgICAgIGNvbnN0IGF1ZGlvQ29kZWNOYW1lcyA9IEFycmF5LmZyb20ob3B0aW9ucy5hdWRpbyxcbiAgICAgICAgICAgIChlbmNvZGluZ1BhcmFtZXRlcnMpID0+IGVuY29kaW5nUGFyYW1ldGVycy5jb2RlYy5uYW1lKTtcbiAgICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICdhdWRpbycsIGF1ZGlvQ29kZWNOYW1lcyk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy52aWRlbykge1xuICAgICAgICBjb25zdCB2aWRlb0NvZGVjTmFtZXMgPSBBcnJheS5mcm9tKG9wdGlvbnMudmlkZW8sXG4gICAgICAgICAgICAoZW5jb2RpbmdQYXJhbWV0ZXJzKSA9PiBlbmNvZGluZ1BhcmFtZXRlcnMuY29kZWMubmFtZSk7XG4gICAgICAgIHNkcCA9IFNkcFV0aWxzLnJlb3JkZXJDb2RlY3Moc2RwLCAndmlkZW8nLCB2aWRlb0NvZGVjTmFtZXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3B0aW9ucy5hdWRpbyAmJiBvcHRpb25zLmF1ZGlvLmNvZGVjcykge1xuICAgICAgICBjb25zdCBhdWRpb0NvZGVjTmFtZXMgPSBBcnJheS5mcm9tKG9wdGlvbnMuYXVkaW8uY29kZWNzLCAoY29kZWMpID0+XG4gICAgICAgICAgY29kZWMubmFtZSk7XG4gICAgICAgIHNkcCA9IFNkcFV0aWxzLnJlb3JkZXJDb2RlY3Moc2RwLCAnYXVkaW8nLCBhdWRpb0NvZGVjTmFtZXMpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMudmlkZW8gJiYgb3B0aW9ucy52aWRlby5jb2RlY3MpIHtcbiAgICAgICAgY29uc3QgdmlkZW9Db2RlY05hbWVzID0gQXJyYXkuZnJvbShvcHRpb25zLnZpZGVvLmNvZGVjcywgKGNvZGVjKSA9PlxuICAgICAgICAgIGNvZGVjLm5hbWUpO1xuICAgICAgICBzZHAgPSBTZHBVdGlscy5yZW9yZGVyQ29kZWNzKHNkcCwgJ3ZpZGVvJywgdmlkZW9Db2RlY05hbWVzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIF9zZXRNYXhCaXRyYXRlKHNkcCwgb3B0aW9ucykge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hdWRpbyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHNkcCA9IFNkcFV0aWxzLnNldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zLmF1ZGlvKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnZpZGVvID09PSAnb2JqZWN0Jykge1xuICAgICAgc2RwID0gU2RwVXRpbHMuc2V0TWF4Qml0cmF0ZShzZHAsIG9wdGlvbnMudmlkZW8pO1xuICAgIH1cbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgX3NldFJ0cFNlbmRlck9wdGlvbnMoc2RwLCBvcHRpb25zKSB7XG4gICAgLy8gU0RQIG11Z2xpbmcgaXMgZGVwcmVjYXRlZCwgbW92aW5nIHRvIGBzZXRQYXJhbWV0ZXJzYC5cbiAgICBpZiAodGhpcy5faXNSdHBFbmNvZGluZ1BhcmFtZXRlcnMob3B0aW9ucy5hdWRpbykgfHxcbiAgICAgICAgdGhpcy5faXNSdHBFbmNvZGluZ1BhcmFtZXRlcnMob3B0aW9ucy52aWRlbykpIHtcbiAgICAgIHJldHVybiBzZHA7XG4gICAgfVxuICAgIHNkcCA9IHRoaXMuX3NldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgX3NldFJ0cFJlY2VpdmVyT3B0aW9ucyhzZHAsIG9wdGlvbnMpIHtcbiAgICAvLyBBZGQgbGVnYWN5IHNpbXVsY2FzdCBpbiBTRFAgZm9yIHNhZmFyaS5cbiAgICBpZiAodGhpcy5faXNSdHBFbmNvZGluZ1BhcmFtZXRlcnMob3B0aW9ucy52aWRlbykgJiYgVXRpbHMuaXNTYWZhcmkoKSkge1xuICAgICAgaWYgKG9wdGlvbnMudmlkZW8ubGVuZ3RoID4gMSkge1xuICAgICAgICBzZHAgPSBTZHBVdGlscy5hZGRMZWdhY3lTaW11bGNhc3Qoc2RwLCAndmlkZW8nLCBvcHRpb25zLnZpZGVvLmxlbmd0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gX3ZpZGVvQ29kZWNzIGlzIGEgd29ya2Fyb3VuZCBmb3Igc2V0dGluZyB2aWRlbyBjb2RlY3MuIEl0IHdpbGwgYmUgbW92ZWQgdG8gUlRDUnRwU2VuZFBhcmFtZXRlcnMuXG4gICAgaWYgKHRoaXMuX2lzUnRwRW5jb2RpbmdQYXJhbWV0ZXJzKG9wdGlvbnMudmlkZW8pICYmIHRoaXMuX3ZpZGVvQ29kZWNzKSB7XG4gICAgICBzZHAgPSBTZHBVdGlscy5yZW9yZGVyQ29kZWNzKHNkcCwgJ3ZpZGVvJywgdGhpcy5fdmlkZW9Db2RlY3MpO1xuICAgICAgcmV0dXJuIHNkcDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzUnRwRW5jb2RpbmdQYXJhbWV0ZXJzKG9wdGlvbnMuYXVkaW8pIHx8XG4gICAgICAgIHRoaXMuX2lzUnRwRW5jb2RpbmdQYXJhbWV0ZXJzKG9wdGlvbnMudmlkZW8pKSB7XG4gICAgICByZXR1cm4gc2RwO1xuICAgIH1cbiAgICBzZHAgPSB0aGlzLl9zZXRDb2RlY09yZGVyKHNkcCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIC8vIEhhbmRsZSBzdHJlYW0gZXZlbnQgc2VudCBmcm9tIE1DVS4gU29tZSBzdHJlYW0gZXZlbnRzIHNob3VsZCBiZSBwdWJsaWNhdGlvblxuICAvLyBldmVudCBvciBzdWJzY3JpcHRpb24gZXZlbnQuIEl0IHdpbGwgYmUgaGFuZGxlZCBoZXJlLlxuICBfb25TdHJlYW1FdmVudChtZXNzYWdlKSB7XG4gICAgbGV0IGV2ZW50VGFyZ2V0O1xuICAgIGlmICh0aGlzLl9wdWJsaWNhdGlvbiAmJiBtZXNzYWdlLmlkID09PSB0aGlzLl9wdWJsaWNhdGlvbi5pZCkge1xuICAgICAgZXZlbnRUYXJnZXQgPSB0aGlzLl9wdWJsaWNhdGlvbjtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5fc3Vic2NyaWJlZFN0cmVhbSAmJiBtZXNzYWdlLmlkID09PSB0aGlzLl9zdWJzY3JpYmVkU3RyZWFtLmlkKSB7XG4gICAgICBldmVudFRhcmdldCA9IHRoaXMuX3N1YnNjcmlwdGlvbjtcbiAgICB9XG4gICAgaWYgKCFldmVudFRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgdHJhY2tLaW5kO1xuICAgIGlmIChtZXNzYWdlLmRhdGEuZmllbGQgPT09ICdhdWRpby5zdGF0dXMnKSB7XG4gICAgICB0cmFja0tpbmQgPSBUcmFja0tpbmQuQVVESU87XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmRhdGEuZmllbGQgPT09ICd2aWRlby5zdGF0dXMnKSB7XG4gICAgICB0cmFja0tpbmQgPSBUcmFja0tpbmQuVklERU87XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdJbnZhbGlkIGRhdGEgZmllbGQgZm9yIHN0cmVhbSB1cGRhdGUgaW5mby4nKTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UuZGF0YS52YWx1ZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgIGV2ZW50VGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IE11dGVFdmVudCgndW5tdXRlJywge2tpbmQ6IHRyYWNrS2luZH0pKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZGF0YS52YWx1ZSA9PT0gJ2luYWN0aXZlJykge1xuICAgICAgZXZlbnRUYXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgTXV0ZUV2ZW50KCdtdXRlJywge2tpbmQ6IHRyYWNrS2luZH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0ludmFsaWQgZGF0YSB2YWx1ZSBmb3Igc3RyZWFtIHVwZGF0ZSBpbmZvLicpO1xuICAgIH1cbiAgfVxuXG4gIF9pc1J0cEVuY29kaW5nUGFyYW1ldGVycyhvYmopIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBPbmx5IGNoZWNrIHRoZSBmaXJzdCBvbmUuXG4gICAgY29uc3QgcGFyYW0gPSBvYmpbMF07XG4gICAgcmV0dXJuIHBhcmFtLmNvZGVjUGF5bG9hZFR5cGUgfHwgcGFyYW0uZHR4IHx8IHBhcmFtLmFjdGl2ZSB8fCBwYXJhbVxuICAgICAgLnB0aW1lIHx8IHBhcmFtLm1heEZyYW1lcmF0ZSB8fCBwYXJhbS5zY2FsZVJlc29sdXRpb25Eb3duQnkgfHwgcGFyYW0ucmlkO1xuICB9XG5cbiAgX2lzT3d0RW5jb2RpbmdQYXJhbWV0ZXJzKG9iaikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIE9ubHkgY2hlY2sgdGhlIGZpcnN0IG9uZS5cbiAgICBjb25zdCBwYXJhbSA9IG9ialswXTtcbiAgICByZXR1cm4gISFwYXJhbS5jb2RlYztcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4vKiBnbG9iYWwgTWFwLCBQcm9taXNlICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICogYXMgRXZlbnRNb2R1bGUgZnJvbSAnLi4vYmFzZS9ldmVudC5qcyc7XG5pbXBvcnQge1Npb1NpZ25hbGluZyBhcyBTaWduYWxpbmd9IGZyb20gJy4vc2lnbmFsaW5nLmpzJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vYmFzZS9sb2dnZXIuanMnO1xuaW1wb3J0IHtCYXNlNjR9IGZyb20gJy4uL2Jhc2UvYmFzZTY0LmpzJztcbmltcG9ydCB7Q29uZmVyZW5jZUVycm9yfSBmcm9tICcuL2Vycm9yLmpzJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL2Jhc2UvdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgU3RyZWFtTW9kdWxlIGZyb20gJy4uL2Jhc2Uvc3RyZWFtLmpzJztcbmltcG9ydCB7UGFydGljaXBhbnR9IGZyb20gJy4vcGFydGljaXBhbnQuanMnO1xuaW1wb3J0IHtDb25mZXJlbmNlSW5mb30gZnJvbSAnLi9pbmZvLmpzJztcbmltcG9ydCB7Q29uZmVyZW5jZVBlZXJDb25uZWN0aW9uQ2hhbm5lbH0gZnJvbSAnLi9jaGFubmVsLmpzJztcbmltcG9ydCB7XG4gIFJlbW90ZU1peGVkU3RyZWFtLFxuICBBY3RpdmVBdWRpb0lucHV0Q2hhbmdlRXZlbnQsXG4gIExheW91dENoYW5nZUV2ZW50LFxufSBmcm9tICcuL21peGVkc3RyZWFtLmpzJztcbmltcG9ydCAqIGFzIFN0cmVhbVV0aWxzTW9kdWxlIGZyb20gJy4vc3RyZWFtdXRpbHMuanMnO1xuXG5jb25zdCBTaWduYWxpbmdTdGF0ZSA9IHtcbiAgUkVBRFk6IDEsXG4gIENPTk5FQ1RJTkc6IDIsXG4gIENPTk5FQ1RFRDogMyxcbn07XG5cbmNvbnN0IHByb3RvY29sVmVyc2lvbiA9ICcxLjEnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xuLyoqXG4gKiBAY2xhc3MgUGFydGljaXBhbnRFdmVudFxuICogQGNsYXNzRGVzYyBDbGFzcyBQYXJ0aWNpcGFudEV2ZW50IHJlcHJlc2VudHMgYSBwYXJ0aWNpcGFudCBldmVudC5cbiAgIEBleHRlbmRzIE93dC5CYXNlLk93dEV2ZW50XG4gKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY29uc3QgUGFydGljaXBhbnRFdmVudCA9IGZ1bmN0aW9uKHR5cGUsIGluaXQpIHtcbiAgY29uc3QgdGhhdCA9IG5ldyBFdmVudE1vZHVsZS5Pd3RFdmVudCh0eXBlLCBpbml0KTtcbiAgLyoqXG4gICAqIEBtZW1iZXIge093dC5Db25mZXJlbmNlLlBhcnRpY2lwYW50fSBwYXJ0aWNpcGFudFxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlBhcnRpY2lwYW50RXZlbnRcbiAgICovXG4gIHRoYXQucGFydGljaXBhbnQgPSBpbml0LnBhcnRpY2lwYW50O1xuICByZXR1cm4gdGhhdDtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIHZhbGlkLWpzZG9jICovXG5cbi8qKlxuICogQGNsYXNzIENvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uXG4gKiBAY2xhc3NEZXNjIENvbmZpZ3VyYXRpb24gZm9yIENvbmZlcmVuY2VDbGllbnQuXG4gKiBAbWVtYmVyT2YgT3d0LkNvbmZlcmVuY2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY2xhc3MgQ29uZmVyZW5jZUNsaWVudENvbmZpZ3VyYXRpb24geyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9SVENDb25maWd1cmF0aW9ufSBydGNDb25maWd1cmF0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uXG4gICAgICogQGRlc2MgSXQgd2lsbCBiZSB1c2VkIGZvciBjcmVhdGluZyBQZWVyQ29ubmVjdGlvbi5cbiAgICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvd2VicnRjLyNydGNjb25maWd1cmF0aW9uLWRpY3Rpb25hcnl8UlRDQ29uZmlndXJhdGlvbiBEaWN0aW9uYXJ5IG9mIFdlYlJUQyAxLjB9LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gRm9sbG93aW5nIG9iamVjdCBjYW4gYmUgc2V0IHRvIGNvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uLnJ0Y0NvbmZpZ3VyYXRpb24uXG4gICAgICoge1xuICAgICAqICAgaWNlU2VydmVyczogW3tcbiAgICAgKiAgICAgIHVybHM6IFwic3R1bjpleGFtcGxlLmNvbTozNDc4XCJcbiAgICAgKiAgIH0sIHtcbiAgICAgKiAgICAgdXJsczogW1xuICAgICAqICAgICAgIFwidHVybjpleGFtcGxlLmNvbTozNDc4P3RyYW5zcG9ydD11ZHBcIixcbiAgICAgKiAgICAgICBcInR1cm46ZXhhbXBsZS5jb206MzQ3OD90cmFuc3BvcnQ9dGNwXCJcbiAgICAgKiAgICAgXSxcbiAgICAgKiAgICAgIGNyZWRlbnRpYWw6IFwicGFzc3dvcmRcIixcbiAgICAgKiAgICAgIHVzZXJuYW1lOiBcInVzZXJuYW1lXCJcbiAgICAgKiAgIH1cbiAgICAgKiB9XG4gICAgICovXG4gICAgdGhpcy5ydGNDb25maWd1cmF0aW9uID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIENvbmZlcmVuY2VDbGllbnRcbiAqIEBjbGFzc2Rlc2MgVGhlIENvbmZlcmVuY2VDbGllbnQgaGFuZGxlcyBQZWVyQ29ubmVjdGlvbnMgYmV0d2VlbiBjbGllbnQgYW5kIHNlcnZlci4gRm9yIGNvbmZlcmVuY2UgY29udHJvbGxpbmcsIHBsZWFzZSByZWZlciB0byBSRVNUIEFQSSBndWlkZS5cbiAqIEV2ZW50czpcbiAqXG4gKiB8IEV2ZW50IE5hbWUgICAgICAgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgICAgICAgICAgICAgICAgIHwgRmlyZWQgd2hlbiAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwgLS0tLS0tLS0tLS0tLS0tLSB8XG4gKiB8IHN0cmVhbWFkZGVkICAgICAgICAgICB8IE93dC5CYXNlLlN0cmVhbUV2ZW50ICAgICAgICAgICAgIHwgQSBuZXcgc3RyZWFtIGlzIGF2YWlsYWJsZSBpbiB0aGUgY29uZmVyZW5jZS4gfFxuICogfCBwYXJ0aWNpcGFudGpvaW5lZCAgICAgfCBPd3QuQ29uZmVyZW5jZS5QYXJ0aWNpcGFudEV2ZW50ICB8IEEgbmV3IHBhcnRpY2lwYW50IGpvaW5lZCB0aGUgY29uZmVyZW5jZS4gfFxuICogfCBtZXNzYWdlcmVjZWl2ZWQgICAgICAgfCBPd3QuQmFzZS5NZXNzYWdlRXZlbnQgICAgICAgICAgICB8IEEgbmV3IG1lc3NhZ2UgaXMgcmVjZWl2ZWQuIHxcbiAqIHwgc2VydmVyZGlzY29ubmVjdGVkICAgIHwgT3d0LkJhc2UuT3d0RXZlbnQgICAgICAgICAgICAgICAgfCBEaXNjb25uZWN0ZWQgZnJvbSBjb25mZXJlbmNlIHNlcnZlci4gfFxuICpcbiAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZVxuICogQGV4dGVuZHMgT3d0LkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7P093dC5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uIH0gY29uZmlnIENvbmZpZ3VyYXRpb24gZm9yIENvbmZlcmVuY2VDbGllbnQuXG4gKiBAcGFyYW0gez9Pd3QuQ29uZmVyZW5jZS5TaW9TaWduYWxpbmcgfSBzaWduYWxpbmdJbXBsIFNpZ25hbGluZyBjaGFubmVsIGltcGxlbWVudGF0aW9uIGZvciBDb25mZXJlbmNlQ2xpZW50LiBTREsgdXNlcyBkZWZhdWx0IHNpZ25hbGluZyBjaGFubmVsIGltcGxlbWVudGF0aW9uIGlmIHRoaXMgcGFyYW1ldGVyIGlzIHVuZGVmaW5lZC4gQ3VycmVudGx5LCBhIFNvY2tldC5JTyBzaWduYWxpbmcgY2hhbm5lbCBpbXBsZW1lbnRhdGlvbiB3YXMgcHJvdmlkZWQgYXMgaWNzLmNvbmZlcmVuY2UuU2lvU2lnbmFsaW5nLiBIb3dldmVyLCBpdCBpcyBub3QgcmVjb21tZW5kZWQgdG8gZGlyZWN0bHkgYWNjZXNzIHNpZ25hbGluZyBjaGFubmVsIG9yIGN1c3RvbWl6ZSBzaWduYWxpbmcgY2hhbm5lbCBmb3IgQ29uZmVyZW5jZUNsaWVudCBhcyB0aGlzIHRpbWUuXG4gKi9cbmV4cG9ydCBjb25zdCBDb25mZXJlbmNlQ2xpZW50ID0gZnVuY3Rpb24oY29uZmlnLCBzaWduYWxpbmdJbXBsKSB7XG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBuZXcgRXZlbnRNb2R1bGUuRXZlbnREaXNwYXRjaGVyKCkpO1xuICBjb25maWcgPSBjb25maWcgfHwge307XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuICBsZXQgc2lnbmFsaW5nU3RhdGUgPSBTaWduYWxpbmdTdGF0ZS5SRUFEWTtcbiAgY29uc3Qgc2lnbmFsaW5nID0gc2lnbmFsaW5nSW1wbCA/IHNpZ25hbGluZ0ltcGwgOiAobmV3IFNpZ25hbGluZygpKTtcbiAgbGV0IG1lO1xuICBsZXQgcm9vbTtcbiAgY29uc3QgcmVtb3RlU3RyZWFtcyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIHN0cmVhbSBJRCwgdmFsdWUgaXMgYSBSZW1vdGVTdHJlYW0uXG4gIGNvbnN0IHBhcnRpY2lwYW50cyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIHBhcnRpY2lwYW50IElELCB2YWx1ZSBpcyBhIFBhcnRpY2lwYW50IG9iamVjdC5cbiAgY29uc3QgcHVibGlzaENoYW5uZWxzID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgcGMgY2hhbm5lbC5cbiAgY29uc3QgY2hhbm5lbHMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBjaGFubmVsJ3MgaW50ZXJuYWwgSUQsIHZhbHVlIGlzIGNoYW5uZWwuXG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBvblNpZ25hbGluZ01lc3NhZ2VcbiAgICogQGRlc2MgUmVjZWl2ZWQgYSBtZXNzYWdlIGZyb20gY29uZmVyZW5jZSBwb3J0YWwuIERlZmluZWQgaW4gY2xpZW50LXNlcnZlciBwcm90b2NvbC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb24gdHlwZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgRGF0YSByZWNlaXZlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIG9uU2lnbmFsaW5nTWVzc2FnZShub3RpZmljYXRpb24sIGRhdGEpIHtcbiAgICBpZiAobm90aWZpY2F0aW9uID09PSAnc29hYycgfHwgbm90aWZpY2F0aW9uID09PSAncHJvZ3Jlc3MnKSB7XG4gICAgICBpZiAoIWNoYW5uZWxzLmhhcyhkYXRhLmlkKSkge1xuICAgICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgYSBjaGFubmVsIGZvciBpbmNvbWluZyBkYXRhLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjaGFubmVscy5nZXQoZGF0YS5pZCkub25NZXNzYWdlKG5vdGlmaWNhdGlvbiwgZGF0YSk7XG4gICAgfSBlbHNlIGlmIChub3RpZmljYXRpb24gPT09ICdzdHJlYW0nKSB7XG4gICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdhZGQnKSB7XG4gICAgICAgIGZpcmVTdHJlYW1BZGRlZChkYXRhLmRhdGEpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3JlbW92ZScpIHtcbiAgICAgICAgZmlyZVN0cmVhbVJlbW92ZWQoZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKGRhdGEuc3RhdHVzID09PSAndXBkYXRlJykge1xuICAgICAgICAvLyBCcm9hZGNhc3QgYXVkaW8vdmlkZW8gdXBkYXRlIHN0YXR1cyB0byBjaGFubmVsIHNvIHNwZWNpZmljIGV2ZW50cyBjYW4gYmUgZmlyZWQgb24gcHVibGljYXRpb24gb3Igc3Vic2NyaXB0aW9uLlxuICAgICAgICBpZiAoZGF0YS5kYXRhLmZpZWxkID09PSAnYXVkaW8uc3RhdHVzJyB8fCBkYXRhLmRhdGEuZmllbGQgPT09XG4gICAgICAgICAgJ3ZpZGVvLnN0YXR1cycpIHtcbiAgICAgICAgICBjaGFubmVscy5mb3JFYWNoKChjKSA9PiB7XG4gICAgICAgICAgICBjLm9uTWVzc2FnZShub3RpZmljYXRpb24sIGRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZGF0YS5maWVsZCA9PT0gJ2FjdGl2ZUlucHV0Jykge1xuICAgICAgICAgIGZpcmVBY3RpdmVBdWRpb0lucHV0Q2hhbmdlKGRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZGF0YS5maWVsZCA9PT0gJ3ZpZGVvLmxheW91dCcpIHtcbiAgICAgICAgICBmaXJlTGF5b3V0Q2hhbmdlKGRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZGF0YS5maWVsZCA9PT0gJy4nKSB7XG4gICAgICAgICAgdXBkYXRlUmVtb3RlU3RyZWFtKGRhdGEuZGF0YS52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ1Vua25vd24gc3RyZWFtIGV2ZW50IGZyb20gTUNVLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub3RpZmljYXRpb24gPT09ICd0ZXh0Jykge1xuICAgICAgZmlyZU1lc3NhZ2VSZWNlaXZlZChkYXRhKTtcbiAgICB9IGVsc2UgaWYgKG5vdGlmaWNhdGlvbiA9PT0gJ3BhcnRpY2lwYW50Jykge1xuICAgICAgZmlyZVBhcnRpY2lwYW50RXZlbnQoZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgc2lnbmFsaW5nLmFkZEV2ZW50TGlzdGVuZXIoJ2RhdGEnLCAoZXZlbnQpID0+IHtcbiAgICBvblNpZ25hbGluZ01lc3NhZ2UoZXZlbnQubWVzc2FnZS5ub3RpZmljYXRpb24sIGV2ZW50Lm1lc3NhZ2UuZGF0YSk7XG4gIH0pO1xuXG4gIHNpZ25hbGluZy5hZGRFdmVudExpc3RlbmVyKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgIGNsZWFuKCk7XG4gICAgc2lnbmFsaW5nU3RhdGUgPSBTaWduYWxpbmdTdGF0ZS5SRUFEWTtcbiAgICBzZWxmLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk93dEV2ZW50KCdzZXJ2ZXJkaXNjb25uZWN0ZWQnKSk7XG4gIH0pO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGZ1bmN0aW9uIGZpcmVQYXJ0aWNpcGFudEV2ZW50KGRhdGEpIHtcbiAgICBpZiAoZGF0YS5hY3Rpb24gPT09ICdqb2luJykge1xuICAgICAgZGF0YSA9IGRhdGEuZGF0YTtcbiAgICAgIGNvbnN0IHBhcnRpY2lwYW50ID0gbmV3IFBhcnRpY2lwYW50KGRhdGEuaWQsIGRhdGEucm9sZSwgZGF0YS51c2VyKTtcbiAgICAgIHBhcnRpY2lwYW50cy5zZXQoZGF0YS5pZCwgcGFydGljaXBhbnQpO1xuICAgICAgY29uc3QgZXZlbnQgPSBuZXcgUGFydGljaXBhbnRFdmVudChcbiAgICAgICAgICAncGFydGljaXBhbnRqb2luZWQnLCB7cGFydGljaXBhbnQ6IHBhcnRpY2lwYW50fSk7XG4gICAgICBzZWxmLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5hY3Rpb24gPT09ICdsZWF2ZScpIHtcbiAgICAgIGNvbnN0IHBhcnRpY2lwYW50SWQgPSBkYXRhLmRhdGE7XG4gICAgICBpZiAoIXBhcnRpY2lwYW50cy5oYXMocGFydGljaXBhbnRJZCkpIHtcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoXG4gICAgICAgICAgICAnUmVjZWl2ZWQgbGVhdmUgbWVzc2FnZSBmcm9tIE1DVSBmb3IgYW4gdW5rbm93biBwYXJ0aWNpcGFudC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcGFydGljaXBhbnQgPSBwYXJ0aWNpcGFudHMuZ2V0KHBhcnRpY2lwYW50SWQpO1xuICAgICAgcGFydGljaXBhbnRzLmRlbGV0ZShwYXJ0aWNpcGFudElkKTtcbiAgICAgIHBhcnRpY2lwYW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk93dEV2ZW50KCdsZWZ0JykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGZ1bmN0aW9uIGZpcmVNZXNzYWdlUmVjZWl2ZWQoZGF0YSkge1xuICAgIGNvbnN0IG1lc3NhZ2VFdmVudCA9IG5ldyBFdmVudE1vZHVsZS5NZXNzYWdlRXZlbnQoJ21lc3NhZ2VyZWNlaXZlZCcsIHtcbiAgICAgIG1lc3NhZ2U6IGRhdGEubWVzc2FnZSxcbiAgICAgIG9yaWdpbjogZGF0YS5mcm9tLFxuICAgICAgdG86IGRhdGEudG8sXG4gICAgfSk7XG4gICAgc2VsZi5kaXNwYXRjaEV2ZW50KG1lc3NhZ2VFdmVudCk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBmdW5jdGlvbiBmaXJlU3RyZWFtQWRkZWQoaW5mbykge1xuICAgIGNvbnN0IHN0cmVhbSA9IGNyZWF0ZVJlbW90ZVN0cmVhbShpbmZvKTtcbiAgICByZW1vdGVTdHJlYW1zLnNldChzdHJlYW0uaWQsIHN0cmVhbSk7XG4gICAgY29uc3Qgc3RyZWFtRXZlbnQgPSBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbUV2ZW50KCdzdHJlYW1hZGRlZCcsIHtcbiAgICAgIHN0cmVhbTogc3RyZWFtLFxuICAgIH0pO1xuICAgIHNlbGYuZGlzcGF0Y2hFdmVudChzdHJlYW1FdmVudCk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBmdW5jdGlvbiBmaXJlU3RyZWFtUmVtb3ZlZChpbmZvKSB7XG4gICAgaWYgKCFyZW1vdGVTdHJlYW1zLmhhcyhpbmZvLmlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHNwZWNpZmljIHJlbW90ZSBzdHJlYW0uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0cmVhbSA9IHJlbW90ZVN0cmVhbXMuZ2V0KGluZm8uaWQpO1xuICAgIGNvbnN0IHN0cmVhbUV2ZW50ID0gbmV3IEV2ZW50TW9kdWxlLk93dEV2ZW50KCdlbmRlZCcpO1xuICAgIHJlbW90ZVN0cmVhbXMuZGVsZXRlKHN0cmVhbS5pZCk7XG4gICAgc3RyZWFtLmRpc3BhdGNoRXZlbnQoc3RyZWFtRXZlbnQpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgZnVuY3Rpb24gZmlyZUFjdGl2ZUF1ZGlvSW5wdXRDaGFuZ2UoaW5mbykge1xuICAgIGlmICghcmVtb3RlU3RyZWFtcy5oYXMoaW5mby5pZCkpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdDYW5ub3QgZmluZCBzcGVjaWZpYyByZW1vdGUgc3RyZWFtLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdHJlYW0gPSByZW1vdGVTdHJlYW1zLmdldChpbmZvLmlkKTtcbiAgICBjb25zdCBzdHJlYW1FdmVudCA9IG5ldyBBY3RpdmVBdWRpb0lucHV0Q2hhbmdlRXZlbnQoXG4gICAgICAgICdhY3RpdmVhdWRpb2lucHV0Y2hhbmdlJywge1xuICAgICAgICAgIGFjdGl2ZUF1ZGlvSW5wdXRTdHJlYW1JZDogaW5mby5kYXRhLnZhbHVlLFxuICAgICAgICB9KTtcbiAgICBzdHJlYW0uZGlzcGF0Y2hFdmVudChzdHJlYW1FdmVudCk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBmdW5jdGlvbiBmaXJlTGF5b3V0Q2hhbmdlKGluZm8pIHtcbiAgICBpZiAoIXJlbW90ZVN0cmVhbXMuaGFzKGluZm8uaWQpKSB7XG4gICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgc3BlY2lmaWMgcmVtb3RlIHN0cmVhbS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3RyZWFtID0gcmVtb3RlU3RyZWFtcy5nZXQoaW5mby5pZCk7XG4gICAgY29uc3Qgc3RyZWFtRXZlbnQgPSBuZXcgTGF5b3V0Q2hhbmdlRXZlbnQoXG4gICAgICAgICdsYXlvdXRjaGFuZ2UnLCB7XG4gICAgICAgICAgbGF5b3V0OiBpbmZvLmRhdGEudmFsdWUsXG4gICAgICAgIH0pO1xuICAgIHN0cmVhbS5kaXNwYXRjaEV2ZW50KHN0cmVhbUV2ZW50KTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGZ1bmN0aW9uIHVwZGF0ZVJlbW90ZVN0cmVhbShzdHJlYW1JbmZvKSB7XG4gICAgaWYgKCFyZW1vdGVTdHJlYW1zLmhhcyhzdHJlYW1JbmZvLmlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHNwZWNpZmljIHJlbW90ZSBzdHJlYW0uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0cmVhbSA9IHJlbW90ZVN0cmVhbXMuZ2V0KHN0cmVhbUluZm8uaWQpO1xuICAgIHN0cmVhbS5zZXR0aW5ncyA9IFN0cmVhbVV0aWxzTW9kdWxlLmNvbnZlcnRUb1B1YmxpY2F0aW9uU2V0dGluZ3Moc3RyZWFtSW5mb1xuICAgICAgICAubWVkaWEpO1xuICAgIHN0cmVhbS5leHRyYUNhcGFiaWxpdGllcyA9IFN0cmVhbVV0aWxzTW9kdWxlXG4gICAgICAuY29udmVydFRvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzKFxuICAgICAgICBzdHJlYW1JbmZvLm1lZGlhKTtcbiAgICBjb25zdCBzdHJlYW1FdmVudCA9IG5ldyBFdmVudE1vZHVsZS5Pd3RFdmVudCgndXBkYXRlZCcpO1xuICAgIHN0cmVhbS5kaXNwYXRjaEV2ZW50KHN0cmVhbUV2ZW50KTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlbW90ZVN0cmVhbShzdHJlYW1JbmZvKSB7XG4gICAgaWYgKHN0cmVhbUluZm8udHlwZSA9PT0gJ21peGVkJykge1xuICAgICAgcmV0dXJuIG5ldyBSZW1vdGVNaXhlZFN0cmVhbShzdHJlYW1JbmZvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGF1ZGlvU291cmNlSW5mbzsgbGV0IHZpZGVvU291cmNlSW5mbztcbiAgICAgIGlmIChzdHJlYW1JbmZvLm1lZGlhLmF1ZGlvKSB7XG4gICAgICAgIGF1ZGlvU291cmNlSW5mbyA9IHN0cmVhbUluZm8ubWVkaWEuYXVkaW8uc291cmNlO1xuICAgICAgfVxuICAgICAgaWYgKHN0cmVhbUluZm8ubWVkaWEudmlkZW8pIHtcbiAgICAgICAgdmlkZW9Tb3VyY2VJbmZvID0gc3RyZWFtSW5mby5tZWRpYS52aWRlby5zb3VyY2U7XG4gICAgICB9XG4gICAgICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtTW9kdWxlLlJlbW90ZVN0cmVhbShzdHJlYW1JbmZvLmlkLFxuICAgICAgICAgIHN0cmVhbUluZm8uaW5mby5vd25lciwgdW5kZWZpbmVkLCBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbVNvdXJjZUluZm8oXG4gICAgICAgICAgICAgIGF1ZGlvU291cmNlSW5mbywgdmlkZW9Tb3VyY2VJbmZvKSwgc3RyZWFtSW5mby5pbmZvLmF0dHJpYnV0ZXMpO1xuICAgICAgc3RyZWFtLnNldHRpbmdzID0gU3RyZWFtVXRpbHNNb2R1bGUuY29udmVydFRvUHVibGljYXRpb25TZXR0aW5ncyhcbiAgICAgICAgICBzdHJlYW1JbmZvLm1lZGlhKTtcbiAgICAgIHN0cmVhbS5leHRyYUNhcGFiaWxpdGllcyA9IFN0cmVhbVV0aWxzTW9kdWxlXG4gICAgICAgIC5jb252ZXJ0VG9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMoXG4gICAgICAgICAgc3RyZWFtSW5mby5tZWRpYSk7XG4gICAgICByZXR1cm4gc3RyZWFtO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGZ1bmN0aW9uIHNlbmRTaWduYWxpbmdNZXNzYWdlKHR5cGUsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gc2lnbmFsaW5nLnNlbmQodHlwZSwgbWVzc2FnZSk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBmdW5jdGlvbiBjcmVhdGVQZWVyQ29ubmVjdGlvbkNoYW5uZWwoKSB7XG4gICAgLy8gQ29uc3RydWN0IGFuIHNpZ25hbGluZyBzZW5kZXIvcmVjZWl2ZXIgZm9yIENvbmZlcmVuY2VQZWVyQ29ubmVjdGlvbi5cbiAgICBjb25zdCBzaWduYWxpbmdGb3JDaGFubmVsID0gT2JqZWN0LmNyZWF0ZShFdmVudE1vZHVsZS5FdmVudERpc3BhdGNoZXIpO1xuICAgIHNpZ25hbGluZ0ZvckNoYW5uZWwuc2VuZFNpZ25hbGluZ01lc3NhZ2UgPSBzZW5kU2lnbmFsaW5nTWVzc2FnZTtcbiAgICBjb25zdCBwY2MgPSBuZXcgQ29uZmVyZW5jZVBlZXJDb25uZWN0aW9uQ2hhbm5lbChcbiAgICAgICAgY29uZmlnLCBzaWduYWxpbmdGb3JDaGFubmVsKTtcbiAgICBwY2MuYWRkRXZlbnRMaXN0ZW5lcignaWQnLCAobWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICBjaGFubmVscy5zZXQobWVzc2FnZUV2ZW50Lm1lc3NhZ2UsIHBjYyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHBjYztcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGZ1bmN0aW9uIGNsZWFuKCkge1xuICAgIHBhcnRpY2lwYW50cy5jbGVhcigpO1xuICAgIHJlbW90ZVN0cmVhbXMuY2xlYXIoKTtcbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaW5mbycsIHtcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgIGdldDogKCkgPT4ge1xuICAgICAgaWYgKCFyb29tKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBDb25mZXJlbmNlSW5mbyhyb29tLmlkLCBBcnJheS5mcm9tKHBhcnRpY2lwYW50cywgKHgpID0+IHhbXG4gICAgICAgICAgMV0pLCBBcnJheS5mcm9tKHJlbW90ZVN0cmVhbXMsICh4KSA9PiB4WzFdKSwgbWUpO1xuICAgIH0sXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gam9pblxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgSm9pbiBhIGNvbmZlcmVuY2UuXG4gICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5Db25mZXJlbmNlQ2xpZW50XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPENvbmZlcmVuY2VJbmZvLCBFcnJvcj59IFJldHVybiBhIHByb21pc2UgcmVzb2x2ZWQgd2l0aCBjdXJyZW50IGNvbmZlcmVuY2UncyBpbmZvcm1hdGlvbiBpZiBzdWNjZXNzZnVsbHkgam9pbiB0aGUgY29uZmVyZW5jZS4gT3IgcmV0dXJuIGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIGEgbmV3bHkgY3JlYXRlZCBPd3QuRXJyb3IgaWYgZmFpbGVkIHRvIGpvaW4gdGhlIGNvbmZlcmVuY2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlblN0cmluZyBUb2tlbiBpcyBpc3N1ZWQgYnkgY29uZmVyZW5jZSBzZXJ2ZXIobnV2ZSkuXG4gICAqL1xuICB0aGlzLmpvaW4gPSBmdW5jdGlvbih0b2tlblN0cmluZykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IEpTT04ucGFyc2UoQmFzZTY0LmRlY29kZUJhc2U2NCh0b2tlblN0cmluZykpO1xuICAgICAgY29uc3QgaXNTZWN1cmVkID0gKHRva2VuLnNlY3VyZSA9PT0gdHJ1ZSk7XG4gICAgICBsZXQgaG9zdCA9IHRva2VuLmhvc3Q7XG4gICAgICBpZiAodHlwZW9mIGhvc3QgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKCdJbnZhbGlkIGhvc3QuJykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaG9zdC5pbmRleE9mKCdodHRwJykgPT09IC0xKSB7XG4gICAgICAgIGhvc3QgPSBpc1NlY3VyZWQgPyAoJ2h0dHBzOi8vJyArIGhvc3QpIDogKCdodHRwOi8vJyArIGhvc3QpO1xuICAgICAgfVxuICAgICAgaWYgKHNpZ25hbGluZ1N0YXRlICE9PSBTaWduYWxpbmdTdGF0ZS5SRUFEWSkge1xuICAgICAgICByZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcignY29ubmVjdGlvbiBzdGF0ZSBpbnZhbGlkJykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNpZ25hbGluZ1N0YXRlID0gU2lnbmFsaW5nU3RhdGUuQ09OTkVDVElORztcblxuICAgICAgY29uc3QgbG9naW5JbmZvID0ge1xuICAgICAgICB0b2tlbjogdG9rZW5TdHJpbmcsXG4gICAgICAgIHVzZXJBZ2VudDogVXRpbHMuc3lzSW5mbygpLFxuICAgICAgICBwcm90b2NvbDogcHJvdG9jb2xWZXJzaW9uLFxuICAgICAgfTtcblxuICAgICAgc2lnbmFsaW5nLmNvbm5lY3QoaG9zdCwgaXNTZWN1cmVkLCBsb2dpbkluZm8pLnRoZW4oKHJlc3ApID0+IHtcbiAgICAgICAgc2lnbmFsaW5nU3RhdGUgPSBTaWduYWxpbmdTdGF0ZS5DT05ORUNURUQ7XG4gICAgICAgIHJvb20gPSByZXNwLnJvb207XG4gICAgICAgIGlmIChyb29tLnN0cmVhbXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGZvciAoY29uc3Qgc3Qgb2Ygcm9vbS5zdHJlYW1zKSB7XG4gICAgICAgICAgICBpZiAoc3QudHlwZSA9PT0gJ21peGVkJykge1xuICAgICAgICAgICAgICBzdC52aWV3cG9ydCA9IHN0LmluZm8ubGFiZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZW1vdGVTdHJlYW1zLnNldChzdC5pZCwgY3JlYXRlUmVtb3RlU3RyZWFtKHN0KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNwLnJvb20gJiYgcmVzcC5yb29tLnBhcnRpY2lwYW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBwIG9mIHJlc3Aucm9vbS5wYXJ0aWNpcGFudHMpIHtcbiAgICAgICAgICAgIHBhcnRpY2lwYW50cy5zZXQocC5pZCwgbmV3IFBhcnRpY2lwYW50KHAuaWQsIHAucm9sZSwgcC51c2VyKSk7XG4gICAgICAgICAgICBpZiAocC5pZCA9PT0gcmVzcC5pZCkge1xuICAgICAgICAgICAgICBtZSA9IHBhcnRpY2lwYW50cy5nZXQocC5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUobmV3IENvbmZlcmVuY2VJbmZvKHJlc3Aucm9vbS5pZCwgQXJyYXkuZnJvbShwYXJ0aWNpcGFudHNcbiAgICAgICAgICAgIC52YWx1ZXMoKSksIEFycmF5LmZyb20ocmVtb3RlU3RyZWFtcy52YWx1ZXMoKSksIG1lKSk7XG4gICAgICB9LCAoZSkgPT4ge1xuICAgICAgICBzaWduYWxpbmdTdGF0ZSA9IFNpZ25hbGluZ1N0YXRlLlJFQURZO1xuICAgICAgICByZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihlKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHB1Ymxpc2hcbiAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIFB1Ymxpc2ggYSBMb2NhbFN0cmVhbSB0byBjb25mZXJlbmNlIHNlcnZlci4gT3RoZXIgcGFydGljaXBhbnRzIHdpbGwgYmUgYWJsZSB0byBzdWJzY3JpYmUgdGhpcyBzdHJlYW0gd2hlbiBpdCBpcyBzdWNjZXNzZnVsbHkgcHVibGlzaGVkLlxuICAgKiBAcGFyYW0ge093dC5CYXNlLkxvY2FsU3RyZWFtfSBzdHJlYW0gVGhlIHN0cmVhbSB0byBiZSBwdWJsaXNoZWQuXG4gICAqIEBwYXJhbSB7T3d0LkJhc2UuUHVibGlzaE9wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyBmb3IgcHVibGljYXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHZpZGVvQ29kZWNzIFZpZGVvIGNvZGVjIG5hbWVzIGZvciBwdWJsaXNoaW5nLiBWYWxpZCB2YWx1ZXMgYXJlICdWUDgnLCAnVlA5JyBhbmQgJ0gyNjQnLiBUaGlzIHBhcmFtZXRlciBvbmx5IHZhbGlkIHdoZW4gb3B0aW9ucy52aWRlbyBpcyBSVENSdHBFbmNvZGluZ1BhcmFtZXRlcnMuIFB1Ymxpc2hpbmcgd2l0aCBSVENSdHBFbmNvZGluZ1BhcmFtZXRlcnMgaXMgYW4gZXhwZXJpbWVudGFsIGZlYXR1cmUuIFRoaXMgcGFyYW1ldGVyIGlzIHN1YmplY3QgdG8gY2hhbmdlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQdWJsaWNhdGlvbiwgRXJyb3I+fSBSZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCBhIG5ld2x5IGNyZWF0ZWQgUHVibGljYXRpb24gb25jZSBzcGVjaWZpYyBzdHJlYW0gaXMgc3VjY2Vzc2Z1bGx5IHB1Ymxpc2hlZCwgb3IgcmVqZWN0ZWQgd2l0aCBhIG5ld2x5IGNyZWF0ZWQgRXJyb3IgaWYgc3RyZWFtIGlzIGludmFsaWQgb3Igb3B0aW9ucyBjYW5ub3QgYmUgc2F0aXNmaWVkLiBTdWNjZXNzZnVsbHkgcHVibGlzaGVkIG1lYW5zIFBlZXJDb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkIGFuZCBzZXJ2ZXIgaXMgYWJsZSB0byBwcm9jZXNzIG1lZGlhIGRhdGEuXG4gICAqL1xuICB0aGlzLnB1Ymxpc2ggPSBmdW5jdGlvbihzdHJlYW0sIG9wdGlvbnMsIHZpZGVvQ29kZWNzKSB7XG4gICAgaWYgKCEoc3RyZWFtIGluc3RhbmNlb2YgU3RyZWFtTW9kdWxlLkxvY2FsU3RyZWFtKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoJ0ludmFsaWQgc3RyZWFtLicpKTtcbiAgICB9XG4gICAgaWYgKHB1Ymxpc2hDaGFubmVscy5oYXMoc3RyZWFtLm1lZGlhU3RyZWFtLmlkKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBwdWJsaXNoIGEgcHVibGlzaGVkIHN0cmVhbS4nKSk7XG4gICAgfVxuICAgIGNvbnN0IGNoYW5uZWwgPSBjcmVhdGVQZWVyQ29ubmVjdGlvbkNoYW5uZWwoKTtcbiAgICByZXR1cm4gY2hhbm5lbC5wdWJsaXNoKHN0cmVhbSwgb3B0aW9ucywgdmlkZW9Db2RlY3MpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gc3Vic2NyaWJlXG4gICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5Db25mZXJlbmNlQ2xpZW50XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBTdWJzY3JpYmUgYSBSZW1vdGVTdHJlYW0gZnJvbSBjb25mZXJlbmNlIHNlcnZlci5cbiAgICogQHBhcmFtIHtPd3QuQmFzZS5SZW1vdGVTdHJlYW19IHN0cmVhbSBUaGUgc3RyZWFtIHRvIGJlIHN1YnNjcmliZWQuXG4gICAqIEBwYXJhbSB7T3d0LkNvbmZlcmVuY2UuU3Vic2NyaWJlT3B0aW9uc30gb3B0aW9ucyBPcHRpb25zIGZvciBzdWJzY3JpcHRpb24uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN1YnNjcmlwdGlvbiwgRXJyb3I+fSBSZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCBhIG5ld2x5IGNyZWF0ZWQgU3Vic2NyaXB0aW9uIG9uY2Ugc3BlY2lmaWMgc3RyZWFtIGlzIHN1Y2Nlc3NmdWxseSBzdWJzY3JpYmVkLCBvciByZWplY3RlZCB3aXRoIGEgbmV3bHkgY3JlYXRlZCBFcnJvciBpZiBzdHJlYW0gaXMgaW52YWxpZCBvciBvcHRpb25zIGNhbm5vdCBiZSBzYXRpc2ZpZWQuIFN1Y2Nlc3NmdWxseSBzdWJzY3JpYmVkIG1lYW5zIFBlZXJDb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkIGFuZCBzZXJ2ZXIgd2FzIHN0YXJ0ZWQgdG8gc2VuZCBtZWRpYSBkYXRhLlxuICAgKi9cbiAgdGhpcy5zdWJzY3JpYmUgPSBmdW5jdGlvbihzdHJlYW0sIG9wdGlvbnMpIHtcbiAgICBpZiAoIShzdHJlYW0gaW5zdGFuY2VvZiBTdHJlYW1Nb2R1bGUuUmVtb3RlU3RyZWFtKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoJ0ludmFsaWQgc3RyZWFtLicpKTtcbiAgICB9XG4gICAgY29uc3QgY2hhbm5lbCA9IGNyZWF0ZVBlZXJDb25uZWN0aW9uQ2hhbm5lbCgpO1xuICAgIHJldHVybiBjaGFubmVsLnN1YnNjcmliZShzdHJlYW0sIG9wdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gc2VuZFxuICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuQ29uZmVyZW5jZUNsaWVudFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgU2VuZCBhIHRleHQgbWVzc2FnZSB0byBhIHBhcnRpY2lwYW50IG9yIGFsbCBwYXJ0aWNpcGFudHMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIE1lc3NhZ2UgdG8gYmUgc2VudC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcnRpY2lwYW50SWQgUmVjZWl2ZXIgb2YgdGhpcyBtZXNzYWdlLiBNZXNzYWdlIHdpbGwgYmUgc2VudCB0byBhbGwgcGFydGljaXBhbnRzIGlmIHBhcnRpY2lwYW50SWQgaXMgdW5kZWZpbmVkLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHZvaWQsIEVycm9yPn0gUmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdoZW4gY29uZmVyZW5jZSBzZXJ2ZXIgcmVjZWl2ZWQgY2VydGFpbiBtZXNzYWdlLlxuICAgKi9cbiAgdGhpcy5zZW5kID0gZnVuY3Rpb24obWVzc2FnZSwgcGFydGljaXBhbnRJZCkge1xuICAgIGlmIChwYXJ0aWNpcGFudElkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHBhcnRpY2lwYW50SWQgPSAnYWxsJztcbiAgICB9XG4gICAgcmV0dXJuIHNlbmRTaWduYWxpbmdNZXNzYWdlKCd0ZXh0Jywge3RvOiBwYXJ0aWNpcGFudElkLCBtZXNzYWdlOiBtZXNzYWdlfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBsZWF2ZVxuICAgKiBAbWVtYmVyT2YgT3d0LkNvbmZlcmVuY2UuQ29uZmVyZW5jZUNsaWVudFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgTGVhdmUgYSBjb25mZXJlbmNlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHZvaWQsIEVycm9yPn0gUmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGggdW5kZWZpbmVkIG9uY2UgdGhlIGNvbm5lY3Rpb24gaXMgZGlzY29ubmVjdGVkLlxuICAgKi9cbiAgdGhpcy5sZWF2ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzaWduYWxpbmcuZGlzY29ubmVjdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgY2xlYW4oKTtcbiAgICAgIHNpZ25hbGluZ1N0YXRlID0gU2lnbmFsaW5nU3RhdGUuUkVBRFk7XG4gICAgfSk7XG4gIH07XG59O1xuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cclxuLy9cclxuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ29uZmVyZW5jZUVycm9yXHJcbiAqIEBjbGFzc0Rlc2MgVGhlIENvbmZlcmVuY2VFcnJvciBvYmplY3QgcmVwcmVzZW50cyBhbiBlcnJvciBpbiBjb25mZXJlbmNlIG1vZGUuXHJcbiAqIEBtZW1iZXJPZiBPd3QuQ29uZmVyZW5jZVxyXG4gKiBAaGlkZWNvbnN0cnVjdG9yXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29uZmVyZW5jZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXHJcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xyXG4gICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgfVxyXG59XHJcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXHJcbi8vXHJcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQge0NvbmZlcmVuY2VDbGllbnR9IGZyb20gJy4vY2xpZW50LmpzJztcclxuZXhwb3J0IHtTaW9TaWduYWxpbmd9IGZyb20gJy4vc2lnbmFsaW5nLmpzJztcclxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cclxuLy9cclxuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ29uZmVyZW5jZUluZm9cclxuICogQGNsYXNzRGVzYyBJbmZvcm1hdGlvbiBmb3IgYSBjb25mZXJlbmNlLlxyXG4gKiBAbWVtYmVyT2YgT3d0LkNvbmZlcmVuY2VcclxuICogQGhpZGVjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbmZlcmVuY2VJbmZvIHtcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xyXG4gIGNvbnN0cnVjdG9yKGlkLCBwYXJ0aWNpcGFudHMsIHJlbW90ZVN0cmVhbXMsIG15SW5mbykge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGlkXHJcbiAgICAgKiBAaW5zdGFuY2VcclxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5Db25mZXJlbmNlSW5mb1xyXG4gICAgICogQGRlc2MgQ29uZmVyZW5jZSBJRC5cclxuICAgICAqL1xyXG4gICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAbWVtYmVyIHtBcnJheTxPd3QuQ29uZmVyZW5jZS5QYXJ0aWNpcGFudD59IHBhcnRpY2lwYW50c1xyXG4gICAgICogQGluc3RhbmNlXHJcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuQ29uZmVyZW5jZUluZm9cclxuICAgICAqIEBkZXNjIFBhcnRpY2lwYW50cyBpbiB0aGUgY29uZmVyZW5jZS5cclxuICAgICAqL1xyXG4gICAgdGhpcy5wYXJ0aWNpcGFudHMgPSBwYXJ0aWNpcGFudHM7XHJcbiAgICAvKipcclxuICAgICAqIEBtZW1iZXIge0FycmF5PE93dC5CYXNlLlJlbW90ZVN0cmVhbT59IHJlbW90ZVN0cmVhbXNcclxuICAgICAqIEBpbnN0YW5jZVxyXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLkNvbmZlcmVuY2VJbmZvXHJcbiAgICAgKiBAZGVzYyBTdHJlYW1zIHB1Ymxpc2hlZCBieSBwYXJ0aWNpcGFudHMuIEl0IGFsc28gaW5jbHVkZXMgc3RyZWFtcyBwdWJsaXNoZWQgYnkgY3VycmVudCB1c2VyLlxyXG4gICAgICovXHJcbiAgICB0aGlzLnJlbW90ZVN0cmVhbXMgPSByZW1vdGVTdHJlYW1zO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAbWVtYmVyIHtPd3QuQmFzZS5QYXJ0aWNpcGFudH0gc2VsZlxyXG4gICAgICogQGluc3RhbmNlXHJcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuQ29uZmVyZW5jZUluZm9cclxuICAgICAqL1xyXG4gICAgdGhpcy5zZWxmID0gbXlJbmZvO1xyXG4gIH1cclxufVxyXG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICogYXMgU3RyZWFtTW9kdWxlIGZyb20gJy4uL2Jhc2Uvc3RyZWFtLmpzJztcbmltcG9ydCAqIGFzIFN0cmVhbVV0aWxzTW9kdWxlIGZyb20gJy4vc3RyZWFtdXRpbHMuanMnO1xuaW1wb3J0IHtPd3RFdmVudH0gZnJvbSAnLi4vYmFzZS9ldmVudC5qcyc7XG5cbi8qKlxuICogQGNsYXNzIFJlbW90ZU1peGVkU3RyZWFtXG4gKiBAY2xhc3NEZXNjIE1peGVkIHN0cmVhbSBmcm9tIGNvbmZlcmVuY2Ugc2VydmVyLlxuICogRXZlbnRzOlxuICpcbiAqIHwgRXZlbnQgTmFtZSAgICAgICAgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgfCBGaXJlZCB3aGVuICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18IC0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgYWN0aXZlYXVkaW9pbnB1dGNoYW5nZSB8IEV2ZW50ICAgICAgICAgICAgfCBBdWRpbyBhY3RpdmVuZXNzIG9mIGlucHV0IHN0cmVhbSAob2YgdGhlIG1peGVkIHN0cmVhbSkgaXMgY2hhbmdlZC4gfFxuICogfCBsYXlvdXRjaGFuZ2UgICAgICAgICAgIHwgRXZlbnQgICAgICAgICAgICB8IFZpZGVvJ3MgbGF5b3V0IGhhcyBiZWVuIGNoYW5nZWQuIEl0IHVzdWFsbHkgaGFwcGVucyB3aGVuIGEgbmV3IHZpZGVvIGlzIG1peGVkIGludG8gdGhlIHRhcmdldCBtaXhlZCBzdHJlYW0gb3IgYW4gZXhpc3RpbmcgdmlkZW8gaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIG1peGVkIHN0cmVhbS4gfFxuICpcbiAqIEBtZW1iZXJPZiBPd3QuQ29uZmVyZW5jZVxuICogQGV4dGVuZHMgT3d0LkJhc2UuUmVtb3RlU3RyZWFtXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBSZW1vdGVNaXhlZFN0cmVhbSBleHRlbmRzIFN0cmVhbU1vZHVsZS5SZW1vdGVTdHJlYW0ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihpbmZvKSB7XG4gICAgaWYgKGluZm8udHlwZSAhPT0gJ21peGVkJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTm90IGEgbWl4ZWQgc3RyZWFtJyk7XG4gICAgfVxuICAgIHN1cGVyKGluZm8uaWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbVNvdXJjZUluZm8oXG4gICAgICAgICdtaXhlZCcsICdtaXhlZCcpKTtcblxuICAgIHRoaXMuc2V0dGluZ3MgPSBTdHJlYW1VdGlsc01vZHVsZS5jb252ZXJ0VG9QdWJsaWNhdGlvblNldHRpbmdzKGluZm8ubWVkaWEpO1xuXG4gICAgdGhpcy5leHRyYUNhcGFiaWxpdGllcyA9IG5ldyBTdHJlYW1VdGlsc01vZHVsZVxuICAgICAgLmNvbnZlcnRUb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyhcbiAgICAgICAgaW5mby5tZWRpYSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgQWN0aXZlQXVkaW9JbnB1dENoYW5nZUV2ZW50XG4gKiBAY2xhc3NEZXNjIENsYXNzIEFjdGl2ZUF1ZGlvSW5wdXRDaGFuZ2VFdmVudCByZXByZXNlbnRzIGFuIGFjdGl2ZSBhdWRpbyBpbnB1dCBjaGFuZ2UgZXZlbnQuXG4gKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEFjdGl2ZUF1ZGlvSW5wdXRDaGFuZ2VFdmVudCBleHRlbmRzIE93dEV2ZW50IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IodHlwZSwgaW5pdCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gYWN0aXZlQXVkaW9JbnB1dFN0cmVhbUlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLkFjdGl2ZUF1ZGlvSW5wdXRDaGFuZ2VFdmVudFxuICAgICAqIEBkZXNjIFRoZSBJRCBvZiBpbnB1dCBzdHJlYW0ob2YgdGhlIG1peGVkIHN0cmVhbSkgd2hvc2UgYXVkaW8gaXMgYWN0aXZlLlxuICAgICAqL1xuICAgIHRoaXMuYWN0aXZlQXVkaW9JbnB1dFN0cmVhbUlkID0gaW5pdC5hY3RpdmVBdWRpb0lucHV0U3RyZWFtSWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgTGF5b3V0Q2hhbmdlRXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgTGF5b3V0Q2hhbmdlRXZlbnQgcmVwcmVzZW50cyBhbiB2aWRlbyBsYXlvdXQgY2hhbmdlIGV2ZW50LlxuICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBMYXlvdXRDaGFuZ2VFdmVudCBleHRlbmRzIE93dEV2ZW50IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IodHlwZSwgaW5pdCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge29iamVjdH0gbGF5b3V0XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLkxheW91dENoYW5nZUV2ZW50XG4gICAgICogQGRlc2MgQ3VycmVudCB2aWRlbydzIGxheW91dC4gSXQncyBhbiBhcnJheSBvZiBtYXAgd2hpY2ggbWFwcyBlYWNoIHN0cmVhbSB0byBhIHJlZ2lvbi5cbiAgICAgKi9cbiAgICB0aGlzLmxheW91dCA9IGluaXQubGF5b3V0O1xuICB9XG59XG5cbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXHJcbi8vXHJcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXHJcblxyXG5pbXBvcnQgKiBhcyBFdmVudE1vZHVsZSBmcm9tICcuLi9iYXNlL2V2ZW50LmpzJztcclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUGFydGljaXBhbnRcclxuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXHJcbiAqIEBjbGFzc0Rlc2MgVGhlIFBhcnRpY2lwYW50IGRlZmluZXMgYSBwYXJ0aWNpcGFudCBpbiBhIGNvbmZlcmVuY2UuXHJcbiAqIEV2ZW50czpcclxuICpcclxuICogfCBFdmVudCBOYW1lICAgICAgfCBBcmd1bWVudCBUeXBlICAgICAgfCBGaXJlZCB3aGVuICAgICAgIHxcclxuICogfCAtLS0tLS0tLS0tLS0tLS0tfCAtLS0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tIHxcclxuICogfCBsZWZ0ICAgICAgICAgICAgfCBPd3QuQmFzZS5Pd3RFdmVudCAgfCBUaGUgcGFydGljaXBhbnQgbGVmdCB0aGUgY29uZmVyZW5jZS4gfFxyXG4gKlxyXG4gKiBAZXh0ZW5kcyBPd3QuQmFzZS5FdmVudERpc3BhdGNoZXJcclxuICogQGhpZGVjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBhcnRpY2lwYW50IGV4dGVuZHMgRXZlbnRNb2R1bGUuRXZlbnREaXNwYXRjaGVyIHtcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xyXG4gIGNvbnN0cnVjdG9yKGlkLCByb2xlLCB1c2VySWQpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICAvKipcclxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gaWRcclxuICAgICAqIEBpbnN0YW5jZVxyXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlBhcnRpY2lwYW50XHJcbiAgICAgKiBAZGVzYyBUaGUgSUQgb2YgdGhlIHBhcnRpY2lwYW50LiBJdCB2YXJpZXMgd2hlbiBhIHNpbmdsZSB1c2VyIGpvaW4gZGlmZmVyZW50IGNvbmZlcmVuY2VzLlxyXG4gICAgICovXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2lkJywge1xyXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgIHZhbHVlOiBpZCxcclxuICAgIH0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IHJvbGVcclxuICAgICAqIEBpbnN0YW5jZVxyXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlBhcnRpY2lwYW50XHJcbiAgICAgKi9cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncm9sZScsIHtcclxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICB2YWx1ZTogcm9sZSxcclxuICAgIH0pO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IHVzZXJJZFxyXG4gICAgICogQGluc3RhbmNlXHJcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuUGFydGljaXBhbnRcclxuICAgICAqIEBkZXNjIFRoZSB1c2VyIElEIG9mIHRoZSBwYXJ0aWNpcGFudC4gSXQgY2FuIGJlIGludGVncmF0ZWQgaW50byBleGlzdGluZyBhY2NvdW50IG1hbmFnZW1lbnQgc3lzdGVtLlxyXG4gICAgICovXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3VzZXJJZCcsIHtcclxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICB2YWx1ZTogdXNlcklkLFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuLyogZ2xvYmFsIGlvLCBQcm9taXNlICovXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL2Jhc2UvbG9nZ2VyLmpzJztcbmltcG9ydCAqIGFzIEV2ZW50TW9kdWxlIGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnO1xuaW1wb3J0IHtDb25mZXJlbmNlRXJyb3J9IGZyb20gJy4vZXJyb3IuanMnO1xuaW1wb3J0IHtCYXNlNjR9IGZyb20gJy4uL2Jhc2UvYmFzZTY0LmpzJztcblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZWNvbm5lY3Rpb25BdHRlbXB0cyA9IDEwO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuZnVuY3Rpb24gaGFuZGxlUmVzcG9uc2Uoc3RhdHVzLCBkYXRhLCByZXNvbHZlLCByZWplY3QpIHtcbiAgaWYgKHN0YXR1cyA9PT0gJ29rJyB8fCBzdGF0dXMgPT09ICdzdWNjZXNzJykge1xuICAgIHJlc29sdmUoZGF0YSk7XG4gIH0gZWxzZSBpZiAoc3RhdHVzID09PSAnZXJyb3InKSB7XG4gICAgcmVqZWN0KGRhdGEpO1xuICB9IGVsc2Uge1xuICAgIExvZ2dlci5lcnJvcignTUNVIHJldHVybnMgdW5rbm93biBhY2suJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgU2lvU2lnbmFsaW5nXG4gKiBAY2xhc3NkZXNjIFNvY2tldC5JTyBzaWduYWxpbmcgY2hhbm5lbCBmb3IgQ29uZmVyZW5jZUNsaWVudC4gSXQgaXMgbm90IHJlY29tbWVuZGVkIHRvIGRpcmVjdGx5IGFjY2VzcyB0aGlzIGNsYXNzLlxuICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlXG4gKiBAZXh0ZW5kcyBPd3QuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgU2lvU2lnbmFsaW5nIGV4dGVuZHMgRXZlbnRNb2R1bGUuRXZlbnREaXNwYXRjaGVyIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9zb2NrZXQgPSBudWxsO1xuICAgIHRoaXMuX2xvZ2dlZEluID0gZmFsc2U7XG4gICAgdGhpcy5fcmVjb25uZWN0VGltZXMgPSAwO1xuICAgIHRoaXMuX3JlY29ubmVjdGlvblRpY2tldCA9IG51bGw7XG4gICAgdGhpcy5fcmVmcmVzaFJlY29ubmVjdGlvblRpY2tldCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGNvbm5lY3RcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIENvbm5lY3QgdG8gYSBwb3J0YWwuXG4gICAqIEBtZW1iZXJvZiBPbXMuQ29uZmVyZW5jZS5TaW9TaWduYWxpbmdcbiAgICogQHJldHVybiB7UHJvbWlzZTxPYmplY3QsIEVycm9yPn0gUmV0dXJuIGEgcHJvbWlzZSByZXNvbHZlZCB3aXRoIHRoZSBkYXRhIHJldHVybmVkIGJ5IHBvcnRhbCBpZiBzdWNjZXNzZnVsbHkgbG9nZ2VkIGluLiBPciByZXR1cm4gYSBwcm9taXNlIHJlamVjdGVkIHdpdGggYSBuZXdseSBjcmVhdGVkIE9tcy5FcnJvciBpZiBmYWlsZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0IEhvc3Qgb2YgdGhlIHBvcnRhbC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlzU2VjdXJlZCBJcyBzZWN1cmUgY29ubmVjdGlvbiBvciBub3QuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2dpbkluZm8gSW5mb21hdGlvbiByZXF1aXJlZCBmb3IgbG9nZ2luZyBpbi5cbiAgICogQHByaXZhdGUuXG4gICAqL1xuICBjb25uZWN0KGhvc3QsIGlzU2VjdXJlZCwgbG9naW5JbmZvKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgICdyZWNvbm5lY3Rpb24nOiB0cnVlLFxuICAgICAgICAncmVjb25uZWN0aW9uQXR0ZW1wdHMnOiByZWNvbm5lY3Rpb25BdHRlbXB0cyxcbiAgICAgICAgJ2ZvcmNlIG5ldyBjb25uZWN0aW9uJzogdHJ1ZSxcbiAgICAgIH07XG4gICAgICB0aGlzLl9zb2NrZXQgPSBpbyhob3N0LCBvcHRzKTtcbiAgICAgIFsncGFydGljaXBhbnQnLCAndGV4dCcsICdzdHJlYW0nLCAncHJvZ3Jlc3MnXS5mb3JFYWNoKChcbiAgICAgICAgICBub3RpZmljYXRpb24pID0+IHtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKG5vdGlmaWNhdGlvbiwgKGRhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk1lc3NhZ2VFdmVudCgnZGF0YScsIHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgICAgICAgbm90aWZpY2F0aW9uOiBub3RpZmljYXRpb24sXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3NvY2tldC5vbigncmVjb25uZWN0aW5nJywgKCkgPT4ge1xuICAgICAgICB0aGlzLl9yZWNvbm5lY3RUaW1lcysrO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9zb2NrZXQub24oJ3JlY29ubmVjdF9mYWlsZWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9yZWNvbm5lY3RUaW1lcyA+PSByZWNvbm5lY3Rpb25BdHRlbXB0cykge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnRNb2R1bGUuT3d0RXZlbnQoJ2Rpc2Nvbm5lY3QnKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc29ja2V0Lm9uKCdjb25uZWN0X2Vycm9yJywgKGUpID0+IHtcbiAgICAgICAgcmVqZWN0KGBjb25uZWN0X2Vycm9yOiR7aG9zdH1gKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc29ja2V0Lm9uKCdkcm9wJywgKCkgPT4ge1xuICAgICAgICB0aGlzLl9yZWNvbm5lY3RUaW1lcyA9IHJlY29ubmVjdGlvbkF0dGVtcHRzO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NsZWFyUmVjb25uZWN0aW9uVGFzaygpO1xuICAgICAgICBpZiAodGhpcy5fcmVjb25uZWN0VGltZXMgPj0gcmVjb25uZWN0aW9uQXR0ZW1wdHMpIHtcbiAgICAgICAgICB0aGlzLl9sb2dnZWRJbiA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnRNb2R1bGUuT3d0RXZlbnQoJ2Rpc2Nvbm5lY3QnKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc29ja2V0LmVtaXQoJ2xvZ2luJywgbG9naW5JbmZvLCAoc3RhdHVzLCBkYXRhKSA9PiB7XG4gICAgICAgIGlmIChzdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICB0aGlzLl9sb2dnZWRJbiA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fb25SZWNvbm5lY3Rpb25UaWNrZXQoZGF0YS5yZWNvbm5lY3Rpb25UaWNrZXQpO1xuICAgICAgICAgIHRoaXMuX3NvY2tldC5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgIC8vIHJlLWxvZ2luIHdpdGggcmVjb25uZWN0aW9uIHRpY2tldC5cbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdyZWxvZ2luJywgdGhpcy5fcmVjb25uZWN0aW9uVGlja2V0LCAoc3RhdHVzLFxuICAgICAgICAgICAgICAgIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlY29ubmVjdFRpbWVzID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblJlY29ubmVjdGlvblRpY2tldChkYXRhKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk93dEV2ZW50KCdkaXNjb25uZWN0JykpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVSZXNwb25zZShzdGF0dXMsIGRhdGEsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gZGlzY29ubmVjdFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgRGlzY29ubmVjdCBmcm9tIGEgcG9ydGFsLlxuICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuU2lvU2lnbmFsaW5nXG4gICAqIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0LCBFcnJvcj59IFJldHVybiBhIHByb21pc2UgcmVzb2x2ZWQgd2l0aCB0aGUgZGF0YSByZXR1cm5lZCBieSBwb3J0YWwgaWYgc3VjY2Vzc2Z1bGx5IGRpc2Nvbm5lY3RlZC4gT3IgcmV0dXJuIGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIGEgbmV3bHkgY3JlYXRlZCBPbXMuRXJyb3IgaWYgZmFpbGVkLlxuICAgKiBAcHJpdmF0ZS5cbiAgICovXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgaWYgKCF0aGlzLl9zb2NrZXQgfHwgdGhpcy5fc29ja2V0LmRpc2Nvbm5lY3RlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICAgJ1BvcnRhbCBpcyBub3QgY29ubmVjdGVkLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdsb2dvdXQnLCAoc3RhdHVzLCBkYXRhKSA9PiB7XG4gICAgICAgIC8vIE1heGltaXplIHRoZSByZWNvbm5lY3QgdGltZXMgdG8gZGlzYWJsZSByZWNvbm5lY3Rpb24uXG4gICAgICAgIHRoaXMuX3JlY29ubmVjdFRpbWVzID0gcmVjb25uZWN0aW9uQXR0ZW1wdHM7XG4gICAgICAgIHRoaXMuX3NvY2tldC5kaXNjb25uZWN0KCk7XG4gICAgICAgIGhhbmRsZVJlc3BvbnNlKHN0YXR1cywgZGF0YSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBzZW5kXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBTZW5kIGRhdGEgdG8gcG9ydGFsLlxuICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuU2lvU2lnbmFsaW5nXG4gICAqIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0LCBFcnJvcj59IFJldHVybiBhIHByb21pc2UgcmVzb2x2ZWQgd2l0aCB0aGUgZGF0YSByZXR1cm5lZCBieSBwb3J0YWwuIE9yIHJldHVybiBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCBhIG5ld2x5IGNyZWF0ZWQgT21zLkVycm9yIGlmIGZhaWxlZCB0byBzZW5kIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdE5hbWUgTmFtZSBkZWZpbmVkIGluIGNsaWVudC1zZXJ2ZXIgcHJvdG9jb2wuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0RGF0YSBEYXRhIGZvcm1hdCBpcyBkZWZpbmVkIGluIGNsaWVudC1zZXJ2ZXIgcHJvdG9jb2wuXG4gICAqIEBwcml2YXRlLlxuICAgKi9cbiAgc2VuZChyZXF1ZXN0TmFtZSwgcmVxdWVzdERhdGEpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fc29ja2V0LmVtaXQocmVxdWVzdE5hbWUsIHJlcXVlc3REYXRhLCAoc3RhdHVzLCBkYXRhKSA9PiB7XG4gICAgICAgIGhhbmRsZVJlc3BvbnNlKHN0YXR1cywgZGF0YSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBfb25SZWNvbm5lY3Rpb25UaWNrZXRcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIFBhcnNlIHJlY29ubmVjdGlvbiB0aWNrZXQgYW5kIHNjaGVkdWxlIHRpY2tldCByZWZyZXNoaW5nLlxuICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU2lvU2lnbmFsaW5nXG4gICAqIEBwcml2YXRlLlxuICAgKi9cbiAgX29uUmVjb25uZWN0aW9uVGlja2V0KHRpY2tldFN0cmluZykge1xuICAgIHRoaXMuX3JlY29ubmVjdGlvblRpY2tldCA9IHRpY2tldFN0cmluZztcbiAgICBjb25zdCB0aWNrZXQgPSBKU09OLnBhcnNlKEJhc2U2NC5kZWNvZGVCYXNlNjQodGlja2V0U3RyaW5nKSk7XG4gICAgLy8gUmVmcmVzaCB0aWNrZXQgMSBtaW4gb3IgMTAgc2Vjb25kcyBiZWZvcmUgaXQgZXhwaXJlcy5cbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IG1pbGxpc2Vjb25kc0luT25lTWludXRlID0gNjAgKiAxMDAwO1xuICAgIGNvbnN0IG1pbGxpc2Vjb25kc0luVGVuU2Vjb25kcyA9IDEwICogMTAwMDtcbiAgICBpZiAodGlja2V0Lm5vdEFmdGVyIDw9IG5vdyAtIG1pbGxpc2Vjb25kc0luVGVuU2Vjb25kcykge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ1JlY29ubmVjdGlvbiB0aWNrZXQgZXhwaXJlcyB0b28gc29vbi4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHJlZnJlc2hBZnRlciA9IHRpY2tldC5ub3RBZnRlciAtIG5vdyAtIG1pbGxpc2Vjb25kc0luT25lTWludXRlO1xuICAgIGlmIChyZWZyZXNoQWZ0ZXIgPCAwKSB7XG4gICAgICByZWZyZXNoQWZ0ZXIgPSB0aWNrZXQubm90QWZ0ZXIgLSBub3cgLSBtaWxsaXNlY29uZHNJblRlblNlY29uZHM7XG4gICAgfVxuICAgIHRoaXMuX2NsZWFyUmVjb25uZWN0aW9uVGFzaygpO1xuICAgIHRoaXMuX3JlZnJlc2hSZWNvbm5lY3Rpb25UaWNrZXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdyZWZyZXNoUmVjb25uZWN0aW9uVGlja2V0JywgKHN0YXR1cywgZGF0YSkgPT4ge1xuICAgICAgICBpZiAoc3RhdHVzICE9PSAnb2snKSB7XG4gICAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ0ZhaWxlZCB0byByZWZyZXNoIHJlY29ubmVjdGlvbiB0aWNrZXQuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX29uUmVjb25uZWN0aW9uVGlja2V0KGRhdGEpO1xuICAgICAgfSk7XG4gICAgfSwgcmVmcmVzaEFmdGVyKTtcbiAgfVxuXG4gIF9jbGVhclJlY29ubmVjdGlvblRhc2soKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlZnJlc2hSZWNvbm5lY3Rpb25UaWNrZXQpO1xuICAgIHRoaXMuX3JlZnJlc2hSZWNvbm5lY3Rpb25UaWNrZXQgPSBudWxsO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8vIFRoaXMgZmlsZSBkb2Vzbid0IGhhdmUgcHVibGljIEFQSXMuXG4vKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCAqIGFzIFB1YmxpY2F0aW9uTW9kdWxlIGZyb20gJy4uL2Jhc2UvcHVibGljYXRpb24uanMnO1xuaW1wb3J0ICogYXMgTWVkaWFGb3JtYXRNb2R1bGUgZnJvbSAnLi4vYmFzZS9tZWRpYWZvcm1hdC5qcyc7XG5pbXBvcnQgKiBhcyBDb2RlY01vZHVsZSBmcm9tICcuLi9iYXNlL2NvZGVjLmpzJztcbmltcG9ydCAqIGFzIFN1YnNjcmlwdGlvbk1vZHVsZSBmcm9tICcuL3N1YnNjcmlwdGlvbi5qcyc7XG5cblxuLyoqXG4gKiBAZnVuY3Rpb24gZXh0cmFjdEJpdHJhdGVNdWx0aXBsaWVyXG4gKiBAZGVzYyBFeHRyYWN0IGJpdHJhdGUgbXVsdGlwbGllciBmcm9tIGEgc3RyaW5nIGxpa2UgXCJ4MC4yXCIuXG4gKiBAcmV0dXJuIHtQcm9taXNlPE9iamVjdCwgRXJyb3I+fSBUaGUgZmxvYXQgbnVtYmVyIGFmdGVyIFwieFwiLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZXh0cmFjdEJpdHJhdGVNdWx0aXBsaWVyKGlucHV0KSB7XG4gIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnIHx8ICFpbnB1dC5zdGFydHNXaXRoKCd4JykpIHtcbiAgICBMLkxvZ2dlci53YXJuaW5nKCdJbnZhbGlkIGJpdHJhdGUgbXVsdGlwbGllciBpbnB1dC4nKTtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gTnVtYmVyLnBhcnNlRmxvYXQoaW5wdXQucmVwbGFjZSgvXngvLCAnJykpO1xufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuZnVuY3Rpb24gc29ydE51bWJlcnMoeCwgeSkge1xuICByZXR1cm4geCAtIHk7XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG5mdW5jdGlvbiBzb3J0UmVzb2x1dGlvbnMoeCwgeSkge1xuICBpZiAoeC53aWR0aCAhPT0geS53aWR0aCkge1xuICAgIHJldHVybiB4LndpZHRoIC0geS53aWR0aDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4geC5oZWlnaHQgLSB5LmhlaWdodDtcbiAgfVxufVxuXG4vKipcbiAqIEBmdW5jdGlvbiBjb252ZXJ0VG9QdWJsaWNhdGlvblNldHRpbmdzXG4gKiBAZGVzYyBDb252ZXJ0IG1lZGlhSW5mbyByZWNlaXZlZCBmcm9tIHNlcnZlciB0byBQdWJsaWNhdGlvblNldHRpbmdzLlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb1B1YmxpY2F0aW9uU2V0dGluZ3MobWVkaWFJbmZvKSB7XG4gIGxldCBhdWRpbyA9IFtdLFxuICAgIHZpZGVvID0gW107XG4gIGxldCBhdWRpb0NvZGVjLCB2aWRlb0NvZGVjLCByZXNvbHV0aW9uLCBmcmFtZXJhdGUsIGJpdHJhdGUsIGtleUZyYW1lSW50ZXJ2YWwsXG4gICAgcmlkO1xuICBpZiAobWVkaWFJbmZvLmF1ZGlvKSB7XG4gICAgaWYgKG1lZGlhSW5mby5hdWRpby5mb3JtYXQpIHtcbiAgICAgIGF1ZGlvQ29kZWMgPSBuZXcgQ29kZWNNb2R1bGUuQXVkaW9Db2RlY1BhcmFtZXRlcnMoXG4gICAgICAgIG1lZGlhSW5mby5hdWRpby5mb3JtYXQuY29kZWMsIG1lZGlhSW5mby5hdWRpby5mb3JtYXQuY2hhbm5lbE51bSxcbiAgICAgICAgbWVkaWFJbmZvLmF1ZGlvLmZvcm1hdC5zYW1wbGVSYXRlKTtcbiAgICB9XG4gICAgYXVkaW8ucHVzaChuZXcgUHVibGljYXRpb25Nb2R1bGUuQXVkaW9QdWJsaWNhdGlvblNldHRpbmdzKGF1ZGlvQ29kZWMpKTtcbiAgfVxuICBpZiAobWVkaWFJbmZvLnZpZGVvKSB7XG4gICAgZm9yIChjb25zdCB2aWRlb0luZm8gb2YgbWVkaWFJbmZvLnZpZGVvLm9yaWdpbmFsKSB7XG4gICAgICBpZiAodmlkZW9JbmZvLmZvcm1hdCkge1xuICAgICAgICB2aWRlb0NvZGVjID0gbmV3IENvZGVjTW9kdWxlLlZpZGVvQ29kZWNQYXJhbWV0ZXJzKFxuICAgICAgICAgIHZpZGVvSW5mby5mb3JtYXQuY29kZWMsIHZpZGVvSW5mby5mb3JtYXQucHJvZmlsZSk7XG4gICAgICB9XG4gICAgICBpZiAodmlkZW9JbmZvLnBhcmFtZXRlcnMpIHtcbiAgICAgICAgaWYgKHZpZGVvSW5mby5wYXJhbWV0ZXJzLnJlc29sdXRpb24pIHtcbiAgICAgICAgICByZXNvbHV0aW9uID0gbmV3IE1lZGlhRm9ybWF0TW9kdWxlLlJlc29sdXRpb24oXG4gICAgICAgICAgICB2aWRlb0luZm8ucGFyYW1ldGVycy5yZXNvbHV0aW9uLndpZHRoLFxuICAgICAgICAgICAgdmlkZW9JbmZvLnBhcmFtZXRlcnMucmVzb2x1dGlvbi5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGZyYW1lcmF0ZSA9IHZpZGVvSW5mby5wYXJhbWV0ZXJzLmZyYW1lcmF0ZTtcbiAgICAgICAgYml0cmF0ZSA9IHZpZGVvSW5mby5wYXJhbWV0ZXJzLmJpdHJhdGUgKiAxMDAwO1xuICAgICAgICBrZXlGcmFtZUludGVydmFsID0gdmlkZW9JbmZvLnBhcmFtZXRlcnMua2V5RnJhbWVJbnRlcnZhbDtcbiAgICAgIH1cbiAgICAgIGlmICh2aWRlb0luZm8uc2ltdWxjYXN0UmlkKSB7XG4gICAgICAgIHJpZCA9IHZpZGVvSW5mby5zaW11bGNhc3RSaWQ7XG4gICAgICB9XG4gICAgICB2aWRlby5wdXNoKG5ldyBQdWJsaWNhdGlvbk1vZHVsZS5WaWRlb1B1YmxpY2F0aW9uU2V0dGluZ3MoXG4gICAgICAgIHZpZGVvQ29kZWMsIHJlc29sdXRpb24sIGZyYW1lcmF0ZSwgYml0cmF0ZSwga2V5RnJhbWVJbnRlcnZhbCwgcmlkKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgUHVibGljYXRpb25Nb2R1bGUuUHVibGljYXRpb25TZXR0aW5ncyhhdWRpbywgdmlkZW8pO1xufVxuXG4vKipcbiAqIEBmdW5jdGlvbiBjb252ZXJ0VG9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXNcbiAqIEBkZXNjIENvbnZlcnQgbWVkaWFJbmZvIHJlY2VpdmVkIGZyb20gc2VydmVyIHRvIFN1YnNjcmlwdGlvbkNhcGFiaWxpdGllcy5cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMobWVkaWFJbmZvKSB7XG4gIGxldCBhdWRpbzsgbGV0IHZpZGVvO1xuICBpZiAobWVkaWFJbmZvLmF1ZGlvKSB7XG4gICAgY29uc3QgYXVkaW9Db2RlY3MgPSBbXTtcbiAgICBpZiAobWVkaWFJbmZvLmF1ZGlvICYmIG1lZGlhSW5mby5hdWRpby5vcHRpb25hbCAmJlxuICAgICAgbWVkaWFJbmZvLmF1ZGlvLm9wdGlvbmFsLmZvcm1hdCkge1xuICAgICAgZm9yIChjb25zdCBhdWRpb0NvZGVjSW5mbyBvZiBtZWRpYUluZm8uYXVkaW8ub3B0aW9uYWwuZm9ybWF0KSB7XG4gICAgICAgIGNvbnN0IGF1ZGlvQ29kZWMgPSBuZXcgQ29kZWNNb2R1bGUuQXVkaW9Db2RlY1BhcmFtZXRlcnMoXG4gICAgICAgICAgICBhdWRpb0NvZGVjSW5mby5jb2RlYywgYXVkaW9Db2RlY0luZm8uY2hhbm5lbE51bSxcbiAgICAgICAgICAgIGF1ZGlvQ29kZWNJbmZvLnNhbXBsZVJhdGUpO1xuICAgICAgICBhdWRpb0NvZGVjcy5wdXNoKGF1ZGlvQ29kZWMpO1xuICAgICAgfVxuICAgIH1cbiAgICBhdWRpb0NvZGVjcy5zb3J0KCk7XG4gICAgYXVkaW8gPSBuZXcgU3Vic2NyaXB0aW9uTW9kdWxlLkF1ZGlvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzKGF1ZGlvQ29kZWNzKTtcbiAgfVxuICBpZiAobWVkaWFJbmZvLnZpZGVvKSB7XG4gICAgY29uc3QgdmlkZW9Db2RlY3MgPSBbXTtcbiAgICBpZiAobWVkaWFJbmZvLnZpZGVvICYmIG1lZGlhSW5mby52aWRlby5vcHRpb25hbCAmJlxuICAgICAgbWVkaWFJbmZvLnZpZGVvLm9wdGlvbmFsLmZvcm1hdCkge1xuICAgICAgZm9yIChjb25zdCB2aWRlb0NvZGVjSW5mbyBvZiBtZWRpYUluZm8udmlkZW8ub3B0aW9uYWwuZm9ybWF0KSB7XG4gICAgICAgIGNvbnN0IHZpZGVvQ29kZWMgPSBuZXcgQ29kZWNNb2R1bGUuVmlkZW9Db2RlY1BhcmFtZXRlcnMoXG4gICAgICAgICAgICB2aWRlb0NvZGVjSW5mby5jb2RlYywgdmlkZW9Db2RlY0luZm8ucHJvZmlsZSk7XG4gICAgICAgIHZpZGVvQ29kZWNzLnB1c2godmlkZW9Db2RlYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHZpZGVvQ29kZWNzLnNvcnQoKTtcbiAgICBpZiAobWVkaWFJbmZvLnZpZGVvICYmIG1lZGlhSW5mby52aWRlby5vcHRpb25hbCAmJiBtZWRpYUluZm8udmlkZW8ub3B0aW9uYWxcbiAgICAgIC5wYXJhbWV0ZXJzKSB7XG4gICAgICBjb25zdCByZXNvbHV0aW9ucyA9IEFycmF5LmZyb20oXG4gICAgICAgIG1lZGlhSW5mby52aWRlby5vcHRpb25hbC5wYXJhbWV0ZXJzLnJlc29sdXRpb24sXG4gICAgICAgIChyKSA9PiBuZXcgTWVkaWFGb3JtYXRNb2R1bGUuUmVzb2x1dGlvbihyLndpZHRoLCByLmhlaWdodCkpO1xuICAgICAgcmVzb2x1dGlvbnMuc29ydChzb3J0UmVzb2x1dGlvbnMpO1xuICAgICAgY29uc3QgYml0cmF0ZXMgPSBBcnJheS5mcm9tKFxuICAgICAgICBtZWRpYUluZm8udmlkZW8ub3B0aW9uYWwucGFyYW1ldGVycy5iaXRyYXRlLFxuICAgICAgICAoYml0cmF0ZSkgPT4gZXh0cmFjdEJpdHJhdGVNdWx0aXBsaWVyKGJpdHJhdGUpKTtcbiAgICAgIGJpdHJhdGVzLnB1c2goMS4wKTtcbiAgICAgIGJpdHJhdGVzLnNvcnQoc29ydE51bWJlcnMpO1xuICAgICAgY29uc3QgZnJhbWVSYXRlcyA9IEpTT04ucGFyc2UoXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG1lZGlhSW5mby52aWRlby5vcHRpb25hbC5wYXJhbWV0ZXJzLmZyYW1lcmF0ZSkpO1xuICAgICAgZnJhbWVSYXRlcy5zb3J0KHNvcnROdW1iZXJzKTtcbiAgICAgIGNvbnN0IGtleUZyYW1lSW50ZXJ2YWxzID0gSlNPTi5wYXJzZShcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkobWVkaWFJbmZvLnZpZGVvLm9wdGlvbmFsLnBhcmFtZXRlcnMua2V5RnJhbWVJbnRlcnZhbCkpO1xuICAgICAga2V5RnJhbWVJbnRlcnZhbHMuc29ydChzb3J0TnVtYmVycyk7XG4gICAgICB2aWRlbyA9IG5ldyBTdWJzY3JpcHRpb25Nb2R1bGUuVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMoXG4gICAgICAgIHZpZGVvQ29kZWNzLCByZXNvbHV0aW9ucywgZnJhbWVSYXRlcywgYml0cmF0ZXMsIGtleUZyYW1lSW50ZXJ2YWxzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlkZW8gPSBuZXcgU3Vic2NyaXB0aW9uTW9kdWxlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzKHZpZGVvQ29kZWNzLFxuICAgICAgICBbXSwgW10sIFsxLjBdLCBbXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uTW9kdWxlLlN1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyhhdWRpbywgdmlkZW8pO1xufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCAqIGFzIE1lZGlhRm9ybWF0TW9kdWxlIGZyb20gJy4uL2Jhc2UvbWVkaWFmb3JtYXQuanMnO1xuaW1wb3J0ICogYXMgQ29kZWNNb2R1bGUgZnJvbSAnLi4vYmFzZS9jb2RlYy5qcyc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlcn0gZnJvbSAnLi4vYmFzZS9ldmVudC5qcyc7XG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gKiBAbWVtYmVyT2YgT3d0LkNvbmZlcmVuY2VcbiAqIEBjbGFzc0Rlc2MgUmVwcmVzZW50cyB0aGUgYXVkaW8gY2FwYWJpbGl0eSBmb3Igc3Vic2NyaXB0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcihjb2RlY3MpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48T3d0LkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnM+fSBjb2RlY3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuQXVkaW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXNcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjcyA9IGNvZGVjcztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc1xuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIHZpZGVvIGNhcGFiaWxpdHkgZm9yIHN1YnNjcmlwdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoY29kZWNzLCByZXNvbHV0aW9ucywgZnJhbWVSYXRlcywgYml0cmF0ZU11bHRpcGxpZXJzLFxuICAgICAga2V5RnJhbWVJbnRlcnZhbHMpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48T3d0LkJhc2UuVmlkZW9Db2RlY1BhcmFtZXRlcnM+fSBjb2RlY3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXNcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjcyA9IGNvZGVjcztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48T3d0LkJhc2UuUmVzb2x1dGlvbj59IHJlc29sdXRpb25zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9ucyA9IHJlc29sdXRpb25zO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge0FycmF5LjxudW1iZXI+fSBmcmFtZVJhdGVzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5mcmFtZVJhdGVzID0gZnJhbWVSYXRlcztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48bnVtYmVyPn0gYml0cmF0ZU11bHRpcGxpZXJzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5iaXRyYXRlTXVsdGlwbGllcnMgPSBiaXRyYXRlTXVsdGlwbGllcnM7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7QXJyYXkuPG51bWJlcj59IGtleUZyYW1lSW50ZXJ2YWxzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5rZXlGcmFtZUludGVydmFscyA9IGtleUZyYW1lSW50ZXJ2YWxzO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN1YnNjcmlwdGlvbkNhcGFiaWxpdGllc1xuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIGNhcGFiaWxpdHkgZm9yIHN1YnNjcmlwdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGF1ZGlvLCB2aWRlbykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9Pd3QuQ29uZmVyZW5jZS5BdWRpb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc30gYXVkaW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5hdWRpbyA9IGF1ZGlvO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9Pd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc30gdmlkZW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy52aWRlbyA9IHZpZGVvO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAqIEBtZW1iZXJPZiBPd3QuQ29uZmVyZW5jZVxuICogQGNsYXNzRGVzYyBSZXByZXNlbnRzIHRoZSBhdWRpbyBjb25zdHJhaW50cyBmb3Igc3Vic2NyaXB0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9TdWJzY3JpcHRpb25Db25zdHJhaW50cyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGNvZGVjcykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9BcnJheS48T3d0LkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnM+fSBjb2RlY3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuQXVkaW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICAgICAqIEBkZXNjIENvZGVjcyBhY2NlcHRlZC4gSWYgbm9uZSBvZiBgY29kZWNzYCBzdXBwb3J0ZWQgYnkgYm90aCBzaWRlcywgY29ubmVjdGlvbiBmYWlscy4gTGVhdmUgaXQgdW5kZWZpbmVkIHdpbGwgdXNlIGFsbCBwb3NzaWJsZSBjb2RlY3MuXG4gICAgICovXG4gICAgdGhpcy5jb2RlY3MgPSBjb2RlY3M7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIHZpZGVvIGNvbnN0cmFpbnRzIGZvciBzdWJzY3JpcHRpb24uXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvbkNvbnN0cmFpbnRzIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoY29kZWNzLCByZXNvbHV0aW9uLCBmcmFtZVJhdGUsIGJpdHJhdGVNdWx0aXBsaWVyLFxuICAgICAga2V5RnJhbWVJbnRlcnZhbCwgcmlkKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P0FycmF5LjxPd3QuQmFzZS5WaWRlb0NvZGVjUGFyYW1ldGVycz59IGNvZGVjc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvbkNvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgQ29kZWNzIGFjY2VwdGVkLiBJZiBub25lIG9mIGBjb2RlY3NgIHN1cHBvcnRlZCBieSBib3RoIHNpZGVzLCBjb25uZWN0aW9uIGZhaWxzLiBMZWF2ZSBpdCB1bmRlZmluZWQgd2lsbCB1c2UgYWxsIHBvc3NpYmxlIGNvZGVjcy5cbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjcyA9IGNvZGVjcztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/T3d0LkJhc2UuUmVzb2x1dGlvbn0gcmVzb2x1dGlvblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvbkNvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgT25seSByZXNvbHV0aW9ucyBsaXN0ZWQgaW4gT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9uID0gcmVzb2x1dGlvbjtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBmcmFtZVJhdGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICAgICAqIEBkZXNjIE9ubHkgZnJhbWVSYXRlcyBsaXN0ZWQgaW4gT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5mcmFtZVJhdGUgPSBmcmFtZVJhdGU7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gYml0cmF0ZU11bHRpcGxpZXJcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICAgICAqIEBkZXNjIE9ubHkgYml0cmF0ZU11bHRpcGxpZXJzIGxpc3RlZCBpbiBPd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyBhcmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICB0aGlzLmJpdHJhdGVNdWx0aXBsaWVyID0gYml0cmF0ZU11bHRpcGxpZXI7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0ga2V5RnJhbWVJbnRlcnZhbFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvbkNvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgT25seSBrZXlGcmFtZUludGVydmFscyBsaXN0ZWQgaW4gT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5rZXlGcmFtZUludGVydmFsID0ga2V5RnJhbWVJbnRlcnZhbDtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSByaWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICAgICAqIEBkZXNjIFJlc3RyaWN0aW9uIGlkZW50aWZpZXIgdG8gaWRlbnRpZnkgdGhlIFJUUCBTdHJlYW1zIHdpdGhpbiBhbiBSVFAgc2Vzc2lvbi4gV2hlbiByaWQgaXMgc3BlY2lmaWVkLCBvdGhlciBjb25zdHJhaW50cyB3aWxsIGJlIGlnbm9yZWQuXG4gICAgICovXG4gICAgdGhpcy5yaWQgPSByaWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgU3Vic2NyaWJlT3B0aW9uc1xuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFN1YnNjcmliZU9wdGlvbnMgZGVmaW5lcyBvcHRpb25zIGZvciBzdWJzY3JpYmluZyBhIE93dC5CYXNlLlJlbW90ZVN0cmVhbS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmliZU9wdGlvbnMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihhdWRpbywgdmlkZW8pIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/T3d0LkNvbmZlcmVuY2UuQXVkaW9TdWJzY3JpcHRpb25Db25zdHJhaW50c30gYXVkaW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaWJlT3B0aW9uc1xuICAgICAqL1xuICAgIHRoaXMuYXVkaW8gPSBhdWRpbztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/T3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c30gdmlkZW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaWJlT3B0aW9uc1xuICAgICAqL1xuICAgIHRoaXMudmlkZW8gPSB2aWRlbztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAqIEBtZW1iZXJPZiBPd3QuQ29uZmVyZW5jZVxuICogQGNsYXNzRGVzYyBWaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnMgZGVmaW5lcyBvcHRpb25zIGZvciB1cGRhdGluZyBhIHN1YnNjcmlwdGlvbidzIHZpZGVvIHBhcnQuXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/T3d0LkJhc2UuUmVzb2x1dGlvbn0gcmVzb2x1dGlvblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAgICAgKiBAZGVzYyBPbmx5IHJlc29sdXRpb25zIGxpc3RlZCBpbiBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyBhcmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICB0aGlzLnJlc29sdXRpb24gPSB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gZnJhbWVSYXRlc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAgICAgKiBAZGVzYyBPbmx5IGZyYW1lUmF0ZXMgbGlzdGVkIGluIFZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIGFyZSBhbGxvd2VkLlxuICAgICAqL1xuICAgIHRoaXMuZnJhbWVSYXRlID0gdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGJpdHJhdGVNdWx0aXBsaWVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAgICAgKiBAZGVzYyBPbmx5IGJpdHJhdGVNdWx0aXBsaWVycyBsaXN0ZWQgaW4gVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5iaXRyYXRlTXVsdGlwbGllcnMgPSB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0ga2V5RnJhbWVJbnRlcnZhbHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gICAgICogQGRlc2MgT25seSBrZXlGcmFtZUludGVydmFscyBsaXN0ZWQgaW4gVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5rZXlGcmFtZUludGVydmFsID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAqIEBtZW1iZXJPZiBPd3QuQ29uZmVyZW5jZVxuICogQGNsYXNzRGVzYyBTdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIGRlZmluZXMgb3B0aW9ucyBmb3IgdXBkYXRpbmcgYSBzdWJzY3JpcHRpb24uXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P1ZpZGVvU3Vic2NyaXB0aW9uVXBkYXRlT3B0aW9uc30gdmlkZW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uVXBkYXRlT3B0aW9uc1xuICAgICAqL1xuICAgIHRoaXMudmlkZW8gPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgU3Vic2NyaXB0aW9uXG4gKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2VcbiAqIEBjbGFzc0Rlc2MgU3Vic2NyaXB0aW9uIGlzIGEgcmVjZWl2ZXIgZm9yIHJlY2VpdmluZyBhIHN0cmVhbS5cbiAqIEV2ZW50czpcbiAqXG4gKiB8IEV2ZW50IE5hbWUgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgfCBGaXJlZCB3aGVuICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0tLS0tLXwgLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBlbmRlZCAgICAgICAgICAgfCBFdmVudCAgICAgICAgICAgIHwgU3Vic2NyaXB0aW9uIGlzIGVuZGVkLiB8XG4gKiB8IGVycm9yICAgICAgICAgICB8IEVycm9yRXZlbnQgICAgICAgfCBBbiBlcnJvciBvY2N1cnJlZCBvbiB0aGUgc3Vic2NyaXB0aW9uLiB8XG4gKiB8IG11dGUgICAgICAgICAgICB8IE11dGVFdmVudCAgICAgICAgfCBQdWJsaWNhdGlvbiBpcyBtdXRlZC4gUmVtb3RlIHNpZGUgc3RvcHBlZCBzZW5kaW5nIGF1ZGlvIGFuZC9vciB2aWRlbyBkYXRhLiB8XG4gKiB8IHVubXV0ZSAgICAgICAgICB8IE11dGVFdmVudCAgICAgICAgfCBQdWJsaWNhdGlvbiBpcyB1bm11dGVkLiBSZW1vdGUgc2lkZSBjb250aW51ZWQgc2VuZGluZyBhdWRpbyBhbmQvb3IgdmlkZW8gZGF0YS4gfFxuICpcbiAqIEBleHRlbmRzIE93dC5CYXNlLkV2ZW50RGlzcGF0Y2hlclxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgU3Vic2NyaXB0aW9uIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoaWQsIHN0b3AsIGdldFN0YXRzLCBtdXRlLCB1bm11dGUsIGFwcGx5T3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gICAgaWYgKCFpZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSUQgY2Fubm90IGJlIG51bGwgb3IgdW5kZWZpbmVkLicpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaWQnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IGlkLFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBzdG9wXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCBjZXJ0YWluIHN1YnNjcmlwdGlvbi4gT25jZSBhIHN1YnNjcmlwdGlvbiBpcyBzdG9wcGVkLCBpdCBjYW5ub3QgYmUgcmVjb3ZlcmVkLlxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5TdWJzY3JpcHRpb25cbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIHRoaXMuc3RvcCA9IHN0b3A7XG4gICAgLyoqXG4gICAgICogQGZ1bmN0aW9uIGdldFN0YXRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgR2V0IHN0YXRzIG9mIHVuZGVybHlpbmcgUGVlckNvbm5lY3Rpb24uXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFJUQ1N0YXRzUmVwb3J0LCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5nZXRTdGF0cyA9IGdldFN0YXRzO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBtdXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCByZWV2aW5nIGRhdGEgZnJvbSByZW1vdGUgZW5kcG9pbnQuXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEBwYXJhbSB7T3d0LkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSBtdXRlZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn1cbiAgICAgKi9cbiAgICB0aGlzLm11dGUgPSBtdXRlO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiB1bm11dGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBDb250aW51ZSByZWV2aW5nIGRhdGEgZnJvbSByZW1vdGUgZW5kcG9pbnQuXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEBwYXJhbSB7T3d0LkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSB1bm11dGVkLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHVuZGVmaW5lZCwgRXJyb3I+fVxuICAgICAqL1xuICAgIHRoaXMudW5tdXRlID0gdW5tdXRlO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBhcHBseU9wdGlvbnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBVcGRhdGUgc3Vic2NyaXB0aW9uIHdpdGggZ2l2ZW4gb3B0aW9ucy5cbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uXG4gICAgICogQHBhcmFtIHtPd3QuQ29uZmVyZW5jZS5TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIH0gb3B0aW9ucyBTdWJzY3JpcHRpb24gdXBkYXRlIG9wdGlvbnMuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dW5kZWZpbmVkLCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5hcHBseU9wdGlvbnMgPSBhcHBseU9wdGlvbnM7XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXHJcbi8vXHJcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgKiBhcyBiYXNlIGZyb20gJy4vYmFzZS9leHBvcnQuanMnO1xyXG5pbXBvcnQgKiBhcyBwMnAgZnJvbSAnLi9wMnAvZXhwb3J0LmpzJztcclxuaW1wb3J0ICogYXMgY29uZmVyZW5jZSBmcm9tICcuL2NvbmZlcmVuY2UvZXhwb3J0LmpzJztcclxuXHJcbi8qKlxyXG4gKiBCYXNlIG9iamVjdHMgZm9yIGJvdGggUDJQIGFuZCBjb25mZXJlbmNlLlxyXG4gKiBAbmFtZXNwYWNlIE93dC5CYXNlXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgQmFzZSA9IGJhc2U7XHJcblxyXG4vKipcclxuICogUDJQIFdlYlJUQyBjb25uZWN0aW9ucy5cclxuICogQG5hbWVzcGFjZSBPd3QuUDJQXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgUDJQID0gcDJwO1xyXG5cclxuLyoqXHJcbiAqIFdlYlJUQyBjb25uZWN0aW9ucyB3aXRoIGNvbmZlcmVuY2Ugc2VydmVyLlxyXG4gKiBAbmFtZXNwYWNlIE93dC5Db25mZXJlbmNlXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgQ29uZmVyZW5jZSA9IGNvbmZlcmVuY2U7XHJcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXHJcbi8vXHJcbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY29uc3QgZXJyb3JzID0ge1xyXG4gIC8vIDIxMDAtMjk5OSBmb3IgUDJQIGVycm9yc1xyXG4gIC8vIDIxMDAtMjE5OSBmb3IgY29ubmVjdGlvbiBlcnJvcnNcclxuICAvLyAyMTAwLTIxMDkgZm9yIHNlcnZlciBlcnJvcnNcclxuICBQMlBfQ09OTl9TRVJWRVJfVU5LTk9XTjoge1xyXG4gICAgY29kZTogMjEwMCxcclxuICAgIG1lc3NhZ2U6ICdTZXJ2ZXIgdW5rbm93biBlcnJvci4nLFxyXG4gIH0sXHJcbiAgUDJQX0NPTk5fU0VSVkVSX1VOQVZBSUxBQkxFOiB7XHJcbiAgICBjb2RlOiAyMTAxLFxyXG4gICAgbWVzc2FnZTogJ1NlcnZlciBpcyB1bmF2YWxpYWJsZS4nLFxyXG4gIH0sXHJcbiAgUDJQX0NPTk5fU0VSVkVSX0JVU1k6IHtcclxuICAgIGNvZGU6IDIxMDIsXHJcbiAgICBtZXNzYWdlOiAnU2VydmVyIGlzIHRvbyBidXN5LicsXHJcbiAgfSxcclxuICBQMlBfQ09OTl9TRVJWRVJfTk9UX1NVUFBPUlRFRDoge1xyXG4gICAgY29kZTogMjEwMyxcclxuICAgIG1lc3NhZ2U6ICdNZXRob2QgaGFzIG5vdCBiZWVuIHN1cHBvcnRlZCBieSBzZXJ2ZXIuJyxcclxuICB9LFxyXG4gIC8vIDIxMTAtMjExOSBmb3IgY2xpZW50IGVycm9yc1xyXG4gIFAyUF9DT05OX0NMSUVOVF9VTktOT1dOOiB7XHJcbiAgICBjb2RlOiAyMTEwLFxyXG4gICAgbWVzc2FnZTogJ0NsaWVudCB1bmtub3duIGVycm9yLicsXHJcbiAgfSxcclxuICBQMlBfQ09OTl9DTElFTlRfTk9UX0lOSVRJQUxJWkVEOiB7XHJcbiAgICBjb2RlOiAyMTExLFxyXG4gICAgbWVzc2FnZTogJ0Nvbm5lY3Rpb24gaXMgbm90IGluaXRpYWxpemVkLicsXHJcbiAgfSxcclxuICAvLyAyMTIwLTIxMjkgZm9yIGF1dGhlbnRpY2F0aW9uIGVycm9yc1xyXG4gIFAyUF9DT05OX0FVVEhfVU5LTk9XTjoge1xyXG4gICAgY29kZTogMjEyMCxcclxuICAgIG1lc3NhZ2U6ICdBdXRoZW50aWNhdGlvbiB1bmtub3duIGVycm9yLicsXHJcbiAgfSxcclxuICBQMlBfQ09OTl9BVVRIX0ZBSUxFRDoge1xyXG4gICAgY29kZTogMjEyMSxcclxuICAgIG1lc3NhZ2U6ICdXcm9uZyB1c2VybmFtZSBvciB0b2tlbi4nLFxyXG4gIH0sXHJcbiAgLy8gMjIwMC0yMjk5IGZvciBtZXNzYWdlIHRyYW5zcG9ydCBlcnJvcnNcclxuICBQMlBfTUVTU0FHSU5HX1RBUkdFVF9VTlJFQUNIQUJMRToge1xyXG4gICAgY29kZTogMjIwMSxcclxuICAgIG1lc3NhZ2U6ICdSZW1vdGUgdXNlciBjYW5ub3QgYmUgcmVhY2hlZC4nLFxyXG4gIH0sXHJcbiAgUDJQX0NMSUVOVF9ERU5JRUQ6IHtcclxuICAgIGNvZGU6IDIyMDIsXHJcbiAgICBtZXNzYWdlOiAnVXNlciBpcyBkZW5pZWQuJyxcclxuICB9LFxyXG4gIC8vIDIzMDEtMjM5OSBmb3IgY2hhdCByb29tIGVycm9yc1xyXG4gIC8vIDI0MDEtMjQ5OSBmb3IgY2xpZW50IGVycm9yc1xyXG4gIFAyUF9DTElFTlRfVU5LTk9XTjoge1xyXG4gICAgY29kZTogMjQwMCxcclxuICAgIG1lc3NhZ2U6ICdVbmtub3duIGVycm9ycy4nLFxyXG4gIH0sXHJcbiAgUDJQX0NMSUVOVF9VTlNVUFBPUlRFRF9NRVRIT0Q6IHtcclxuICAgIGNvZGU6IDI0MDEsXHJcbiAgICBtZXNzYWdlOiAnVGhpcyBtZXRob2QgaXMgdW5zdXBwb3J0ZWQgaW4gY3VycmVudCBicm93c2VyLicsXHJcbiAgfSxcclxuICBQMlBfQ0xJRU5UX0lMTEVHQUxfQVJHVU1FTlQ6IHtcclxuICAgIGNvZGU6IDI0MDIsXHJcbiAgICBtZXNzYWdlOiAnSWxsZWdhbCBhcmd1bWVudC4nLFxyXG4gIH0sXHJcbiAgUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFOiB7XHJcbiAgICBjb2RlOiAyNDAzLFxyXG4gICAgbWVzc2FnZTogJ0ludmFsaWQgcGVlciBzdGF0ZS4nLFxyXG4gIH0sXHJcbiAgUDJQX0NMSUVOVF9OT1RfQUxMT1dFRDoge1xyXG4gICAgY29kZTogMjQwNCxcclxuICAgIG1lc3NhZ2U6ICdSZW1vdGUgdXNlciBpcyBub3QgYWxsb3dlZC4nLFxyXG4gIH0sXHJcbiAgLy8gMjUwMS0yNTk5IGZvciBXZWJSVEMgZXJyb3MuXHJcbiAgUDJQX1dFQlJUQ19VTktOT1dOOiB7XHJcbiAgICBjb2RlOiAyNTAwLFxyXG4gICAgbWVzc2FnZTogJ1dlYlJUQyBlcnJvci4nLFxyXG4gIH0sXHJcbiAgUDJQX1dFQlJUQ19TRFA6IHtcclxuICAgIGNvZGU6IDI1MDIsXHJcbiAgICBtZXNzYWdlOiAnU0RQIGVycm9yLicsXHJcbiAgfSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb24gZ2V0RXJyb3JCeUNvZGVcclxuICogQGRlc2MgR2V0IGVycm9yIG9iamVjdCBieSBlcnJvciBjb2RlLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZXJyb3JDb2RlIEVycm9yIGNvZGUuXHJcbiAqIEByZXR1cm4ge093dC5QMlAuRXJyb3J9IEVycm9yIG9iamVjdFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEVycm9yQnlDb2RlKGVycm9yQ29kZSkge1xyXG4gIGNvbnN0IGNvZGVFcnJvck1hcCA9IHtcclxuICAgIDIxMDA6IGVycm9ycy5QMlBfQ09OTl9TRVJWRVJfVU5LTk9XTixcclxuICAgIDIxMDE6IGVycm9ycy5QMlBfQ09OTl9TRVJWRVJfVU5BVkFJTEFCTEUsXHJcbiAgICAyMTAyOiBlcnJvcnMuUDJQX0NPTk5fU0VSVkVSX0JVU1ksXHJcbiAgICAyMTAzOiBlcnJvcnMuUDJQX0NPTk5fU0VSVkVSX05PVF9TVVBQT1JURUQsXHJcbiAgICAyMTEwOiBlcnJvcnMuUDJQX0NPTk5fQ0xJRU5UX1VOS05PV04sXHJcbiAgICAyMTExOiBlcnJvcnMuUDJQX0NPTk5fQ0xJRU5UX05PVF9JTklUSUFMSVpFRCxcclxuICAgIDIxMjA6IGVycm9ycy5QMlBfQ09OTl9BVVRIX1VOS05PV04sXHJcbiAgICAyMTIxOiBlcnJvcnMuUDJQX0NPTk5fQVVUSF9GQUlMRUQsXHJcbiAgICAyMjAxOiBlcnJvcnMuUDJQX01FU1NBR0lOR19UQVJHRVRfVU5SRUFDSEFCTEUsXHJcbiAgICAyNDAwOiBlcnJvcnMuUDJQX0NMSUVOVF9VTktOT1dOLFxyXG4gICAgMjQwMTogZXJyb3JzLlAyUF9DTElFTlRfVU5TVVBQT1JURURfTUVUSE9ELFxyXG4gICAgMjQwMjogZXJyb3JzLlAyUF9DTElFTlRfSUxMRUdBTF9BUkdVTUVOVCxcclxuICAgIDI0MDM6IGVycm9ycy5QMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEUsXHJcbiAgICAyNDA0OiBlcnJvcnMuUDJQX0NMSUVOVF9OT1RfQUxMT1dFRCxcclxuICAgIDI1MDA6IGVycm9ycy5QMlBfV0VCUlRDX1VOS05PV04sXHJcbiAgICAyNTAxOiBlcnJvcnMuUDJQX1dFQlJUQ19TRFAsXHJcbiAgfTtcclxuICByZXR1cm4gY29kZUVycm9yTWFwW2Vycm9yQ29kZV07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUDJQRXJyb3JcclxuICogQGNsYXNzRGVzYyBUaGUgUDJQRXJyb3Igb2JqZWN0IHJlcHJlc2VudHMgYW4gZXJyb3IgaW4gUDJQIG1vZGUuXHJcbiAqIEBtZW1iZXJPZiBPd3QuUDJQXHJcbiAqIEBoaWRlY29uc3RydWN0b3JcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQMlBFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xyXG4gIGNvbnN0cnVjdG9yKGVycm9yLCBtZXNzYWdlKSB7XHJcbiAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgIGlmICh0eXBlb2YgZXJyb3IgPT09ICdudW1iZXInKSB7XHJcbiAgICAgIHRoaXMuY29kZSA9IGVycm9yO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb2RlID0gZXJyb3IuY29kZTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cclxuLy9cclxuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCB7ZGVmYXVsdCBhcyBQMlBDbGllbnR9IGZyb20gJy4vcDJwY2xpZW50LmpzJztcclxuZXhwb3J0IHtQMlBFcnJvcn0gZnJvbSAnLi9lcnJvci5qcyc7XHJcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuLyogZ2xvYmFsIE1hcCwgUHJvbWlzZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL2Jhc2UvbG9nZ2VyLmpzJztcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyLCBPd3RFdmVudH0gZnJvbSAnLi4vYmFzZS9ldmVudC5qcyc7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuLi9iYXNlL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIEVycm9yTW9kdWxlIGZyb20gJy4vZXJyb3IuanMnO1xuaW1wb3J0IFAyUFBlZXJDb25uZWN0aW9uQ2hhbm5lbCBmcm9tICcuL3BlZXJjb25uZWN0aW9uLWNoYW5uZWwuanMnO1xuXG5jb25zdCBDb25uZWN0aW9uU3RhdGUgPSB7XG4gIFJFQURZOiAxLFxuICBDT05ORUNUSU5HOiAyLFxuICBDT05ORUNURUQ6IDMsXG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuLyoqXG4gKiBAY2xhc3MgUDJQQ2xpZW50Q29uZmlndXJhdGlvblxuICogQGNsYXNzRGVzYyBDb25maWd1cmF0aW9uIGZvciBQMlBDbGllbnQuXG4gKiBAbWVtYmVyT2YgT3d0LlAyUFxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jb25zdCBQMlBDbGllbnRDb25maWd1cmF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIC8qKlxuICAgKiBAbWVtYmVyIHs/QXJyYXk8T3d0LkJhc2UuQXVkaW9FbmNvZGluZ1BhcmFtZXRlcnM+fSBhdWRpb0VuY29kaW5nXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBFbmNvZGluZyBwYXJhbWV0ZXJzIGZvciBwdWJsaXNoaW5nIGF1ZGlvIHRyYWNrcy5cbiAgICogQG1lbWJlcm9mIE93dC5QMlAuUDJQQ2xpZW50Q29uZmlndXJhdGlvblxuICAgKi9cbiAgdGhpcy5hdWRpb0VuY29kaW5nID0gdW5kZWZpbmVkO1xuICAvKipcbiAgICogQG1lbWJlciB7P0FycmF5PE93dC5CYXNlLlZpZGVvRW5jb2RpbmdQYXJhbWV0ZXJzPn0gdmlkZW9FbmNvZGluZ1xuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgRW5jb2RpbmcgcGFyYW1ldGVycyBmb3IgcHVibGlzaGluZyB2aWRlbyB0cmFja3MuXG4gICAqIEBtZW1iZXJvZiBPd3QuUDJQLlAyUENsaWVudENvbmZpZ3VyYXRpb25cbiAgICovXG4gIHRoaXMudmlkZW9FbmNvZGluZyA9IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIEBtZW1iZXIgez9SVENDb25maWd1cmF0aW9ufSBydGNDb25maWd1cmF0aW9uXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgT3d0LlAyUC5QMlBDbGllbnRDb25maWd1cmF0aW9uXG4gICAqIEBkZXNjIEl0IHdpbGwgYmUgdXNlZCBmb3IgY3JlYXRpbmcgUGVlckNvbm5lY3Rpb24uXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93ZWJydGMvI3J0Y2NvbmZpZ3VyYXRpb24tZGljdGlvbmFyeXxSVENDb25maWd1cmF0aW9uIERpY3Rpb25hcnkgb2YgV2ViUlRDIDEuMH0uXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIEZvbGxvd2luZyBvYmplY3QgY2FuIGJlIHNldCB0byBwMnBDbGllbnRDb25maWd1cmF0aW9uLnJ0Y0NvbmZpZ3VyYXRpb24uXG4gICAqIHtcbiAgICogICBpY2VTZXJ2ZXJzOiBbe1xuICAgKiAgICAgIHVybHM6IFwic3R1bjpleGFtcGxlLmNvbTozNDc4XCJcbiAgICogICB9LCB7XG4gICAqICAgICB1cmxzOiBbXG4gICAqICAgICAgIFwidHVybjpleGFtcGxlLmNvbTozNDc4P3RyYW5zcG9ydD11ZHBcIixcbiAgICogICAgICAgXCJ0dXJuOmV4YW1wbGUuY29tOjM0Nzg/dHJhbnNwb3J0PXRjcFwiXG4gICAqICAgICBdLFxuICAgKiAgICAgIGNyZWRlbnRpYWw6IFwicGFzc3dvcmRcIixcbiAgICogICAgICB1c2VybmFtZTogXCJ1c2VybmFtZVwiXG4gICAqICAgfVxuICAgKiB9XG4gICAqL1xuICB0aGlzLnJ0Y0NvbmZpZ3VyYXRpb24gPSB1bmRlZmluZWQ7XG59O1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG4vKipcbiAqIEBjbGFzcyBQMlBDbGllbnRcbiAqIEBjbGFzc0Rlc2MgVGhlIFAyUENsaWVudCBoYW5kbGVzIFBlZXJDb25uZWN0aW9ucyBiZXR3ZWVuIGRpZmZlcmVudCBjbGllbnRzLlxuICogRXZlbnRzOlxuICpcbiAqIHwgRXZlbnQgTmFtZSAgICAgICAgICAgIHwgQXJndW1lbnQgVHlwZSAgICB8IEZpcmVkIHdoZW4gICAgICAgfFxuICogfCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLSB8XG4gKiB8IHN0cmVhbWFkZGVkICAgICAgICAgICB8IFN0cmVhbUV2ZW50ICAgICAgfCBBIG5ldyBzdHJlYW0gaXMgc2VudCBmcm9tIHJlbW90ZSBlbmRwb2ludC4gfFxuICogfCBtZXNzYWdlcmVjZWl2ZWQgICAgICAgfCBNZXNzYWdlRXZlbnQgICAgIHwgQSBuZXcgbWVzc2FnZSBpcyByZWNlaXZlZC4gfFxuICogfCBzZXJ2ZXJkaXNjb25uZWN0ZWQgICAgfCBPd3RFdmVudCAgICAgICAgIHwgRGlzY29ubmVjdGVkIGZyb20gc2lnbmFsaW5nIHNlcnZlci4gfFxuICpcbiAqIEBtZW1iZXJvZiBPd3QuUDJQXG4gKiBAZXh0ZW5kcyBPd3QuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHs/T3d0LlAyUC5QMlBDbGllbnRDb25maWd1cmF0aW9uIH0gY29uZmlndXJhdGlvbiBDb25maWd1cmF0aW9uIGZvciBPd3QuUDJQLlAyUENsaWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzaWduYWxpbmdDaGFubmVsIEEgY2hhbm5lbCBmb3Igc2VuZGluZyBhbmQgcmVjZWl2aW5nIHNpZ25hbGluZyBtZXNzYWdlcy5cbiAqL1xuY29uc3QgUDJQQ2xpZW50ID0gZnVuY3Rpb24oY29uZmlndXJhdGlvbiwgc2lnbmFsaW5nQ2hhbm5lbCkge1xuICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgbmV3IEV2ZW50RGlzcGF0Y2hlcigpKTtcbiAgY29uc3QgY29uZmlnID0gY29uZmlndXJhdGlvbjtcbiAgY29uc3Qgc2lnbmFsaW5nID0gc2lnbmFsaW5nQ2hhbm5lbDtcbiAgY29uc3QgY2hhbm5lbHMgPSBuZXcgTWFwKCk7IC8vIE1hcCBvZiBQZWVyQ29ubmVjdGlvbkNoYW5uZWxzLlxuICBjb25zdCBzZWxmPXRoaXM7XG4gIGxldCBzdGF0ZSA9IENvbm5lY3Rpb25TdGF0ZS5SRUFEWTtcbiAgbGV0IG15SWQ7XG5cbiAgc2lnbmFsaW5nLm9uTWVzc2FnZSA9IGZ1bmN0aW9uKG9yaWdpbiwgbWVzc2FnZSkge1xuICAgIExvZ2dlci5kZWJ1ZygnUmVjZWl2ZWQgc2lnbmFsaW5nIG1lc3NhZ2UgZnJvbSAnICsgb3JpZ2luICsgJzogJyArIG1lc3NhZ2UpO1xuICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKG1lc3NhZ2UpO1xuICAgIGlmIChkYXRhLnR5cGUgPT09ICdjaGF0LWNsb3NlZCcpIHtcbiAgICAgIGlmIChjaGFubmVscy5oYXMob3JpZ2luKSkge1xuICAgICAgICBnZXRPckNyZWF0ZUNoYW5uZWwob3JpZ2luKS5vbk1lc3NhZ2UoZGF0YSk7XG4gICAgICAgIGNoYW5uZWxzLmRlbGV0ZShvcmlnaW4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc2VsZi5hbGxvd2VkUmVtb3RlSWRzLmluZGV4T2Yob3JpZ2luKSA+PSAwKSB7XG4gICAgICBnZXRPckNyZWF0ZUNoYW5uZWwob3JpZ2luKS5vbk1lc3NhZ2UoZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbmRTaWduYWxpbmdNZXNzYWdlKG9yaWdpbiwgJ2NoYXQtY2xvc2VkJyxcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9ERU5JRUQpO1xuICAgIH1cbiAgfTtcblxuICBzaWduYWxpbmcub25TZXJ2ZXJEaXNjb25uZWN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICBzdGF0ZSA9IENvbm5lY3Rpb25TdGF0ZS5SRUFEWTtcbiAgICBzZWxmLmRpc3BhdGNoRXZlbnQobmV3IE93dEV2ZW50KCdzZXJ2ZXJkaXNjb25uZWN0ZWQnKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBtZW1iZXIge2FycmF5fSBhbGxvd2VkUmVtb3RlSWRzXG4gICAqIEBtZW1iZXJvZiBPd3QuUDJQLlAyUENsaWVudFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgT25seSBhbGxvd2VkIHJlbW90ZSBlbmRwb2ludCBJRHMgYXJlIGFibGUgdG8gcHVibGlzaCBzdHJlYW0gb3Igc2VuZCBtZXNzYWdlIHRvIGN1cnJlbnQgZW5kcG9pbnQuIFJlbW92aW5nIGFuIElEIGZyb20gYWxsb3dlZFJlbW90ZUlkcyBkb2VzIHN0b3AgZXhpc3RpbmcgY29ubmVjdGlvbiB3aXRoIGNlcnRhaW4gZW5kcG9pbnQuIFBsZWFzZSBjYWxsIHN0b3AgdG8gc3RvcCB0aGUgUGVlckNvbm5lY3Rpb24uXG4gICAqL1xuICB0aGlzLmFsbG93ZWRSZW1vdGVJZHM9W107XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBjb25uZWN0XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBDb25uZWN0IHRvIHNpZ25hbGluZyBzZXJ2ZXIuIFNpbmNlIHNpZ25hbGluZyBjYW4gYmUgY3VzdG9taXplZCwgdGhpcyBtZXRob2QgZG9lcyBub3QgZGVmaW5lIGhvdyBhIHRva2VuIGxvb2tzIGxpa2UuIFNESyBwYXNzZXMgdG9rZW4gdG8gc2lnbmFsaW5nIGNoYW5uZWwgd2l0aG91dCBjaGFuZ2VzLlxuICAgKiBAbWVtYmVyb2YgT3d0LlAyUC5QMlBDbGllbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIEEgdG9rZW4gZm9yIGNvbm5lY3RpbmcgdG8gc2lnbmFsaW5nIHNlcnZlci4gVGhlIGZvcm1hdCBvZiB0aGlzIHRva2VuIGRlcGVuZHMgb24gc2lnbmFsaW5nIHNlcnZlcidzIHJlcXVpcmVtZW50LlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPG9iamVjdCwgRXJyb3I+fSBJdCByZXR1cm5zIGEgcHJvbWlzZSByZXNvbHZlZCB3aXRoIGFuIG9iamVjdCByZXR1cm5lZCBieSBzaWduYWxpbmcgY2hhbm5lbCBvbmNlIHNpZ25hbGluZyBjaGFubmVsIHJlcG9ydHMgY29ubmVjdGlvbiBoYXMgYmVlbiBlc3RhYmxpc2hlZC5cbiAgICovXG4gIHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgaWYgKHN0YXRlID09PSBDb25uZWN0aW9uU3RhdGUuUkVBRFkpIHtcbiAgICAgIHN0YXRlID0gQ29ubmVjdGlvblN0YXRlLkNPTk5FQ1RJTkc7XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdJbnZhbGlkIGNvbm5lY3Rpb24gc3RhdGU6ICcgKyBzdGF0ZSk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKFxuICAgICAgICAgIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEUpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNpZ25hbGluZy5jb25uZWN0KHRva2VuKS50aGVuKChpZCkgPT4ge1xuICAgICAgICBteUlkID0gaWQ7XG4gICAgICAgIHN0YXRlID0gQ29ubmVjdGlvblN0YXRlLkNPTk5FQ1RFRDtcbiAgICAgICAgcmVzb2x2ZShteUlkKTtcbiAgICAgIH0sIChlcnJDb2RlKSA9PiB7XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZ2V0RXJyb3JCeUNvZGUoXG4gICAgICAgICAgICBlcnJDb2RlKSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBkaXNjb25uZWN0XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBEaXNjb25uZWN0IGZyb20gdGhlIHNpZ25hbGluZyBjaGFubmVsLiBJdCBzdG9wcyBhbGwgZXhpc3Rpbmcgc2Vzc2lvbnMgd2l0aCByZW1vdGUgZW5kcG9pbnRzLlxuICAgKiBAbWVtYmVyb2YgT3d0LlAyUC5QMlBDbGllbnRcbiAgICogQHJldHVybnMge1Byb21pc2U8dW5kZWZpbmVkLCBFcnJvcj59XG4gICAqL1xuICB0aGlzLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoc3RhdGUgPT0gQ29ubmVjdGlvblN0YXRlLlJFQURZKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoYW5uZWxzLmZvckVhY2goKGNoYW5uZWwpPT57XG4gICAgICBjaGFubmVsLnN0b3AoKTtcbiAgICB9KTtcbiAgICBjaGFubmVscy5jbGVhcigpO1xuICAgIHNpZ25hbGluZy5kaXNjb25uZWN0KCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBwdWJsaXNoXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBQdWJsaXNoIGEgc3RyZWFtIHRvIGEgcmVtb3RlIGVuZHBvaW50LlxuICAgKiBAbWVtYmVyb2YgT3d0LlAyUC5QMlBDbGllbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbW90ZUlkIFJlbW90ZSBlbmRwb2ludCdzIElELlxuICAgKiBAcGFyYW0ge093dC5CYXNlLkxvY2FsU3RyZWFtfSBzdHJlYW0gQW4gT3d0LkJhc2UuTG9jYWxTdHJlYW0gdG8gYmUgcHVibGlzaGVkLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPE93dC5CYXNlLlB1YmxpY2F0aW9uLCBFcnJvcj59IEEgcHJvbWlzZWQgdGhhdCByZXNvbHZlcyB3aGVuIHJlbW90ZSBzaWRlIHJlY2VpdmVkIHRoZSBjZXJ0YWluIHN0cmVhbS4gSG93ZXZlciwgcmVtb3RlIGVuZHBvaW50IG1heSBub3QgZGlzcGxheSB0aGlzIHN0cmVhbSwgb3IgaWdub3JlIGl0LlxuICAgKi9cbiAgdGhpcy5wdWJsaXNoID0gZnVuY3Rpb24ocmVtb3RlSWQsIHN0cmVhbSkge1xuICAgIGlmIChzdGF0ZSAhPT0gQ29ubmVjdGlvblN0YXRlLkNPTk5FQ1RFRCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFLFxuICAgICAgICAgICdQMlAgQ2xpZW50IGlzIG5vdCBjb25uZWN0ZWQgdG8gc2lnbmFsaW5nIGNoYW5uZWwuJykpO1xuICAgIH1cbiAgICBpZiAodGhpcy5hbGxvd2VkUmVtb3RlSWRzLmluZGV4T2YocmVtb3RlSWQpIDwgMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9OT1RfQUxMT1dFRCkpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGdldE9yQ3JlYXRlQ2hhbm5lbChyZW1vdGVJZCkucHVibGlzaChzdHJlYW0pKTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHNlbmRcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIFNlbmQgYSBtZXNzYWdlIHRvIHJlbW90ZSBlbmRwb2ludC5cbiAgICogQG1lbWJlcm9mIE93dC5QMlAuUDJQQ2xpZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZW1vdGVJZCBSZW1vdGUgZW5kcG9pbnQncyBJRC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgTWVzc2FnZSB0byBiZSBzZW50LiBJdCBzaG91bGQgYmUgYSBzdHJpbmcuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8dW5kZWZpbmVkLCBFcnJvcj59IEl0IHJldHVybnMgYSBwcm9taXNlIHJlc29sdmVkIHdoZW4gcmVtb3RlIGVuZHBvaW50IHJlY2VpdmVkIGNlcnRhaW4gbWVzc2FnZS5cbiAgICovXG4gIHRoaXMuc2VuZD1mdW5jdGlvbihyZW1vdGVJZCwgbWVzc2FnZSkge1xuICAgIGlmIChzdGF0ZSAhPT0gQ29ubmVjdGlvblN0YXRlLkNPTk5FQ1RFRCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFLFxuICAgICAgICAgICdQMlAgQ2xpZW50IGlzIG5vdCBjb25uZWN0ZWQgdG8gc2lnbmFsaW5nIGNoYW5uZWwuJykpO1xuICAgIH1cbiAgICBpZiAodGhpcy5hbGxvd2VkUmVtb3RlSWRzLmluZGV4T2YocmVtb3RlSWQpIDwgMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9OT1RfQUxMT1dFRCkpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGdldE9yQ3JlYXRlQ2hhbm5lbChyZW1vdGVJZCkuc2VuZChtZXNzYWdlKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBzdG9wXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBDbGVhbiBhbGwgcmVzb3VyY2VzIGFzc29jaWF0ZWQgd2l0aCBnaXZlbiByZW1vdGUgZW5kcG9pbnQuIEl0IG1heSBpbmNsdWRlIFJUQ1BlZXJDb25uZWN0aW9uLCBSVENSdHBUcmFuc2NlaXZlciBhbmQgUlRDRGF0YUNoYW5uZWwuIEl0IHN0aWxsIHBvc3NpYmxlIHRvIHB1Ymxpc2ggYSBzdHJlYW0sIG9yIHNlbmQgYSBtZXNzYWdlIHRvIGdpdmVuIHJlbW90ZSBlbmRwb2ludCBhZnRlciBzdG9wLlxuICAgKiBAbWVtYmVyb2YgT3d0LlAyUC5QMlBDbGllbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbW90ZUlkIFJlbW90ZSBlbmRwb2ludCdzIElELlxuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAqL1xuICB0aGlzLnN0b3AgPSBmdW5jdGlvbihyZW1vdGVJZCkge1xuICAgIGlmICghY2hhbm5lbHMuaGFzKHJlbW90ZUlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoXG4gICAgICAgICAgJ05vIFBlZXJDb25uZWN0aW9uIGJldHdlZW4gY3VycmVudCBlbmRwb2ludCBhbmQgc3BlY2lmaWMgcmVtb3RlICcgK1xuICAgICAgICAgICdlbmRwb2ludC4nXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaGFubmVscy5nZXQocmVtb3RlSWQpLnN0b3AoKTtcbiAgICBjaGFubmVscy5kZWxldGUocmVtb3RlSWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gZ2V0U3RhdHNcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIEdldCBzdGF0cyBvZiB1bmRlcmx5aW5nIFBlZXJDb25uZWN0aW9uLlxuICAgKiBAbWVtYmVyb2YgT3d0LlAyUC5QMlBDbGllbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbW90ZUlkIFJlbW90ZSBlbmRwb2ludCdzIElELlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPFJUQ1N0YXRzUmVwb3J0LCBFcnJvcj59IEl0IHJldHVybnMgYSBwcm9taXNlIHJlc29sdmVkIHdpdGggYW4gUlRDU3RhdHNSZXBvcnQgb3IgcmVqZWN0IHdpdGggYW4gRXJyb3IgaWYgdGhlcmUgaXMgbm8gY29ubmVjdGlvbiB3aXRoIHNwZWNpZmljIHVzZXIuXG4gICAqL1xuICB0aGlzLmdldFN0YXRzID0gZnVuY3Rpb24ocmVtb3RlSWQpIHtcbiAgICBpZiAoIWNoYW5uZWxzLmhhcyhyZW1vdGVJZCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoXG4gICAgICAgICAgRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfSU5WQUxJRF9TVEFURSxcbiAgICAgICAgICAnTm8gUGVlckNvbm5lY3Rpb24gYmV0d2VlbiBjdXJyZW50IGVuZHBvaW50IGFuZCBzcGVjaWZpYyByZW1vdGUgJyArXG4gICAgICAgICAgJ2VuZHBvaW50LicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoYW5uZWxzLmdldChyZW1vdGVJZCkuZ2V0U3RhdHMoKTtcbiAgfTtcblxuICBjb25zdCBzZW5kU2lnbmFsaW5nTWVzc2FnZSA9IGZ1bmN0aW9uKHJlbW90ZUlkLCB0eXBlLCBtZXNzYWdlKSB7XG4gICAgY29uc3QgbXNnID0ge1xuICAgICAgdHlwZTogdHlwZSxcbiAgICB9O1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBtc2cuZGF0YSA9IG1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiBzaWduYWxpbmcuc2VuZChyZW1vdGVJZCwgSlNPTi5zdHJpbmdpZnkobXNnKSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdGhyb3cgRXJyb3JNb2R1bGUuZ2V0RXJyb3JCeUNvZGUoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgZ2V0T3JDcmVhdGVDaGFubmVsID0gZnVuY3Rpb24ocmVtb3RlSWQpIHtcbiAgICBpZiAoIWNoYW5uZWxzLmhhcyhyZW1vdGVJZCkpIHtcbiAgICAgIC8vIENvbnN0cnVjdCBhbiBzaWduYWxpbmcgc2VuZGVyL3JlY2VpdmVyIGZvciBQMlBQZWVyQ29ubmVjdGlvbi5cbiAgICAgIGNvbnN0IHNpZ25hbGluZ0ZvckNoYW5uZWwgPSBPYmplY3QuY3JlYXRlKEV2ZW50RGlzcGF0Y2hlcik7XG4gICAgICBzaWduYWxpbmdGb3JDaGFubmVsLnNlbmRTaWduYWxpbmdNZXNzYWdlID0gc2VuZFNpZ25hbGluZ01lc3NhZ2U7XG4gICAgICBjb25zdCBwY2MgPSBuZXcgUDJQUGVlckNvbm5lY3Rpb25DaGFubmVsKGNvbmZpZywgbXlJZCwgcmVtb3RlSWQsXG4gICAgICAgICAgc2lnbmFsaW5nRm9yQ2hhbm5lbCk7XG4gICAgICBwY2MuYWRkRXZlbnRMaXN0ZW5lcignc3RyZWFtYWRkZWQnLCAoc3RyZWFtRXZlbnQpPT57XG4gICAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChzdHJlYW1FdmVudCk7XG4gICAgICB9KTtcbiAgICAgIHBjYy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlcmVjZWl2ZWQnLCAobWVzc2FnZUV2ZW50KT0+e1xuICAgICAgICBzZWxmLmRpc3BhdGNoRXZlbnQobWVzc2FnZUV2ZW50KTtcbiAgICAgIH0pO1xuICAgICAgcGNjLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCk9PntcbiAgICAgICAgY2hhbm5lbHMuZGVsZXRlKHJlbW90ZUlkKTtcbiAgICAgIH0pO1xuICAgICAgY2hhbm5lbHMuc2V0KHJlbW90ZUlkLCBwY2MpO1xuICAgIH1cbiAgICByZXR1cm4gY2hhbm5lbHMuZ2V0KHJlbW90ZUlkKTtcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFAyUENsaWVudDtcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuLy8gVGhpcyBmaWxlIGRvZXNuJ3QgaGF2ZSBwdWJsaWMgQVBJcy5cbi8qIGVzbGludC1kaXNhYmxlIHZhbGlkLWpzZG9jICovXG4vKiBlc2xpbnQtZGlzYWJsZSByZXF1aXJlLWpzZG9jICovXG4vKiBnbG9iYWwgRXZlbnQsIE1hcCwgUHJvbWlzZSwgUlRDSWNlQ2FuZGlkYXRlICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9iYXNlL2xvZ2dlci5qcyc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgTWVzc2FnZUV2ZW50LCBPd3RFdmVudH0gZnJvbSAnLi4vYmFzZS9ldmVudC5qcyc7XG5pbXBvcnQge1B1YmxpY2F0aW9ufSBmcm9tICcuLi9iYXNlL3B1YmxpY2F0aW9uLmpzJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL2Jhc2UvdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgRXJyb3JNb2R1bGUgZnJvbSAnLi9lcnJvci5qcyc7XG5pbXBvcnQgKiBhcyBTdHJlYW1Nb2R1bGUgZnJvbSAnLi4vYmFzZS9zdHJlYW0uanMnO1xuaW1wb3J0ICogYXMgU2RwVXRpbHMgZnJvbSAnLi4vYmFzZS9zZHB1dGlscy5qcyc7XG5cbi8qKlxuICogQGNsYXNzIFAyUFBlZXJDb25uZWN0aW9uQ2hhbm5lbEV2ZW50XG4gKiBAZGVzYyBFdmVudCBmb3IgU3RyZWFtLlxuICogQG1lbWJlck9mIE93dC5QMlBcbiAqIEBwcml2YXRlXG4gKiAqL1xuZXhwb3J0IGNsYXNzIFAyUFBlZXJDb25uZWN0aW9uQ2hhbm5lbEV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvYyAqL1xuICBjb25zdHJ1Y3Rvcihpbml0KSB7XG4gICAgc3VwZXIoaW5pdCk7XG4gICAgdGhpcy5zdHJlYW0gPSBpbml0LnN0cmVhbTtcbiAgfVxufVxuXG5jb25zdCBEYXRhQ2hhbm5lbExhYmVsID0ge1xuICBNRVNTQUdFOiAnbWVzc2FnZScsXG4gIEZJTEU6ICdmaWxlJyxcbn07XG5cbmNvbnN0IFNpZ25hbGluZ1R5cGUgPSB7XG4gIERFTklFRDogJ2NoYXQtZGVuaWVkJyxcbiAgQ0xPU0VEOiAnY2hhdC1jbG9zZWQnLFxuICBORUdPVElBVElPTl9ORUVERUQ6ICdjaGF0LW5lZ290aWF0aW9uLW5lZWRlZCcsXG4gIFRSQUNLX1NPVVJDRVM6ICdjaGF0LXRyYWNrLXNvdXJjZXMnLFxuICBTVFJFQU1fSU5GTzogJ2NoYXQtc3RyZWFtLWluZm8nLFxuICBTRFA6ICdjaGF0LXNpZ25hbCcsXG4gIFRSQUNLU19BRERFRDogJ2NoYXQtdHJhY2tzLWFkZGVkJyxcbiAgVFJBQ0tTX1JFTU9WRUQ6ICdjaGF0LXRyYWNrcy1yZW1vdmVkJyxcbiAgREFUQV9SRUNFSVZFRDogJ2NoYXQtZGF0YS1yZWNlaXZlZCcsXG4gIFVBOiAnY2hhdC11YScsXG59O1xuXG5jb25zdCBzeXNJbmZvID0gVXRpbHMuc3lzSW5mbygpO1xuXG4vKipcbiAqIEBjbGFzcyBQMlBQZWVyQ29ubmVjdGlvbkNoYW5uZWxcbiAqIEBkZXNjIEEgUDJQUGVlckNvbm5lY3Rpb25DaGFubmVsIGhhbmRsZXMgYWxsIGludGVyYWN0aW9ucyBiZXR3ZWVuIHRoaXMgZW5kcG9pbnQgYW5kIGEgcmVtb3RlIGVuZHBvaW50LlxuICogQG1lbWJlck9mIE93dC5QMlBcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFAyUFBlZXJDb25uZWN0aW9uQ2hhbm5lbCBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIC8vIHxzaWduYWxpbmd8IGlzIGFuIG9iamVjdCBoYXMgYSBtZXRob2QgfHNlbmRTaWduYWxpbmdNZXNzYWdlfC5cbiAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2MgKi9cbiAgY29uc3RydWN0b3IoY29uZmlnLCBsb2NhbElkLCByZW1vdGVJZCwgc2lnbmFsaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5fbG9jYWxJZCA9IGxvY2FsSWQ7XG4gICAgdGhpcy5fcmVtb3RlSWQgPSByZW1vdGVJZDtcbiAgICB0aGlzLl9zaWduYWxpbmcgPSBzaWduYWxpbmc7XG4gICAgdGhpcy5fcGMgPSBudWxsO1xuICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbXMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBzdHJlYW1zIHB1Ymxpc2hlZCwgdmFsdWUgaXMgaXRzIHB1YmxpY2F0aW9uLlxuICAgIHRoaXMuX3BlbmRpbmdTdHJlYW1zID0gW107IC8vIFN0cmVhbXMgZ29pbmcgdG8gYmUgYWRkZWQgdG8gUGVlckNvbm5lY3Rpb24uXG4gICAgdGhpcy5fcHVibGlzaGluZ1N0cmVhbXMgPSBbXTsgLy8gU3RyZWFtcyBoYXZlIGJlZW4gYWRkZWQgdG8gUGVlckNvbm5lY3Rpb24sIGJ1dCBkb2VzIG5vdCByZWNlaXZlIGFjayBmcm9tIHJlbW90ZSBzaWRlLlxuICAgIHRoaXMuX3BlbmRpbmdVbnB1Ymxpc2hTdHJlYW1zID0gW107IC8vIFN0cmVhbXMgZ29pbmcgdG8gYmUgcmVtb3ZlZC5cbiAgICAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgYW4gb2JqZWN0IHtzb3VyY2U6e2F1ZGlvOnN0cmluZywgdmlkZW86c3RyaW5nfSwgYXR0cmlidXRlczogb2JqZWN0LCBzdHJlYW06IFJlbW90ZVN0cmVhbSwgbWVkaWFTdHJlYW06IE1lZGlhU3RyZWFtfS4gYHN0cmVhbWAgYW5kIGBtZWRpYVN0cmVhbWAgd2lsbCBiZSBzZXQgd2hlbiBgdHJhY2tgIGV2ZW50IGlzIGZpcmVkIG9uIGBSVENQZWVyQ29ubmVjdGlvbmAuIGBtZWRpYVN0cmVhbWAgd2lsbCBiZSBgbnVsbGAgYWZ0ZXIgYHN0cmVhbWFkZGVkYCBldmVudCBpcyBmaXJlZCBvbiBgUDJQQ2xpZW50YC4gT3RoZXIgcHJvcGVydGVzIHdpbGwgYmUgc2V0IHVwb24gYFNUUkVBTV9JTkZPYCBldmVudCBmcm9tIHNpZ25hbGluZyBjaGFubmVsLlxuICAgIHRoaXMuX3JlbW90ZVN0cmVhbUluZm8gPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fcmVtb3RlU3RyZWFtcyA9IFtdO1xuICAgIHRoaXMuX3JlbW90ZVRyYWNrU291cmNlSW5mbyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIE1lZGlhU3RyZWFtVHJhY2sncyBJRCwgdmFsdWUgaXMgc291cmNlIGluZm8uXG4gICAgdGhpcy5fcHVibGlzaFByb21pc2VzID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgYW4gb2JqZWN0IGhhcyB8cmVzb2x2ZXwgYW5kIHxyZWplY3R8LlxuICAgIHRoaXMuX3VucHVibGlzaFByb21pc2VzID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgYW4gb2JqZWN0IGhhcyB8cmVzb2x2ZXwgYW5kIHxyZWplY3R8LlxuICAgIHRoaXMuX3B1Ymxpc2hpbmdTdHJlYW1UcmFja3MgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBNZWRpYVN0cmVhbSdzIElELCB2YWx1ZSBpcyBhbiBhcnJheSBvZiB0aGUgSUQgb2YgaXRzIE1lZGlhU3RyZWFtVHJhY2tzIHRoYXQgaGF2ZW4ndCBiZWVuIGFja2VkLlxuICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbVRyYWNrcyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIE1lZGlhU3RyZWFtJ3MgSUQsIHZhbHVlIGlzIGFuIGFycmF5IG9mIHRoZSBJRCBvZiBpdHMgTWVkaWFTdHJlYW1UcmFja3MgdGhhdCBoYXZlbid0IGJlZW4gcmVtb3ZlZC5cbiAgICB0aGlzLl9pc05lZ290aWF0aW9uTmVlZGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzUmVtb3ZlU3RyZWFtID0gdHJ1ZTtcbiAgICB0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNQbGFuQiA9IHRydWU7XG4gICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzVW5pZmllZFBsYW4gPSB0cnVlO1xuICAgIHRoaXMuX3JlbW90ZUljZUNhbmRpZGF0ZXMgPSBbXTtcbiAgICB0aGlzLl9kYXRhQ2hhbm5lbHMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBkYXRhIGNoYW5uZWwncyBsYWJlbCwgdmFsdWUgaXMgYSBSVENEYXRhQ2hhbm5lbC5cbiAgICB0aGlzLl9wZW5kaW5nTWVzc2FnZXMgPSBbXTtcbiAgICB0aGlzLl9kYXRhU2VxID0gMTsgLy8gU2VxdWVuY2UgbnVtYmVyIGZvciBkYXRhIGNoYW5uZWwgbWVzc2FnZXMuXG4gICAgdGhpcy5fc2VuZERhdGFQcm9taXNlcyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIGRhdGEgc2VxdWVuY2UgbnVtYmVyLCB2YWx1ZSBpcyBhbiBvYmplY3QgaGFzIHxyZXNvbHZlfCBhbmQgfHJlamVjdHwuXG4gICAgdGhpcy5fYWRkZWRUcmFja0lkcyA9IFtdOyAvLyBUcmFja3MgdGhhdCBoYXZlIGJlZW4gYWRkZWQgYWZ0ZXIgcmVjZWl2aW5nIHJlbW90ZSBTRFAgYnV0IGJlZm9yZSBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkLiBEcmFpbmluZyB0aGVzZSBtZXNzYWdlcyB3aGVuIElDRSBjb25uZWN0aW9uIHN0YXRlIGlzIGNvbm5lY3RlZC5cbiAgICB0aGlzLl9pc0NhbGxlciA9IHRydWU7XG4gICAgdGhpcy5faW5mb1NlbnQgPSBmYWxzZTtcbiAgICB0aGlzLl9kaXNwb3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2NyZWF0ZVBlZXJDb25uZWN0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHB1Ymxpc2hcbiAgICogQGRlc2MgUHVibGlzaCBhIHN0cmVhbSB0byB0aGUgcmVtb3RlIGVuZHBvaW50LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHVibGlzaChzdHJlYW0pIHtcbiAgICBpZiAoIShzdHJlYW0gaW5zdGFuY2VvZiBTdHJlYW1Nb2R1bGUuTG9jYWxTdHJlYW0pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignSW52YWxpZCBzdHJlYW0uJykpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcHVibGlzaGVkU3RyZWFtcy5oYXMoc3RyZWFtKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTExFR0FMX0FSR1VNRU5ULFxuICAgICAgICAgICdEdXBsaWNhdGVkIHN0cmVhbS4nKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9hcmVBbGxUcmFja3NFbmRlZChzdHJlYW0ubWVkaWFTdHJlYW0pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKFxuICAgICAgICAgIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEUsXG4gICAgICAgICAgJ0FsbCB0cmFja3MgYXJlIGVuZGVkLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFt0aGlzLl9zZW5kQ2xvc2VkTXNnSWZOZWNlc3NhcnkoKSxcbiAgICAgIHRoaXMuX3NlbmRTeXNJbmZvSWZOZWNlc3NhcnkoKSxcbiAgICAgIHRoaXMuX3NlbmRTdHJlYW1JbmZvKHN0cmVhbSldKS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIFJlcGxhY2UgfGFkZFN0cmVhbXwgd2l0aCBQZWVyQ29ubmVjdGlvbi5hZGRUcmFjayB3aGVuIGFsbCBicm93c2VycyBhcmUgcmVhZHkuXG4gICAgICAgIGZvciAoY29uc3QgdHJhY2sgb2Ygc3RyZWFtLm1lZGlhU3RyZWFtLmdldFRyYWNrcygpKSB7XG4gICAgICAgICAgdGhpcy5fcGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbS5tZWRpYVN0cmVhbSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb25OZWdvdGlhdGlvbm5lZWRlZCgpO1xuICAgICAgICB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtcy5wdXNoKHN0cmVhbSk7XG4gICAgICAgIGNvbnN0IHRyYWNrSWRzID0gQXJyYXkuZnJvbShzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VHJhY2tzKCksXG4gICAgICAgICAgICAodHJhY2spID0+IHRyYWNrLmlkKTtcbiAgICAgICAgdGhpcy5fcHVibGlzaGluZ1N0cmVhbVRyYWNrcy5zZXQoc3RyZWFtLm1lZGlhU3RyZWFtLmlkLFxuICAgICAgICAgICAgdHJhY2tJZHMpO1xuICAgICAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZXMuc2V0KHN0cmVhbS5tZWRpYVN0cmVhbS5pZCwge1xuICAgICAgICAgIHJlc29sdmU6IHJlc29sdmUsXG4gICAgICAgICAgcmVqZWN0OiByZWplY3QsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHNlbmRcbiAgICogQGRlc2MgU2VuZCBhIG1lc3NhZ2UgdG8gdGhlIHJlbW90ZSBlbmRwb2ludC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbmQobWVzc2FnZSkge1xuICAgIGlmICghKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJykpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG1lc3NhZ2UuJykpO1xuICAgIH1cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgaWQ6IHRoaXMuX2RhdGFTZXErKyxcbiAgICAgIGRhdGE6IG1lc3NhZ2UsXG4gICAgfTtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fc2VuZERhdGFQcm9taXNlcy5zZXQoZGF0YS5pZCwge1xuICAgICAgICByZXNvbHZlOiByZXNvbHZlLFxuICAgICAgICByZWplY3Q6IHJlamVjdCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmICghdGhpcy5fZGF0YUNoYW5uZWxzLmhhcyhEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpKSB7XG4gICAgICB0aGlzLl9jcmVhdGVEYXRhQ2hhbm5lbChEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpO1xuICAgIH1cblxuICAgIHRoaXMuX3NlbmRDbG9zZWRNc2dJZk5lY2Vzc2FyeSgpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnRmFpbGVkIHRvIHNlbmQgY2xvc2VkIG1lc3NhZ2UuJyArIGVyci5tZXNzYWdlKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3NlbmRTeXNJbmZvSWZOZWNlc3NhcnkoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBMb2dnZXIuZGVidWcoJ0ZhaWxlZCB0byBzZW5kIHN5c0luZm8uJyArIGVyci5tZXNzYWdlKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGRjID0gdGhpcy5fZGF0YUNoYW5uZWxzLmdldChEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpO1xuICAgIGlmIChkYy5yZWFkeVN0YXRlID09PSAnb3BlbicpIHtcbiAgICAgIHRoaXMuX2RhdGFDaGFubmVscy5nZXQoRGF0YUNoYW5uZWxMYWJlbC5NRVNTQUdFKS5zZW5kKFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcGVuZGluZ01lc3NhZ2VzLnB1c2goZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBzdG9wXG4gICAqIEBkZXNjIFN0b3AgdGhlIGNvbm5lY3Rpb24gd2l0aCByZW1vdGUgZW5kcG9pbnQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuX3N0b3AodW5kZWZpbmVkLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gZ2V0U3RhdHNcbiAgICogQGRlc2MgR2V0IHN0YXRzIGZvciBhIHNwZWNpZmljIE1lZGlhU3RyZWFtLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0U3RhdHMobWVkaWFTdHJlYW0pIHtcbiAgICBpZiAodGhpcy5fcGMpIHtcbiAgICAgIGlmIChtZWRpYVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYy5nZXRTdGF0cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdHJhY2tzU3RhdHNSZXBvcnRzID0gW107XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbbWVkaWFTdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgICB0aGlzLl9nZXRTdGF0cyh0cmFjaywgdHJhY2tzU3RhdHNSZXBvcnRzKTtcbiAgICAgICAgfSldKS50aGVuKFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJhY2tzU3RhdHNSZXBvcnRzKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFKSk7XG4gICAgfVxuICB9XG5cbiAgX2dldFN0YXRzKG1lZGlhU3RyZWFtVHJhY2ssIHJlcG9ydHNSZXN1bHQpIHtcbiAgICByZXR1cm4gdGhpcy5fcGMuZ2V0U3RhdHMobWVkaWFTdHJlYW1UcmFjaykudGhlbihcbiAgICAgICAgKHN0YXRzUmVwb3J0KSA9PiB7XG4gICAgICAgICAgcmVwb3J0c1Jlc3VsdC5wdXNoKHN0YXRzUmVwb3J0KTtcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uIG9uTWVzc2FnZVxuICAgKiBAZGVzYyBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgUDJQQ2xpZW50IHdoZW4gdGhlcmUgaXMgbmV3IHNpZ25hbGluZyBtZXNzYWdlIGFycml2ZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvbk1lc3NhZ2UobWVzc2FnZSkge1xuICAgIHRoaXMuX1NpZ25hbGluZ01lc3NzYWdlSGFuZGxlcihtZXNzYWdlKTtcbiAgfVxuXG4gIF9zZW5kU2RwKHNkcCkge1xuICAgIHJldHVybiB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoXG4gICAgICAgIHRoaXMuX3JlbW90ZUlkLCBTaWduYWxpbmdUeXBlLlNEUCwgc2RwKTtcbiAgfVxuXG4gIF9zZW5kU2lnbmFsaW5nTWVzc2FnZSh0eXBlLCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSh0aGlzLl9yZW1vdGVJZCwgdHlwZSwgbWVzc2FnZSk7XG4gIH1cblxuICBfU2lnbmFsaW5nTWVzc3NhZ2VIYW5kbGVyKG1lc3NhZ2UpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0NoYW5uZWwgcmVjZWl2ZWQgbWVzc2FnZTogJyArIG1lc3NhZ2UpO1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuVUE6XG4gICAgICAgIHRoaXMuX2hhbmRsZVJlbW90ZUNhcGFiaWxpdHkobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgdGhpcy5fc2VuZFN5c0luZm9JZk5lY2Vzc2FyeSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5UUkFDS19TT1VSQ0VTOlxuICAgICAgICB0aGlzLl90cmFja1NvdXJjZXNIYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTaWduYWxpbmdUeXBlLlNUUkVBTV9JTkZPOlxuICAgICAgICB0aGlzLl9zdHJlYW1JbmZvSGFuZGxlcihtZXNzYWdlLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5TRFA6XG4gICAgICAgIHRoaXMuX3NkcEhhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuVFJBQ0tTX0FEREVEOlxuICAgICAgICB0aGlzLl90cmFja3NBZGRlZEhhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuVFJBQ0tTX1JFTU9WRUQ6XG4gICAgICAgIHRoaXMuX3RyYWNrc1JlbW92ZWRIYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTaWduYWxpbmdUeXBlLkRBVEFfUkVDRUlWRUQ6XG4gICAgICAgIHRoaXMuX2RhdGFSZWNlaXZlZEhhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuQ0xPU0VEOlxuICAgICAgICB0aGlzLl9jaGF0Q2xvc2VkSGFuZGxlcihtZXNzYWdlLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIExvZ2dlci5lcnJvcignSW52YWxpZCBzaWduYWxpbmcgbWVzc2FnZSByZWNlaXZlZC4gVHlwZTogJyArXG4gICAgICAgICAgICBtZXNzYWdlLnR5cGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gX3RyYWNrc0FkZGVkSGFuZGxlclxuICAgKiBAZGVzYyBIYW5kbGUgdHJhY2sgYWRkZWQgZXZlbnQgZnJvbSByZW1vdGUgc2lkZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90cmFja3NBZGRlZEhhbmRsZXIoaWRzKSB7XG4gICAgLy8gQ3VycmVudGx5LCB8aWRzfCBjb250YWlucyBhbGwgdHJhY2sgSURzIG9mIGEgTWVkaWFTdHJlYW0uIEZvbGxvd2luZyBhbGdvcml0aG0gYWxzbyBoYW5kbGVzIHxpZHN8IGlzIGEgcGFydCBvZiBhIE1lZGlhU3RyZWFtJ3MgdHJhY2tzLlxuICAgIGZvciAoY29uc3QgaWQgb2YgaWRzKSB7XG4gICAgICAvLyBJdCBjb3VsZCBiZSBhIHByb2JsZW0gaWYgdGhlcmUgaXMgYSB0cmFjayBwdWJsaXNoZWQgd2l0aCBkaWZmZXJlbnQgTWVkaWFTdHJlYW1zLlxuICAgICAgdGhpcy5fcHVibGlzaGluZ1N0cmVhbVRyYWNrcy5mb3JFYWNoKChtZWRpYVRyYWNrSWRzLCBtZWRpYVN0cmVhbUlkKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVkaWFUcmFja0lkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChtZWRpYVRyYWNrSWRzW2ldID09PSBpZCkge1xuICAgICAgICAgICAgLy8gTW92ZSB0aGlzIHRyYWNrIGZyb20gcHVibGlzaGluZyB0cmFja3MgdG8gcHVibGlzaGVkIHRyYWNrcy5cbiAgICAgICAgICAgIGlmICghdGhpcy5fcHVibGlzaGVkU3RyZWFtVHJhY2tzLmhhcyhtZWRpYVN0cmVhbUlkKSkge1xuICAgICAgICAgICAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW1UcmFja3Muc2V0KG1lZGlhU3RyZWFtSWQsIFtdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbVRyYWNrcy5nZXQobWVkaWFTdHJlYW1JZCkucHVzaChcbiAgICAgICAgICAgICAgICBtZWRpYVRyYWNrSWRzW2ldKTtcbiAgICAgICAgICAgIG1lZGlhVHJhY2tJZHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBSZXNvbHZpbmcgY2VydGFpbiBwdWJsaXNoIHByb21pc2Ugd2hlbiByZW1vdGUgZW5kcG9pbnQgcmVjZWl2ZWQgYWxsIHRyYWNrcyBvZiBhIE1lZGlhU3RyZWFtLlxuICAgICAgICAgIGlmIChtZWRpYVRyYWNrSWRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3B1Ymxpc2hQcm9taXNlcy5oYXMobWVkaWFTdHJlYW1JZCkpIHtcbiAgICAgICAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHRoZSBwcm9taXNlIGZvciBwdWJsaXNoaW5nICcgK1xuICAgICAgICAgICAgICAgIG1lZGlhU3RyZWFtSWQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFN0cmVhbUluZGV4ID0gdGhpcy5fcHVibGlzaGluZ1N0cmVhbXMuZmluZEluZGV4KFxuICAgICAgICAgICAgICAgIChlbGVtZW50KSA9PiBlbGVtZW50Lm1lZGlhU3RyZWFtLmlkID09IG1lZGlhU3RyZWFtSWQpO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0U3RyZWFtID0gdGhpcy5fcHVibGlzaGluZ1N0cmVhbXNbdGFyZ2V0U3RyZWFtSW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5fcHVibGlzaGluZ1N0cmVhbXMuc3BsaWNlKHRhcmdldFN0cmVhbUluZGV4LCAxKTtcbiAgICAgICAgICAgIGNvbnN0IHB1YmxpY2F0aW9uID0gbmV3IFB1YmxpY2F0aW9uKFxuICAgICAgICAgICAgICAgIGlkLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl91bnB1Ymxpc2godGFyZ2V0U3RyZWFtKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcHVibGljYXRpb24uZGlzcGF0Y2hFdmVudChuZXcgT3d0RXZlbnQoJ2VuZGVkJykpO1xuICAgICAgICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgLy8gVXNlIGRlYnVnIG1vZGUgYmVjYXVzZSB0aGlzIGVycm9yIHVzdWFsbHkgZG9lc24ndCBibG9jayBzdG9wcGluZyBhIHB1YmxpY2F0aW9uLlxuICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZGVidWcoXG4gICAgICAgICAgICAgICAgICAgICAgICAnU29tZXRoaW5nIHdyb25nIGhhcHBlbmVkIGR1cmluZyBzdG9wcGluZyBhICcrXG4gICAgICAgICAgICAgICAgICAgICAgICAncHVibGljYXRpb24uICcgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldFN0cmVhbSB8fCAhdGFyZ2V0U3RyZWFtLm1lZGlhU3RyZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1B1YmxpY2F0aW9uIGlzIG5vdCBhdmFpbGFibGUuJykpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdHModGFyZ2V0U3RyZWFtLm1lZGlhU3RyZWFtKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbXMuc2V0KHRhcmdldFN0cmVhbSwgcHVibGljYXRpb24pO1xuICAgICAgICAgICAgdGhpcy5fcHVibGlzaFByb21pc2VzLmdldChtZWRpYVN0cmVhbUlkKS5yZXNvbHZlKHB1YmxpY2F0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlcy5kZWxldGUobWVkaWFTdHJlYW1JZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uIF90cmFja3NSZW1vdmVkSGFuZGxlclxuICAgKiBAZGVzYyBIYW5kbGUgdHJhY2sgcmVtb3ZlZCBldmVudCBmcm9tIHJlbW90ZSBzaWRlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3RyYWNrc1JlbW92ZWRIYW5kbGVyKGlkcykge1xuICAgIC8vIEN1cnJlbnRseSwgfGlkc3wgY29udGFpbnMgYWxsIHRyYWNrIElEcyBvZiBhIE1lZGlhU3RyZWFtLiBGb2xsb3dpbmcgYWxnb3JpdGhtIGFsc28gaGFuZGxlcyB8aWRzfCBpcyBhIHBhcnQgb2YgYSBNZWRpYVN0cmVhbSdzIHRyYWNrcy5cbiAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcykge1xuICAgICAgLy8gSXQgY291bGQgYmUgYSBwcm9ibGVtIGlmIHRoZXJlIGlzIGEgdHJhY2sgcHVibGlzaGVkIHdpdGggZGlmZmVyZW50IE1lZGlhU3RyZWFtcy5cbiAgICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbVRyYWNrcy5mb3JFYWNoKChtZWRpYVRyYWNrSWRzLCBtZWRpYVN0cmVhbUlkKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVkaWFUcmFja0lkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChtZWRpYVRyYWNrSWRzW2ldID09PSBpZCkge1xuICAgICAgICAgICAgbWVkaWFUcmFja0lkcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uIF9kYXRhUmVjZWl2ZWRIYW5kbGVyXG4gICAqIEBkZXNjIEhhbmRsZSBkYXRhIHJlY2VpdmVkIGV2ZW50IGZyb20gcmVtb3RlIHNpZGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGF0YVJlY2VpdmVkSGFuZGxlcihpZCkge1xuICAgIGlmICghdGhpcy5fc2VuZERhdGFQcm9taXNlcy5oYXMoaWQpKSB7XG4gICAgICBMb2dnZXIud2FybmluZygnUmVjZWl2ZWQgdW5rbm93biBkYXRhIHJlY2VpdmVkIG1lc3NhZ2UuIElEOiAnICsgaWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZW5kRGF0YVByb21pc2VzLmdldChpZCkucmVzb2x2ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gX3NkcEhhbmRsZXJcbiAgICogQGRlc2MgSGFuZGxlIFNEUCByZWNlaXZlZCBldmVudCBmcm9tIHJlbW90ZSBzaWRlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3NkcEhhbmRsZXIoc2RwKSB7XG4gICAgaWYgKHNkcC50eXBlID09PSAnb2ZmZXInKSB7XG4gICAgICB0aGlzLl9vbk9mZmVyKHNkcCk7XG4gICAgfSBlbHNlIGlmIChzZHAudHlwZSA9PT0gJ2Fuc3dlcicpIHtcbiAgICAgIHRoaXMuX29uQW5zd2VyKHNkcCk7XG4gICAgfSBlbHNlIGlmIChzZHAudHlwZSA9PT0gJ2NhbmRpZGF0ZXMnKSB7XG4gICAgICB0aGlzLl9vblJlbW90ZUljZUNhbmRpZGF0ZShzZHApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gX3RyYWNrU291cmNlc0hhbmRsZXJcbiAgICogQGRlc2MgUmVjZWl2ZWQgdHJhY2sgc291cmNlIGluZm9ybWF0aW9uIGZyb20gcmVtb3RlIHNpZGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdHJhY2tTb3VyY2VzSGFuZGxlcihkYXRhKSB7XG4gICAgZm9yIChjb25zdCBpbmZvIG9mIGRhdGEpIHtcbiAgICAgIHRoaXMuX3JlbW90ZVRyYWNrU291cmNlSW5mby5zZXQoaW5mby5pZCwgaW5mby5zb3VyY2UpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gX3N0cmVhbUluZm9IYW5kbGVyXG4gICAqIEBkZXNjIFJlY2VpdmVkIHN0cmVhbSBpbmZvcm1hdGlvbiBmcm9tIHJlbW90ZSBzaWRlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3N0cmVhbUluZm9IYW5kbGVyKGRhdGEpIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdVbmV4cGVjdGVkIHN0cmVhbSBpbmZvLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLnNldChkYXRhLmlkLCB7XG4gICAgICBzb3VyY2U6IGRhdGEuc291cmNlLFxuICAgICAgYXR0cmlidXRlczogZGF0YS5hdHRyaWJ1dGVzLFxuICAgICAgc3RyZWFtOiBudWxsLFxuICAgICAgbWVkaWFTdHJlYW06IG51bGwsXG4gICAgICB0cmFja0lkczogZGF0YS50cmFja3MsIC8vIFRyYWNrIElEcyBtYXkgbm90IG1hdGNoIGF0IHNlbmRlciBhbmQgcmVjZWl2ZXIgc2lkZXMuIEtlZXAgaXQgZm9yIGxlZ2FjeSBwb3Jwb3Nlcy5cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gX2NoYXRDbG9zZWRIYW5kbGVyXG4gICAqIEBkZXNjIFJlY2VpdmVkIGNoYXQgY2xvc2VkIGV2ZW50IGZyb20gcmVtb3RlIHNpZGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2hhdENsb3NlZEhhbmRsZXIoZGF0YSkge1xuICAgIHRoaXMuX2Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICB0aGlzLl9zdG9wKGRhdGEsIGZhbHNlKTtcbiAgfVxuXG4gIF9vbk9mZmVyKHNkcCkge1xuICAgIExvZ2dlci5kZWJ1ZygnQWJvdXQgdG8gc2V0IHJlbW90ZSBkZXNjcmlwdGlvbi4gU2lnbmFsaW5nIHN0YXRlOiAnICtcbiAgICAgIHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlKTtcbiAgICBzZHAuc2RwID0gdGhpcy5fc2V0UnRwU2VuZGVyT3B0aW9ucyhzZHAuc2RwLCB0aGlzLl9jb25maWcpO1xuICAgIC8vIEZpcmVmb3ggb25seSBoYXMgb25lIGNvZGVjIGluIGFuc3dlciwgd2hpY2ggZG9lcyBub3QgdHJ1bHkgcmVmbGVjdCBpdHNcbiAgICAvLyBkZWNvZGluZyBjYXBhYmlsaXR5LiBTbyB3ZSBzZXQgY29kZWMgcHJlZmVyZW5jZSB0byByZW1vdGUgb2ZmZXIsIGFuZCBsZXRcbiAgICAvLyBGaXJlZm94IGNob29zZSBpdHMgcHJlZmVycmVkIGNvZGVjLlxuICAgIC8vIFJlZmVyZW5jZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9ODE0MjI3LlxuICAgIGlmIChVdGlscy5pc0ZpcmVmb3goKSkge1xuICAgICAgc2RwLnNkcCA9IHRoaXMuX3NldENvZGVjT3JkZXIoc2RwLnNkcCk7XG4gICAgfVxuICAgIGNvbnN0IHNlc3Npb25EZXNjcmlwdGlvbiA9IG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKTtcbiAgICB0aGlzLl9wYy5zZXRSZW1vdGVEZXNjcmlwdGlvbihzZXNzaW9uRGVzY3JpcHRpb24pLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5fY3JlYXRlQW5kU2VuZEFuc3dlcigpO1xuICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdTZXQgcmVtb3RlIGRlc2NyaXB0aW9uIGZhaWxlZC4gTWVzc2FnZTogJyArIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgdGhpcy5fc3RvcChlcnJvciwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBfb25BbnN3ZXIoc2RwKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdBYm91dCB0byBzZXQgcmVtb3RlIGRlc2NyaXB0aW9uLiBTaWduYWxpbmcgc3RhdGU6ICcgK1xuICAgICAgdGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUpO1xuICAgIHNkcC5zZHAgPSB0aGlzLl9zZXRSdHBTZW5kZXJPcHRpb25zKHNkcC5zZHAsIHRoaXMuX2NvbmZpZyk7XG4gICAgY29uc3Qgc2Vzc2lvbkRlc2NyaXB0aW9uID0gbmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApO1xuICAgIHRoaXMuX3BjLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oXG4gICAgICAgIHNlc3Npb25EZXNjcmlwdGlvbikpLnRoZW4oKCkgPT4ge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdTZXQgcmVtb3RlIGRlc2NyaXBpdG9uIHN1Y2Nlc3NmdWxseS4nKTtcbiAgICAgIHRoaXMuX2RyYWluUGVuZGluZ01lc3NhZ2VzKCk7XG4gICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICBMb2dnZXIuZGVidWcoJ1NldCByZW1vdGUgZGVzY3JpcHRpb24gZmFpbGVkLiBNZXNzYWdlOiAnICsgZXJyb3IubWVzc2FnZSk7XG4gICAgICB0aGlzLl9zdG9wKGVycm9yLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9vbkxvY2FsSWNlQ2FuZGlkYXRlKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmNhbmRpZGF0ZSkge1xuICAgICAgdGhpcy5fc2VuZFNkcCh7XG4gICAgICAgIHR5cGU6ICdjYW5kaWRhdGVzJyxcbiAgICAgICAgY2FuZGlkYXRlOiBldmVudC5jYW5kaWRhdGUuY2FuZGlkYXRlLFxuICAgICAgICBzZHBNaWQ6IGV2ZW50LmNhbmRpZGF0ZS5zZHBNaWQsXG4gICAgICAgIHNkcE1MaW5lSW5kZXg6IGV2ZW50LmNhbmRpZGF0ZS5zZHBNTGluZUluZGV4LFxuICAgICAgfSkuY2F0Y2goKGUpPT57XG4gICAgICAgIExvZ2dlci53YXJuaW5nKCdGYWlsZWQgdG8gc2VuZCBjYW5kaWRhdGUuJyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdFbXB0eSBjYW5kaWRhdGUuJyk7XG4gICAgfVxuICB9XG5cbiAgX29uUmVtb3RlVHJhY2tBZGRlZChldmVudCkge1xuICAgIExvZ2dlci5kZWJ1ZygnUmVtb3RlIHRyYWNrIGFkZGVkLicpO1xuICAgIGZvciAoY29uc3Qgc3RyZWFtIG9mIGV2ZW50LnN0cmVhbXMpIHtcbiAgICAgIGlmICghdGhpcy5fcmVtb3RlU3RyZWFtSW5mby5oYXMoc3RyZWFtLmlkKSkge1xuICAgICAgICBMb2dnZXIud2FybmluZygnTWlzc2luZyBzdHJlYW0gaW5mby4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChzdHJlYW0uaWQpLnN0cmVhbSkge1xuICAgICAgICB0aGlzLl9zZXRTdHJlYW1Ub1JlbW90ZVN0cmVhbUluZm8oc3RyZWFtKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuX3BjLmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nvbm5lY3RlZCcgfHxcbiAgICAgICB0aGlzLl9wYy5pY2VDb25uZWN0aW9uU3RhdGUgPT09ICdjb21wbGV0ZWQnKSB7XG4gICAgICB0aGlzLl9jaGVja0ljZUNvbm5lY3Rpb25TdGF0ZUFuZEZpcmVFdmVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hZGRlZFRyYWNrSWRzLmNvbmNhdChldmVudC50cmFjay5pZCk7XG4gICAgfVxuICB9XG5cbiAgX29uUmVtb3RlU3RyZWFtQWRkZWQoZXZlbnQpIHtcbiAgICBMb2dnZXIuZGVidWcoJ1JlbW90ZSBzdHJlYW0gYWRkZWQuJyk7XG4gICAgaWYgKCF0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmhhcyhldmVudC5zdHJlYW0uaWQpKSB7XG4gICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgc291cmNlIGluZm8gZm9yIHN0cmVhbSAnICsgZXZlbnQuc3RyZWFtLmlkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3BjLmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nvbm5lY3RlZCcgfHxcbiAgICAgIHRoaXMuX3BjLmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2NvbXBsZXRlZCcpIHtcbiAgICAgIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuVFJBQ0tTX0FEREVELFxuICAgICAgICAgIHRoaXMuX3JlbW90ZVN0cmVhbUluZm8uZ2V0KGV2ZW50LnN0cmVhbS5pZCkudHJhY2tJZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hZGRlZFRyYWNrSWRzID0gdGhpcy5fYWRkZWRUcmFja0lkcy5jb25jYXQoXG4gICAgICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtSW5mby5nZXQoZXZlbnQuc3RyZWFtLmlkKS50cmFja0lkcyk7XG4gICAgfVxuICAgIGNvbnN0IGF1ZGlvVHJhY2tTb3VyY2UgPSB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChldmVudC5zdHJlYW0uaWQpXG4gICAgICAgIC5zb3VyY2UuYXVkaW87XG4gICAgY29uc3QgdmlkZW9UcmFja1NvdXJjZSA9IHRoaXMuX3JlbW90ZVN0cmVhbUluZm8uZ2V0KGV2ZW50LnN0cmVhbS5pZClcbiAgICAgICAgLnNvdXJjZS52aWRlbztcbiAgICBjb25zdCBzb3VyY2VJbmZvID0gbmV3IFN0cmVhbU1vZHVsZS5TdHJlYW1Tb3VyY2VJbmZvKGF1ZGlvVHJhY2tTb3VyY2UsXG4gICAgICAgIHZpZGVvVHJhY2tTb3VyY2UpO1xuICAgIGlmIChVdGlscy5pc1NhZmFyaSgpKSB7XG4gICAgICBpZiAoIXNvdXJjZUluZm8uYXVkaW8pIHtcbiAgICAgICAgZXZlbnQuc3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgICBldmVudC5zdHJlYW0ucmVtb3ZlVHJhY2sodHJhY2spO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghc291cmNlSW5mby52aWRlbykge1xuICAgICAgICBldmVudC5zdHJlYW0uZ2V0VmlkZW9UcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICAgIGV2ZW50LnN0cmVhbS5yZW1vdmVUcmFjayh0cmFjayk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5fcmVtb3RlU3RyZWFtSW5mby5nZXQoZXZlbnQuc3RyZWFtLmlkKS5hdHRyaWJ1dGVzO1xuICAgIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW1Nb2R1bGUuUmVtb3RlU3RyZWFtKHVuZGVmaW5lZCwgdGhpcy5fcmVtb3RlSWQsXG4gICAgICAgIGV2ZW50LnN0cmVhbSwgc291cmNlSW5mbywgYXR0cmlidXRlcyk7XG4gICAgaWYgKHN0cmVhbSkge1xuICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtcy5wdXNoKHN0cmVhbSk7XG4gICAgICBjb25zdCBzdHJlYW1FdmVudCA9IG5ldyBTdHJlYW1Nb2R1bGUuU3RyZWFtRXZlbnQoJ3N0cmVhbWFkZGVkJywge1xuICAgICAgICBzdHJlYW06IHN0cmVhbSxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHN0cmVhbUV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBfb25SZW1vdGVTdHJlYW1SZW1vdmVkKGV2ZW50KSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdSZW1vdGUgc3RyZWFtIHJlbW92ZWQuJyk7XG4gICAgY29uc3QgaSA9IHRoaXMuX3JlbW90ZVN0cmVhbXMuZmluZEluZGV4KChzKSA9PiB7XG4gICAgICByZXR1cm4gcy5tZWRpYVN0cmVhbS5pZCA9PT0gZXZlbnQuc3RyZWFtLmlkO1xuICAgIH0pO1xuICAgIGlmIChpICE9PSAtMSkge1xuICAgICAgY29uc3Qgc3RyZWFtID0gdGhpcy5fcmVtb3RlU3RyZWFtc1tpXTtcbiAgICAgIHRoaXMuX3N0cmVhbVJlbW92ZWQoc3RyZWFtKTtcbiAgICAgIHRoaXMuX3JlbW90ZVN0cmVhbXMuc3BsaWNlKGksIDEpO1xuICAgIH1cbiAgfVxuXG4gIF9vbk5lZ290aWF0aW9ubmVlZGVkKCkge1xuICAgIC8vIFRoaXMgaXMgaW50ZW50ZWQgdG8gYmUgZXhlY3V0ZWQgd2hlbiBvbm5lZ290aWF0aW9ubmVlZGVkIGV2ZW50IGlzIGZpcmVkLlxuICAgIC8vIEhvd2V2ZXIsIG9ubmVnb3RpYXRpb25uZWVkZWQgbWF5IGZpcmUgbXV0aXBsZSB0aW1lcyB3aGVuIG1vcmUgdGhhbiBvbmVcbiAgICAvLyB0cmFjayBpcyBhZGRlZC9yZW1vdmVkLiBTbyB3ZSBtYW51YWxseSBleGVjdXRlIHRoaXMgZnVuY3Rpb24gYWZ0ZXJcbiAgICAvLyBhZGRpbmcvcmVtb3ZpbmcgdHJhY2sgYW5kIGNyZWF0aW5nIGRhdGEgY2hhbm5lbC5cbiAgICBMb2dnZXIuZGVidWcoJ09uIG5lZ290aWF0aW9uIG5lZWRlZC4nKTtcblxuICAgIGlmICh0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSA9PT0gJ3N0YWJsZScpIHtcbiAgICAgIHRoaXMuX2RvTmVnb3RpYXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2lzTmVnb3RpYXRpb25OZWVkZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIF9vblJlbW90ZUljZUNhbmRpZGF0ZShjYW5kaWRhdGVJbmZvKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlID0gbmV3IFJUQ0ljZUNhbmRpZGF0ZSh7XG4gICAgICBjYW5kaWRhdGU6IGNhbmRpZGF0ZUluZm8uY2FuZGlkYXRlLFxuICAgICAgc2RwTWlkOiBjYW5kaWRhdGVJbmZvLnNkcE1pZCxcbiAgICAgIHNkcE1MaW5lSW5kZXg6IGNhbmRpZGF0ZUluZm8uc2RwTUxpbmVJbmRleCxcbiAgICB9KTtcbiAgICBpZiAodGhpcy5fcGMucmVtb3RlRGVzY3JpcHRpb24gJiYgdGhpcy5fcGMucmVtb3RlRGVzY3JpcHRpb24uc2RwICE9PSAnJykge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdBZGQgcmVtb3RlIGljZSBjYW5kaWRhdGVzLicpO1xuICAgICAgdGhpcy5fcGMuYWRkSWNlQ2FuZGlkYXRlKGNhbmRpZGF0ZSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIExvZ2dlci53YXJuaW5nKCdFcnJvciBwcm9jZXNzaW5nIElDRSBjYW5kaWRhdGU6ICcgKyBlcnJvcik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdDYWNoZSByZW1vdGUgaWNlIGNhbmRpZGF0ZXMuJyk7XG4gICAgICB0aGlzLl9yZW1vdGVJY2VDYW5kaWRhdGVzLnB1c2goY2FuZGlkYXRlKTtcbiAgICB9XG4gIH1cblxuICBfb25TaWduYWxpbmdTdGF0ZUNoYW5nZShldmVudCkge1xuICAgIExvZ2dlci5kZWJ1ZygnU2lnbmFsaW5nIHN0YXRlIGNoYW5nZWQ6ICcgKyB0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSk7XG4gICAgaWYgKHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlID09PSAnY2xvc2VkJykge1xuICAgICAgLy8gc3RvcENoYXRMb2NhbGx5KHBlZXIsIHBlZXIuaWQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgPT09ICdzdGFibGUnKSB7XG4gICAgICB0aGlzLl9uZWdvdGlhdGluZyA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMuX2lzTmVnb3RpYXRpb25OZWVkZWQpIHtcbiAgICAgICAgdGhpcy5fb25OZWdvdGlhdGlvbm5lZWRlZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZHJhaW5QZW5kaW5nU3RyZWFtcygpO1xuICAgICAgICB0aGlzLl9kcmFpblBlbmRpbmdNZXNzYWdlcygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgPT09ICdoYXZlLXJlbW90ZS1vZmZlcicpIHtcbiAgICAgIHRoaXMuX2RyYWluUGVuZGluZ1JlbW90ZUljZUNhbmRpZGF0ZXMoKTtcbiAgICB9XG4gIH1cblxuICBfb25JY2VDb25uZWN0aW9uU3RhdGVDaGFuZ2UoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuY3VycmVudFRhcmdldC5pY2VDb25uZWN0aW9uU3RhdGUgPT09ICdjbG9zZWQnIHx8XG4gICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuaWNlQ29ubmVjdGlvblN0YXRlID09PSAnZmFpbGVkJykge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoXG4gICAgICAgICAgRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9XRUJSVENfVU5LTk9XTixcbiAgICAgICAgICAnSUNFIGNvbm5lY3Rpb24gZmFpbGVkIG9yIGNsb3NlZC4nKTtcbiAgICAgIHRoaXMuX3N0b3AoZXJyb3IsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQuY3VycmVudFRhcmdldC5pY2VDb25uZWN0aW9uU3RhdGUgPT09ICdjb25uZWN0ZWQnIHx8XG4gICAgICBldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2NvbXBsZXRlZCcpIHtcbiAgICAgIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuVFJBQ0tTX0FEREVELFxuICAgICAgICAgIHRoaXMuX2FkZGVkVHJhY2tJZHMpO1xuICAgICAgdGhpcy5fYWRkZWRUcmFja0lkcyA9IFtdO1xuICAgICAgdGhpcy5fY2hlY2tJY2VDb25uZWN0aW9uU3RhdGVBbmRGaXJlRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICBfb25EYXRhQ2hhbm5lbE1lc3NhZ2UoZXZlbnQpIHtcbiAgICBjb25zdCBtZXNzYWdlPUpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgTG9nZ2VyLmRlYnVnKCdEYXRhIGNoYW5uZWwgbWVzc2FnZSByZWNlaXZlZDogJyttZXNzYWdlLmRhdGEpO1xuICAgIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuREFUQV9SRUNFSVZFRCwgbWVzc2FnZS5pZCk7XG4gICAgY29uc3QgbWVzc2FnZUV2ZW50ID0gbmV3IE1lc3NhZ2VFdmVudCgnbWVzc2FnZXJlY2VpdmVkJywge1xuICAgICAgbWVzc2FnZTogbWVzc2FnZS5kYXRhLFxuICAgICAgb3JpZ2luOiB0aGlzLl9yZW1vdGVJZCxcbiAgICB9KTtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQobWVzc2FnZUV2ZW50KTtcbiAgfVxuXG4gIF9vbkRhdGFDaGFubmVsT3BlbihldmVudCkge1xuICAgIExvZ2dlci5kZWJ1ZygnRGF0YSBDaGFubmVsIGlzIG9wZW5lZC4nKTtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmxhYmVsID09PSBEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpIHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnRGF0YSBjaGFubmVsIGZvciBtZXNzYWdlcyBpcyBvcGVuZWQuJyk7XG4gICAgICB0aGlzLl9kcmFpblBlbmRpbmdNZXNzYWdlcygpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkRhdGFDaGFubmVsQ2xvc2UoZXZlbnQpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0RhdGEgQ2hhbm5lbCBpcyBjbG9zZWQuJyk7XG4gIH1cblxuICBfc3RyZWFtUmVtb3ZlZChzdHJlYW0pIHtcbiAgICBpZiAoIXRoaXMuX3JlbW90ZVN0cmVhbUluZm8uaGFzKHN0cmVhbS5tZWRpYVN0cmVhbS5pZCkpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdDYW5ub3QgZmluZCBzdHJlYW0gaW5mby4nKTtcbiAgICB9XG4gICAgdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5UUkFDS1NfUkVNT1ZFRCxcbiAgICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtSW5mby5nZXQoc3RyZWFtLm1lZGlhU3RyZWFtLmlkKS50cmFja0lkcyk7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgT3d0RXZlbnQoJ2VuZGVkJyk7XG4gICAgc3RyZWFtLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgX2lzVW5pZmllZFBsYW4oKSB7XG4gICAgaWYgKFV0aWxzLmlzRmlyZWZveCgpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgcGMgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgc2RwU2VtYW50aWNzOiAndW5pZmllZC1wbGFuJyxcbiAgICB9KTtcbiAgICByZXR1cm4gKHBjLmdldENvbmZpZ3VyYXRpb24oKSAmJiBwYy5nZXRDb25maWd1cmF0aW9uKCkuc2RwU2VtYW50aWNzID09PVxuICAgICAgJ3BsYW4tYicpO1xuICB9XG5cbiAgX2NyZWF0ZVBlZXJDb25uZWN0aW9uKCkge1xuICAgIGNvbnN0IHBjQ29uZmlndXJhdGlvbiA9IHRoaXMuX2NvbmZpZy5ydGNDb25maWd1cmF0aW9uIHx8IHt9O1xuICAgIGlmIChVdGlscy5pc0Nocm9tZSgpKSB7XG4gICAgICBwY0NvbmZpZ3VyYXRpb24uc2RwU2VtYW50aWNzID0gJ3VuaWZpZWQtcGxhbic7XG4gICAgfVxuICAgIHRoaXMuX3BjID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHBjQ29uZmlndXJhdGlvbik7XG4gICAgLy8gRmlyZWZveCA1OSBpbXBsZW1lbnRlZCBhZGRUcmFuc2NlaXZlci4gSG93ZXZlciwgbWlkIGluIFNEUCB3aWxsIGRpZmZlciBmcm9tIHRyYWNrJ3MgSUQgaW4gdGhpcyBjYXNlLiBBbmQgdHJhbnNjZWl2ZXIncyBtaWQgaXMgbnVsbC5cbiAgICBpZiAodHlwZW9mIHRoaXMuX3BjLmFkZFRyYW5zY2VpdmVyID09PSAnZnVuY3Rpb24nICYmIFV0aWxzLmlzU2FmYXJpKCkpIHtcbiAgICAgIHRoaXMuX3BjLmFkZFRyYW5zY2VpdmVyKCdhdWRpbycpO1xuICAgICAgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ3ZpZGVvJyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5faXNVbmlmaWVkUGxhbigpICYmICFVdGlscy5pc1NhZmFyaSgpKSB7XG4gICAgICB0aGlzLl9wYy5vbmFkZHN0cmVhbSA9IChldmVudCkgPT4ge1xuICAgICAgICAvLyBUT0RPOiBMZWdhY3kgQVBJLCBzaG91bGQgYmUgcmVtb3ZlZCB3aGVuIGFsbCBVQXMgaW1wbGVtZW50ZWQgV2ViUlRDIDEuMC5cbiAgICAgICAgdGhpcy5fb25SZW1vdGVTdHJlYW1BZGRlZC5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICAgIH07XG4gICAgICB0aGlzLl9wYy5vbnJlbW92ZXN0cmVhbSA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLl9vblJlbW90ZVN0cmVhbVJlbW92ZWQuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9wYy5vbnRyYWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuX29uUmVtb3RlVHJhY2tBZGRlZC5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMuX3BjLm9uaWNlY2FuZGlkYXRlID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vbkxvY2FsSWNlQ2FuZGlkYXRlLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgdGhpcy5fcGMub25zaWduYWxpbmdzdGF0ZWNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25TaWduYWxpbmdTdGF0ZUNoYW5nZS5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICB9O1xuICAgIHRoaXMuX3BjLm9uZGF0YWNoYW5uZWwgPSAoZXZlbnQpID0+IHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnT24gZGF0YSBjaGFubmVsLicpO1xuICAgICAgLy8gU2F2ZSByZW1vdGUgY3JlYXRlZCBkYXRhIGNoYW5uZWwuXG4gICAgICBpZiAoIXRoaXMuX2RhdGFDaGFubmVscy5oYXMoZXZlbnQuY2hhbm5lbC5sYWJlbCkpIHtcbiAgICAgICAgdGhpcy5fZGF0YUNoYW5uZWxzLnNldChldmVudC5jaGFubmVsLmxhYmVsLCBldmVudC5jaGFubmVsKTtcbiAgICAgICAgTG9nZ2VyLmRlYnVnKCdTYXZlIHJlbW90ZSBjcmVhdGVkIGRhdGEgY2hhbm5lbC4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2JpbmRFdmVudHNUb0RhdGFDaGFubmVsKGV2ZW50LmNoYW5uZWwpO1xuICAgIH07XG4gICAgdGhpcy5fcGMub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uSWNlQ29ubmVjdGlvblN0YXRlQ2hhbmdlLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgLypcbiAgICB0aGlzLl9wYy5vbmljZUNoYW5uZWxTdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBfb25JY2VDaGFubmVsU3RhdGVDaGFuZ2UocGVlciwgZXZlbnQpO1xuICAgIH07XG4gICAgID0gZnVuY3Rpb24oKSB7XG4gICAgICBvbk5lZ290aWF0aW9ubmVlZGVkKHBlZXJzW3BlZXIuaWRdKTtcbiAgICB9O1xuXG4gICAgLy9EYXRhQ2hhbm5lbFxuICAgIHRoaXMuX3BjLm9uZGF0YWNoYW5uZWwgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgTG9nZ2VyLmRlYnVnKG15SWQgKyAnOiBPbiBkYXRhIGNoYW5uZWwnKTtcbiAgICAgIC8vIFNhdmUgcmVtb3RlIGNyZWF0ZWQgZGF0YSBjaGFubmVsLlxuICAgICAgaWYgKCFwZWVyLmRhdGFDaGFubmVsc1tldmVudC5jaGFubmVsLmxhYmVsXSkge1xuICAgICAgICBwZWVyLmRhdGFDaGFubmVsc1tldmVudC5jaGFubmVsLmxhYmVsXSA9IGV2ZW50LmNoYW5uZWw7XG4gICAgICAgIExvZ2dlci5kZWJ1ZygnU2F2ZSByZW1vdGUgY3JlYXRlZCBkYXRhIGNoYW5uZWwuJyk7XG4gICAgICB9XG4gICAgICBiaW5kRXZlbnRzVG9EYXRhQ2hhbm5lbChldmVudC5jaGFubmVsLCBwZWVyKTtcbiAgICB9OyovXG4gIH1cblxuICBfZHJhaW5QZW5kaW5nU3RyZWFtcygpIHtcbiAgICBsZXQgbmVnb3RpYXRpb25OZWVkZWQgPSBmYWxzZTtcbiAgICBMb2dnZXIuZGVidWcoJ0RyYWluaW5nIHBlbmRpbmcgc3RyZWFtcy4nKTtcbiAgICBpZiAodGhpcy5fcGMgJiYgdGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgPT09ICdzdGFibGUnKSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ1BlZXIgY29ubmVjdGlvbiBpcyByZWFkeSBmb3IgZHJhaW5pbmcgcGVuZGluZyBzdHJlYW1zLicpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9wZW5kaW5nU3RyZWFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzdHJlYW0gPSB0aGlzLl9wZW5kaW5nU3RyZWFtc1tpXTtcbiAgICAgICAgLy8gT25OZWdvdGlhdGlvbk5lZWRlZCBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBpbW1lZGlhdGVseSBhZnRlciBhZGRpbmcgc3RyZWFtIHRvIFBlZXJDb25uZWN0aW9uIGluIEZpcmVmb3guXG4gICAgICAgIC8vIEFuZCBPbk5lZ290aWF0aW9uTmVlZGVkIGhhbmRsZXIgd2lsbCBleGVjdXRlIGRyYWluUGVuZGluZ1N0cmVhbXMuIFRvIGF2b2lkIGFkZCB0aGUgc2FtZSBzdHJlYW0gbXVsdGlwbGUgdGltZXMsXG4gICAgICAgIC8vIHNoaWZ0IGl0IGZyb20gcGVuZGluZyBzdHJlYW0gbGlzdCBiZWZvcmUgYWRkaW5nIGl0IHRvIFBlZXJDb25uZWN0aW9uLlxuICAgICAgICB0aGlzLl9wZW5kaW5nU3RyZWFtcy5zaGlmdCgpO1xuICAgICAgICBpZiAoIXN0cmVhbS5tZWRpYVN0cmVhbSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgdHJhY2sgb2Ygc3RyZWFtLm1lZGlhU3RyZWFtLmdldFRyYWNrcygpKSB7XG4gICAgICAgICAgdGhpcy5fcGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbS5tZWRpYVN0cmVhbSk7XG4gICAgICAgICAgbmVnb3RpYXRpb25OZWVkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIExvZ2dlci5kZWJ1ZygnQWRkZWQgc3RyZWFtIHRvIHBlZXIgY29ubmVjdGlvbi4nKTtcbiAgICAgICAgdGhpcy5fcHVibGlzaGluZ1N0cmVhbXMucHVzaChzdHJlYW0pO1xuICAgICAgfVxuICAgICAgdGhpcy5fcGVuZGluZ1N0cmVhbXMubGVuZ3RoID0gMDtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5fcGVuZGluZ1VucHVibGlzaFN0cmVhbXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKCF0aGlzLl9wZW5kaW5nVW5wdWJsaXNoU3RyZWFtc1tqXS5tZWRpYVN0cmVhbSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BjLnJlbW92ZVN0cmVhbSh0aGlzLl9wZW5kaW5nVW5wdWJsaXNoU3RyZWFtc1tqXS5tZWRpYVN0cmVhbSk7XG4gICAgICAgIG5lZ290aWF0aW9uTmVlZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fdW5wdWJsaXNoUHJvbWlzZXMuZ2V0KFxuICAgICAgICAgICAgdGhpcy5fcGVuZGluZ1VucHVibGlzaFN0cmVhbXNbal0ubWVkaWFTdHJlYW0uaWQpLnJlc29sdmUoKTtcbiAgICAgICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtcy5kZWxldGUodGhpcy5fcGVuZGluZ1VucHVibGlzaFN0cmVhbXNbal0pO1xuICAgICAgICBMb2dnZXIuZGVidWcoJ1JlbW92ZSBzdHJlYW0uJyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wZW5kaW5nVW5wdWJsaXNoU3RyZWFtcy5sZW5ndGggPSAwO1xuICAgIH1cbiAgICBpZiAobmVnb3RpYXRpb25OZWVkZWQpIHtcbiAgICAgIHRoaXMuX29uTmVnb3RpYXRpb25uZWVkZWQoKTtcbiAgICB9XG4gIH1cblxuICBfZHJhaW5QZW5kaW5nUmVtb3RlSWNlQ2FuZGlkYXRlcygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3JlbW90ZUljZUNhbmRpZGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnQWRkIGNhbmRpZGF0ZScpO1xuICAgICAgdGhpcy5fcGMuYWRkSWNlQ2FuZGlkYXRlKHRoaXMuX3JlbW90ZUljZUNhbmRpZGF0ZXNbaV0pLmNhdGNoKChlcnJvcik9PntcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Vycm9yIHByb2Nlc3NpbmcgSUNFIGNhbmRpZGF0ZTogJytlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5fcmVtb3RlSWNlQ2FuZGlkYXRlcy5sZW5ndGggPSAwO1xuICB9XG5cbiAgX2RyYWluUGVuZGluZ01lc3NhZ2VzKCkge1xuICAgIExvZ2dlci5kZWJ1ZygnRHJhaW5pbmcgcGVuZGluZyBtZXNzYWdlcy4nKTtcbiAgICBpZiAodGhpcy5fcGVuZGluZ01lc3NhZ2VzLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGRjID0gdGhpcy5fZGF0YUNoYW5uZWxzLmdldChEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpO1xuICAgIGlmIChkYyAmJiBkYy5yZWFkeVN0YXRlID09PSAnb3BlbicpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fcGVuZGluZ01lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIExvZ2dlci5kZWJ1ZygnU2VuZGluZyBtZXNzYWdlIHZpYSBkYXRhIGNoYW5uZWw6ICcrdGhpcy5fcGVuZGluZ01lc3NhZ2VzW2ldKTtcbiAgICAgICAgZGMuc2VuZChKU09OLnN0cmluZ2lmeSh0aGlzLl9wZW5kaW5nTWVzc2FnZXNbaV0pKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3BlbmRpbmdNZXNzYWdlcy5sZW5ndGggPSAwO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fcGMgJiYgIWRjKSB7XG4gICAgICB0aGlzLl9jcmVhdGVEYXRhQ2hhbm5lbChEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpO1xuICAgIH1cbiAgfVxuXG4gIF9zZW5kU3RyZWFtSW5mbyhzdHJlYW0pIHtcbiAgICBpZiAoIXN0cmVhbSB8fCAhc3RyZWFtLm1lZGlhU3RyZWFtKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lMTEVHQUxfQVJHVU1FTlQpO1xuICAgIH1cbiAgICBjb25zdCBpbmZvID0gW107XG4gICAgc3RyZWFtLm1lZGlhU3RyZWFtLmdldFRyYWNrcygpLm1hcCgodHJhY2spID0+IHtcbiAgICAgIGluZm8ucHVzaCh7XG4gICAgICAgIGlkOiB0cmFjay5pZCxcbiAgICAgICAgc291cmNlOiBzdHJlYW0uc291cmNlW3RyYWNrLmtpbmRdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFt0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLlRSQUNLX1NPVVJDRVMsXG4gICAgICAgIGluZm8pLFxuICAgIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuU1RSRUFNX0lORk8sIHtcbiAgICAgIGlkOiBzdHJlYW0ubWVkaWFTdHJlYW0uaWQsXG4gICAgICBhdHRyaWJ1dGVzOiBzdHJlYW0uYXR0cmlidXRlcyxcbiAgICAgIC8vIFRyYWNrIElEcyBtYXkgbm90IG1hdGNoIGF0IHNlbmRlciBhbmQgcmVjZWl2ZXIgc2lkZXMuXG4gICAgICB0cmFja3M6IEFycmF5LmZyb20oaW5mbywgKGl0ZW0pID0+IGl0ZW0uaWQpLFxuICAgICAgLy8gVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIFNhZmFyaS4gUGxlYXNlIHVzZSB0cmFjay1zb3VyY2VzIGlmIHBvc3NpYmxlLlxuICAgICAgc291cmNlOiBzdHJlYW0uc291cmNlLFxuICAgIH0pLFxuICAgIF0pO1xuICB9XG5cblxuICBfc2VuZFN5c0luZm9JZk5lY2Vzc2FyeSgpIHtcbiAgICBpZiAodGhpcy5faW5mb1NlbnQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgdGhpcy5faW5mb1NlbnQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLlVBLCBzeXNJbmZvKTtcbiAgfVxuXG4gIF9zZW5kQ2xvc2VkTXNnSWZOZWNlc3NhcnkoKSB7XG4gICAgaWYgKHRoaXMuX3BjLnJlbW90ZURlc2NyaXB0aW9uID09PSBudWxsIHx8XG4gICAgICAgIHRoaXMuX3BjLnJlbW90ZURlc2NyaXB0aW9uLnNkcCA9PT0gJycpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLkNMT1NFRCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIF9oYW5kbGVSZW1vdGVDYXBhYmlsaXR5KHVhKSB7XG4gICAgaWYgKHVhLnNkayAmJiB1YS5zZGsgJiYgdWEuc2RrLnR5cGUgPT09ICdKYXZhU2NyaXB0JyAmJiB1YS5ydW50aW1lICYmXG4gICAgICAgIHVhLnJ1bnRpbWUubmFtZSA9PT0gJ0ZpcmVmb3gnKSB7XG4gICAgICB0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNSZW1vdmVTdHJlYW0gPSBmYWxzZTtcbiAgICAgIHRoaXMuX3JlbW90ZVNpZGVTdXBwb3J0c1BsYW5CID0gZmFsc2U7XG4gICAgICB0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNVbmlmaWVkUGxhbiA9IHRydWU7XG4gICAgfSBlbHNlIHsgLy8gUmVtb3RlIHNpZGUgaXMgaU9TL0FuZHJvaWQvQysrIHdoaWNoIHVzZXMgR29vZ2xlJ3MgV2ViUlRDIHN0YWNrLlxuICAgICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzUmVtb3ZlU3RyZWFtID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3JlbW90ZVNpZGVTdXBwb3J0c1BsYW5CID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3JlbW90ZVNpZGVTdXBwb3J0c1VuaWZpZWRQbGFuID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgX2RvTmVnb3RpYXRlKCkge1xuICAgIHRoaXMuX2NyZWF0ZUFuZFNlbmRPZmZlcigpO1xuICB9XG5cbiAgX3NldENvZGVjT3JkZXIoc2RwKSB7XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5hdWRpb0VuY29kaW5ncykge1xuICAgICAgY29uc3QgYXVkaW9Db2RlY05hbWVzID0gQXJyYXkuZnJvbSh0aGlzLl9jb25maWcuYXVkaW9FbmNvZGluZ3MsXG4gICAgICAgICAgKGVuY29kaW5nUGFyYW1ldGVycykgPT4gZW5jb2RpbmdQYXJhbWV0ZXJzLmNvZGVjLm5hbWUpO1xuICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICdhdWRpbycsIGF1ZGlvQ29kZWNOYW1lcyk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9jb25maWcudmlkZW9FbmNvZGluZ3MpIHtcbiAgICAgIGNvbnN0IHZpZGVvQ29kZWNOYW1lcyA9IEFycmF5LmZyb20odGhpcy5fY29uZmlnLnZpZGVvRW5jb2RpbmdzLFxuICAgICAgICAgIChlbmNvZGluZ1BhcmFtZXRlcnMpID0+IGVuY29kaW5nUGFyYW1ldGVycy5jb2RlYy5uYW1lKTtcbiAgICAgIHNkcCA9IFNkcFV0aWxzLnJlb3JkZXJDb2RlY3Moc2RwLCAndmlkZW8nLCB2aWRlb0NvZGVjTmFtZXMpO1xuICAgIH1cbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgX3NldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmF1ZGlvRW5jb2RpbmdzID09PSAnb2JqZWN0Jykge1xuICAgICAgc2RwID0gU2RwVXRpbHMuc2V0TWF4Qml0cmF0ZShzZHAsIG9wdGlvbnMuYXVkaW9FbmNvZGluZ3MpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudmlkZW9FbmNvZGluZ3MgPT09ICdvYmplY3QnKSB7XG4gICAgICBzZHAgPSBTZHBVdGlscy5zZXRNYXhCaXRyYXRlKHNkcCwgb3B0aW9ucy52aWRlb0VuY29kaW5ncyk7XG4gICAgfVxuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBfc2V0UnRwU2VuZGVyT3B0aW9ucyhzZHAsIG9wdGlvbnMpIHtcbiAgICBzZHAgPSB0aGlzLl9zZXRNYXhCaXRyYXRlKHNkcCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIF9zZXRSdHBSZWNlaXZlck9wdGlvbnMoc2RwKSB7XG4gICAgc2RwID0gdGhpcy5fc2V0Q29kZWNPcmRlcihzZHApO1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBfY3JlYXRlQW5kU2VuZE9mZmVyKCkge1xuICAgIGlmICghdGhpcy5fcGMpIHtcbiAgICAgIExvZ2dlci5lcnJvcignUGVlciBjb25uZWN0aW9uIGhhdmUgbm90IGJlZW4gY3JlYXRlZC4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5faXNOZWdvdGlhdGlvbk5lZWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2lzQ2FsbGVyID0gdHJ1ZTtcbiAgICBsZXQgbG9jYWxEZXNjO1xuICAgIHRoaXMuX3BjLmNyZWF0ZU9mZmVyKCkudGhlbigoZGVzYykgPT4ge1xuICAgICAgZGVzYy5zZHAgPSB0aGlzLl9zZXRSdHBSZWNlaXZlck9wdGlvbnMoZGVzYy5zZHApO1xuICAgICAgbG9jYWxEZXNjID0gZGVzYztcbiAgICAgIGlmKHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlPT09J3N0YWJsZScpe1xuICAgICAgICByZXR1cm4gdGhpcy5fcGMuc2V0TG9jYWxEZXNjcmlwdGlvbihkZXNjKS50aGVuKCgpPT57XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbmRTZHAobG9jYWxEZXNjKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIExvZ2dlci5lcnJvcihlLm1lc3NhZ2UgKyAnIFBsZWFzZSBjaGVjayB5b3VyIGNvZGVjIHNldHRpbmdzLicpO1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9XRUJSVENfU0RQLFxuICAgICAgICAgIGUubWVzc2FnZSk7XG4gICAgICB0aGlzLl9zdG9wKGVycm9yLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9jcmVhdGVBbmRTZW5kQW5zd2VyKCkge1xuICAgIHRoaXMuX2RyYWluUGVuZGluZ1N0cmVhbXMoKTtcbiAgICB0aGlzLl9pc05lZ290aWF0aW9uTmVlZGVkID0gZmFsc2U7XG4gICAgdGhpcy5faXNDYWxsZXIgPSBmYWxzZTtcbiAgICBsZXQgbG9jYWxEZXNjO1xuICAgIHRoaXMuX3BjLmNyZWF0ZUFuc3dlcigpLnRoZW4oKGRlc2MpID0+IHtcbiAgICAgIGRlc2Muc2RwID0gdGhpcy5fc2V0UnRwUmVjZWl2ZXJPcHRpb25zKGRlc2Muc2RwKTtcbiAgICAgIGxvY2FsRGVzYz1kZXNjO1xuICAgICAgdGhpcy5fbG9nQ3VycmVudEFuZFBlbmRpbmdMb2NhbERlc2NyaXB0aW9uKCk7XG4gICAgICByZXR1cm4gdGhpcy5fcGMuc2V0TG9jYWxEZXNjcmlwdGlvbihkZXNjKTtcbiAgICB9KS50aGVuKCgpPT57XG4gICAgICByZXR1cm4gdGhpcy5fc2VuZFNkcChsb2NhbERlc2MpO1xuICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICBMb2dnZXIuZXJyb3IoZS5tZXNzYWdlICsgJyBQbGVhc2UgY2hlY2sgeW91ciBjb2RlYyBzZXR0aW5ncy4nKTtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfV0VCUlRDX1NEUCxcbiAgICAgICAgICBlLm1lc3NhZ2UpO1xuICAgICAgdGhpcy5fc3RvcChlcnJvciwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBfbG9nQ3VycmVudEFuZFBlbmRpbmdMb2NhbERlc2NyaXB0aW9uKCl7XG4gICAgTG9nZ2VyLmluZm8oJ0N1cnJlbnQgZGVzY3JpcHRpb246ICcrdGhpcy5fcGMuY3VycmVudExvY2FsRGVzY3JpcHRpb24pO1xuICAgIExvZ2dlci5pbmZvKCdQZW5kaW5nIGRlc2NyaXB0aW9uOiAnK3RoaXMuX3BjLnBlbmRpbmdMb2NhbERlc2NyaXB0aW9uKTtcbiAgfVxuXG4gIF9nZXRBbmREZWxldGVUcmFja1NvdXJjZUluZm8odHJhY2tzKSB7XG4gICAgaWYgKHRyYWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB0cmFja0lkID0gdHJhY2tzWzBdLmlkO1xuICAgICAgaWYgKHRoaXMuX3JlbW90ZVRyYWNrU291cmNlSW5mby5oYXModHJhY2tJZCkpIHtcbiAgICAgICAgY29uc3Qgc291cmNlSW5mbyA9IHRoaXMuX3JlbW90ZVRyYWNrU291cmNlSW5mby5nZXQodHJhY2tJZCk7XG4gICAgICAgIHRoaXMuX3JlbW90ZVRyYWNrU291cmNlSW5mby5kZWxldGUodHJhY2tJZCk7XG4gICAgICAgIHJldHVybiBzb3VyY2VJbmZvO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHNvdXJjZSBpbmZvIGZvciAnICsgdHJhY2tJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3VucHVibGlzaChzdHJlYW0pIHtcbiAgICBpZiAobmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSB8fCAhdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzUmVtb3ZlU3RyZWFtKSB7XG4gICAgICAvLyBBY3R1YWxseSB1bnB1Ymxpc2ggaXMgc3VwcG9ydGVkLiBJdCBpcyBhIGxpdHRsZSBiaXQgY29tcGxleCBzaW5jZSBGaXJlZm94IGltcGxlbWVudGVkIFdlYlJUQyBzcGVjIHdoaWxlIENocm9tZSBpbXBsZW1lbnRlZCBhbiBvbGQgQVBJLlxuICAgICAgTG9nZ2VyLmVycm9yKFxuICAgICAgICAgICdTdG9wcGluZyBhIHB1YmxpY2F0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgb24gRmlyZWZveC4gUGxlYXNlIHVzZSBQMlBDbGllbnQuc3RvcCgpIHRvIHN0b3AgdGhlIGNvbm5lY3Rpb24gd2l0aCByZW1vdGUgZW5kcG9pbnQuJ1xuICAgICAgKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoXG4gICAgICAgICAgRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfVU5TVVBQT1JURURfTUVUSE9EKSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fcHVibGlzaGVkU3RyZWFtcy5oYXMoc3RyZWFtKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTExFR0FMX0FSR1VNRU5UKSk7XG4gICAgfVxuICAgIHRoaXMuX3BlbmRpbmdVbnB1Ymxpc2hTdHJlYW1zLnB1c2goc3RyZWFtKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fdW5wdWJsaXNoUHJvbWlzZXMuc2V0KHN0cmVhbS5tZWRpYVN0cmVhbS5pZCwge1xuICAgICAgICByZXNvbHZlOiByZXNvbHZlLFxuICAgICAgICByZWplY3Q6IHJlamVjdCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fZHJhaW5QZW5kaW5nU3RyZWFtcygpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIHxfcGN8IGlzIGF2YWlsYWJsZSBiZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZC5cbiAgX2NyZWF0ZURhdGFDaGFubmVsKGxhYmVsKSB7XG4gICAgaWYgKHRoaXMuX2RhdGFDaGFubmVscy5oYXMobGFiZWwpKSB7XG4gICAgICBMb2dnZXIud2FybmluZygnRGF0YSBjaGFubmVsIGxhYmVsZWQgJysgbGFiZWwrJyBhbHJlYWR5IGV4aXN0cy4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9wYykge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdQZWVyQ29ubmVjdGlvbiBpcyBub3QgYXZhaWxhYmxlIGJlZm9yZSBjcmVhdGluZyBEYXRhQ2hhbm5lbC4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgTG9nZ2VyLmRlYnVnKCdDcmVhdGUgZGF0YSBjaGFubmVsLicpO1xuICAgIGNvbnN0IGRjID0gdGhpcy5fcGMuY3JlYXRlRGF0YUNoYW5uZWwobGFiZWwpO1xuICAgIHRoaXMuX2JpbmRFdmVudHNUb0RhdGFDaGFubmVsKGRjKTtcbiAgICB0aGlzLl9kYXRhQ2hhbm5lbHMuc2V0KERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSwgZGMpO1xuICAgIHRoaXMuX29uTmVnb3RpYXRpb25uZWVkZWQoKTtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzVG9EYXRhQ2hhbm5lbChkYykge1xuICAgIGRjLm9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25EYXRhQ2hhbm5lbE1lc3NhZ2UuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICBkYy5vbm9wZW4gPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uRGF0YUNoYW5uZWxPcGVuLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgZGMub25jbG9zZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25EYXRhQ2hhbm5lbENsb3NlLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgZGMub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdEYXRhIENoYW5uZWwgRXJyb3I6JywgZXJyb3IpO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIGFsbCBNZWRpYVN0cmVhbXMgaXQgYmVsb25ncyB0by5cbiAgX2dldFN0cmVhbUJ5VHJhY2sobWVkaWFTdHJlYW1UcmFjaykge1xuICAgIGNvbnN0IHN0cmVhbXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtpZCwgaW5mb10gb2YgdGhpcy5fcmVtb3RlU3RyZWFtSW5mbykge1xuICAgICAgaWYgKCFpbmZvLnN0cmVhbSB8fCAhaW5mby5zdHJlYW0ubWVkaWFTdHJlYW0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IHRyYWNrIG9mIGluZm8uc3RyZWFtLm1lZGlhU3RyZWFtLmdldFRyYWNrcygpKSB7XG4gICAgICAgIGlmIChtZWRpYVN0cmVhbVRyYWNrID09PSB0cmFjaykge1xuICAgICAgICAgIHN0cmVhbXMucHVzaChpbmZvLnN0cmVhbS5tZWRpYVN0cmVhbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0cmVhbXM7XG4gIH1cblxuICBfYXJlQWxsVHJhY2tzRW5kZWQobWVkaWFTdHJlYW0pIHtcbiAgICBmb3IgKGNvbnN0IHRyYWNrIG9mIG1lZGlhU3RyZWFtLmdldFRyYWNrcygpKSB7XG4gICAgICBpZiAodHJhY2sucmVhZHlTdGF0ZSA9PT0gJ2xpdmUnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBfc3RvcChlcnJvciwgbm90aWZ5UmVtb3RlKSB7XG4gICAgbGV0IHByb21pc2VFcnJvciA9IGVycm9yO1xuICAgIGlmICghcHJvbWlzZUVycm9yKSB7XG4gICAgICBwcm9taXNlRXJyb3IgPSBuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoXG4gICAgICAgICAgRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfVU5LTk9XTik7XG4gICAgfVxuICAgIGZvciAoY29uc3QgW2xhYmVsLCBkY10gb2YgdGhpcy5fZGF0YUNoYW5uZWxzKSB7XG4gICAgICBkYy5jbG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLl9kYXRhQ2hhbm5lbHMuY2xlYXIoKTtcbiAgICBpZiAodGhpcy5fcGMgJiYgdGhpcy5fcGMuaWNlQ29ubmVjdGlvblN0YXRlICE9PSAnY2xvc2VkJykge1xuICAgICAgdGhpcy5fcGMuY2xvc2UoKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBbaWQsIHByb21pc2VdIG9mIHRoaXMuX3B1Ymxpc2hQcm9taXNlcykge1xuICAgICAgcHJvbWlzZS5yZWplY3QocHJvbWlzZUVycm9yKTtcbiAgICB9XG4gICAgdGhpcy5fcHVibGlzaFByb21pc2VzLmNsZWFyKCk7XG4gICAgZm9yIChjb25zdCBbaWQsIHByb21pc2VdIG9mIHRoaXMuX3VucHVibGlzaFByb21pc2VzKSB7XG4gICAgICBwcm9taXNlLnJlamVjdChwcm9taXNlRXJyb3IpO1xuICAgIH1cbiAgICB0aGlzLl91bnB1Ymxpc2hQcm9taXNlcy5jbGVhcigpO1xuICAgIGZvciAoY29uc3QgW2lkLCBwcm9taXNlXSBvZiB0aGlzLl9zZW5kRGF0YVByb21pc2VzKSB7XG4gICAgICBwcm9taXNlLnJlamVjdChwcm9taXNlRXJyb3IpO1xuICAgIH1cbiAgICB0aGlzLl9zZW5kRGF0YVByb21pc2VzLmNsZWFyKCk7XG4gICAgLy8gRmlyZSBlbmRlZCBldmVudCBpZiBwdWJsaWNhdGlvbiBvciByZW1vdGUgc3RyZWFtIGV4aXN0cy5cbiAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW1zLmZvckVhY2goKHB1YmxpY2F0aW9uKSA9PiB7XG4gICAgICBwdWJsaWNhdGlvbi5kaXNwYXRjaEV2ZW50KG5ldyBPd3RFdmVudCgnZW5kZWQnKSk7XG4gICAgfSk7XG4gICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtcy5jbGVhcigpO1xuICAgIHRoaXMuX3JlbW90ZVN0cmVhbXMuZm9yRWFjaCgoc3RyZWFtKSA9PiB7XG4gICAgICBzdHJlYW0uZGlzcGF0Y2hFdmVudChuZXcgT3d0RXZlbnQoJ2VuZGVkJykpO1xuICAgIH0pO1xuICAgIHRoaXMuX3JlbW90ZVN0cmVhbXMgPSBbXTtcbiAgICBpZiAoIXRoaXMuX2Rpc3Bvc2VkKSB7XG4gICAgICBpZiAobm90aWZ5UmVtb3RlKSB7XG4gICAgICAgIGxldCBzZW5kRXJyb3I7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHNlbmRFcnJvciA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcbiAgICAgICAgICAvLyBBdm9pZCB0byBsZWFrIGRldGFpbGVkIGVycm9yIHRvIHJlbW90ZSBzaWRlLlxuICAgICAgICAgIHNlbmRFcnJvci5tZXNzYWdlID0gJ0Vycm9yIGhhcHBlbmVkIGF0IHJlbW90ZSBzaWRlLic7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5DTE9TRUQsIHNlbmRFcnJvcikuY2F0Y2goXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIExvZ2dlci5kZWJ1ZygnRmFpbGVkIHRvIHNlbmQgY2xvc2UuJyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnZW5kZWQnKSk7XG4gICAgfVxuICB9XG5cbiAgX3NldFN0cmVhbVRvUmVtb3RlU3RyZWFtSW5mbyhtZWRpYVN0cmVhbSkge1xuICAgIGNvbnN0IGluZm8gPSB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChtZWRpYVN0cmVhbS5pZCk7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IGluZm8uYXR0cmlidXRlcztcbiAgICBjb25zdCBzb3VyY2VJbmZvID0gbmV3IFN0cmVhbU1vZHVsZS5TdHJlYW1Tb3VyY2VJbmZvKHRoaXMuX3JlbW90ZVN0cmVhbUluZm9cbiAgICAgICAgLmdldChtZWRpYVN0cmVhbS5pZCkuc291cmNlLmF1ZGlvLCB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChcbiAgICAgICAgbWVkaWFTdHJlYW0uaWQpXG4gICAgICAgIC5zb3VyY2UudmlkZW8pO1xuICAgIGluZm8uc3RyZWFtID0gbmV3IFN0cmVhbU1vZHVsZS5SZW1vdGVTdHJlYW0oXG4gICAgICAgIHVuZGVmaW5lZCwgdGhpcy5fcmVtb3RlSWQsIG1lZGlhU3RyZWFtLFxuICAgICAgICBzb3VyY2VJbmZvLCBhdHRyaWJ1dGVzKTtcbiAgICBpbmZvLm1lZGlhU3RyZWFtID0gbWVkaWFTdHJlYW07XG4gICAgY29uc3Qgc3RyZWFtID0gaW5mby5zdHJlYW07XG4gICAgaWYgKHN0cmVhbSkge1xuICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtcy5wdXNoKHN0cmVhbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdGYWlsZWQgdG8gY3JlYXRlIFJlbW90ZVN0cmVhbS4nKTtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tJY2VDb25uZWN0aW9uU3RhdGVBbmRGaXJlRXZlbnQoKSB7XG4gICAgaWYgKHRoaXMuX3BjLmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nvbm5lY3RlZCcgfHxcbiAgICAgICAgdGhpcy5fcGMuaWNlQ29ubmVjdGlvblN0YXRlID09PSAnY29tcGxldGVkJykge1xuICAgICAgZm9yIChjb25zdCBbaWQsIGluZm9dIG9mIHRoaXMuX3JlbW90ZVN0cmVhbUluZm8pIHtcbiAgICAgICAgaWYgKGluZm8ubWVkaWFTdHJlYW0pIHtcbiAgICAgICAgICBjb25zdCBzdHJlYW1FdmVudCA9IG5ldyBTdHJlYW1Nb2R1bGUuU3RyZWFtRXZlbnQoJ3N0cmVhbWFkZGVkJywge1xuICAgICAgICAgICAgc3RyZWFtOiBpbmZvLnN0cmVhbSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAodGhpcy5faXNVbmlmaWVkUGxhbigpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRyYWNrIG9mIGluZm8ubWVkaWFTdHJlYW0uZ2V0VHJhY2tzKCkpIHtcbiAgICAgICAgICAgICAgdHJhY2suYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZWRpYVN0cmVhbXMgPSB0aGlzLl9nZXRTdHJlYW1CeVRyYWNrKGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBtZWRpYVN0cmVhbSBvZiBtZWRpYVN0cmVhbXMpIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hcmVBbGxUcmFja3NFbmRlZChtZWRpYVN0cmVhbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25SZW1vdGVTdHJlYW1SZW1vdmVkKG1lZGlhU3RyZWFtKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLlRSQUNLU19BRERFRCwgaW5mby50cmFja0lkcyk7XG4gICAgICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtSW5mby5nZXQoaW5mby5tZWRpYVN0cmVhbS5pZCkubWVkaWFTdHJlYW0gPSBudWxsO1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChzdHJlYW1FdmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUDJQUGVlckNvbm5lY3Rpb25DaGFubmVsO1xuIl19
