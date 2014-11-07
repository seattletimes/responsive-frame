/*

This is a tiny shim for AMD modules. It assumes that you have built your
modules using the RequireJS optimizer - it does NOT support loader plugins or
remote module loading. It's basically just enough to load a component bundle.

*/
(function() {

  //don't override existing module loader
  if (typeof define == "function") return;

  var moduleCache = {};

  var makeAbsolute = function(name, path) {
    var dir = name.replace(/\/[^\/]+$/, "");
    var absolute = path.replace(/(^|!)\./, function(matches) { return matches.replace(".", dir) });
    return absolute;
  };

  //runs dependencies at definition time instead of lazy-executing them when required
  //this is probably not technically correct behavior, but works for our purposes
  window.define = function(moduleName, required, def) {
    if (!(required instanceof Array)) {
      def = required;
      required = [];
    }

    var module;
    if (typeof def == "function") {
      var dependencies = required.map(function(path) { return moduleCache[makeAbsolute(moduleName, path)] });
      module = def.apply(null, dependencies);
    } else {
      module = def;
    }
    moduleCache[moduleName] = module;
  };

  window.require = function(required, f) {
    if (!f) return;
    var dependencies = required.map(function(path) { return moduleCache[path] });
    f.apply(null, dependencies);
  };

})();