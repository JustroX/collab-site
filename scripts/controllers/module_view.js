app.controller("moduleViewController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$routeParams)
{
	const subpage=subpageService.Page();
	const models = schemaService.getModels();
	$scope.subpage  = subpage;
	$scope.moment = moment;

	apiService.free();
	modelService.free();

	$scope.module  = modelService.new({id:"module-model",model:"module"});
	$scope.module_id = $routeParams.id;


	$scope.$on('ready',function()
	{
		$scope.module.load($routeParams.id);
		load_pages(function()
		{
			$scope.access_page($routeParams.page);
		});
	});

	$scope.hide_offcanvas = function()
	{
		UIkit.offcanvas('#module-sidebar').hide();
		UIkit.offcanvas('#module-sidebar').hide();
	}

	//pages
	$scope.pages = [];
	$scope.pages_loading =false;

	let pages_article_loaded = false;
	let pages_challenge_loaded = false;

	//page
	let articleList   = apiService.new({ id: "module-article-list" , url: "module/"+$routeParams.id+"/articles", model: "module", method: "list" });
	let challengeList = apiService.new({ id: "module-challenge-list" , url: "module/"+$routeParams.id+"/challenges", model: "module", method: "list" });

	articleList.on("success",function(res)
	{
		for(let i in res)
			res[i].type = "article";
		$scope.pages.push(...res);
		pages_article_loaded = true;

		if(pages_article_loaded && pages_challenge_loaded)
			all_loaded();
	});
	challengeList.on("success",function(res)
	{
		for(let i in res)
			res[i].type = "challenge";		
		$scope.pages.push(...res);
		pages_challenge_loaded = true;

		if(pages_article_loaded && pages_challenge_loaded)
			all_loaded();
	});

	function all_loaded()
	{
		$scope.pages_loading = false;
		$scope.pages.sort( (a,b)=> a.page-b.page );
		// for(let i in $scope.pages)
		// 	$scope.pages[i].page = i;
		load_pages_cp && load_pages_cp();
	}

	let load_pages_cp ; 
	function load_pages(c)
	{
		load_pages_cp = c;
		pages_article_loaded = false;
		pages_challenge_loaded = false;
		$scope.pages = [];
		$scope.pages_loading = true;
		articleList.load();
		challengeList.load();
	}

	let access_models = 
	{
		article  : modelService.new({ id: "article-model", model: "article" }),
		challenge  : modelService.new({ id: "challenge-model", model: "challenge" }),
	};

	//view pages
	$scope.page = 0;
	$scope.access_page = function(i)
	{

		let page = $scope.pages[i];
		$scope.page = parseInt(i);
		subpage.goto(page.type);
		access_models[page.type].load(page.content._id);
 	}

 	let render;
 	$scope.get_renderer = function(r){ render = r; };

 	access_models.article.on("loaded",function()
 	{
 		render();
 	});

 	$scope.page_next = function()
 	{
 		$scope.access_page($scope.page + 1);
 	}
 	$scope.page_prev = function()
 	{
 		$scope.access_page($scope.page - 1);
 	}

});