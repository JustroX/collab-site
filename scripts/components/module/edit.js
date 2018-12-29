app.controller("moduleEditController",function($scope,$http,$location,$timeout,session,apiService)
{
	let model = 
	{
		name: "", 
		guild: "",
	 };
	$scope.model = model;

	let api = apiService.edit("module",$scope);
	let view = apiService.view("module",$scope);
	
	api.loaded = function(res)
	{
		model = 
		{
			name: "", 
			guild: "", 
		};
		$scope.model = model;
	};
	api.validate = function()
	{
		return $scope.model.name!="" && $scope.model.guild!="" ;
	};
	
	api.view =  view;
	$scope.api = api;

});