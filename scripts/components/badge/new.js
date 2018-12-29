app.controller("badgeNewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let model = 
	{
		name: "",
	};

	$scope.model   = model;

	let api = apiService.new("badge",$scope);
	api.loaded = function(res)
	{
		model = 
		{
			name: "", 
		};
		$scope.model = model;
	};
	api.validate = function()
	{
		return $scope.model.name!="" ;
	};


	$scope.api    = api;
});