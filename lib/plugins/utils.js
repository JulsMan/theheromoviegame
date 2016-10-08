String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
}


String.prototype.endsWith = function (suffix) {
    return (this.substr(this.length - suffix.length) === suffix);
}

String.prototype.startsWith = function (prefix) {
    return (this.substr(0, prefix.length) === prefix);
}


Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}


Array.prototype.containsItem = function (obj) {
    if (obj == undefined) return false;
    if (typeof (obj) === 'string') {
        var i = this.length;
        while (i--) {
            if (this[i].name.toLowerCase() == obj.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
    else {
        var i = this.length;
        while (i--) {
            if (this[i].name.toLowerCase() == obj.name.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
}

Array.prototype.containsId = function (obj) {
    if (obj == undefined) return false;
    if (typeof (obj) === 'string') {
        var i = this.length;
        while (i--) {
            if (this[i].id.toLowerCase() == obj.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
    else {
        var i = this.length;
        while (i--) {
            if (this[i].id.toLowerCase() == obj.id.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
}


