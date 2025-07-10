
function isObject(o) {
    if (typeof o !== 'object' || o === null) return false;
    return Object.prototype.toString.call(o) === '[object Object]'
        && Object.getPrototypeOf(o) === Object.prototype;
}

function getPath(path) {
    if (typeof path === 'string') {
        path = path.split('.');
    } else if (
        Number.isInteger(path) ||
        typeof path === 'symbol'
    ) {
        path = [path];
    } else if (!Array.isArray(path)) {
        throw `poke second argument must be any of a string, symbol, integer or an array but got ${path}`;
    }
    return path;
}

function poke(obj, path, value) {
    path = getPath(path);

    let curr = obj;

    for (let i = 0; i < path.length; i++) {
        const key = path[i];

        if (
            typeof key === 'string' ||
            typeof key === 'symbol'
        ) {
            if (!isObject(curr)) return curr;
        } else if (Number.isInteger(key)) {
            if (!Array.isArray(curr)) return curr;
        } else throw `unexpected value "${key}", field must be either string, symbol or integer`;

        if (i === path.length - 1) {
            curr[key] = value;
        } else {
            const nextKey = path[i + 1];

            if (
                typeof nextKey === 'string' ||
                typeof nextKey === 'symbol'
            ) {
                if (!isObject(curr[key])) {
                    curr[key] = {};
                }
            } else if (Number.isInteger(nextKey)) {
                if (!Array.isArray(curr[key])) {
                    curr[key] = [];
                }
            }
            curr = curr[key];
        }
    }

    return obj;
}

function grab(obj, paths, defaultValue) {
    paths = getPath(paths);

    let curr = obj;

    for (let i = 0; i < paths.length; i++) {
        curr = curr?.[paths[i]];
    }
    return curr === undefined ? defaultValue : curr;
}

function unpoke(obj, paths) {
    paths = getPath(paths);

    try {
        if (paths.length > 1) {
            return delete grab(obj, paths.slice(0, -1))[paths.slice(-1)[0]];
        } else if (paths.length === 1) {
            return delete obj[paths[0]];
        }
    } catch (_) { }
    return false;
}

module.exports = {
    poke,
    unpoke,
    grab
};