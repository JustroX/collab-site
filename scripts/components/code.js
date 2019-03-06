CodeMirror.modeURL = "https://codemirror.net/mode/%N/%N.js";

app.component('codeEditor',{
    controller: function(schemaService,modelService,$timeout,$element,$sanitize)
    {
      const ctrl = this;
      ctrl.random_id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
      ctrl.$onInit = function()
      {
        let render =  function()
        {
          let textarea = document.getElementById(ctrl.random_id);
          let editor_ = ctrl;
          ctrl.codemirror =CodeMirror.fromTextArea(textarea, {
              lineNumbers: true,
              keyMap: "sublime",
              theme: "monokai",
              mode: "python",
              autoRefresh: true
            });
          ctrl.codemirror.on('change', editor =>
          {
            $timeout(()=>
            {
              ctrl.model = ctrl.codemirror.getValue();
              ctrl.textchange && ctrl.textchange();
            },1);
          });

          ctrl.access && ctrl.access({
            editor: ctrl.codemirror,
            language_change : function(lang) 
            {
              let val = { "python2": "text/x-python","python3": "text/x-python","cpp": "text/x-c++src","c": "text/x-csrc", }[lang], m, mode, spec;
              if (m = /.+\.([^.]+)$/.exec(val)) {
                var info = CodeMirror.findModeByExtension(m[1]);
                if (info) {
                  mode = info.mode;
                  spec = info.mime;
                }
              } else if (/\//.test(val)) {
                var info = CodeMirror.findModeByMIME(val);
                if (info) {
                  mode = info.mode;
                  spec = val;
                }
              } else {
                mode = spec = val;
              }
              if (mode) {
                ctrl.codemirror.setOption("mode", spec);
                ctrl.codemirror.setOption("autoRefresh", true);
                CodeMirror.autoLoadMode(ctrl.codemirror, mode);
                ctrl.codemirror.refresh();
              } else {
                alert("Could not find a mode corresponding to " + val);
              }
            }  
          });
        };
        $timeout(render,1);
      }
    },
    transclude: true,
    template: `<div><textarea id='{{$ctrl.random_id}}' ></textarea></div>`,
    bindings:
    {
      model: "=",
      textchange: "=",
      access: "="
    },
});