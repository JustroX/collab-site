app.controller("navbarController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$routeParams)
{
	const subpage=subpageService.Page();
	const models = schemaService.getModels();

	apiService.free();
	modelService.free();
	


	$scope.subpage  = subpage;
	$scope.moment = moment;


	$scope.$on('ready',function()
	{

	});


	let invitationNew = apiService.new({ id: "invitation-new" , model: "invitation", method: "post" });

	$scope.invitation = {};

	$scope.invite = function()
	{
		UIkit.modal("#modal-invitation").show();
		$scope.invitation  = {};
	}

	invitationNew.on("success",function(res)
	{
		$scope.invitation.link  = window.location.protocol +"//"+ window.location.host + "/#/invitation/" + res._id;
	});


});