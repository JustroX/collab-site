app.controller("invitationListController",function(apiService,$scope,$http,$location,$timeout,session)
{
	let api = apiService.list("invitation",$scope);
	$scope.api    = api;
});