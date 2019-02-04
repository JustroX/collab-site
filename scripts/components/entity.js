//needed
/*
  id
  template
*/

app.component('entity',{
    controller: function(schemaService,modelService,$transclude,$element)
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
      ctrl.$onInit = function()
      {
        ctrl.entity = modelService.find(ctrl.id).res[0];
        ctrl.config = ctrl.entity.config;

        ctrl.get  = ctrl.entity.api.get;
        ctrl.put  = ctrl.entity.api.put;
        ctrl.delete  = ctrl.entity.api.delete;
        ctrl.value  = ctrl.entity.value;

        ctrl.mode = ctrl.mode || "view";
      }   
    },
    transclude: true,
    template: `<temp></temp><div ng-if='!$ctrl.hasTranscluded'><div ng-include="$ctrl.template || '/template/model/default' "></div></div>`,
    bindings:{
      id: "@bind",
      mode: "@?"
    },
});