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
    	scope.minipage = ctrl.subpage;
    },
    template: `<div ng-show='minipage.Ispage(page)'><div ng-transclude></div></div>`
  };
})
.directive('pages', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope:
    {
    	page: "@",
    	subpage: "=",
        default: "@"
    },
    controller: function($scope)
    {
    	this.subpage = $scope.subpage;
        this.$onInit = function()
        {
            if($scope.default)
                this.subpage.goto($scope.default);
        }
    },
    template: `<div><div ng-transclude></div></div>`
  };
});