var scriptConfig = { autoscript: "NAVIAM.QRCODE", description: "Generates a QR Code for the data query parameter.", version: "1.0.0", active: !0, logLevel: "ERROR" },
    global = this,
    window = this;
("undefined" == typeof setTimeout &&
    ((global.setTimeout = function (t, e) {
        return (t(), 0);
    }),
    (global.clearTimeout = function () {}),
    (global.setImmediate = function (t) {
        return (t(), 0);
    })),
    "undefined" == typeof Promise &&
        ((global.Promise = function (t) {
            var e = this;
            function resolve(t) {
                "pending" === e._state &&
                    ((e._state = "fulfilled"),
                    (e._value = t),
                    e._handlers.forEach(function (t) {
                        t.onFulfilled(e._value);
                    }),
                    (e._handlers = []));
            }
            function reject(t) {
                "pending" === e._state &&
                    ((e._state = "rejected"),
                    (e._value = t),
                    e._handlers.forEach(function (t) {
                        t.onRejected(e._value);
                    }),
                    (e._handlers = []));
            }
            ((e._state = "pending"), (e._value = void 0), (e._handlers = []));
            try {
                t(resolve, reject);
            } catch (t) {
                reject(t);
            }
        }),
        (global.Promise.prototype.then = function (t, e) {
            var r = this;
            return new Promise(function (n, o) {
                function handle() {
                    if ("fulfilled" === r._state)
                        if ("function" == typeof t)
                            try {
                                n(t(r._value));
                            } catch (t) {
                                o(t);
                            }
                        else n(r._value);
                    else if ("rejected" === r._state)
                        if ("function" == typeof e)
                            try {
                                n(e(r._value));
                            } catch (t) {
                                o(t);
                            }
                        else o(r._value);
                    else
                        r._handlers.push({
                            onFulfilled: function (e) {
                                if ("function" == typeof t)
                                    try {
                                        n(t(e));
                                    } catch (t) {
                                        o(t);
                                    }
                                else n(e);
                            },
                            onRejected: function (t) {
                                if ("function" == typeof e)
                                    try {
                                        n(e(t));
                                    } catch (t) {
                                        o(t);
                                    }
                                else o(t);
                            }
                        });
                }
                handle();
            });
        }),
        (global.Promise.prototype.catch = function (t) {
            return this.then(null, t);
        }),
        (global.Promise.resolve = function (t) {
            return new Promise(function (e) {
                e(t);
            });
        }),
        (global.Promise.reject = function (t) {
            return new Promise(function (e, r) {
                r(t);
            });
        }),
        (global.Promise.all = function (t) {
            return new Promise(function (e, r) {
                var n = [],
                    o = t.length;
                0 !== o
                    ? t.forEach(function (t, i) {
                          Promise.resolve(t).then(function (t) {
                              ((n[i] = t), 0 === --o && e(n));
                          }, r);
                      })
                    : e(n);
            });
        }),
        (global.Promise.race = function (t) {
            return new Promise(function (e, r) {
                t.forEach(function (t) {
                    Promise.resolve(t).then(e, r);
                });
            });
        })),
    (function (t) {
        function makeUint8Array(t, e, r) {
            var n, o, i;
            if ("number" == typeof t) {
                for (o = t >>> 0, n = 0; n < o; n++) this[n] = 0;
                this.length = o;
            } else if (t && "number" == typeof t.length) {
                for (o = t.length, n = 0; n < o; n++) ((i = t[n]), (this[n] = 255 & (i < 0 ? (i % 256) + 256 : i)));
                this.length = o;
            } else if (t && t._isArrayBuffer) {
                for (e = (e || 0) >>> 0, o = void 0 !== r ? r >>> 0 : t.byteLength - e, n = 0; n < o; n++) this[n] = 255 & t._bytes[e + n];
                ((this.length = o), (this.byteOffset = e), (this.buffer = t));
            } else ((o = 0), (this.length = 0));
            if (!this.buffer) {
                var a = { _isArrayBuffer: !0, byteLength: this.length, _bytes: this };
                this.buffer = a;
            }
            ((this.byteLength = this.length), void 0 === this.byteOffset && (this.byteOffset = 0), (this.BYTES_PER_ELEMENT = 1));
        }
        ((makeUint8Array.BYTES_PER_ELEMENT = 1),
            (makeUint8Array.from = function (t, e, r) {
                for (var n = t && "number" == typeof t.length ? t : [], o = new makeUint8Array(n.length), i = 0; i < n.length; i++) o[i] = 255 & (e ? e.call(r, n[i], i) : n[i]);
                return o;
            }),
            (makeUint8Array.of = function () {
                return new makeUint8Array(Array.prototype.slice.call(arguments));
            }),
            (makeUint8Array.prototype.set = function (t, e) {
                e = (e || 0) >>> 0;
                for (var r = 0; r < t.length; r++) this[e + r] = 255 & t[r];
            }),
            (makeUint8Array.prototype.slice = function (t, e) {
                var r = this.length;
                if ((t = void 0 === t ? 0 : t < 0 ? Math.max(r + t, 0) : Math.min(t, r)) >= (e = void 0 === e ? r : e < 0 ? Math.max(r + e, 0) : Math.min(e, r))) return new makeUint8Array(0);
                for (var n = new makeUint8Array(e - t), o = 0; o < n.length; o++) n[o] = this[t + o];
                return n;
            }),
            (makeUint8Array.prototype.subarray = function (t, e) {
                return this.slice(t, e);
            }),
            (makeUint8Array.prototype.fill = function (t, e, r) {
                ((t &= 255), (e = void 0 === e ? 0 : e < 0 ? Math.max(this.length + e, 0) : Math.min(e, this.length)), (r = void 0 === r ? this.length : r < 0 ? Math.max(this.length + r, 0) : Math.min(r, this.length)));
                for (var n = e; n < r; n++) this[n] = t;
                return this;
            }),
            (makeUint8Array.prototype.forEach = function (t, e) {
                for (var r = 0; r < this.length; r++) t.call(e, this[r], r, this);
            }),
            (makeUint8Array.prototype.map = function (t, e) {
                for (var r = new makeUint8Array(this.length), n = 0; n < this.length; n++) r[n] = 255 & t.call(e, this[n], n, this);
                return r;
            }),
            (makeUint8Array.prototype.reduce = function (t, e) {
                var r,
                    n = 0;
                for (arguments.length < 2 ? ((r = this[0]), (n = 1)) : (r = e); n < this.length; n++) r = t(r, this[n], n, this);
                return r;
            }),
            (makeUint8Array.prototype.indexOf = function (t) {
                for (var e = 0; e < this.length; e++) if (this[e] === (255 & t)) return e;
                return -1;
            }),
            (makeUint8Array.prototype.join = function (t) {
                for (var e = [], r = 0; r < this.length; r++) e.push(this[r]);
                return e.join(void 0 === t ? "," : t);
            }),
            (makeUint8Array.prototype.toString = function () {
                return this.join(",");
            }),
            (t.Uint8Array = makeUint8Array),
            "undefined" == typeof ArrayBuffer &&
                (t.ArrayBuffer = function (t) {
                    ((this.byteLength = t >>> 0), (this._bytes = new makeUint8Array(this.byteLength)), (this._isArrayBuffer = !0));
                }));
    })(global),
    "undefined" == typeof TextEncoder &&
        (global.TextEncoder = function () {
            this.encode = function (t) {
                for (var e = [], r = 0; r < t.length; r++) {
                    var n = t.charCodeAt(r);
                    n < 128
                        ? e.push(n)
                        : n < 2048
                          ? e.push(192 | (n >> 6), 128 | (63 & n))
                          : n < 55296 || n >= 57344
                            ? e.push(224 | (n >> 12), 128 | ((n >> 6) & 63), 128 | (63 & n))
                            : (r++, (n = 65536 + (((1023 & n) << 10) | (1023 & t.charCodeAt(r)))), e.push(240 | (n >> 18), 128 | ((n >> 12) & 63), 128 | ((n >> 6) & 63), 128 | (63 & n)));
                }
                return new Uint8Array(e);
            };
        }),
    "undefined" == typeof TextDecoder &&
        (global.TextDecoder = function () {
            this.decode = function (t) {
                for (var e, r, n, o = [], i = 0; i < t.length; )
                    switch ((e = t[i++]) >> 4) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            o.push(String.fromCharCode(e));
                            break;
                        case 12:
                        case 13:
                            ((r = t[i++]), o.push(String.fromCharCode(((31 & e) << 6) | (63 & r))));
                            break;
                        case 14:
                            ((r = t[i++]), (n = t[i++]), o.push(String.fromCharCode(((15 & e) << 12) | ((63 & r) << 6) | (63 & n))));
                            break;
                        case 15:
                            var a = ((7 & e) << 18) | ((63 & (r = t[i++])) << 12) | ((63 & (n = t[i++])) << 6) | (63 & t[i++]);
                            ((a -= 65536), o.push(String.fromCharCode(55296 + (a >> 10))), o.push(String.fromCharCode(56320 + (1023 & a))));
                    }
                return o.join("");
            };
        }));
