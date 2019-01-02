app.controller("invitationNewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let model = 
	{
		email: "",
	};

	$scope.model   = model;

	let api = apiService.new("invitation",$scope);
	api.loaded = function(res)
	{
		model = 
		{
			email: "", 
		};
		$scope.model = model;
	};
	api.validate = function()
	{
		return $scope.model.email!="" ;
	};
	api.success = function(res)
	{
		$scope.invitation.link  = window.location.protocol +"//"+ window.location.host + "/#/invitation/" + res._id;
	}

	$scope.invitation ={};

	$scope.api    = api;
	$scope.modal  = {};

	$scope.$on('pages/navigation/navbar/click-invite',function(ev,data)
	{
		$scope.invitation.link = "";
		if($scope.modal.id)
			UIkit.modal("#"+$scope.modal.id).show();
	});
});