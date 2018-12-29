app.controller("moduleNewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let model = 
	{
		name: "", 
		guild: "",
	 };
	$scope.model   = model;
	
	let api = apiService.new("module",$scope);
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
	
	$scope.api    = api;
});