app.controller("badgeNewController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{
	let model = 
	{
		name: "New Badge",
	};

	$scope.model   = model;

	let api = apiService.new("badge",$scope);
	api.loaded = function(res)
	{
		model = 
		{
			name: "New Badge", 
		};
		$scope.model = model;
	};
	api.validate = function()
	{
		return $scope.model.name!="" ;
	};

	$scope.api    = api;

	$scope.api.success = function(res)
	{
		$rootScope.$broadcast('components/badge/new/success');
	};

});