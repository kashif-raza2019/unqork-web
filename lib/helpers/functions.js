/**
 * Helper functions for this library
 */

/**
 * Split the URL "fbu/uapi/models/{dataModelId}/{recordId}"
 * into array based upon the dynamic values needs to be passed
 * 
 * @param {String} input 
 * 
 * like this
 * 
 * ["fbu/uapi/models", "dataModelId", "recordId"]
 * @returns {Array}
 */
const splitStringByBraces = (input) => {
    const regex = /\{(.*?)\}/g; // Regex to match text within {}
    let match;
    const result = [];
    let lastIndex = 0;

    while ((match = regex.exec(input)) !== null) {
        // Add the text before the current match
        result.push(input.slice(lastIndex, match.index));
        // Add the content inside the braces
        result.push(match[1]);
        // Update the last index
        lastIndex = regex.lastIndex;
    }

    // Add any remaining text after the last match
    if (lastIndex < input.length) {
        result.push(input.slice(lastIndex));
    }

    return result;
}

// If an element in array is present
function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}


module.exports = {
    splitStringByBraces,
    include
}
