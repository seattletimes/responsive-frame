var Host = require("./host");
require("document-register-element");

var proto = Object.create(HTMLElement.prototype);
var iframeProto = Object.create(HTMLIFrameElement.prototype);
proto.createdCallback = iframeProto.createdCallback = function() {
  var src = this.getAttribute("src");
  var element;
  if (this.tagName.toLowerCase() == "iframe") {
    element = this;
  } else {
    element = document.createElement("iframe");
    element.src = src;
    this.appendChild(element);
  }
  element.setAttribute("seamless", "");
  element.setAttribute("width", "100%");
  element.setAttribute("scrolling", "no");
  element.setAttribute("frameborder", "0");
  element.setAttribute("marginwidth", "0");
  element.setAttribute("marginheight", "0");
  var self = this;
  this.host = new Host(element, function(data) {
    self.dispatchEvent(new MessageEvent("childmessage", { data: data, bubbles: true }));
  });
};

proto.sendMessage = iframeProto.sendMessage = function(message) {
  this.host.send(message);
};

document.registerElement("responsive-frame", { prototype: proto });
document.registerElement("responsive-iframe", { prototype: iframeProto, extends: "iframe" });