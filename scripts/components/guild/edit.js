app.controller("guildEditController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{
	let model = 
	{
	   name: "",
	   description: "",
	 };

	$scope.model = model;

	let api = apiService.edit("guild",$scope);
	let view = apiService.view("guild",$scope);
	
	api.success = function(res)
	{
		UIkit.notification({
		    message: 'Guild Settings Saved',
		    status: 'primary',
		    pos: 'top-right',
		    timeout: 5000
		});
		$rootScope.$broadcast("components/guild/edit/success");
	};
	api.validate = function()
	{
		return $scope.model.name!=""  && $scope.model.description!=""  ;
	};

	$scope.$on("components/guild/edit",function(err,id)
	{
		api.view.target = id;
		api.view.load();
	});
	
	api.view =  view;
	$scope.api = api;
});