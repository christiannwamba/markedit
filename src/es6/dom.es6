import {Handler} from './handler.es6';

function makeElem(elemName){
        return this.document.createElement(elemName);
}

function eName(event){
        return this.eventListenerFunc === 'attachEvent' ? 'on'+event : event;
}

export class Dom {

    constructor(controls, options) {
        this.document = document;
        this.controls = controls;
        this.options = options;
        this.eventListenerFunc = ('addEventListener' in this.document.body) ? 'addEventListener' : 'attachEvent';
        this.handler = new Handler(document);
    }

    makeWrapper() {
        let wrapper = makeElem.bind(this)('div');
        // using document fragments is much quicker and performant
        let frag = this.document.createDocumentFragment();
        wrapper.className = 'markedit';
        wrapper.style.cssText = 'height:'+this.options.height+'px;width:'+this.options.width+'px';
        wrapper.style.width = this.options.width;
        wrapper.style.height = this.options.height;
    
        frag.appendChild(this.makeControls());
        frag.appendChild(this.makeText());
        frag.appendChild(this.makePreview());
        frag.appendChild(this.makeUploader());
        wrapper.appendChild(frag);
        return wrapper;
    }

    makeIcon(icon, text) {
        let iconEl = makeElem.bind(this)('i');
        if (text) {
            iconEl.appendChild(this.document.createTextNode(text));
        }
        iconEl.className = `icon-${icon}`;
        return iconEl;
    }

    makeControl(icon, className, text) {
        let control = makeElem.bind(this)('a');
        control.className = `markedit__control ${className}`;
        control.appendChild(this.makeIcon(icon, text));
        control[this.eventListenerFunc](eName.bind(this)('click'), (e) => {
            this.handler.dispatch(e, className + 'Event' + this.options.container);
        });
        return control;
    }

    makeDivider() {
        let divider = makeElem.bind(this)('span');
        divider.className = 'markedit__divider';
        return divider;
    }

    makeControls() {
        let controls = this.controls;
        let controlsEl = makeElem.bind(this)('div');
        controlsEl.className = 'markedit__controls';
        controls.forEach((control) => {
            if (controls.indexOf(control) % 3 === 0 && controls.indexOf(control) > 0) {
                controlsEl.appendChild(this.makeDivider());
            }
            controlsEl.appendChild(this.makeControl(control.icon, control.className, control.text));
        });
        return controlsEl;
    }

    makeText() {
        let text = makeElem.bind(this)('textarea');
        let tHeight = text.clientHeight;
        let tWidth = text.clientWidth;
        text.className = 'markedit__text';
        text.style.resize = this.options.resize;
        text[this.eventListenerFunc](eName.bind(this)('mousemove'), (e) => {
            if (tHeight !== text.clientHeight || tWidth !== text.clientWidth) {
                this.handler.dispatch(e, 'onResize', {width: text.clientWidth});
            }
        });
        text[this.eventListenerFunc](eName.bind(this)('focus'), (e) => {
            if (this.options.onFocus) {
                this.options.onFocus(e);
            }
        });
        text[this.eventListenerFunc](eName.bind(this)('blur'), (e) => {
            if (this.options.onBlur) {
                this.options.onBlur(e);
            }
        });
        return text;
    }

    makePreview() {
        let preview = makeElem.bind(this)('div');
        preview.className = 'markedit__preview';
        return preview;
    }

    makeUploader() {
        let uploader = makeElem.bind(this)('input');
        uploader.setAttribute('id', 'markedit__upload');
        uploader.setAttribute('type', 'file');
        uploader.style.visibility = 'hidden';
        uploader.style.height = '1px';
        uploader.style.width = '1px';
        uploader[this.eventListenerFunc](eName.bind(this)('change'), (e) => {
            this.handler.dispatch(e, 'newImage');
        });
        return uploader;
    }
}
