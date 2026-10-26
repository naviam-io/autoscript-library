import qrcode from 'qrcode-generator';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type ImageFormat = 'png' | 'svg';

export interface QrCodeOptions {
    value: string;
    /** Pixels drawn for each module (the black or white squares) of the code, or null to fit the code to width and height. */
    scale: number | null;
    /** Image width in pixels, or null to size the image from the scale. */
    width: number | null;
    /** Image height in pixels, or null to size the image from the scale. */
    height: number | null;
    /** Width of the white border, in modules. The QR specification asks for at least four. */
    margin: number;
    errorCorrection: ErrorCorrectionLevel;
    format: ImageFormat;
}

/** The request parameters as they arrive, each absent one null. */
export interface QrCodeParameters {
    value: string | null;
    scale: string | null;
    width: string | null;
    height: string | null;
    margin: string | null;
    errorCorrection: string | null;
    format: string | null;
}

/** Where the code is drawn within the image. */
export interface QrCodeLayout {
    scale: number;
    imageWidth: number;
    imageHeight: number;
    /** Pixels from the left edge of the image to the first module. */
    offsetX: number;
    /** Pixels from the top edge of the image to the first module. */
    offsetY: number;
}

export var DEFAULT_SCALE = 8;
export var DEFAULT_MARGIN = 4;
export var DEFAULT_ERROR_CORRECTION: ErrorCorrectionLevel = 'M';
export var DEFAULT_FORMAT: ImageFormat = 'png';
export var MAXIMUM_SCALE = 40;
export var MAXIMUM_MARGIN = 20;
/** The widest image produced, in pixels, so a single request cannot exhaust the server's memory. */
export var MAXIMUM_IMAGE_SIZE = 4096;

var ERROR_CORRECTION_LEVELS = ['L', 'M', 'Q', 'H'];
var IMAGE_FORMATS = ['png', 'svg'];

// Encode text as UTF-8 rather than the library's default, which keeps only the low byte of each character.
qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];

/**
 * A request the caller can correct, reported to them with a 400 status.
 * Deliberately not a subclass of Error, which does not keep its prototype when compiled to ES5.
 */
export class QrCodeRequestError {
    reason: string;
    message: string;

    constructor(reason: string, message: string) {
        this.reason = reason;
        this.message = message;
    }
}

/**
 * Validates the request parameters and fills in the defaults.
 * @param parameters the raw request parameters.
 * @returns the options to generate the code with.
 * @throws QrCodeRequestError when a parameter is missing or out of range.
 */
export function parseQrCodeOptions(parameters: QrCodeParameters): QrCodeOptions {
    if (parameters.value === null || parameters.value.length === 0) {
        throw new QrCodeRequestError('missingValue', 'A value to encode is required.');
    }

    var errorCorrection = parameters.errorCorrection === null ? DEFAULT_ERROR_CORRECTION : parameters.errorCorrection.toUpperCase();
    if (ERROR_CORRECTION_LEVELS.indexOf(errorCorrection) === -1) {
        throw new QrCodeRequestError('invalidErrorCorrection', 'The errorCorrection parameter must be one of L, M, Q or H.');
    }

    var format = parameters.format === null || parameters.format.length === 0 ? DEFAULT_FORMAT : parameters.format.toLowerCase();
    if (IMAGE_FORMATS.indexOf(format) === -1) {
        throw new QrCodeRequestError('invalidFormat', 'The format parameter must be png or svg.');
    }

    var width = parseInteger(parameters.width, 'width', null, 1, MAXIMUM_IMAGE_SIZE);
    var height = parseInteger(parameters.height, 'height', null, 1, MAXIMUM_IMAGE_SIZE);
    var scale = parseInteger(parameters.scale, 'scale', null, 1, MAXIMUM_SCALE);
    if (scale !== null && (width !== null || height !== null)) {
        throw new QrCodeRequestError('conflictingParameters', 'Give either scale, or width and height, not both.');
    }

    // A QR code is square, so one dimension alone sizes both.
    return {
        value: parameters.value,
        scale: width === null && height === null && scale === null ? DEFAULT_SCALE : scale,
        width: width !== null ? width : height,
        height: height !== null ? height : width,
        margin: parseInteger(parameters.margin, 'margin', DEFAULT_MARGIN, 0, MAXIMUM_MARGIN),
        errorCorrection: errorCorrection as ErrorCorrectionLevel,
        format: format as ImageFormat
    };
}

