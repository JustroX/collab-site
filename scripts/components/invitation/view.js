app.controller("invitationViewController",function($scope,$http,$location,$timeout,session,apiService)
{
	let api = apiService.view("invitation",$scope);
	$scope.api    = api;
});