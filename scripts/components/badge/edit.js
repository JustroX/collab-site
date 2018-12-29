app.controller("badgeEditController",function( apiService, $scope,$http,$location,$timeout,session)
{
	let model = 
	{
		name: "", 
	};
	$scope.model = model;

	let api = apiService.edit("badge",$scope);
	let view = apiService.view("badge",$scope);
	
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
	
	api.view =  view;
	$scope.api = api;

});