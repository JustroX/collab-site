app.controller("userEditController",function($scope,$http,$location,$timeout,session,apiService)
{

	let model = 
	{
	   name: "",
	   bio: "",
	   birthday: new Date(),
	   school: "",
	   username: "",
	   "private.local.email" : "",
	   private: 
	   {
	   	 local: 
	   	 {
	   	 	password: "",
	   	 }
	   }
	};

	$scope.model = model;

	let api = apiService.edit("user",$scope);
	let view = apiService.view("user",$scope);
	
	api.loaded = function(res)
	{
		model = 
		{
			name: "",
		   bio: "",
		   birthday: new Date(),
		   school: "",
		   username: "",
		   private: 
		   {
		   	 local: 
		   	 {
		   	 	password: "",
		   	 }
		   }
		};
		$scope.model = model;
	};
	api.validate = function()
	{
		return $scope.model.username!="" &&  $scope.model.name!=""  && (  $scope.model.private && $scope.model.private.local &&  $scope.model.private.local.email!="") ;
	};
	view.success = function(res)
	{
		$scope.model = res;
		$scope.model.birthday = new Date(res.birthday);
	}
	
	api.view =  view;
	$scope.api = api;

});