/**
 * Works out the image size and where the code sits within it. With a width and height, the code
 * is drawn at the largest whole number of pixels per module that fits with its margin, centered;
 * whole pixels keep every module the same size, which scanners rely on.
 * @param moduleCount the modules along one side of the code.
 * @param options the validated options.
 * @returns the layout to draw with.
 * @throws QrCodeRequestError when the code does not fit the requested size, or the image would be too large.
 */
export function computeQrCodeLayout(moduleCount: number, options: QrCodeOptions): QrCodeLayout {
    var modulesWithMargin = moduleCount + options.margin * 2;

    if (options.scale !== null) {
        var imageSize = modulesWithMargin * options.scale;
        if (imageSize > MAXIMUM_IMAGE_SIZE) {
            throw new QrCodeRequestError(
                'imageTooLarge',
                'The image would be ' + imageSize + ' pixels wide, more than the ' + MAXIMUM_IMAGE_SIZE + ' allowed. Use a smaller scale or margin.'
            );
        }
        var offset = options.margin * options.scale;
        return { scale: options.scale, imageWidth: imageSize, imageHeight: imageSize, offsetX: offset, offsetY: offset };
    }

    var scale = Math.floor(Math.min(options.width, options.height) / modulesWithMargin);
    if (scale < 1) {
        throw new QrCodeRequestError(
            'imageTooSmall',
            'This code needs at least ' + modulesWithMargin + ' pixels on each side, including its margin. Use a larger width and height, or a smaller margin.'
        );
    }

    var codeSize = moduleCount * scale;
    return {
        scale: scale,
        imageWidth: options.width,
        imageHeight: options.height,
        offsetX: Math.floor((options.width - codeSize) / 2),
        offsetY: Math.floor((options.height - codeSize) / 2)
    };
}

/**
 * Encodes the value as a QR code.
 * @param options the validated options.
 * @returns the module grid, indexed by row then column, true where a module is dark.
 * @throws QrCodeRequestError when the value does not fit in a QR code.
 */
export function buildQrCodeMatrix(options: QrCodeOptions): boolean[][] {
    // Type number zero picks the smallest code that holds the value.
    var code = qrcode(0, options.errorCorrection);
    code.addData(options.value, 'Byte');

    try {
        code.make();
    } catch (error) {
        // The library throws plain strings; the only one input can cause is the overflow.
        if (typeof error === 'string' && error.indexOf('code length overflow') === 0) {
            throw new QrCodeRequestError(
                'valueTooLong',
                'The value is too long for a QR code at error correction level ' + options.errorCorrection + '. Shorten it or use a lower level.'
            );
        }
        throw error;
    }

    var moduleCount = code.getModuleCount();
    var matrix: boolean[][] = [];
    for (var row = 0; row < moduleCount; row++) {
        var cells: boolean[] = [];
        for (var column = 0; column < moduleCount; column++) {
            cells.push(code.isDark(row, column));
        }
        matrix.push(cells);
    }
    return matrix;
}

/**
 * Parses an optional whole number parameter.
 * @param text the parameter as received, or null when absent.
 * @param name the parameter name, for the error message.
 * @param defaultValue the value used when the parameter is absent, which may be null.
 * @param minimum the smallest value allowed.
 * @param maximum the largest value allowed.
 * @returns the parsed number, or the default when absent.
 * @throws QrCodeRequestError when the text is not a whole number within range.
 */
function parseInteger(text: string | null, name: string, defaultValue: number | null, minimum: number, maximum: number): number | null {
    if (text === null || text.length === 0) {
        return defaultValue;
    }

    var value = /^\d+$/.test(text) ? parseInt(text, 10) : NaN;
    if (isNaN(value) || value < minimum || value > maximum) {
        throw new QrCodeRequestError('invalidParameter', 'The ' + name + ' parameter must be a whole number from ' + minimum + ' to ' + maximum + '.');
    }
    return value;
}
