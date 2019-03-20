//needed
/*
  id
  template
*/

app.component('feed',{
    controller: function(schemaService,feedService,$transclude,$element)
    {
      const ctrl = this;
      ctrl.$onInit = function()
      {
     
      }   
    },
    transclude: true,
    template: ``,
    bindings:{
      id: "@bind",
      mode: "@?"
    },
});