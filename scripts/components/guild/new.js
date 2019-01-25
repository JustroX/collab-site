app.controller("guildNewController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{
	let model = 
	{
	   name: "",
	   description: "",
	 };

	$scope.model   = model;

	let api = apiService.new("guild",$scope);
	api.loaded = function(res)
	{
		model = 
		{
		   name: "",
		   description: "",
		 };
		$scope.model = model;
	};
	api.validate = function()
	{
		return $scope.model.name!=""  && $scope.model.description!=""  ;
	};


	$scope.api    = api;

	$scope.api.success =function(res)
	{
		$rootScope.$broadcast('components/guild/new/success',{_id: res._id});
	}
});