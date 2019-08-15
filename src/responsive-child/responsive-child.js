require("core-js/es/reflect");
require('@webcomponents/custom-elements');
require("./responsive-child.less");
var makeEvent = require("../makeEvent");
var Guest = require("./guest.js");

var proto = Object.create(HTMLElement.prototype);
var bodyProto = Object.create(HTMLBodyElement.prototype);


function ResponsiveChild() {
    return Reflect.construct(HTMLElement, [], this.constructor);
}

ResponsiveChild.prototype = Object.create(HTMLElement.prototype);
ResponsiveChild.prototype.constructor = ResponsiveChild;
Object.setPrototypeOf(ResponsiveChild, HTMLElement);


function ResponsiveBody() {
    return Reflect.construct(HTMLBodyElement, [], this.constructor);
}

ResponsiveBody.prototype = Object.create(HTMLBodyElement.prototype);
ResponsiveBody.prototype.constructor = ResponsiveBody;
Object.setPrototypeOf(ResponsiveBody, HTMLBodyElement);

ResponsiveChild.prototype.connectedCallback = ResponsiveBody.prototype.connectedCallback = function() {
    var self = this;
    var guest = this.guest = new Guest(this, function(data) {
        //message from the host
        var event = makeEvent("message", {
            data: data
        });
        self.dispatchEvent(event);
    });
    //set a default interval, but interval=0 still disables it.
    var interval = this.getAttribute("interval") || 100;
    interval *= 1;
    if (interval) {
        var height = null;
        var loop = function() {
            var h = self.offsetHeight;
            // don't message if nothing has changed
            if (h != height) guest.notify("interval");
            height = h;
            setTimeout(loop, interval);
        };
        loop();
    }
};

ResponsiveBody.prototype.sendMessage = ResponsiveChild.prototype.sendMessage = function(message) {
    this.guest.send(message);
};
ResponsiveBody.prototype.guest = ResponsiveChild.prototype.guest = null;

try {
    customElements.define('responsive-body', ResponsiveBody);
    customElements.define('responsive-child', ResponsiveChild);
} catch (_) {
    if (window.console && console.log) console.log("<responsive-child> is already registered.");
}
