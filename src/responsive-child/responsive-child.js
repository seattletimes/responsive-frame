require("document-register-element");
require("./responsive-child.less");
var Guest = require("./guest.js");

var proto = Object.create(HTMLElement.prototype);
proto.createdCallback = function() {
  var self = this;
  var guest = this.guest = new Guest(this, function(data) {
    //message from the host
    var event = new MessageEvent("message", { data: data });
    self.dispatchEvent(event);
  });
  var interval = this.getAttribute("interval");
  if (interval) {
    var loop = function() {
      guest.notify("interval");
      setTimeout(loop, interval);
    };
    loop();
  }
};
proto.sendMessage = function(message) {
  this.guest.send(message);
};
proto.guest = null;

document.registerElement("responsive-body", { prototype: proto, extends: "body" });
document.registerElement("responsive-child", { prototype: proto });