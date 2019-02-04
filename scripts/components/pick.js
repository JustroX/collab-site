app.component('pick',{
    bindings:{
      id : "@bind",
      class : "@class",
      style : "@style",
    },
    transclude: true,
    template: `<div ng-transclude></div><div ng-if='!$ctrl.hasTranscluded'><div ng-include="$ctrl.template || '/template/picker/default' "></div></div>`,
    controller: function(utilService)
    {
       const ctrl = this;
       ctrl.$onInit = function()
       {
         ctrl.picker = utilService.picker().find(ctrl.id).pickers[0];
       }
    }
});