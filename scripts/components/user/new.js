app.controller("userNewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let model = 
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
	   	 	email: "",
	   	 	password: "",
	   	 }
	   }
	};

	$scope.model   = model;

	let api = apiService.new("user",$scope);
	api.loaded = function(res)
	{
		$scope.model = 
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
		   	 	email: "",
		   	 	password: "",
		   	 }
		   }
		 }
	};

	api.validate = function()
	{	
		return $scope.model.username!="" &&  $scope.model.name!="" && (  $scope.model.private && $scope.model.private.local &&  $scope.model.private.local.email!=""&&  $scope.model.private.local.password!="");
	};


	$scope.api    = api;
});