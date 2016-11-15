export class Utility {
    static capitalizeFirstLetter(string) {
        if(typeof string !== "string"){
            return null;
        }
        return string[0].toUpperCase() + string.slice(1);
    }

    static toggleClass(element, className) {
        if (!element || !className) {
            return;
        }
        let classString = element.className || element.getAttribute('className');
        let nameIndex = classString.indexOf(className);
        if (nameIndex === -1) {
            classString += ' ' + className;
        }
        else {
            classString = classString.replace(className, '');
        }
        element.className = classString;
    }
}