var __webpack_modules__ = {
        2: function (t, e, r) {
            var n = r(675);
            function NumericData(t) {
                ((this.mode = n.NUMERIC), (this.data = t.toString()));
            }
            ((NumericData.getBitsLength = function (t) {
                return 10 * Math.floor(t / 3) + (t % 3 ? (t % 3) * 3 + 1 : 0);
            }),
                (NumericData.prototype.getLength = function () {
                    return this.data.length;
                }),
                (NumericData.prototype.getBitsLength = function () {
                    return NumericData.getBitsLength(this.data.length);
                }),
                (NumericData.prototype.write = function (t) {
                    var e, r, n;
                    for (e = 0; e + 3 <= this.data.length; e += 3) ((r = this.data.substr(e, 3)), (n = parseInt(r, 10)), t.put(n, 10));
                    var o = this.data.length - e;
                    o > 0 && ((r = this.data.substr(e)), (n = parseInt(r, 10)), t.put(n, 3 * o + 1));
                }),
                (t.exports = NumericData));
        },
        82: function (t, e) {
            function fromString(t) {
                if ("string" != typeof t) throw new Error("Param is not a string");
                switch (t.toLowerCase()) {
                    case "l":
                    case "low":
                        return e.L;
                    case "m":
                    case "medium":
                        return e.M;
                    case "q":
                    case "quartile":
                        return e.Q;
                    case "h":
                    case "high":
                        return e.H;
                    default:
                        throw new Error("Unknown EC Level: " + t);
                }
            }
            ((e.L = { bit: 1 }),
                (e.M = { bit: 0 }),
                (e.Q = { bit: 3 }),
                (e.H = { bit: 2 }),
                (e.isValid = function (t) {
                    return t && "undefined" != typeof t.bit && t.bit >= 0 && t.bit < 4;
                }),
                (e.from = function (t, r) {
                    if (e.isValid(t)) return t;
                    try {
                        return fromString(t);
                    } catch (t) {
                        return r;
                    }
                }));
        },
        128: function (t, e, r) {
            var n = r(155).getSymbolSize;
            ((e.getRowColCoords = function (t) {
                if (1 === t) return [];
                for (var e = Math.floor(t / 7) + 2, r = n(t), o = 145 === r ? 26 : 2 * Math.ceil((r - 13) / (2 * e - 2)), i = [r - 7], a = 1; a < e - 1; a++) i[a] = i[a - 1] - o;
                return (i.push(6), i.reverse());
            }),
                (e.getPositions = function (t) {
                    for (var r = [], n = e.getRowColCoords(t), o = n.length, i = 0; i < o; i++) for (var a = 0; a < o; a++) (0 === i && 0 === a) || (0 === i && a === o - 1) || (i === o - 1 && 0 === a) || r.push([n[i], n[a]]);
                    return r;
                }));
        },
        155: function (t, e) {
            var r,
                n = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];
            ((e.getSymbolSize = function (t) {
                if (!t) throw new Error('"version" cannot be null or undefined');
                if (t < 1 || t > 40) throw new Error('"version" should be in range from 1 to 40');
                return 4 * t + 17;
            }),
                (e.getSymbolTotalCodewords = function (t) {
                    return n[t];
                }),
                (e.getBCHDigit = function (t) {
                    for (var e = 0; 0 !== t; ) (e++, (t >>>= 1));
                    return e;
                }),
                (e.setToSJISFunction = function (t) {
                    if ("function" != typeof t) throw new Error('"toSJISFunc" is not a valid function.');
                    r = t;
                }),
                (e.isKanjiModeEnabled = function () {
                    return "undefined" != typeof r;
                }),
                (e.toSJIS = function (t) {
                    return r(t);
                }));
        },
        255: function (t) {
            function BitMatrix(t) {
                if (!t || t < 1) throw new Error("BitMatrix size must be defined and greater than 0");
                ((this.size = t), (this.data = new Uint8Array(t * t)), (this.reservedBit = new Uint8Array(t * t)));
            }
            ((BitMatrix.prototype.set = function (t, e, r, n) {
                var o = t * this.size + e;
                ((this.data[o] = r), n && (this.reservedBit[o] = !0));
            }),
                (BitMatrix.prototype.get = function (t, e) {
                    return this.data[t * this.size + e];
                }),
                (BitMatrix.prototype.xor = function (t, e, r) {
                    this.data[t * this.size + e] ^= r;
                }),
                (BitMatrix.prototype.isReserved = function (t, e) {
                    return this.reservedBit[t * this.size + e];
                }),
                (t.exports = BitMatrix));
        },
        320: function (t) {
            "use strict";
            var e = {
                single_source_shortest_paths: function (t, r, n) {
                    var o = {},
                        i = {};
                    i[r] = 0;
                    var a,
                        u,
                        s,
                        f,
                        c,
                        h,
                        l,
                        g = e.PriorityQueue.make();
                    for (g.push(r, 0); !g.empty(); ) for (s in ((u = (a = g.pop()).value), (f = a.cost), (c = t[u] || {}))) c.hasOwnProperty(s) && ((h = f + c[s]), (l = i[s]), ("undefined" == typeof i[s] || l > h) && ((i[s] = h), g.push(s, h), (o[s] = u)));
                    if ("undefined" != typeof n && "undefined" == typeof i[n]) {
                        var d = ["Could not find a path from ", r, " to ", n, "."].join("");
                        throw new Error(d);
                    }
                    return o;
                },
                extract_shortest_path_from_predecessor_list: function (t, e) {
                    for (var r = [], n = e; n; ) (r.push(n), t[n], (n = t[n]));
                    return (r.reverse(), r);
                },
                find_path: function (t, r, n) {
                    var o = e.single_source_shortest_paths(t, r, n);
                    return e.extract_shortest_path_from_predecessor_list(o, n);
                },
                PriorityQueue: {
                    make: function (t) {
                        var r,
                            n = e.PriorityQueue,
                            o = {};
                        for (r in ((t = t || {}), n)) n.hasOwnProperty(r) && (o[r] = n[r]);
                        return ((o.queue = []), (o.sorter = t.sorter || n.default_sorter), o);
                    },
                    default_sorter: function (t, e) {
                        return t.cost - e.cost;
                    },
                    push: function (t, e) {
                        var r = { value: t, cost: e };
                        (this.queue.push(r), this.queue.sort(this.sorter));
                    },
                    pop: function () {
                        return this.queue.shift();
                    },
                    empty: function () {
                        return 0 === this.queue.length;
                    }
                }
            };
            t.exports = e;
        },
        384: function (t, e) {
            var r = new Uint8Array(512),
                n = new Uint8Array(256);
            (!(function () {
                for (var t = 1, e = 0; e < 255; e++) ((r[e] = t), (n[t] = e), 256 & (t <<= 1) && (t ^= 285));
                for (var o = 255; o < 512; o++) r[o] = r[o - 255];
            })(),
                (e.log = function (t) {
                    if (t < 1) throw new Error("log(" + t + ")");
                    return n[t];
                }),
                (e.exp = function (t) {
                    return r[t];
                }),
                (e.mul = function (t, e) {
                    return 0 === t || 0 === e ? 0 : r[n[t] + n[e]];
                }));
        },
        510: function (t, e, r) {
            var n = r(155),
                o = r(679),
                i = r(82),
                a = r(675),
                u = r(735),
                s = 7973,
                f = n.getBCHDigit(s);
            function getBestVersionForDataLength(t, r, n) {
                for (var o = 1; o <= 40; o++) if (r <= e.getCapacity(o, n, t)) return o;
            }
            function getReservedBitsCount(t, e) {
                return a.getCharCountIndicator(t, e) + 4;
            }
            function getTotalBitsFromDataArray(t, e) {
                var r = 0;
                return (
                    t.forEach(function (t) {
                        var n = getReservedBitsCount(t.mode, e);
                        r += n + t.getBitsLength();
                    }),
                    r
                );
            }
            function getBestVersionForMixedData(t, r) {
                for (var n = 1; n <= 40; n++) {
                    if (getTotalBitsFromDataArray(t, n) <= e.getCapacity(n, r, a.MIXED)) return n;
                }
            }
            ((e.from = function (t, e) {
                return u.isValid(t) ? parseInt(t, 10) : e;
            }),
                (e.getCapacity = function (t, e, r) {
                    if (!u.isValid(t)) throw new Error("Invalid QR Code version");
                    "undefined" == typeof r && (r = a.BYTE);
                    var i = 8 * (n.getSymbolTotalCodewords(t) - o.getTotalCodewordsCount(t, e));
                    if (r === a.MIXED) return i;
                    var s = i - getReservedBitsCount(r, t);
                    switch (r) {
                        case a.NUMERIC:
                            return Math.floor((s / 10) * 3);
                        case a.ALPHANUMERIC:
                            return Math.floor((s / 11) * 2);
                        case a.KANJI:
                            return Math.floor(s / 13);
                        case a.BYTE:
                        default:
                            return Math.floor(s / 8);
                    }
                }),
                (e.getBestVersionForData = function (t, e) {
                    var r,
                        n = i.from(e, i.M);
                    if (Array.isArray(t)) {
                        if (t.length > 1) return getBestVersionForMixedData(t, n);
                        if (0 === t.length) return 1;
                        r = t[0];
                    } else r = t;
                    return getBestVersionForDataLength(r.mode, r.getLength(), n);
                }),
                (e.getEncodedBits = function (t) {
                    if (!u.isValid(t) || t < 7) throw new Error("Invalid QR Code version");
                    for (var e = t << 12; n.getBCHDigit(e) - f >= 0; ) e ^= s << (n.getBCHDigit(e) - f);
                    return (t << 12) | e;
                }));
        },
        524: function (t) {
            function BitBuffer() {
                ((this.buffer = []), (this.length = 0));
            }
            ((BitBuffer.prototype = {
                get: function (t) {
                    var e = Math.floor(t / 8);
                    return 1 == ((this.buffer[e] >>> (7 - (t % 8))) & 1);
                },
                put: function (t, e) {
                    for (var r = 0; r < e; r++) this.putBit(1 == ((t >>> (e - r - 1)) & 1));
                },
                getLengthInBits: function () {
                    return this.length;
                },
                putBit: function (t) {
                    var e = Math.floor(this.length / 8);
                    (this.buffer.length <= e && this.buffer.push(0), t && (this.buffer[e] |= 128 >>> (this.length % 8)), this.length++);
                }
            }),
                (t.exports = BitBuffer));
        },
        539: function (t, e, r) {
            var n = r(675);
            function ByteData(t) {
                ((this.mode = n.BYTE), (this.data = "string" == typeof t ? new TextEncoder().encode(t) : new Uint8Array(t)));
            }
            ((ByteData.getBitsLength = function (t) {
                return 8 * t;
            }),
                (ByteData.prototype.getLength = function () {
                    return this.data.length;
                }),
                (ByteData.prototype.getBitsLength = function () {
                    return ByteData.getBitsLength(this.data.length);
                }),
                (ByteData.prototype.write = function (t) {
                    for (var e = 0, r = this.data.length; e < r; e++) t.put(this.data[e], 8);
                }),
                (t.exports = ByteData));
        },
        578: function (t) {
            t.exports = function () {
                return "function" == typeof Promise && Promise.prototype && Promise.prototype.then;
            };
        },
        630: function (t, e, r) {
            var n = r(384);
            ((e.mul = function (t, e) {
                for (var r = new Uint8Array(t.length + e.length - 1), o = 0; o < t.length; o++) for (var i = 0; i < e.length; i++) r[o + i] ^= n.mul(t[o], e[i]);
                return r;
            }),
                (e.mod = function (t, e) {
                    for (var r = new Uint8Array(t); r.length - e.length >= 0; ) {
                        for (var o = r[0], i = 0; i < e.length; i++) r[i] ^= n.mul(e[i], o);
                        for (var a = 0; a < r.length && 0 === r[a]; ) a++;
                        r = r.slice(a);
                    }
                    return r;
                }),
                (e.generateECPolynomial = function (t) {
                    for (var r = new Uint8Array([1]), o = 0; o < t; o++) r = e.mul(r, new Uint8Array([1, n.exp(o)]));
                    return r;
                }));
        },
        641: function (t, e, r) {
            var n = r(867);
            function getColorAttrib(t, e) {
                var r = t.a / 255,
                    n = e + '="' + t.hex + '"';
                return r < 1 ? n + " " + e + '-opacity="' + r.toFixed(2).slice(1) + '"' : n;
            }
            function svgCmd(t, e, r) {
                var n = t + e;
                return ("undefined" != typeof r && (n += " " + r), n);
            }
            function qrToPath(t, e, r) {
                for (var n = "", o = 0, i = !1, a = 0, u = 0; u < t.length; u++) {
                    var s = Math.floor(u % e),
                        f = Math.floor(u / e);
                    (s || i || (i = !0), t[u] ? (a++, (u > 0 && s > 0 && t[u - 1]) || ((n += i ? svgCmd("M", s + r, 0.5 + f + r) : svgCmd("m", o, 0)), (o = 0), (i = !1)), (s + 1 < e && t[u + 1]) || ((n += svgCmd("h", a)), (a = 0))) : o++);
                }
                return n;
            }
            e.render = function (t, e, r) {
                var o = n.getOptions(e),
                    i = t.modules.size,
                    a = t.modules.data,
                    u = i + 2 * o.margin,
                    s = o.color.light.a ? "<path " + getColorAttrib(o.color.light, "fill") + ' d="M0 0h' + u + "v" + u + 'H0z"/>' : "",
                    f = "<path " + getColorAttrib(o.color.dark, "stroke") + ' d="' + qrToPath(a, i, o.margin) + '"/>',
                    c = 'viewBox="0 0 ' + u + " " + u + '"',
                    h = '<svg xmlns="http://www.w3.org/2000/svg" ' + (o.width ? 'width="' + o.width + '" height="' + o.width + '" ' : "") + c + ' shape-rendering="crispEdges">' + s + f + "</svg>\n";
                return ("function" == typeof r && r(null, h), h);
            };
        },
        659: function (t, e) {
            e.Patterns = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 };
            var r = { N1: 3, N2: 3, N3: 40, N4: 10 };
            function getMaskAt(t, r, n) {
                switch (t) {
                    case e.Patterns.PATTERN000:
                        return (r + n) % 2 == 0;
                    case e.Patterns.PATTERN001:
                        return r % 2 == 0;
                    case e.Patterns.PATTERN010:
                        return n % 3 == 0;
                    case e.Patterns.PATTERN011:
                        return (r + n) % 3 == 0;
                    case e.Patterns.PATTERN100:
                        return (Math.floor(r / 2) + Math.floor(n / 3)) % 2 == 0;
                    case e.Patterns.PATTERN101:
                        return ((r * n) % 2) + ((r * n) % 3) == 0;
                    case e.Patterns.PATTERN110:
                        return (((r * n) % 2) + ((r * n) % 3)) % 2 == 0;
                    case e.Patterns.PATTERN111:
                        return (((r * n) % 3) + ((r + n) % 2)) % 2 == 0;
                    default:
                        throw new Error("bad maskPattern:" + t);
                }
            }
            ((e.isValid = function (t) {
                return null != t && "" !== t && !isNaN(t) && t >= 0 && t <= 7;
            }),
                (e.from = function (t) {
                    return e.isValid(t) ? parseInt(t, 10) : void 0;
                }),
                (e.getPenaltyN1 = function (t) {
                    for (var e = t.size, n = 0, o = 0, i = 0, a = null, u = null, s = 0; s < e; s++) {
                        ((o = i = 0), (a = u = null));
                        for (var f = 0; f < e; f++) {
                            var c = t.get(s, f);
                            (c === a ? o++ : (o >= 5 && (n += r.N1 + (o - 5)), (a = c), (o = 1)), (c = t.get(f, s)) === u ? i++ : (i >= 5 && (n += r.N1 + (i - 5)), (u = c), (i = 1)));
                        }
                        (o >= 5 && (n += r.N1 + (o - 5)), i >= 5 && (n += r.N1 + (i - 5)));
                    }
                    return n;
                }),
                (e.getPenaltyN2 = function (t) {
                    for (var e = t.size, n = 0, o = 0; o < e - 1; o++)
                        for (var i = 0; i < e - 1; i++) {
                            var a = t.get(o, i) + t.get(o, i + 1) + t.get(o + 1, i) + t.get(o + 1, i + 1);
                            (4 !== a && 0 !== a) || n++;
                        }
                    return n * r.N2;
                }),
                (e.getPenaltyN3 = function (t) {
                    for (var e = t.size, n = 0, o = 0, i = 0, a = 0; a < e; a++) {
                        o = i = 0;
                        for (var u = 0; u < e; u++) ((o = ((o << 1) & 2047) | t.get(a, u)), u >= 10 && (1488 === o || 93 === o) && n++, (i = ((i << 1) & 2047) | t.get(u, a)), u >= 10 && (1488 === i || 93 === i) && n++);
                    }
                    return n * r.N3;
                }),
                (e.getPenaltyN4 = function (t) {
                    for (var e = 0, n = t.data.length, o = 0; o < n; o++) e += t.data[o];
                    return Math.abs(Math.ceil((100 * e) / n / 5) - 10) * r.N4;
                }),
                (e.applyMask = function (t, e) {
                    for (var r = e.size, n = 0; n < r; n++) for (var o = 0; o < r; o++) e.isReserved(o, n) || e.xor(o, n, getMaskAt(t, o, n));
                }),
                (e.getBestMask = function (t, r) {
                    for (var n = Object.keys(e.Patterns).length, o = 0, i = 1 / 0, a = 0; a < n; a++) {
                        (r(a), e.applyMask(a, t));
                        var u = e.getPenaltyN1(t) + e.getPenaltyN2(t) + e.getPenaltyN3(t) + e.getPenaltyN4(t);
                        (e.applyMask(a, t), u < i && ((i = u), (o = a)));
                    }
                    return o;
                }));
        },
        675: function (t, e, r) {
            var n = r(735),
                o = r(909);
            function fromString(t) {
                if ("string" != typeof t) throw new Error("Param is not a string");
                switch (t.toLowerCase()) {
                    case "numeric":
                        return e.NUMERIC;
                    case "alphanumeric":
                        return e.ALPHANUMERIC;
                    case "kanji":
                        return e.KANJI;
                    case "byte":
                        return e.BYTE;
                    default:
                        throw new Error("Unknown mode: " + t);
                }
            }
            ((e.NUMERIC = { id: "Numeric", bit: 1, ccBits: [10, 12, 14] }),
                (e.ALPHANUMERIC = { id: "Alphanumeric", bit: 2, ccBits: [9, 11, 13] }),
                (e.BYTE = { id: "Byte", bit: 4, ccBits: [8, 16, 16] }),
                (e.KANJI = { id: "Kanji", bit: 8, ccBits: [8, 10, 12] }),
                (e.MIXED = { bit: -1 }),
                (e.getCharCountIndicator = function (t, e) {
                    if (!t.ccBits) throw new Error("Invalid mode: " + t);
                    if (!n.isValid(e)) throw new Error("Invalid version: " + e);
                    return e >= 1 && e < 10 ? t.ccBits[0] : e < 27 ? t.ccBits[1] : t.ccBits[2];
                }),
                (e.getBestModeForData = function (t) {
                    return o.testNumeric(t) ? e.NUMERIC : o.testAlphanumeric(t) ? e.ALPHANUMERIC : o.testKanji(t) ? e.KANJI : e.BYTE;
                }),
                (e.toString = function (t) {
                    if (t && t.id) return t.id;
                    throw new Error("Invalid mode");
                }),
                (e.isValid = function (t) {
                    return t && t.bit && t.ccBits;
                }),
                (e.from = function (t, r) {
                    if (e.isValid(t)) return t;
                    try {
                        return fromString(t);
                    } catch (t) {
                        return r;
                    }
                }));
        },
        679: function (t, e, r) {
            var n = r(82),
                o = [
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17, 23, 34, 9,
                    18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47, 65, 77, 25, 49, 68, 81
                ],
                i = [
                    7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308,
                    448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290,
                    1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430
                ];
            ((e.getBlocksCount = function (t, e) {
                switch (e) {
                    case n.L:
                        return o[4 * (t - 1) + 0];
                    case n.M:
                        return o[4 * (t - 1) + 1];
                    case n.Q:
                        return o[4 * (t - 1) + 2];
                    case n.H:
                        return o[4 * (t - 1) + 3];
                    default:
                        return;
                }
            }),
                (e.getTotalCodewordsCount = function (t, e) {
                    switch (e) {
                        case n.L:
                            return i[4 * (t - 1) + 0];
                        case n.M:
                            return i[4 * (t - 1) + 1];
                        case n.Q:
                            return i[4 * (t - 1) + 2];
                        case n.H:
                            return i[4 * (t - 1) + 3];
                        default:
                            return;
                    }
                }));
        },
        735: function (t, e) {
            e.isValid = function (t) {
                return !isNaN(t) && t >= 1 && t <= 40;
            };
        },
        770: function (t, e, r) {
            var n = r(155),
                o = r(82),
                i = r(524),
                a = r(255),
                u = r(128),
                s = r(827),
                f = r(659),
                c = r(679),
                h = r(915),
                l = r(510),
                g = r(924),
                d = r(675),
                p = r(886);
            function setupFinderPattern(t, e) {
                for (var r = t.size, n = s.getPositions(e), o = 0; o < n.length; o++)
                    for (var i = n[o][0], a = n[o][1], u = -1; u <= 7; u++)
                        if (!(i + u <= -1 || r <= i + u)) for (var f = -1; f <= 7; f++) a + f <= -1 || r <= a + f || ((u >= 0 && u <= 6 && (0 === f || 6 === f)) || (f >= 0 && f <= 6 && (0 === u || 6 === u)) || (u >= 2 && u <= 4 && f >= 2 && f <= 4) ? t.set(i + u, a + f, !0, !0) : t.set(i + u, a + f, !1, !0));
            }
            function setupTimingPattern(t) {
                for (var e = t.size, r = 8; r < e - 8; r++) {
                    var n = r % 2 == 0;
                    (t.set(r, 6, n, !0), t.set(6, r, n, !0));
                }
            }
            function setupAlignmentPattern(t, e) {
                for (var r = u.getPositions(e), n = 0; n < r.length; n++) for (var o = r[n][0], i = r[n][1], a = -2; a <= 2; a++) for (var s = -2; s <= 2; s++) -2 === a || 2 === a || -2 === s || 2 === s || (0 === a && 0 === s) ? t.set(o + a, i + s, !0, !0) : t.set(o + a, i + s, !1, !0);
            }
            function setupVersionInfo(t, e) {
                for (var r, n, o, i = t.size, a = l.getEncodedBits(e), u = 0; u < 18; u++) ((r = Math.floor(u / 3)), (n = (u % 3) + i - 8 - 3), (o = 1 == ((a >> u) & 1)), t.set(r, n, o, !0), t.set(n, r, o, !0));
            }
            function setupFormatInfo(t, e, r) {
                var n,
                    o,
                    i = t.size,
                    a = g.getEncodedBits(e, r);
                for (n = 0; n < 15; n++) ((o = 1 == ((a >> n) & 1)), n < 6 ? t.set(n, 8, o, !0) : n < 8 ? t.set(n + 1, 8, o, !0) : t.set(i - 15 + n, 8, o, !0), n < 8 ? t.set(8, i - n - 1, o, !0) : n < 9 ? t.set(8, 15 - n - 1 + 1, o, !0) : t.set(8, 15 - n - 1, o, !0));
                t.set(i - 8, 8, 1, !0);
            }
            function setupData(t, e) {
                for (var r = t.size, n = -1, o = r - 1, i = 7, a = 0, u = r - 1; u > 0; u -= 2)
                    for (6 === u && u--; ; ) {
                        for (var s = 0; s < 2; s++)
                            if (!t.isReserved(o, u - s)) {
                                var f = !1;
                                (a < e.length && (f = 1 == ((e[a] >>> i) & 1)), t.set(o, u - s, f), -1 === --i && (a++, (i = 7)));
                            }
                        if ((o += n) < 0 || r <= o) {
                            ((o -= n), (n = -n));
                            break;
                        }
                    }
            }
            function createData(t, e, r) {
                var o = new i();
                r.forEach(function (e) {
                    (o.put(e.mode.bit, 4), o.put(e.getLength(), d.getCharCountIndicator(e.mode, t)), e.write(o));
                });
                var a = 8 * (n.getSymbolTotalCodewords(t) - c.getTotalCodewordsCount(t, e));
                for (o.getLengthInBits() + 4 <= a && o.put(0, 4); o.getLengthInBits() % 8 != 0; ) o.putBit(0);
                for (var u = (a - o.getLengthInBits()) / 8, s = 0; s < u; s++) o.put(s % 2 ? 17 : 236, 8);
                return createCodewords(o, t, e);
            }
            function createCodewords(t, e, r) {
                for (
                    var o = n.getSymbolTotalCodewords(e), i = o - c.getTotalCodewordsCount(e, r), a = c.getBlocksCount(e, r), u = a - (o % a), s = Math.floor(o / a), f = Math.floor(i / a), l = f + 1, g = s - f, d = new h(g), p = 0, m = new Array(a), v = new Array(a), y = 0, w = new Uint8Array(t.buffer), E = 0;
                    E < a;
                    E++
                ) {
                    var A = E < u ? f : l;
                    ((m[E] = w.slice(p, p + A)), (v[E] = d.encode(m[E])), (p += A), (y = Math.max(y, A)));
                }
                var _,
                    b,
                    B = new Uint8Array(o),
                    C = 0;
                for (_ = 0; _ < y; _++) for (b = 0; b < a; b++) _ < m[b].length && (B[C++] = m[b][_]);
                for (_ = 0; _ < g; _++) for (b = 0; b < a; b++) B[C++] = v[b][_];
                return B;
            }
            function createSymbol(t, e, r, o) {
                var i;
                if (Array.isArray(t)) i = p.fromArray(t);
                else {
                    if ("string" != typeof t) throw new Error("Invalid data");
                    var u = e;
                    if (!u) {
                        var s = p.rawSplit(t);
                        u = l.getBestVersionForData(s, r);
                    }
                    i = p.fromString(t, u || 40);
                }
                var c = l.getBestVersionForData(i, r);
                if (!c) throw new Error("The amount of data is too big to be stored in a QR Code");
                if (e) {
                    if (e < c) throw new Error("\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + c + ".\n");
                } else e = c;
                var h = createData(e, r, i),
                    g = n.getSymbolSize(e),
                    d = new a(g);
                return (
                    setupFinderPattern(d, e),
                    setupTimingPattern(d),
                    setupAlignmentPattern(d, e),
                    setupFormatInfo(d, r, 0),
                    e >= 7 && setupVersionInfo(d, e),
                    setupData(d, h),
                    isNaN(o) && (o = f.getBestMask(d, setupFormatInfo.bind(null, d, r))),
                    f.applyMask(o, d),
                    setupFormatInfo(d, r, o),
                    { modules: d, version: e, errorCorrectionLevel: r, maskPattern: o, segments: i }
                );
            }
            e.create = function (t, e) {
                if ("undefined" == typeof t || "" === t) throw new Error("No input text");
                var r,
                    i,
                    a = o.M;
                return ("undefined" != typeof e && ((a = o.from(e.errorCorrectionLevel, o.M)), (r = l.from(e.version)), (i = f.from(e.maskPattern)), e.toSJISFunc && n.setToSJISFunction(e.toSJISFunc)), createSymbol(t, r, a, i));
            };
        },
        827: function (t, e, r) {
            var n = r(155).getSymbolSize,
                o = 7;
            e.getPositions = function (t) {
                var e = n(t);
                return [
                    [0, 0],
                    [e - o, 0],
                    [0, e - o]
                ];
            };
        },
        860: function (t, e, r) {
            var n = r(578),
                o = r(770),
                i = r(948),
                a = r(641);
            function renderCanvas(t, e, r, i, a) {
                var u = [].slice.call(arguments, 1),
                    s = u.length,
                    f = "function" == typeof u[s - 1];
                if (!f && !n()) throw new Error("Callback required as last argument");
                if (!f) {
                    if (s < 1) throw new Error("Too few arguments provided");
                    return (
                        1 === s ? ((r = e), (e = i = void 0)) : 2 !== s || e.getContext || ((i = r), (r = e), (e = void 0)),
                        new Promise(function (n, a) {
                            try {
                                var u = o.create(r, i);
                                n(t(u, e, i));
                            } catch (t) {
                                a(t);
                            }
                        })
                    );
                }
                if (s < 2) throw new Error("Too few arguments provided");
                2 === s ? ((a = r), (r = e), (e = i = void 0)) : 3 === s && (e.getContext && "undefined" == typeof a ? ((a = i), (i = void 0)) : ((a = i), (i = r), (r = e), (e = void 0)));
                try {
                    var c = o.create(r, i);
                    a(null, t(c, e, i));
                } catch (t) {
                    a(t);
                }
            }
            (o.create,
                renderCanvas.bind(null, i.render),
                renderCanvas.bind(null, i.renderToDataURL),
                (e.toString = renderCanvas.bind(null, function (t, e, r) {
                    return a.render(t, r);
                })));
        },
        867: function (t, e) {
            function hex2rgba(t) {
                if (("number" == typeof t && (t = t.toString()), "string" != typeof t)) throw new Error("Color should be defined as hex string");
                var e = t.slice().replace("#", "").split("");
                if (e.length < 3 || 5 === e.length || e.length > 8) throw new Error("Invalid hex color: " + t);
                ((3 !== e.length && 4 !== e.length) ||
                    (e = Array.prototype.concat.apply(
                        [],
                        e.map(function (t) {
                            return [t, t];
                        })
                    )),
                    6 === e.length && e.push("F", "F"));
                var r = parseInt(e.join(""), 16);
                return { r: (r >> 24) & 255, g: (r >> 16) & 255, b: (r >> 8) & 255, a: 255 & r, hex: "#" + e.slice(0, 6).join("") };
            }
            ((e.getOptions = function (t) {
                (t || (t = {}), t.color || (t.color = {}));
                var e = "undefined" == typeof t.margin || null === t.margin || t.margin < 0 ? 4 : t.margin,
                    r = t.width && t.width >= 21 ? t.width : void 0,
                    n = t.scale || 4;
                return { width: r, scale: r ? 4 : n, margin: e, color: { dark: hex2rgba(t.color.dark || "#000000ff"), light: hex2rgba(t.color.light || "#ffffffff") }, type: t.type, rendererOpts: t.rendererOpts || {} };
            }),
                (e.getScale = function (t, e) {
                    return e.width && e.width >= t + 2 * e.margin ? e.width / (t + 2 * e.margin) : e.scale;
                }),
                (e.getImageWidth = function (t, r) {
                    var n = e.getScale(t, r);
                    return Math.floor((t + 2 * r.margin) * n);
                }),
                (e.qrToImageData = function (t, r, n) {
                    for (var o = r.modules.size, i = r.modules.data, a = e.getScale(o, n), u = Math.floor((o + 2 * n.margin) * a), s = n.margin * a, f = [n.color.light, n.color.dark], c = 0; c < u; c++)
                        for (var h = 0; h < u; h++) {
                            var l = 4 * (c * u + h),
                                g = n.color.light;
                            if (c >= s && h >= s && c < u - s && h < u - s) g = f[i[Math.floor((c - s) / a) * o + Math.floor((h - s) / a)] ? 1 : 0];
                            ((t[l++] = g.r), (t[l++] = g.g), (t[l++] = g.b), (t[l] = g.a));
                        }
                }));
        },
        886: function (t, e, r) {
            var n = r(675),
                o = r(2),
                i = r(892),
                a = r(539),
                u = r(894),
                s = r(909),
                f = r(155),
                c = r(320);
            function getStringByteLength(t) {
                return unescape(encodeURIComponent(t)).length;
            }
            function getSegments(t, e, r) {
                for (var n, o = []; null !== (n = t.exec(r)); ) o.push({ data: n[0], index: n.index, mode: e, length: n[0].length });
                return o;
            }
            function getSegmentsFromString(t) {
                var e,
                    r,
                    o = getSegments(s.NUMERIC, n.NUMERIC, t),
                    i = getSegments(s.ALPHANUMERIC, n.ALPHANUMERIC, t);
                return (
                    f.isKanjiModeEnabled() ? ((e = getSegments(s.BYTE, n.BYTE, t)), (r = getSegments(s.KANJI, n.KANJI, t))) : ((e = getSegments(s.BYTE_KANJI, n.BYTE, t)), (r = [])),
                    o
                        .concat(i, e, r)
                        .sort(function (t, e) {
                            return t.index - e.index;
                        })
                        .map(function (t) {
                            return { data: t.data, mode: t.mode, length: t.length };
                        })
                );
            }
            function getSegmentBitsLength(t, e) {
                switch (e) {
                    case n.NUMERIC:
                        return o.getBitsLength(t);
                    case n.ALPHANUMERIC:
                        return i.getBitsLength(t);
                    case n.KANJI:
                        return u.getBitsLength(t);
                    case n.BYTE:
                        return a.getBitsLength(t);
                }
            }
            function mergeSegments(t) {
                return t.reduce(function (t, e) {
                    var r = t.length - 1 >= 0 ? t[t.length - 1] : null;
                    return r && r.mode === e.mode ? ((t[t.length - 1].data += e.data), t) : (t.push(e), t);
                }, []);
            }
            function buildNodes(t) {
                for (var e = [], r = 0; r < t.length; r++) {
                    var o = t[r];
                    switch (o.mode) {
                        case n.NUMERIC:
                            e.push([o, { data: o.data, mode: n.ALPHANUMERIC, length: o.length }, { data: o.data, mode: n.BYTE, length: o.length }]);
                            break;
                        case n.ALPHANUMERIC:
                            e.push([o, { data: o.data, mode: n.BYTE, length: o.length }]);
                            break;
                        case n.KANJI:
                            e.push([o, { data: o.data, mode: n.BYTE, length: getStringByteLength(o.data) }]);
                            break;
                        case n.BYTE:
                            e.push([{ data: o.data, mode: n.BYTE, length: getStringByteLength(o.data) }]);
                    }
                }
                return e;
            }
            function buildGraph(t, e) {
                for (var r = {}, o = { start: {} }, i = ["start"], a = 0; a < t.length; a++) {
                    for (var u = t[a], s = [], f = 0; f < u.length; f++) {
                        var c = u[f],
                            h = "" + a + f;
                        (s.push(h), (r[h] = { node: c, lastCount: 0 }), (o[h] = {}));
                        for (var l = 0; l < i.length; l++) {
                            var g = i[l];
                            r[g] && r[g].node.mode === c.mode
                                ? ((o[g][h] = getSegmentBitsLength(r[g].lastCount + c.length, c.mode) - getSegmentBitsLength(r[g].lastCount, c.mode)), (r[g].lastCount += c.length))
                                : (r[g] && (r[g].lastCount = c.length), (o[g][h] = getSegmentBitsLength(c.length, c.mode) + 4 + n.getCharCountIndicator(c.mode, e)));
                        }
                    }
                    i = s;
                }
                for (var d = 0; d < i.length; d++) o[i[d]].end = 0;
                return { map: o, table: r };
            }
            function buildSingleSegment(t, e) {
                var r,
                    s = n.getBestModeForData(t);
                if ((r = n.from(e, s)) !== n.BYTE && r.bit < s.bit) throw new Error('"' + t + '" cannot be encoded with mode ' + n.toString(r) + ".\n Suggested mode is: " + n.toString(s));
                switch ((r !== n.KANJI || f.isKanjiModeEnabled() || (r = n.BYTE), r)) {
                    case n.NUMERIC:
                        return new o(t);
                    case n.ALPHANUMERIC:
                        return new i(t);
                    case n.KANJI:
                        return new u(t);
                    case n.BYTE:
                        return new a(t);
                }
            }
            ((e.fromArray = function (t) {
                return t.reduce(function (t, e) {
                    return ("string" == typeof e ? t.push(buildSingleSegment(e, null)) : e.data && t.push(buildSingleSegment(e.data, e.mode)), t);
                }, []);
            }),
                (e.fromString = function (t, r) {
                    for (var n = buildGraph(buildNodes(getSegmentsFromString(t, f.isKanjiModeEnabled())), r), o = c.find_path(n.map, "start", "end"), i = [], a = 1; a < o.length - 1; a++) i.push(n.table[o[a]].node);
                    return e.fromArray(mergeSegments(i));
                }),
                (e.rawSplit = function (t) {
                    return e.fromArray(getSegmentsFromString(t, f.isKanjiModeEnabled()));
                }));
        },
        892: function (t, e, r) {
            var n = r(675),
                o = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":"];
            function AlphanumericData(t) {
                ((this.mode = n.ALPHANUMERIC), (this.data = t));
            }
            ((AlphanumericData.getBitsLength = function (t) {
                return 11 * Math.floor(t / 2) + (t % 2) * 6;
            }),
                (AlphanumericData.prototype.getLength = function () {
                    return this.data.length;
                }),
                (AlphanumericData.prototype.getBitsLength = function () {
                    return AlphanumericData.getBitsLength(this.data.length);
                }),
                (AlphanumericData.prototype.write = function (t) {
                    var e;
                    for (e = 0; e + 2 <= this.data.length; e += 2) {
                        var r = 45 * o.indexOf(this.data[e]);
                        ((r += o.indexOf(this.data[e + 1])), t.put(r, 11));
                    }
                    this.data.length % 2 && t.put(o.indexOf(this.data[e]), 6);
                }),
                (t.exports = AlphanumericData));
        },
        894: function (t, e, r) {
            var n = r(675),
                o = r(155);
            function KanjiData(t) {
                ((this.mode = n.KANJI), (this.data = t));
            }
            ((KanjiData.getBitsLength = function (t) {
                return 13 * t;
            }),
                (KanjiData.prototype.getLength = function () {
                    return this.data.length;
                }),
                (KanjiData.prototype.getBitsLength = function () {
                    return KanjiData.getBitsLength(this.data.length);
                }),
                (KanjiData.prototype.write = function (t) {
                    var e;
                    for (e = 0; e < this.data.length; e++) {
                        var r = o.toSJIS(this.data[e]);
                        if (r >= 33088 && r <= 40956) r -= 33088;
                        else {
                            if (!(r >= 57408 && r <= 60351)) throw new Error("Invalid SJIS character: " + this.data[e] + "\nMake sure your charset is UTF-8");
                            r -= 49472;
                        }
                        ((r = 192 * ((r >>> 8) & 255) + (255 & r)), t.put(r, 13));
                    }
                }),
                (t.exports = KanjiData));
        },
        909: function (t, e) {
            var r = "[0-9]+",
                n = "[A-Z $%*+\\-./:]+",
                o = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+",
                i = "(?:(?![A-Z0-9 $%*+\\-./:]|" + (o = o.replace(/u/g, "\\u")) + ")(?:.|[\r\n]))+";
            ((e.KANJI = new RegExp(o, "g")), (e.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g")), (e.BYTE = new RegExp(i, "g")), (e.NUMERIC = new RegExp(r, "g")), (e.ALPHANUMERIC = new RegExp(n, "g")));
            var a = new RegExp("^" + o + "$"),
                u = new RegExp("^" + r + "$"),
                s = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
            ((e.testKanji = function (t) {
                return a.test(t);
            }),
                (e.testNumeric = function (t) {
                    return u.test(t);
                }),
                (e.testAlphanumeric = function (t) {
                    return s.test(t);
                }));
        },
        915: function (t, e, r) {
            var n = r(630);
            function ReedSolomonEncoder(t) {
                ((this.genPoly = void 0), (this.degree = t), this.degree && this.initialize(this.degree));
            }
            ((ReedSolomonEncoder.prototype.initialize = function (t) {
                ((this.degree = t), (this.genPoly = n.generateECPolynomial(this.degree)));
            }),
                (ReedSolomonEncoder.prototype.encode = function (t) {
                    if (!this.genPoly) throw new Error("Encoder not initialized");
                    var e = new Uint8Array(t.length + this.degree);
                    e.set(t);
                    var r = n.mod(e, this.genPoly),
                        o = this.degree - r.length;
                    if (o > 0) {
                        var i = new Uint8Array(this.degree);
                        return (i.set(r, o), i);
                    }
                    return r;
                }),
                (t.exports = ReedSolomonEncoder));
        },
        924: function (t, e, r) {
            var n = r(155),
                o = 1335,
                i = 21522,
                a = n.getBCHDigit(o);
            e.getEncodedBits = function (t, e) {
                for (var r = (t.bit << 3) | e, u = r << 10; n.getBCHDigit(u) - a >= 0; ) u ^= o << (n.getBCHDigit(u) - a);
                return ((r << 10) | u) ^ i;
            };
        },
        948: function (t, e, r) {
            var n = r(867);
            function clearCanvas(t, e, r) {
                (t.clearRect(0, 0, e.width, e.height), e.style || (e.style = {}), (e.height = r), (e.width = r), (e.style.height = r + "px"), (e.style.width = r + "px"));
            }
            function getCanvasElement() {
                try {
                    return document.createElement("canvas");
                } catch (t) {
                    throw new Error("You need to specify a canvas element");
                }
            }
            ((e.render = function (t, e, r) {
                var o = r,
                    i = e;
                ("undefined" != typeof o || (e && e.getContext) || ((o = e), (e = void 0)), e || (i = getCanvasElement()), (o = n.getOptions(o)));
                var a = n.getImageWidth(t.modules.size, o),
                    u = i.getContext("2d"),
                    s = u.createImageData(a, a);
                return (n.qrToImageData(s.data, t, o), clearCanvas(u, i, a), u.putImageData(s, 0, 0), i);
            }),
                (e.renderToDataURL = function (t, r, n) {
                    var o = n;
                    ("undefined" != typeof o || (r && r.getContext) || ((o = r), (r = void 0)), o || (o = {}));
                    var i = e.render(t, r, o),
                        a = o.type || "image/png",
                        u = o.rendererOpts || {};
                    return i.toDataURL(a, u.quality);
                }));
        }
    },
    __webpack_module_cache__ = {};
function __webpack_require__(t) {
    var e = __webpack_module_cache__[t];
    if (void 0 !== e) return e.exports;
    var r = (__webpack_module_cache__[t] = { exports: {} });
    return (__webpack_modules__[t](r, r.exports, __webpack_require__), r.exports);
}
((__webpack_require__.d = function (t, e) {
    for (var r in e) __webpack_require__.o(e, r) && !__webpack_require__.o(t, r) && Object.defineProperty(t, r, { enumerable: !0, get: e[r] });
}),
    (__webpack_require__.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
    }));
var __webpack_exports__ = {};
(!(function () {
    "use strict";
    __webpack_require__.d(__webpack_exports__, {
        default: function () {
            return generateQRCode;
        }
    });
    var t = __webpack_require__(860);
    function generateQRCode(e) {
        var r = "",
            n = null;
        if (
            ((0, t.toString)(e, { type: "svg" }, function (t, e) {
                ((n = t), (r = e));
            }),
            n)
        )
            throw ("undefined" != typeof service && service.log_error("Error generating QR code: " + n), n);
        return r;
    }
})(),
    (NaviamQRCode = __webpack_exports__.default));
