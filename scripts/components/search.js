app.component('search',{
    transclude: true,
    template: `{{ctrl}}<temp></temp><div ng-if='!$ctrl.hasTranscluded'><div ng-include="$ctrl.template || '/template/search/default' "></div></div>`,
    bindings:{
      id: "@bind",  
      model : "=?" ,
      default :"=?",
      reset : "@?",
      field : "@?"
    },
    controller: function(apiService,$timeout,$transclude,schemaService,$element)
    {
      const ctrl = this;
      $transclude(function(clone,scope){
        scope.$ctrl = ctrl;
        $element.find('temp').append(clone);
        if(clone.length){
         ctrl.hasTranscluded = true;
        }
        clone.on('$destroy', function() {
          scope.$destroy();
        });
      });

      //for list
      ctrl.view = function(...args)
      {
        ctrl.api.emit("selected",...args);
      };
      ctrl.$onInit = function()
      {
        ctrl.model  = ctrl.model || {};
        ctrl.default  = ctrl.default || {};

        let bind = function()
        {
          ctrl.api = apiService.find(ctrl.id).apis[0];
          ctrl.api.on("success",function(res)
          {
            console.log(res);
            if(ctrl.api.config.method=="get" || ctrl.api.config.method=="list" )
              ctrl.model = res;
            if(ctrl.api.config.method=="post" && ctrl.reset)
              ctrl.model = {};
          });

          if( ctrl.api.config.method == "post" ||  ctrl.api.config.method == "put" )
          {
            ctrl.required = schemaService.getRequired(ctrl.api.config.method,ctrl.api.config.model);
            ctrl.fields = schemaService.getFields(ctrl.api.config.model);
          }
        }

        let wait = function(){  
          if(!apiService.find(ctrl.id).apis[0])
            $timeout(function()
            {
              wait();
            },1);
          else
            bind();
        };
        wait();


      }

      ctrl.timer = -1;
      ctrl.query = "";

      function wait_before_search()
      {
          if(ctrl.timer==0 && ctrl.query!="")
          {
            let fields = ctrl.field.split(",");
            let str= "search=";
            for(let i of fields)
                str += i + ":" + ctrl.query +",";


            ctrl.api.config.param =str;
            ctrl.api.load();
          }
          if(!ctrl.query) ctrl.timer = -1;
          if(ctrl.timer>=0)
          {
            $timeout(function()
            {
              wait_before_search();
            },1);
            ctrl.timer--;
          }
      }

      ctrl.change = function()
      {
        let t_timer = ctrl.timer;
        ctrl.timer = 50;
        if(t_timer==-1)
          wait_before_search();
      }

      ctrl.submit = function()
      {
        ctrl.api.load(ctrl.model);
      }
    }
});