define([
  "../amd/template!./_template.html",
  "./host",
  "../amd/less!./responsive-frame.less",
  "../lib/document-register-element/build/document-register-element"
], function(template, Host) {

  var proto = Object.create(HTMLElement.prototype);
  proto.createdCallback = function() {
    var src = this.getAttribute("src");
    this.innerHTML = template({ src: src });
    this.host = new Host(this.querySelector("iframe"));
  };

  document.registerElement("responsive-frame", { prototype: proto });

});