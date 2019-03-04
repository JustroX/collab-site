app.controller("groupController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$routeParams)
{
	const subpage=subpageService.Page();
	const models = schemaService.getModels();

	apiService.free();
	modelService.free();
	


	$scope.subpage  = subpage;
	$scope.moment = moment;


	$scope.$on('ready',function()
	{
		$scope.group.load($routeParams.id);
	});
	$scope.group  = modelService.new({id:"group-model",model:"group"});
	$scope.group_id = $routeParams.id;

	$scope.admin_permission = function(field,num)
	{
		for(let i in $scope.group.value.model.users)
		{
			let obj  =$scope.group.value.model.users[i];
			if(obj.user == $scope.SESSION_USER._id)
			{
				let a = $scope.get_rank_permission(obj.rank)[field] & num;	
				return a;
			}
		}	
	}
	let page_info_loaded = false;
	$scope.group.on("loaded",function()
	{
		if(!page_info_loaded)
			subpage.goto($routeParams.subpage);
		page_info_loaded = true;
	});
	$scope.group.on("saved",function()
	{
		UIkit.notification("Group settings saved", "success");
	});


	//FEED
	let postNew  = apiService.new({ id: "post-new-group", model: "post", method: "post", incomplete_default: "Can't post empty content." });
	let postList = apiService.new({ id: "post-list-group", model: "post", method: "list", param: "group="+$scope.group_id+"&sort=-date" });
	postNew.on("success",function()
	{
		postList.load();
		$scope.feed_editor_toggle();
	});
	$scope.postListModel = { group: $scope.group_id };

	$scope.feed_editor_active = false;
	$scope.feed_editor_toggle = function()
	{
		if($("#feed-editor").is(":visible"))
			$("#feed-editor").fadeToggle(500,function(){
				$("#feed-editor-block").fadeToggle(500);
				feed_editor.focus();
			});
		else
			$("#feed-editor-block").fadeToggle(500,function(){
				$("#feed-editor").fadeToggle(500);
			});
	}
	$scope.on_feed_editor = function(quill)
	{
        feed_editor = quill;
	}


	subpage.onload("feed",function()
	{
		$("#feed-editor-container").fadeIn();
		$("#feed-editor").fadeIn();
		postList.load();
	});

	subpage.onload("about",function()
	{
		memberList.load();
	});

	subpage.onload("module",function()
	{
		moduleList.load();
	});



	//GROUP

	let pendingList = apiService.new({ id: "group-pending", model: "group", url: "group/"+$routeParams.id+"/users_pending", method: "list", param: "sort=name" });
	let memberList  = apiService.new({ id: "group-member" , model: "group", url: "group/"+$routeParams.id+"/users", method: "list", param: "sort=name"});

	subpage.onload("member",function()
	{
		pendingList.load();
		memberList.load();
	});
	subpage.onload("settings",function()
	{
		rankList.load();
		badgeList.load();
	});

	$scope.get_rank_name = function(_id)
	{
		let group = $scope.group.value.model;
		for(let i in group.ranks)
		{
			if(group.ranks[i]._id == _id)
				return group.ranks[i].name;
		}
	}
	$scope.get_rank_permission = function(_id)
	{
		let group = $scope.group.value.model;
		for(let i in group.ranks)
		{
			if(group.ranks[i]._id == _id)
				return group.ranks[i].permissions;
		}
	}

	let memberSearch = apiService.new({ id: "member-search", model:"user" , method: "list", param: "fullname=rx_" });
	let memberNew = apiService.new({ id: "member-new" , model: "group", method: "post" , url: "group/"+$routeParams.id+"/users" });
	let memberView = modelService.new({ id: "member-view", model: "group", url: "group/"+$routeParams.id+"/users" });

	$scope.add_new_member = function()
	{
		UIkit.modal("#modal-new-member").show();
	}

	memberView.api.put.on("success",function(res)
	{
		memberList.load();
		UIkit.modal("#modal-view-member").hide();
		UIkit.notification("Member updated","success");
	});

	memberView.api.delete.on("success",function(res)
	{
		memberList.load();
		UIkit.modal("#modal-view-member").hide();
		UIkit.notification("Member removed","success");
	});
	memberView.api.put.on("error",function(err)
	{
		UIkit.modal("#modal-view-member").hide();
		UIkit.notification(err,"danger");
	});
	memberView.api.delete.on("error",function(err)
	{
		UIkit.modal("#modal-view-member").hide();
		UIkit.notification(err,"danger");
	});


	memberList.on("selected",function(u)
	{
		UIkit.modal("#modal-view-member").show();
		memberView.load(u._id);
	});


	$scope.member_new = {};
	memberNew.on("error",function(err)
	{
		UIkit.modal("#modal-new-member").hide();
		UIkit.notification(err,"danger");
	});
	memberNew.on("success",function()
	{
		UIkit.modal("#modal-new-member").hide();
		memberList.load();
	});

	memberSearch.on("selected",function(u)
	{
		for(let i in $scope.group.value.model.ranks)
			if($scope.group.value.model.ranks[i].default )
			{
				$scope.member_new.rank = $scope.group.value.model.ranks[i]._id;
			}

		$scope.member_new.user = u._id;
		memberNew.load($scope.member_new);
	});

	//ranks
	let rankList  = apiService.new({ id: "rank-list" , model: "group", url: "group/"+$routeParams.id+"/ranks", method: "list", param: "sort=name"});
	let rankNew = apiService.new({ id: "rank-new" , model: "group", url: "group/"+$routeParams.id+"/ranks", method: "post" });
	let rank = modelService.new({ id: "rank", model: "group", url: "group/"+$routeParams.id+"/ranks" });

	rankNew.on("success",function()
	{
		rankList.load();
	});
	rankList.on("selected",function(u)
	{
		rank.load(u._id);
	});
	rank.on("loaded",function()
	{
		for(let i in rank.value.model.permissions)
		{
			console.log(i);
			for(let p in [1,2,3])
				$scope.temp_permission_obj[i][p] = (rank.value.model.permissions[i] & (1<<p))? true: false;
		}
	});
	rank.on("saved",function()
	{
		rankList.load();
	});
	rank.on("deleted",function()
	{
		rankList.load();
		UIkit.notification("Group deleted", "success");
		rank.value.model._id = null;
	});

	$scope.temp_permission_obj = 
	{
		module : [0,0,0],
		users : [0,0,0],
		group : [0,0,0],
		post: [0,0,0]
	};

	$scope.rank_permission_change = function(model,permission)
	{
		let num = 0;
		for(let i in $scope.temp_permission_obj[permission])
			num += $scope.temp_permission_obj[permission][i] ? (1<<i) : 0;
		model.permissions[permission] = num;
	}

	$scope.rank_checked = function(model,permission,num)
	{
		return model.permissions[permission]&num;
	}


	// badges
	let badgeList  = apiService.new({ id: "badge-list" 	, model: "group", url: "group/"+$routeParams.id+"/badges_required", method: "list", param: "sort=name"});
	let badgeNew = apiService.new({ id: "badge-new" 	, model: "group", url: "group/"+$routeParams.id+"/badges_required", method: "post" });
	let badge = modelService.new({ id: "badge"			, model: "group", url: "group/"+$routeParams.id+"/badges_required" });
	let badgeSearch = apiService.new({ id: "badge-search", model:"badge" , method: "list", param: "fullname=rx_" });
	let badgeDelete = apiService.new({ id: "badge-delete", model: "group", method: "delete", url: "group/"+$routeParams.id+"/badges_required" });
	
	$scope.badge_new = {};
	badgeSearch.on("selected",function(u)
	{
		$scope.badge_new.badge = u._id;
		badgeNew.load($scope.badge_new);
	});	
	badgeList.on("selected",function(u)
	{
		badgeDelete.config.url  = "group/"+$routeParams.id+"/badges_required/"+u._id;
		badgeDelete.load();
	});
	badgeDelete.on("success",function()
	{
		UIkit.notification("Badge removed","success");
		badgeList.load();
	});
	badgeNew.on("success",function()
	{
		badgeList.load();
	});

	//modules
	let moduleList  = apiService.new({ id: "module-list" , model: "module", method: "list", param: "group="+$routeParams.id});
	let moduleNew = apiService.new({ id: "module-new"    , model: "module", method: "post"})

	moduleNew.on("success",function(res)
	{
		UIkit.modal("#modal-new-module").hide();
		UIkit.notification("Module created","success");
		moduleList.load();
	});
	moduleList.on("selected",function(u,type)
	{
		apiService.reset_events();
		modelService.reset_events();
		if(type=="view")
			$location.path("/module/"+u._id+"/view");
		if(type=="edit")
			$location.path("/module/"+u._id+"/edit");
	});

	$scope.module_new_model = {group: $scope.group_id};
});