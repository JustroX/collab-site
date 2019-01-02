app.controller("userEditController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
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
	
	api.success = function(res)
	{
		// model = 
		// {
		// 	name: "",
		//    bio: "",
		//    birthday: new Date(),
		//    school: "",
		//    username: "",
		//    private: 
		//    {
		//    	 local: 
		//    	 {
		//    	 	password: "",
		//    	 }
		//    }
		// };
		// $scope.model = model;
		$scope.model.private.local.password ="";
		$scope.model.private.local.old_password ="";
		$scope.model.confirm_password ="";
		$rootScope.$broadcast("component/user/edit/save/success",{res:res});
	};
	api.validate = function()
	{
		if( $scope.model.private && $scope.model.private.local && $scope.model.private.local.password!="")
		{
			if ( $scope.model.confirm_password !=  $scope.model.private.local.password)
			{
				$timeout(function()
				{
					api.error = "Password doesn't match";
				},1);
				return false;
			}
			
		}
		return $scope.model.username!="" &&  $scope.model.name!=""  && (  $scope.model.private && $scope.model.private.local &&  $scope.model.private.local.email!="") ;
	};
	view.success = function(res)
	{
		$scope.model = res;
		$scope.model.birthday = new Date(res.birthday || Date.now() );
		$rootScope.$broadcast("component/user/edit/load/success",{res:res});
	}
	view.loaded = function(res)
	{
		console.log(res);
	}

	$scope.$on("component-user-edit-load",function(ev,data)
	{
		$scope.api.view.target = data._id;
		$scope.api.view.load();
	});

	$scope.validateForm1 = function()
	{
		if( $scope.model.private && $scope.model.private.local && $scope.model.private.local.password!="")
		{
			if ( $scope.model.confirm_password !=  $scope.model.private.local.password)
			{
				$timeout(function()
				{
					$scope.api.error = "Password doesn't match";
				},1);
				return;
			}
			
		}
		$scope.gotoPage2()
	}
	
	api.view =  view;
	$scope.api = api;

});