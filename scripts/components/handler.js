app.component('handler',{
    transclude: true,
    template: `{{ctrl}}<temp></temp><div ng-if='!$ctrl.hasTranscluded'><div ng-include="$ctrl.template || ( $ctrl.api.config.method && '/template/api/'+$ctrl.api.config.method ) "></div></div>`,
    bindings:{
      id: "@bind",  
      model : "=?" ,
      default :"=?",
      reset : "@?",
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

      ctrl.submit = function()
      {
        ctrl.api.load(ctrl.model);
      }
    }
});