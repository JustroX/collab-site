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
		load_pages();
	});
	$scope.module.load($routeParams.id);

	$scope.module.on("saved",function()
	{
		UIkit.modal("#modal-module-title").hide();
		UIkit.notification("Module description updated","success");
	});

	$scope.module.on("deleted",function()
	{
		UIkit.modal("#modal-module-delete").hide();
		UIkit.notification("Module deleted","success");
		$timeout(function()
		{
			apiService.reset_events();
			modelService.reset_events();
			$location.path("/group/"+$scope.module.value.model.group+"/module");
		},1000);
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


	$scope.pages = [];
	$scope.pages_loading =false;
	//page
	let articleList = apiService.new({ id: "module-article-list" , url: "module/"+$routeParams.id+"/articles", model: "module", method: "list" });
	let challengeList = apiService.new({ id: "module-challenge-list" , url: "module/"+$routeParams.id+"/challenges", model: "module", method: "list" });

	articleList.on("success",function(res)
	{
		$scope.pages_loading = false;
		for(let i in res)
			res[i].type = "article";
		
		$scope.pages.push(...res);
	});
	challengeList.on("success",function(res)
	{
		$scope.pages_loading = false;
		for(let i in res)
			res[i].type = "challenge";
		
		$scope.pages.push(...res);
	});

	function load_pages()
	{
		$scope.pages = [];
		$scope.pages_loading = true;
		articleList.load();
		challengeList.load();
	}

	$scope.show_page = function(u)
	{

	}

	//articles
	let articleNew    = apiService.new({ id: "article-new" 	, model: "article", method: "post" });
	articleNew.on("success",function()
	{
		load_pages();
	});
});