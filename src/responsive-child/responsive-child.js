require("document-register-element");
require("./responsive-child.less");
var Guest = require("./guest.js");

var proto = Object.create(HTMLElement.prototype);
var bodyProto = Object.create(HTMLBodyElement.prototype);
bodyProto.createdCallback = proto.createdCallback = function() {
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
bodyProto.sendMessage = proto.sendMessage = function(message) {
  this.guest.send(message);
};
bodyProto.guest = proto.guest = null;

try {
  document.registerElement("responsive-body", { prototype: bodyProto, extends: "body" });
  document.registerElement("responsive-child", { prototype: proto });
} catch (_) {
  if (window.console && console.log) console.log("<responsive-child> is already registered.");
}