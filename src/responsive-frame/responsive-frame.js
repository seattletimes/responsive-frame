require("core-js/es/reflect");
require('@webcomponents/custom-elements');
require("./responsive-frame.less");
var Host = require("./host");
var makeEvent = require("../makeEvent");

function ResponsiveFrame() {
    return Reflect.construct(HTMLElement, [], this.constructor);
}

ResponsiveFrame.prototype = Object.create(HTMLElement.prototype);
ResponsiveFrame.prototype.constructor = ResponsiveFrame;
Object.setPrototypeOf(ResponsiveFrame, HTMLElement);

ResponsiveFrame.prototype.connectedCallback = function() {
    this.upgrade();
};

function ResponsiveIFrame() {
    return Reflect.construct(HTMLIFrameElement, [], this.constructor);
}

ResponsiveIFrame.prototype = Object.create(HTMLIFrameElement.prototype);
ResponsiveIFrame.prototype.constructor = ResponsiveIFrame;
Object.setPrototypeOf(ResponsiveIFrame, HTMLIFrameElement);

ResponsiveIFrame.prototype.connectedCallback = function() {
    this.upgrade();
};


ResponsiveFrame.prototype.upgrade = ResponsiveIFrame.prototype.upgrade = function() {
    if (this.upgraded_) return;
    this.upgraded_ = true;
    var src = this.getAttribute("src");
    var element;
    if (this.tagName.toLowerCase() == "iframe") {
        element = this;
    } else {
        var root = this.attachShadow ? this.attachShadow({
            mode: "open"
        }) : this;
        element = document.createElement("iframe");
        element.src = src;
        root.appendChild(element);
    }
    element.setAttribute("seamless", "");
    element.setAttribute("width", "100%");
    element.setAttribute("scrolling", "no");
    element.setAttribute("horizontalscrolling", "no");
    element.setAttribute("verticalscrolling", "no");
    element.setAttribute("frameborder", "0");
    element.setAttribute("marginwidth", "0");
    element.setAttribute("marginheight", "0");
    element.setAttribute("mozallowfullscreen", "");
    element.setAttribute("webkitallowfullscreen", "");
    element.setAttribute("allowfullscreen", "");
    element.setAttribute("loading", "lazy");
    element.style.display = "block";
    this.listen(element);
};

ResponsiveFrame.prototype.listen = ResponsiveIFrame.prototype.listen = function(frame) {
    if (this.host) this.host.destroy();
    var self = this;
    this.host = new Host(frame, function(data) {
        self.dispatchEvent(makeEvent("childmessage", {
            data: data,
            bubbles: true
        }));
    });
};

ResponsiveFrame.prototype.attributeChangedCallback = ResponsiveIFrame.prototype.attributeChangedCallback = function(attr, oldVal, newVal) {
    if (attr != "src") return;
    var frame = this; // start assuming iframe is="responsive-iframe"
    if (frame.tagName.toLowerCase() != "iframe") {
        var root = this.shadowRoot ? this.shadowRoot : this;
        frame = root.querySelector("iframe");
        if (frame.getAttribute("src") == newVal) return;
        frame.src = newVal;
    }
    //wait for the frame to start transitioning
    var self = this;
    setTimeout(function() {
        self.listen(frame)
    }, 100);
}

ResponsiveFrame.prototype.sendMessage = ResponsiveIFrame.prototype.sendMessage = function(message) {
    this.host.send(message);
};

try {
    customElements.define('responsive-frame', ResponsiveFrame);
    customElements.define('responsive-iframe', ResponsiveIFrame, {'extends': 'iframe'});
} catch (_) {
    if (window.console && console.log) console.log("<responsive-iframe> is already registered");
}
