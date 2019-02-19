app.controller("moduleEditController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$routeParams)
{
	const subpage=subpageService.Page();
	const models = schemaService.getModels();
	$scope.subpage  = subpage;
	$scope.moment = moment;

	$scope.module  = modelService.new({id:"module-model",model:"module"});
	$scope.module_id = $routeParams.id;

	$scope.$on('ready',function()
	{
		$scope.module.load($routeParams.id);
		badgeList.load();
	});
	$scope.module.load($routeParams.id);

	$scope.module.on("saved",function()
	{
		UIkit.modal("#modal-module-title").hide();
		UIkit.notification("Module description updated","success");
	});


	let badgeSearch = apiService.new({ id: "module-badge-search", model:"badge" , method: "list", param: "fullname=rx_" });
	let badgeNew = apiService.new({ id: "module-badge-new" 	, model: "module", url: "module/"+$routeParams.id+"/badges", method: "post" });
	let badgeList = apiService.new({ id: "module-badge-list" 	, model: "module", url: "module/"+$routeParams.id+"/badges", method: "list" });
	$scope.badge_new = {};

	badgeSearch.on("selected",function(u)
	{
		$scope.badge_new.badge = u._id;
		badgeNew.load($scope.badge_new);
	});
	badgeNew.on("success",function()
	{
		badgeList.load();
	});

});