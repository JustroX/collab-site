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

	$scope.open_modal_badge = function()
	{
		badgeList.load();
	}


	let badgeSearch = apiService.new({ id: "module-badge-search", model:"badge" , method: "list", param: "fullname=rx_" });
	let badgeNew    = apiService.new({ id: "module-badge-new" 	, model: "module", url: "module/"+$routeParams.id+"/badges", method: "post" });
	let badgeDelete = apiService.new({ id: "module-badge-delete" 	, model: "module", url: "module/"+$routeParams.id+"/badges", method: "delete" });
	let badgeList   = apiService.new({ id: "module-badge-list" 	, model: "module", url: "module/"+$routeParams.id+"/badges", method: "list" });
	let badge       = modelService.new({id:"module-badge-model",model:"badge"});

	$scope.badge_new = {};
	
	badgeSearch.on("selected",function(u)
	{
		$scope.badge_new.badge = u._id;
		badge.load(u._id);
	});

	badgeList.on("selected",function(u)
	{
		badgeDelete.config.target = u._id;
		badge.load(u.badge._id);
	});
	let badges = [];
	badgeList.on("success",function(res)
	{
		badges = res;
	});

	$scope.is_badge_selected  = function()
	{
		if(!badge.value.model) return;
		let id = badge.value.model._id;
		for(let i of badges)
			if(i.badge._id == id )
				return true;
		return false;
	}
	$scope.select_badge = function()
	{
		badgeNew.load({ badge: badge.value.model._id })
	}
	$scope.delete_badge = function()
	{
		badgeDelete.load();
	}
	badgeDelete.on("success",function()
	{
		badgeList.load();
	});
	badgeNew.on("success",function()
	{
		badgeList.load();
	});

});