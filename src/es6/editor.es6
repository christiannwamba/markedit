import marked from 'marked';
import {Utility} from './utility.es6';
import {Handler} from './handler.es6';

export class Editor {
    constructor(document, options) {
        this.document = document;
        this.options = options;
        this.handler = new Handler(this.document);
        this.editor = this.document.querySelector(`#${options.container} .markedit__text`);
    }

    insertBeforeText(text) {
        this.navigateLineStart();
        this.insertAtCursor(text + ' ');
    }

    insertAroundText(text) {
        let editor = this.editor;
        let selectionStart = editor.selectionStart;
        let selectionEnd = editor.selectionEnd;

        var selectionText = editor.value.substring(editor.selectionStart, editor.selectionEnd);

        if (selectionStart === selectionEnd) {
            selectionText = 'text';
        }

        editor.value = editor.value.substring(0, selectionStart) + text + selectionText + text + editor.value.substring(selectionEnd, editor.value.length);

        this.setSelectionRange(selectionEnd, selectionEnd);
    }

    insertBeforeNode(text) {
        let editor = this.editor;
        let selectionStart = editor.selectionStart;
        let selectionEnd = editor.selectionEnd;

        var selectionText = editor.value.substring(editor.selectionStart, editor.selectionEnd);

        if (selectionStart === selectionEnd) {
            selectionText = 'text';
        }

        editor.value = editor.value.substring(0, selectionStart) + text + selectionText + editor.value.substring(selectionEnd, editor.value.length);
    }

    insertAfterNode(text) {
        let editor = this.editor;
        let selectionStart = editor.selectionStart;
        let selectionEnd = editor.selectionEnd;

        var selectionText = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        editor.value = editor.value.substring(0, selectionStart) + selectionText + text + editor.value.substring(selectionEnd, editor.value.length);
        this.setSelectionRange(selectionEnd, selectionEnd);
    }

    setSelectionRange(selectionStart, selectionEnd) {
        if (this.editor.setSelectionRange) {
            this.editor.focus();
            this.editor.setSelectionRange(selectionStart, selectionEnd);
        }
        else if (this.editor.createTextRange) {
            var range = this.editor.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }

    navigateLineStart() {
        let currentPosition = this.editor.selectionStart;
        // Array of all words in textarea
        let currentArray = this.editor.value.substr(0, currentPosition).split('\n');
        // Line number above current line
        let previousLineNumber = currentArray.length - 1;
        // Arrays of text above current line
        let previousArray = currentArray.slice(0, previousLineNumber);
        // Number of items in arrays of text above current line
        let previousArrayLength = previousArray.length;
        // Join all text above current line
        let previousString = previousArray.join('');
        // Put together is the number index before beginning line
        let previousStringLength = previousString.length + previousArrayLength;

        this.setSelectionRange(previousStringLength, previousStringLength);
    }

    insertAtCursor(myValue) {
        // IE support
        if (this.document.selection) {
            this.editor.focus();
            let sel = this.document.selection.createRange();
            sel.text = myValue;
        }
        // MOZILLA and others
        else if (this.editor.selectionStart || this.editor.selectionStart === '0') {
            let startPos = this.editor.selectionStart;
            let endPos = this.editor.selectionEnd;
            this.editor.value = this.editor.value.substring(0, startPos) +
                myValue +
                this.editor.value.substring(endPos, this.editor.value.length);
        } else {
            this.editor.value += myValue;
        }
    }

    insertHeader() {
        const symbol = '#';
        this.insertBeforeText(symbol);
    }

    insertStrikeThrough() {
        this.insertAroundText('~~');
    }

    insertBold() {
        const symbol = '__';
        this.insertAroundText(symbol);
    }

    insertItalic() {
        const symbol = '*';
        this.insertAroundText(symbol);
    }

    insertLink() {
        this.insertBeforeNode('[');
        this.insertAfterNode(']()');
    }

    insertImage(e, url) {
        this.insertBeforeNode('![');
        if (url) {
            this.insertAfterNode(`](${url})`);
        } else {
            this.insertAfterNode(']()');
        }
    }

    insertListOl() {
        this.insertBeforeText('  1.');
    }

    insertListUl() {
        this.insertBeforeText('  *');
    }

    insertCode() {
        this.insertAroundText('```');
    }

    insertLine() {
        this.insertAfterNode('\n ------------------');
    }

    insertQuote() {
        this.insertBeforeText('>');
    }

    preview(e) {
        let previewEl = this.document.querySelector(`#${this.options.container} .markedit__preview`);
        Utility.toggleClass(previewEl, 'open');
        previewEl.innerHTML = this.parse();

        if (this.options.onPreview) {
            this.options.onPreview(e);
        }
    }

    fullscreen(e) {
        let container = this.document.querySelector(`#${this.options.container} .markedit`);
        let controlsEl = this.document.querySelector(`#${this.options.container} .markedit__controls`);
        container.style.zIndex = '9000';
        Utility.toggleClass(container, 'fullscreen');
        controlsEl.style.width = container.clientWidth;

        if (this.options.onFullScreen) {
            this.options.onFullScreen(e);
        }
    }

    parse() {
        return marked(this.editor.value, this.options.marked, this.options.markedHandler);
    }

}
