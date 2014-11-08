/*

This is a tiny shim for AMD modules. It assumes that you have built your
modules using the RequireJS optimizer - it does NOT support loader plugins or
remote module loading. It's basically just enough to load a component bundle.

*/
(function() {

  //don't override existing module loader
  if (typeof define == "function") return;

  var moduleCache = {};

  var resolve = function(name, path) {
    var cwd = name.replace(/\/[^\/]+$/, "");
    var plugin = "";
    if (path.indexOf("!") > -1) {
      //extract plugin path
      plugin = path.replace(/!.*$/, "!");
      path = path.replace(/^[^!]+!/, "");
    }
    var resolved = cwd.split("/").concat(path.split("/")).reduce(function(dirs, segment) {
      if (segment == ".") return dirs;
      if (segment == "..") {
        dirs.pop();
      } else {
        dirs.push(segment);
      }
      return dirs;
    }, []).join("/");
    return plugin + resolved;
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
      var dependencies = required.map(function(path) { return moduleCache[resolve(moduleName, path)] });
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