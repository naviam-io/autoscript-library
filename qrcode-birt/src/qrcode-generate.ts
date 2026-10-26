/// <reference path="../globals.d.ts" />
/// <reference path="../manage-facade.d.ts" />

import { buildQrCodeMatrix, computeQrCodeLayout, parseQrCodeOptions, QrCodeLayout, QrCodeOptions, QrCodeRequestError } from './qrcode-generation';

// Java classes are looked up only when used, through javaType, so the script also loads in BIRT's
// Rhino engine, which has no Java.type, and an SVG generated there needs no Java at all.

/** The options a BIRT report may pass to NaviamQRCode, each optional, as the query parameters of the same names. */
export interface GenerateQrCodeOptions {
    format?: string;
    scale?: number | string;
    width?: number | string;
    height?: number | string;
    margin?: number | string;
    errorCorrection?: string;
}

/** The parts of the script request this script uses, which the bundled declarations do not describe. */
interface ScriptRequest {
    getQueryParam(name: string): string | null;
    getHttpServletResponse(): HttpResponse;
}

interface HttpResponse {
    setBufferSize(size: number): void;
    setStatus(status: number): void;
    setContentType(contentType: string): void;
    setContentLength(length: number): void;
    setHeader(name: string, value: string): void;
    flushBuffer(): void;
    getOutputStream(): { write(bytes: any): void; flush(): void };
}

main();

/**
 * Answers GET /maximo/oslc/script/NV.QRCODE.GENERATE?value=<text> with a PNG image of a QR code
 * encoding the value. A POST encodes its request body instead, for values too long for a URL.
 * Optional query parameters: format (png or svg, default png), width and height (image size in pixels; the code is fitted inside
 * and centered, and one alone makes a square), or instead scale (pixels per module, default 8,
 * sizing the image to the code), margin (modules of white border, default 4) and errorCorrection
 * (L, M, Q or H, default M). Errors are answered as JSON.
 */
function main() {
    if (typeof request === 'undefined') {
        return;
    }

    var scriptRequest = request as unknown as ScriptRequest;
    var response = scriptRequest.getHttpServletResponse();

    try {
        var method = typeof httpMethod !== 'undefined' && httpMethod ? String(httpMethod).toUpperCase() : 'GET';
        if (method !== 'GET' && method !== 'POST') {
            throw new QrCodeRequestError('methodNotAllowed', 'Only GET and POST are supported.');
        }

        var value = method === 'POST' ? (typeof requestBody !== 'undefined' && requestBody !== null ? String(requestBody) : null) : readQueryParam(scriptRequest, 'value');

        var options = parseQrCodeOptions({
            value: value,
            scale: readQueryParam(scriptRequest, 'scale'),
            width: readQueryParam(scriptRequest, 'width'),
            height: readQueryParam(scriptRequest, 'height'),
            margin: readQueryParam(scriptRequest, 'margin'),
            errorCorrection: readQueryParam(scriptRequest, 'errorCorrection'),
            format: readQueryParam(scriptRequest, 'format')
        });

        // Render fully before committing the response, so a failure can still be reported as an error.
        var image = renderImage(options);
        if (options.format === 'svg') {
            image = new (javaType<any>('java.lang.String'))(image).getBytes('UTF-8');
        }

        response.setBufferSize(0);
        response.setStatus(200);
        response.setContentType(options.format === 'svg' ? 'image/svg+xml; charset=UTF-8' : 'image/png');
        response.setContentLength(image.length);
        response.setHeader('Content-Disposition', 'inline; filename="qrcode.' + options.format + '"');
        response.setHeader('Cache-Control', 'no-store');
        response.flushBuffer();

        var outputStream = response.getOutputStream();
        outputStream.write(image);
        outputStream.flush();
    } catch (error) {
        if (error instanceof QrCodeRequestError) {
            writeError(response, error.reason === 'methodNotAllowed' ? 405 : 400, error.reason, error.message);
        } else {
            service.log_error('NV.QRCODE.GENERATE failed: ' + describeError(error));
            writeError(response, 500, 'unexpectedError', describeError(error));
        }
    }
}

/**
 * Generates a QR code for a BIRT report. Evaluating this script's source returns this function,
 * which the report keeps as NaviamQRCode; see the README.
 * @param value the text to encode.
 * @param options the same options as the query parameters of the web request, all optional.
 * @returns the SVG markup as a string, or for format png the PNG file as a Java byte array.
 * @throws Error when the value or an option is not valid.
 */
