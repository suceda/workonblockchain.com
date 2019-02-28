module.exports.isEmpty = function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports.replaceLineBreaksHtml = function replaceLineBreaksHtml(html) {
    let new_html = html.replace(/\r\n|\n\r/g, '\n').replace(/\n\n/g, '\n').replace(/\n/g, '<br />');
    new_html = new_html.replace(/<(?!br\s*\/?)[^>]+>/g, '');

    return new_html;
}

module.exports.removeDuplicates = function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}
