import {Handler} from './handler.es6';

export class Dom {

    constructor(controls, options) {
        this.document = document;
        this.controls = controls;
        this.options = options;
        this.eventListenerFunc = ('addEventListener')
        this.handler = new Handler(document);
    }
    
    private makeElem(elemName){
        return this.document.createElement(elemName);
    }

    makeWrapper() {
        let wrapper = this.makeElem('div');
        wrapper.className = 'markedit';
        wrapper.style.cssText = 'height:'+this.options.height+'px\
        width:'+this.options.width+'px';
        wrapper.appendChild(this.makeControls());
        wrapper.appendChild(this.makeText());
        wrapper.appendChild(this.makePreview());
        wrapper.appendChild(this.makeUploader());
        return wrapper;
    }

    makeIcon(icon, text) {
        let iconEl = this.makeElem('i');
        if (text) {
            iconEl.appendChild(this.document.createTextNode(text));
        }
        iconEl.className = `icon-${icon}`;
        return iconEl;
    }

    makeControl(icon, className, text) {
        let control = this.makeElem('a');
        control.className = `markedit__control ${className}`;
        control.appendChild(this.makeIcon(icon, text));
        control.addEventListener('click', (e) => {
            this.handler.dispatch(e, className + 'Event');
        });
        return control;
    }

    makeDivider() {
        let divider = this.document.createElement('span');
        divider.className = 'markedit__divider';
        return divider;
    }

    makeControls() {
        let controls = this.controls;
        let controlsEl = this.document.createElement('div');
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
        let text = this.document.createElement('textarea');
        let tHeight = text.clientHeight;
        let tWidth = text.clientWidth;
        text.className = 'markedit__text';
        text.style.resize = this.options.resize;
        text.addEventListener('mousemove', (e) => {
            if (tHeight !== text.clientHeight || tWidth !== text.clientWidth) {
                this.handler.dispatch(e, 'onResize', {width: text.clientWidth});
            }
        });
        text.addEventListener('focus', (e) => {
            if (this.options.onFocus) {
                this.options.onFocus(e);
            }
        });
        text.addEventListener('blur', (e) => {
            if (this.options.onBlur) {
                this.options.onBlur(e);
            }
        });
        return text;
    }

    makePreview() {
        let preview = this.document.createElement('div');
        preview.className = 'markedit__preview';
        return preview;
    }

    makeUploader() {
        let uploader = this.document.createElement('input');
        uploader.setAttribute('id', 'markedit__upload');
        uploader.setAttribute('type', 'file');
        uploader.style.visibility = 'hidden';
        uploader.style.height = '1px';
        uploader.style.width = '1px';
        uploader.addEventListener('change', (e) => {
            this.handler.dispatch(e, 'newImage');
        });
        return uploader;
    }
}