export default function generateQrCode(value: any, options?: GenerateQrCodeOptions): any {
    options = options || {};
    try {
        return renderImage(
            parseQrCodeOptions({
                value: toParameter(value),
                scale: toParameter(options.scale),
                width: toParameter(options.width),
                height: toParameter(options.height),
                margin: toParameter(options.margin),
                errorCorrection: toParameter(options.errorCorrection),
                // BIRT reports have always received SVG, so it stays their default.
                format: options.format ? String(options.format) : 'svg'
            })
        );
    } catch (error) {
        // A QrCodeRequestError is not an Error, so BIRT would otherwise report it as [object Object].
        throw new Error('NaviamQRCode: ' + describeError(error));
    }
}

/** @maximoGlobal */
var scriptConfig = {
    "autoscript": 'NV.QRCODE.GENERATE',
    "description": 'Generates a QR code PNG or SVG image, for a web request or a BIRT report',
    "version": '1.2.0',
    "active": true,
    "logLevel": 'ERROR',
    "allowInvokingScriptFunctions": false
};

/**
 * Encodes the value and draws it in the requested format.
 * @param options the validated options.
 * @returns the SVG markup as a string, or the PNG file as a Java byte array.
 */
function renderImage(options: QrCodeOptions): any {
    var matrix = buildQrCodeMatrix(options);
    var layout = computeQrCodeLayout(matrix.length, options);
    return options.format === 'svg' ? renderSvg(matrix, layout) : renderPng(matrix, layout);
}

/**
 * Encodes the QR code as a black and white PNG, one bit per pixel to keep it small.
 * The PNG is written directly rather than drawn with java.awt: in BIRT's Rhino engine on Java 17
 * and later, AWT's Graphics2D resolves to an internal class the module system denies access to.
 * @param matrix the module grid, true where a module is dark.
 * @param layout the image size and where the code sits within it.
 * @returns the PNG file as a Java byte array.
 */
function renderPng(matrix: boolean[][], layout: QrCodeLayout): any {
    var ByteArrayOutputStream = javaType<any>('java.io.ByteArrayOutputStream');
    var DeflaterOutputStream = javaType<any>('java.util.zip.DeflaterOutputStream');
    var moduleCount = matrix.length;
    var bytesPerLine = Math.ceil(layout.imageWidth / 8);

    // Each scan line is a filter type byte, zero for none, followed by the pixels, eight to a byte
    // with the leftmost in the high bit, and a set bit white. Lines within one module row are the same.
    var pixels = new ByteArrayOutputStream();
    var deflater = new DeflaterOutputStream(pixels);
    var line: number[] = null;
    var lineRow = NaN;
    for (var y = 0; y < layout.imageHeight; y++) {
        var row = Math.floor((y - layout.offsetY) / layout.scale);
        if (row !== lineRow) {
            line = [];
            for (var byteIndex = 0; byteIndex < bytesPerLine; byteIndex++) {
                var packed = 0;
                for (var bit = 0; bit < 8; bit++) {
                    var column = Math.floor((byteIndex * 8 + bit - layout.offsetX) / layout.scale);
                    var dark = row >= 0 && row < moduleCount && column >= 0 && column < moduleCount && matrix[row][column];
                    if (!dark) {
                        packed |= 0x80 >> bit;
                    }
                }
                line.push(packed);
            }
            lineRow = row;
        }

        deflater.write(0);
        for (var i = 0; i < line.length; i++) {
            deflater.write(line[i]);
        }
    }
    deflater.finish();

    var header = new ByteArrayOutputStream();
    writeInt32(header, layout.imageWidth);
    writeInt32(header, layout.imageHeight);
    // Bit depth 1, grayscale, deflate compression, adaptive filtering, not interlaced.
    var settings = [1, 0, 0, 0, 0];
    for (var s = 0; s < settings.length; s++) {
        header.write(settings[s]);
    }

    var png = new ByteArrayOutputStream();
    var signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    for (var b = 0; b < signature.length; b++) {
        png.write(signature[b]);
    }
    writePngChunk(png, 'IHDR', header.toByteArray());
    writePngChunk(png, 'IDAT', pixels.toByteArray());
    writePngChunk(png, 'IEND', new ByteArrayOutputStream().toByteArray());
    return png.toByteArray();
}

