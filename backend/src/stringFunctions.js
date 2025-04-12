

export const ReplaceChar = (string, index, newChar) => {
    const newString = string.substring(0, index) + 
    newChar + string.substring(index +1);

    return newString;
}