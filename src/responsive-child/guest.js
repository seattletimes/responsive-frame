//in other words: do not eval our JSON
var trap = "while (true);";

//parent channel
var send = function(message) {
  window.parent.postMessage(trap + JSON.stringify(message), "*");
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
    window.addEventListener("message", function(e) {
      var message = self.parseEvent(e);
      //kick off loop and notifications after ack
      if (message.type == "helo") {
        self.id = message.id;
        //respond to outer frame
        self.notify("ready");
        //register for resizing
        window.addEventListener("resize", function() {
          self.notify("resize");
        });
      } else {
        //transfer to the element for event propagation
        callback(message);
      }
    });
  },

  //parse message event
  parseEvent: function(e) {
    var data = e.data;
    if (data.indexOf(trap) !== 0) return { text: data };
    var message = JSON.parse(data.replace(trap, ""));
    return message;
  },

  //messages that include the height
  notify: function(reason) {
    var message = { height: this.element.offsetHeight, type: reason, id: this.id };
    send(message);
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