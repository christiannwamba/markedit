export class Handler {

    constructor(document) {
        this.document = document;
    }

    dispatch(e, cType, payload) {
        e = e || window.event;
        if (window.CustomEvent) {
            /*global CustomEvent :true*/
            /*eslint no-undef: "error"*/
            var event = new CustomEvent(cType, {
                detail: payload,
                bubbles: true,
                cancelable: true
            });
            e.currentTarget.dispatchEvent(event);
        }else  if (document.createEventObject) {   // IE before version 9
            var customEvent = document.createEventObject (window.event);
              customEvent.detail = payload;
              e.srcElement.fireEvent ("on"+cType, customEvent);
        }
    }

    handle(cType, handlerFunc) {
         if('addEventListener' in this.document){
                  this.document.addEventListener(cType, handlerFunc, false);
         }else if('attachEvent' in this.document){
                 this.document.attachEvent("on"+cType, handlerFunc);
         }          
    }

}
