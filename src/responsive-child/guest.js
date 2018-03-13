//in other words: do not eval our JSON
var trap = require("../trapString");

//parent channel
var send = function(message) {
  window.parent.postMessage(trap + JSON.stringify(message), "*");
};

var ampResize = function(height) {
  window.parent.postMessage(JSON.stringify({
    sentinel: "amp",
    height: height,
    type: "embed-size"
  }), "*");
};

var Guest = function(element, callback) {
  this.element = element;
  this.id = null;
  this.init(callback);
};

Guest.prototype = {
  init: function(callback) {
    var self = this;
    callback = callback || function() {};
    //register for resize
    //this is early, but in an AMP world we can't wait for HELO
    window.addEventListener("resize", this.notify.bind(this, "resize"));
    //listen for host messages, then respond or pass them on
    window.addEventListener("message", function(e) {
      var message = self.parseEvent(e);
      //if we're hosted by responsive-frame, let it know that we're ready
      if (message.type == "helo") {
        self.id = message.id;
        self.notify("ready");
      } else {
        //transfer to the element for event propagation
        callback(message);
      }
    });
  },

  //parse message event
  parseEvent: function(e) {
    var data = e.data;
    if (typeof data == "object") return data;
    if (data.indexOf(trap) !== 0) return { text: data };
    var message = JSON.parse(data.replace(trap, ""));
    return message;
  },

  //messages that include the height
  notify: function(reason) {
    var h = this.element.offsetHeight;
    var message = { height: h, type: reason, id: this.id };
    send(message);
    ampResize(h); //send a note to amp-iframe as well
  },

  //arbitrary messages
  send: function(message) {
    var packet = {};
    for (var key in message) packet[key] = message[key];
    packet.id = this.id;
    send(packet);
  }
};

module.exports = Guest;
