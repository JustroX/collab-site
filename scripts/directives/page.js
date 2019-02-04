app.directive('page', function() {
  return {
    restrict: 'A',
    transclude: true,
    scope:
    {
    	page: "@"
    },
    require: "^^pages",
    link: function(scope,element,attrs,ctrl)
    {
    	scope.subpage = ctrl.subpage;
    },
    template: `<div ng-show='subpage.Ispage(page)'><div ng-transclude></div></div>`
  };
})
.directive('pages', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope:
    {
    	page: "@",
    	subpage: "="
    },
    controller: function($scope)
    {
    	this.subpage = $scope.subpage;
    },
    template: `<div><div ng-transclude></div></div>`
  };
});