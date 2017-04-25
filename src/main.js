(function ($) {
    var swerp = {
        toString: function () {
            return "Softland Sistemas";
        },
        inherit: function (obj) {
            if (obj === null)
                throw TypeError();
            if (Object.create)
                return Object.create(obj);
            var type = typeof obj;
            if (type !== "object" && type !== "function")
                throw TypeError();
            function fun() {}
            ;
            fun.prototype = obj;
            return new fun();
        },
        //Verifica se a variavel n?o ? is Undefined
        isUndefined: function (value) {
            return (typeof value === 'undefined');
        },
        //verifica se ? um array
        isArray: function (value) {
            return Array.isArray(value) && value instanceof Array ? true : false;
        },
        //verifica se ? um objeto
        isObject: function (value) {
            return !Array.isArray(value) ? value instanceof Object : false;
        },
        //verifica o tipo de lista Array ou Object.
        isTypeList: function (value) {
            return swerp.isArray(value) ? 'array' : swerp.isObject(value) ? 'object' : 'undefined';
        },
        //Retorna o tipo da variavel
        typeOf: function (value) {
            // Pode retornar
            // string, number, boolean, object, array, function, undefined
            return typeof value !== 'object' ? typeof value : swerp.isTypeList(value);
        },
        extend: function (o, p) {
            for (var prop in p) {
                o[prop] = p[prop];
            }
            return o;
        },
        merge: function (o, p) {
            for (var prop in p) {
                if (o.hasOwnProperty[prop])
                    continue;
                o[prop] = p[prop];
            }
            return o;
        },
        restrict: function (o, p) {
            for (var prop in p) {
                if (!(prop in p))
                    delete o[prop];
            }
            return o;
        },
        subtract: function (o, p) {
            for (var prop in p) {
                delete o[prop];
            }
            return o;
        },
        union: function (o, p) {
            return swerp.extend(swerp.extend({}, o), p);
        },
        intersection: function (o, p) {
            return swerp.restrict(swerp.extend({}, o), p);
        },
        clone: function (obj) {
            if (null == obj || "object" != typeof obj)
                return obj;

            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = this.clone(obj[i]);
                }
                return copy;
            }

            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = obj[attr];
            }
            return copy;
        },
        keys: function (o) {
            if (typeof o !== "object")
                throw TypeError();
            var result = [];
            for (var prop in o) {
                if (o.hasOwnProperty(prop))
                    result.push(prop);
            }
            return result;
        },
        isEmpty: function (value, isProperts) {
            isProperts = isProperts === undefined ? false : isProperts;
            if (value === null) {
                return true;
            }
            if (swerp.isUndefined(value)) {
                return true;
            }
            if (value instanceof Date) {
                return false;
            }
            if (value instanceof RegExp) {
                return false;
            }
            var type = swerp.typeOf(value);
            switch (type) {
                case 'object':
                    if (isProperts) {
                        for (var prop in value) {
                            if (!swerp.isEmpty(value[prop])) {
                                return false;
                            }
                        }
                        return true;
                    }
                    return Object.keys(value).length == 0 ? true : false;
                    break;
                case 'array':
                    return value.length === 0 || value === [] ? true : false;
                    break;
                case 'number':
                    return false;
                    break;
                case 'boolean':
                    return false;
                    break;
                case 'function':
                    return false;
                    break;
                default:
                    if (value.length > 0) {
                        return false;
                    }
                    return true;
                    break;
            }
        },
        isJson: function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },
        equals: function (a, b) {
            if (!swerp.isObject(a)) {
                return a === b;
            }
            if (swerp.isEmpty(a) || swerp.isEmpty(b)) {
                return false;
            }
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            if (aProps.length != bProps.length) {
                return false;
            }
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                // If values of same property are not equal,
                // objects are not equivalent
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }
            return true;
        },
        pad: function (value, size, token, position) {
            token = token || '0';
            position = position || 'left';
            if (swerp.isEmpty(value)) {
                value = "";
            }
            size = size - value.toString().length;
            var x = '';
            for (var i = 0; i < size; i++) {
                x = x.concat(token);
            }

            return position == 'left' ? x + value : value + x;
        },
        removeAccents: function (text) {
            var charIn = 'àèìòùâêîôûäëïöüáéíóúãõçÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÁÉÍÓÚÃÕÇ';
            var charVa = 'aeiouaeiouaeiouaeiouaocAEIOUAEIOUAEIOUAEIOUAOC';
            var oc = text.match(/[àèìòùâêîôûäëïöüáéíóúãõçÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÁÉÍÓÚÃÇ]/gm);
            if (oc !== null) {
                for (var i = 0; i < oc.length; i++) {
                    text = text.replace(oc[i], charVa.charAt(charIn.indexOf(oc[i])));
                }
            }
            return text;
        },
        capitalize: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        },
        isRegexpTest: function (regex, value) {
            return regex.test(value);
        },
        mask: function (value, mask) {
            if (swerp.isEmpty(value)) {
                value = "";
            }
            if (mask.indexOf("|") !== -1) {
                var masks = mask.split("|");
                for (var i = 0; i < masks.length; i++) {
                    mask = masks[0];
                    if (value.length <= masks[i].replace(/[^#]/gm, "").length) {
                        mask = masks[i];
                        break;
                    }
                }
            }
            if (mask.indexOf("!") !== -1) {
                return swerp.pad(value, mask.replace('!', ''));
            }
            if (mask.indexOf("?") !== -1) {
                return swerp.decimal.br(value, mask);
            }
            value = swerp.removeMask(value, mask);
            if (!swerp.isEmpty(value)) {
                var subst = swerp.isEmpty(mask) ? "" : mask.match(/#+/g);
                var aux1 = "", aux2 = [], pos = 0;
                if (subst != null) {
                    for (var i = 0; i < subst.length; i++) {
                        aux1 = value.toString().substr(0, subst[i].length);
                        value = value.toString().replace(aux1, "");
                        aux2.push(aux1);
                    }
                    var maskedValue = mask.replace(/#+/g, function (match) {
                        var x = aux2[pos];
                        pos++;
                        return x;
                    });
                }
                return maskedValue;
            }
            return value;
        },
        removeMask: function (value, mask) {
            value = value || "";
            var chars = mask.replace(/[^#]/g);
            var stris = mask.match(/[^#]/g);
            if (stris != null) {
                for (var i = 0; i < stris.length; i++) {
                    value = value.toString().replace(stris[i], "");
                }
            }
            return value.substr(0, chars.length);
        },
        generateIdUnique: function (length) {
            length = length || 4;
            var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var randomString = '';
            for (var i = 0; i < length; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1);
            }
            return "_" + randomString;
        },
        listUtilities: {
            updateList: function (list, newValues, start, property) {
                start = start || 0;
                var lastPosition = list.length - 1;
                if (start == lastPosition) {
                    start = 0;
                } else {
                    start = start + 1;
                }
                for (var i = 0; i < newValues.length; i++) {
                    if (!swerp.isEmpty(property)) {
                        list[i + start][property] = newValues[i];
                    } else {
                        list[i + start] = newValues[i];
                    }
                }

            },
            listApportionmentRecalculation: function (totalRefer, list, index, property) {
                var valOfChanged = swerp.isEmpty(list[index][property]) ? list[index] : list[index][property];
                var lastPosition = list.length - 1;
                var sumOfUnchanged = swerp.math.substractFromList(list, [index], property);
                var valor_retirado = (totalRefer - valOfChanged) - sumOfUnchanged;
                var rest;

                if (index == lastPosition) {
                    rest = sumOfUnchanged + valor_retirado;
                    return swerp.math.distribuitionWithoutRet(rest, lastPosition);
                }
                rest = (swerp.math.sumListStartingFrom(list, index, property) - valOfChanged) + valor_retirado;
                return swerp.math.distribuitionWithoutRet(rest, lastPosition - index);
            }
        },
        math: {
            distribuitionWithoutRet: function (dividendo, divisor) {
                divisor = divisor == 0 ? 1 : divisor;
                var quociente = (dividendo / divisor).toFixed(2);
                var resto = (dividendo - (quociente * divisor)).toFixed(2);
                var retorno = [];
                for (var i = 0; i < divisor; i++) {
                    retorno.push(parseFloat((i == (divisor - 1)) ? (parseFloat(quociente) + parseFloat(resto)).toFixed(2) : quociente));
                }
                return retorno;
            },
            substractFromList: function (listSource, listSubtract, property) {
                var newlist = [];
                for (var x = 0; x < listSubtract.length; x++) {
                    for (var i = 0; i < listSource.length; i++) {
                        if (listSubtract[x] != i)
                            newlist.push(listSource[i]);
                    }
                }
                return swerp.math.sum(newlist, property);
            },
            sum: function (list, property) {
                var sum = 0;
                if (!swerp.isEmpty(list)) {
                    for (var i = 0; i < list.length; i++) {
                        if (!swerp.isEmpty(property)) {
                            sum = sum + parseFloat(list[i][property]);
                        } else {
                            sum = sum + parseFloat(list[i]);
                        }
                    }
                }
                return sum;
            },
            sumListStartingFrom: function (list, start, property) {
                var newList = [];
                var lastPosition = list.length - 1;
                start = start || 0;
                if (!swerp.isEmpty(list)) {
                    for (var i = start; i < lastPosition + 1; i++) {
                        newList.push(list[i]);
                    }
                    return swerp.math.sum(newList, property);
                }
                return null;
            }
        },
        decimal: {
            default: function (value, decimais) {
                var aux = value.toString().replace('.', "");
                value = aux.toString().replace(',', '.');
                decimais = !swerp.isEmpty(decimais) ? parseInt(decimais) : value.toString().indexOf('.') !== -1 ? value.toString().split('.')[1].length : 0;
                value = parseFloat(value);
                return parseFloat(value.toFixed(decimais));
            },
            br: function (value, decimais) {
                if (!swerp.isEmpty(value)) {
                    var valueOrig = value;
                    decimais = swerp.isEmpty(decimais) ? 2 : decimais;
                    decimais = decimais.toString().replace(/\D/gim, "");
                    var regx = "", repl = "", fill = "";
                    if (decimais == "0") {
                        return swerp.onlyNumbers(value);
                    }

                    if (value.toString().indexOf('.') !== -1) {
                        value = value.toString().replace(".", ",");
                    }
                    if (value.toString().indexOf(',') !== -1) {
                        var vdec = value.toString().split(",")[1];
                        if (decimais >= value.toString().split(",")[1].length) {
                            fill = swerp.pad(vdec, decimais, 0, 'right');
                            value = value.toString().split(",")[0] + fill;
                        } else {
                            fill = swerp.decimal.default("0," + vdec, decimais);
                            value = parseInt(value.toString().split(",")[0]) + fill;
                        }
                    } else {
                        fill = swerp.pad(0, decimais);
                        value = value + fill;
                    }

                    value = value.toString().replace(/\D/g, "");
                    for (var i = 0; i < parseInt((value.toString().length - parseInt(decimais)) / 3); i++) {
                        regx = regx.concat('([0-9]{3})');
                        repl = repl.concat('.$' + (i + 1));
                    }

                    regx = regx.concat('([0-9]{' + decimais.toString() + '})') + "$";
                    repl = repl.concat(',$' + (parseInt((value.toString().length - parseInt(decimais)) / 3) + 1));
                    var negative = valueOrig.toString().indexOf('-') !== -1 ? "-" : "";
                    var retorno = value.toString().replace(new RegExp(regx, 'g'), repl);
                    return negative + (((value.toString().length - parseInt(decimais)) % 3) === 0 ? retorno.substr(1) : retorno);
                }
                return value;
            }
        },
        onlyNumbers: function (value) {
            value = swerp.isEmpty(value) ? "" : value;
            try {
                return value.toString().replace(/[^\d]+/g, '');
            } catch (e) {
                console.error(e);
                return '';
            }
        },
        date: {
            record: function () {
                var d = new Date();
                return d.getFullYear() + swerp.pad(d.getMonth(), 2) + swerp.pad(d.getDate(), 2) + '_' + d.getHours() + d.getMinutes() + d.getSeconds();
            },
            convertBR: function (date) {
                date = date || new Date();
                if (!(date instanceof Date)) {
                    date = date.indexOf('T') !== -1 ? date.substr(0, date.indexOf('T')) : date;
                    var read = date.replace(/\-/g, "/").split("/");
                    return read[2].substr(0, 4) + "/" + read[1] + "/" + read[0];
                }
                var dia = date.getDate();
                if (dia.toString().length === 1)
                    dia = "0" + dia;
                var mes = date.getMonth() + 1;
                if (mes.toString().length === 1)
                    mes = "0" + mes;
                var ano = date.getFullYear();
                return dia + "/" + mes + "/" + ano;
            },
            convertDF: function (date) {
                if (date instanceof Date) {
                    return date;
                }
                if (swerp.isEmpty(date)) {
                    return new Date;
                }
                var read = date.replace(/\-/g, "/").split("/");
                return new Date(read[2].substr(0, 4) + "/" + read[1] + "/" + read[0]);
            }
        }
    };

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return swerp
        })
    } else if (typeof module === 'object' && module.exports) {
        module.exports = swerp
    } else {
        $.swerp = swerp
    }

}(this));