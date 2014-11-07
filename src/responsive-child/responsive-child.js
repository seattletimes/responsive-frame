define([
  "less!./responsive-child.less"
], function() {

  var trap = "while (true);";

  var send = function(message) {
    window.parent.postMessage(trap + JSON.stringify(message), "*");
  };

  var proto = Object.create(HTMLElement.prototype);
  proto.createdCallback = function() {
    var self = this;
    var id = null;
    var interval = self.getAttribute("interval");
    var notify = function(reason) {
      var message = { height: self.offsetHeight, type: reason, id: id };
      send(message);
    };
    window.addEventListener("message", function(e) {
      var data = e.data;
      if (data.indexOf(trap) !== 0) return;
      var message = JSON.parse(data.replace(trap, ""));
      //kick off loop and notifications after ack
      if (message.type == "helo") {
        id = message.id;
        //respond to outer frame
        notify("ready");
        //start interval loop, if needed
        if (interval) {
          var loop = function() {
            notify("interval");
            setTimeout(loop, interval);
          };
          loop();
        }
        //register for resizing
        window.addEventListener("resize", function() {
          notify("resize");
        });
      }
    });
  };

  document.registerElement("responsive-child", { prototype: proto });

});