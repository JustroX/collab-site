//needed
/*
  id
  template
*/
Quill.register('modules/markdownShortcuts', MarkdownShortcuts)


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

            [{ 'font': [] },'clean'],
            [{ 'align': [] }],
            [ 'link' ,'video','image','formula'],

          ];

          let quill = new Quill('#'+ctrl.idx, 
          {
            theme: 'snow',
            modules: 
            {
              toolbar: toolbarOptions,
              markdownShortcuts: {}
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

          // ctrl.api && ctrl.api.on("success",function()
          // {
          //   quill.setText("");
          // });

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
    controller: function(schemaService,modelService,$timeout,$element,$sanitize,$sce)
    {
      const ctrl = this;
      ctrl.$onInit = function()
      {
        let render =  function()
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
            $(doc).find('iframe.ql-video').each(function(i,e)
            {
                $(e).replaceWith('<p class="vid">' + $(e).attr("src") +'</p>');
            });

            $(doc).find('pre.ql-syntax').each(function(i,e)
            {
                hljs.highlightBlock(e);
            });
            
            let value =  $sanitize(tempQuill.root.innerHTML);
            // console.log(value);

            let ndoc = document.createElement("div");
            $(ndoc).html(value);            
            $(ndoc).find('p.vid').each(function(i,e)
            {
                $(e).replaceWith(`<iframe style='width: 600px; height: 400px' class="ql-video" frameborder="0" allowfullscreen="true" src="`+$(e).html()+`"></iframe>`);
            });
            ctrl.value = $sce.trustAsHtml($(ndoc).html());
            // console.log(ctrl.value)
            // ctrl.value  =value;

            $timeout(function()
            {
              $("pre.ql-syntax").each(function(i,e)
              {
                  $(e).css("padding","5px");
              });
            },1);
        };
        $timeout(render,1);
        ctrl.access &&  ctrl.access(function(){$timeout(render,1);});

      }
    },
    transclude: true,
    template: `<div class='ql-editor' ng-bind-html='$ctrl.value'></div>`,
    bindings:
    {
      data: "@",
      access: "=",
    },
});