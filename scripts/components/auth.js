app.component('auth',{
    bindings:
    {
      location: "@?target",
      success: "="
    },
    transclude: true,
    template: `<here></here><div ng-if='!$ctrl.hasTranscluded'><div ng-include="$ctrl.template || '/template/auth/default' "></div></div>`,
    controller: function($http,$location,$transclude,$element)
    {

       const ctrl = this;
      $transclude(function(clone,scope){
        scope.$ctrl = ctrl;
        $element.find('here').append(clone);
        if(clone.length){
         ctrl.hasTranscluded = true;
        }
        clone.on('$destroy', function() {
          scope.$destroy();
        });
      });

       ctrl.location = ctrl.location || "/master"
       ctrl.$onInit = function()
       {
          let form = 
          {
            email: "",
            password: "",
            message : "",
            error: ""
          };

          ctrl.form = form;

          ctrl.login = function()
          {
            form.error  = "";
            form.loading = true;
            $http.post('/auth/login',form).then((res)=>
            {
              form.loading = false;
              res = res.data;
              if(res.err)
              {
                form.message = "";
                form.error = res.err;
              }
              else
              {
                form.error =  "";
                form.message = res.message;
                form.email  ="";
                form.password  ="";
                ctrl.success && ctrl.success();
              }
            });
          }
       }
    }
});