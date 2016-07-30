import marked from 'marked';
import {Dom} from './dom.es6';
import {Editor} from './editor.es6';
import {Handler} from './handler.es6';
import {Utility} from './utility.es6';

class Markedit {

    constructor(options) {
        var defaultOptions = {height: '400px', width: '800px'};
        
        Object.assign = Object.assign || function(dest){
               if(dest === void 0){
                  throw new TypeError('Cannot convert undefined or null to object');
               }
               dest = Object(dest);
               for(var i = 1; i < arguments.length; i++){
                    var source = arguments[i];
                    if(source !== void 0){
                        for(var key in source){
                           if(({}).hasOwnProperty.call(source, key)){
                                dest[key] = source[key];
                           }
                        }
                    }
               }
               return dest;
        }

        this.options = Object.assign({}, defaultOptions, options);

        if (!this.options.container) {
            return Error('No container defined for Markedit');
        }

        this.document = document;
        this.marked = marked;
        this.handler = new Handler(this.document);
        this.controls = [
            {icon: 'bold', className: 'bold'},
            {icon: 'italic', className: 'italic'},
            {icon: 'header', className: 'header'},
            {icon: 'link', className: 'link'},
            {icon: 'code', className: 'code'},
            {icon: 'image', className: 'image'},
            {icon: 'list', className: 'listUl'},
            {icon: 'list-ol', className: 'listOl'},
            {text: '---', icon: 'line', className: 'line'},
            {icon: 'quote-left', className: 'quote'},
            {icon: 'eye', className: 'preview'},
            {icon: 'fullscreen', className: 'fullscreen'},
            {icon: 'question', className: 'help'}
        ];
        this.buildDOM();
        this.attachEvents();
    }

    buildDOM() {
        let container = this.document.getElementById(this.options.container);
        this.dom = new Dom(this.controls, this.options);
        container.appendChild(this.dom.makeWrapper());
        this.editor = new Editor(this.document, this.options);
    }

    attachEvents() {
        this.controls.forEach(val => {
            this.handler.handle(val.className + 'Event' + this.options.container, (e) => {
                if (val.className === 'preview' || val.className === 'help' || val.className === 'fullscreen') {
                    this.editor[val.className](e);
                }
                else {
                    if (this.options.imageUrl && val.className === 'image') {
                        this.document.getElementById('markedit__upload').click();
                    } else {
                        this.editor['insert' + Utility.capitalizeFirstLetter(val.className)](e);
                    }
                }
            });
        });

        this.handler.handle('onResize', (e) => {
            let controlsEl = this.document.querySelector('.markedit__controls');
            controlsEl.style.width = e.detail.width;
        });

        this.handler.handle('newImage', (e) => {
            this.handleImageUrlUpload(e, this.options.imageUrl);
        });
    }

    handleImageUrlUpload(e, url) {
        /*global XMLHttpRequest FormData :true*/
        var file = e.target.files[0], fd;
        console.log(e.target.files);
        if(typeof FormData == "function"){
             fd = new FormData();
             fd.append('image', file);
        }else{
             fd = {};
        }
        var xhr = (typeof XDomianRequest === "function")? new XDomianRequest() : new XMLHttpRequest();
        xhr.onload = (ev) => {
            this.editor.insertImage(e, ev.target.response.image);
        };
        xhr.onerror = function(){};
        xhr.open('POST', url);
        xhr.responseType = 'json';
        xhr.send(fd);
    }
}

window.Markedit = Markedit;

export default Markedit;
