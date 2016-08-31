require("./responsive-frame.less");
var Host = require("./host");
require("document-register-element");
var makeEvent = require("../makeEvent");

var proto = Object.create(HTMLElement.prototype);
var iframeProto = Object.create(HTMLIFrameElement.prototype);
proto.attachedCallback = iframeProto.attachedCallback = function() {
  this.upgrade();
}

proto.upgrade = iframeProto.upgrade = function() {
  if (this.upgraded_) return;
  this.upgraded_ = true;
  var src = this.getAttribute("src");
  var element;
  if (this.tagName.toLowerCase() == "iframe") {
    element = this;
  } else {
    var root = this.attachShadow ? this.attachShadow({ mode: "open" }) : this;
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
  element.style.display = "block";
  this.listen(element);
};

proto.listen = iframeProto.listen = function(frame) {
  if (this.host) this.host.destroy();
  var self = this;
  this.host = new Host(frame, function(data) {
    self.dispatchEvent(makeEvent("childmessage", { data: data, bubbles: true }));
  });
};

proto.attributeChangedCallback = iframeProto.attributeChangedCallback = function(attr, oldVal, newVal) {
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
  setTimeout(() => self.listen(frame), 100);
}

proto.sendMessage = iframeProto.sendMessage = function(message) {
  this.host.send(message);
};

try {
  document.registerElement("responsive-frame", { prototype: proto });
  document.registerElement("responsive-iframe", { prototype: iframeProto, extends: "iframe" });
} catch (_) {
  if (window.console && console.log) console.log("<responsive-iframe> is already registered");
}