/**
 * Writes a PNG chunk: its length, type, data and the CRC of its type and data.
 * @param output the stream to write to.
 * @param type the four letter chunk type.
 * @param data the chunk data, a Java byte array.
 */
function writePngChunk(output: any, type: string, data: any): void {
    var crc = new (javaType<any>('java.util.zip.CRC32'))();
    writeInt32(output, data.length);
    for (var i = 0; i < type.length; i++) {
        output.write(type.charCodeAt(i));
        crc.update(type.charCodeAt(i));
    }
    output.write(data, 0, data.length);
    crc.update(data, 0, data.length);
    // Nashorn may hand back the long as a java.lang.Long rather than a number.
    writeInt32(output, Number(crc.getValue()));
}

/**
 * Writes a number as four bytes, most significant first.
 * @param output the stream to write to.
 * @param value the number, from 0 to 2^32 - 1.
 */
function writeInt32(output: any, value: number): void {
    output.write((value >>> 24) & 0xff);
    output.write((value >>> 16) & 0xff);
    output.write((value >>> 8) & 0xff);
    output.write(value & 0xff);
}

/**
 * Draws the QR code as an SVG image, one path holding a rectangle for each horizontal run of dark modules.
 * @param matrix the module grid, true where a module is dark.
 * @param layout the image size and where the code sits within it.
 * @returns the SVG markup.
 */
function renderSvg(matrix: boolean[][], layout: QrCodeLayout): string {
    var moduleCount = matrix.length;
    var path = '';
    for (var row = 0; row < moduleCount; row++) {
        var column = 0;
        while (column < moduleCount) {
            if (!matrix[row][column]) {
                column++;
                continue;
            }
            var runStart = column;
            while (column < moduleCount && matrix[row][column]) {
                column++;
            }
            var runWidth = (column - runStart) * layout.scale;
            path += 'M' + (layout.offsetX + runStart * layout.scale) + ' ' + (layout.offsetY + row * layout.scale) + 'h' + runWidth + 'v' + layout.scale + 'h-' + runWidth + 'z';
        }
    }

    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="' + layout.imageWidth + '" height="' + layout.imageHeight + '"' +
        ' viewBox="0 0 ' + layout.imageWidth + ' ' + layout.imageHeight + '" shape-rendering="crispEdges">' +
        '<rect width="100%" height="100%" fill="#ffffff"/>' +
        '<path d="' + path + '" fill="#000000"/>' +
        '</svg>\n'
    );
}

/**
 * Converts a value passed by a report to a string, as a query parameter arrives.
 * @param value the value, which may be a JavaScript or Java object.
 * @returns the value as a string, or null when absent.
 */
function toParameter(value: any): string | null {
    return value === null || typeof value === 'undefined' ? null : String(value);
}

/**
 * Reads a query parameter as a JavaScript string.
 * @param scriptRequest the script request.
 * @param name the parameter name.
 * @returns the value, or null when the parameter is absent.
 */
function readQueryParam(scriptRequest: ScriptRequest, name: string): string | null {
    var value = scriptRequest.getQueryParam(name);
    return value === null || typeof value === 'undefined' ? null : String(value);
}

/**
 * Answers the request with a JSON error.
 * @param response the servlet response, not yet committed.
 * @param status the HTTP status code.
 * @param reason a short identifier of the failure.
 * @param message a description of the failure for the caller.
 */
function writeError(response: HttpResponse, status: number, reason: string, message: string): void {
    var body = new (javaType<any>('java.lang.String'))(JSON.stringify({ status: 'error', reason: reason, message: message })).getBytes('UTF-8');
    response.setBufferSize(0);
    response.setStatus(status);
    response.setContentType('application/json; charset=UTF-8');
    response.setContentLength(body.length);
    response.flushBuffer();

    var outputStream = response.getOutputStream();
    outputStream.write(body);
    outputStream.flush();
}

/**
 * Describes a caught error, which may be a JavaScript Error, a thrown string or a Java throwable.
 * @param error the caught value.
 * @returns a message describing it.
 */
function describeError(error: any): string {
    if (error && typeof error.getMessage === 'function') {
        return String(error.getMessage());
    }
    if (error && error.message) {
        return String(error.message);
    }
    return String(error);
}
