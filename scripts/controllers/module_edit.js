app.controller("moduleEditController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$routeParams)
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
		badgeList.load();
		load_pages();
	});
	$scope.module.load($routeParams.id);

	let group_id;
	$scope.module.on("loaded",function()
	{
	  group_id = $scope.module.value.model.group;
	});

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

	$scope.show_page = function(u)
	{

	}

	//articles
	let articleNew      = apiService.new({ id: "article-new" 	, model: "article",   method: "post" });
	let challengeNew    = apiService.new({ id: "challenge-new" 	, model: "challenge", method: "post" });
	articleNew.on("success",function()
	{
		load_pages();
	});
	challengeNew.on("success",function()
	{
		load_pages();
	});
	let article = modelService.new({ id: "article", model: "article"  });
	let challenge = modelService.new({ id: "challenge", model: "challenge"  });
	challenge.on("loaded",function()
	{
		$scope.page_editor.loading = false;
		if(challenge.value.model.content)
		{
			try{
				editor.setContents(JSON.parse(challenge.value.model.content));
			}
			catch(e)
			{
				console.log("Error parsing content.");
			}
		}
		else
			editor.setText("");
	});
	challenge.on("deleted",function()
	{
		UIkit.modal("#modal-challenge-delete").hide();
		UIkit.notification("Module deleted.","success");
		$scope.page_editor.type = null;
		load_pages(function()
		{
			if($scope.pages.length)
				$scope.page_edit($scope.pages[0]);			
		});
	});
	article.on("loaded",function()
	{
		$scope.page_editor.loading = false;
		if(article.value.model.content)
		{
			try{
				editor.setContents(JSON.parse(article.value.model.content));
			}
			catch(e)
			{
				console.log("Error parsing content.");
			}
		}
		else
			editor.setText("");
	});
	article.on("deleted",function()
	{
		UIkit.modal("#modal-article-delete").hide();
		UIkit.notification("Article deleted.","success");
		load_pages();
		$scope.page_editor.type = null;
	});
	challenge.on("deleted",function()
	{
		UIkit.modal("#modal-challenge-delete").hide();
		UIkit.notification("Challenge deleted.","success");
		load_pages();
		$scope.page_editor.type = null;
	});

	article.on("saved",function()
	{
		load_pages();
	});
	challenge.on("saved",function()
	{
		load_pages();
	});

	$scope.page_editor  = {  type: null };
	$scope.page_editor.loading = false;

	let editor;
	$scope.page_editor.access = function(quill)
	{
		editor  = quill;
	}


	let page_put = apiService.new({ id: "module-article-put", model:"module" , method: "put" });;

	$scope.move_up = function(i)
	{
		let page =  1; 
		page_put.config.url =  'module/'+ $routeParams.id + '/' + i.type + 's/'+ i._id ;
		page_put.load({ inc: page });
	};
	$scope.move_down = function(i)
	{
		let page =  -1; 
		page_put.config.url =  'module/'+ $routeParams.id + '/' + i.type + 's/'+ i._id ;
		page_put.load({ inc: page });
	};

	page_put.on("success",function()
	{
		load_pages();
	});

	$scope.page_edit = function(i)
	{
		$scope.page_editor.type = i.type;
		if(i.type == "article")
			article.load(i.content._id);
		else
			challenge.load(i.content._id);
			
		$scope.page_editor.loading = true;
	}

});