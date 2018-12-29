app.controller("guildEditController",function($scope,$http,$location,$timeout,session,apiService)
{
	let model = 
	{
	   name: "",
	   description: "",
	 };

	$scope.model = model;

	let api = apiService.edit("guild",$scope);
	let view = apiService.view("guild",$scope);
	
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
		return $scope.model.name!=""  && $scope.model.description!=""  ;
	};
	
	api.view =  view;
	$scope.api = api;
});