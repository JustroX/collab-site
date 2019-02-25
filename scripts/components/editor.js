//needed
/*
  id
  template
*/

app.component('editor',{
    controller: function(schemaService,modelService,$timeout,$element)
    {
      const ctrl = this;
      ctrl.idx = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
      ctrl.$onInit = function()
      {
        $timeout(function()
        {
          let toolbarOptions = 
          [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean']                                         // remove formatting button
          ];

          let quill = new Quill('#'+ctrl.idx, 
          {
            theme: 'snow',
            modules: 
            {
              toolbar: toolbarOptions
            },
          });

          if(ctrl.bind)
            quill.setContents(JSON.parse(ctrl.bind));

          quill.on('text-change', function(delta, oldDelta, source) 
          {
            $timeout(function()
            {
              let contents = (quill.getText().trim().length === 0 && quill.container.firstChild.innerHTML.includes("img") === false)? "" : JSON.stringify(quill.getContents());
              ctrl.bind = contents;
              ctrl.change && ctrl.change(contents);
            });
          });

          ctrl.api && ctrl.api.on("success",function()
          {
            quill.setText("");
          });

          ctrl.access && ctrl.access(quill);
        },1);
      }
    },
    transclude: true,
    template: `<div style="{{$ctrl.style}}" ng-attr-id="{{$ctrl.idx}}"></div>`,
    bindings:
    {
      change: "=",
      style: "@?",
      bind: "=bind",
      api: "=?",
      access: '=?'
    },
});



app.component('editorView',{
    controller: function(schemaService,modelService,$timeout,$element,$sanitize)
    {
      const ctrl = this;
      ctrl.$onInit = function()
      {
        $timeout(function()
        {
            let doc  =document.createElement("div");
            let tempQuill=new Quill(doc);
            try
            {
              tempQuill.setContents(JSON.parse(ctrl.data));
            }
            catch(e)
            {
              console.log("Editor view parsing error.");
            }
            $(doc).find('pre.ql-syntax').each(function(i,e)
            {
                $(e).replaceWith('<pre class="ql-syntax"><code>' + $(e).html() +'</code></pre>');
            });
            $(doc).find('pre.ql-syntax').each(function(i,e)
            {
                hljs.highlightBlock(e);
            });
            ctrl.value =  $sanitize(tempQuill.root.innerHTML);
            $timeout(function()
            {
              $("pre.ql-syntax").each(function(i,e)
              {
                  $(e).css("padding","5px");
              });
            },1);
        },1);

      }
    },
    transclude: true,
    template: `<div class='ql-editor' ng-bind-html='$ctrl.value'></div>`,
    bindings:
    {
      data: "@"
    },
});