app.controller("groupController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$routeParams)
{
	const subpage=subpageService.Page();
	const models = schemaService.getModels();
	$scope.subpage  = subpage;
	$scope.moment = moment;

	$scope.$on('ready',function()
	{
		$scope.group.load($routeParams.id);
		$scope.group.on("loaded",function()
		{
			subpage.goto($routeParams.subpage);
		});
	});
	$scope.group  = modelService.new({id:"group-model",model:"group"});
	$scope.group_id = $routeParams.id;


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


	//GROUP

	let pendingList = apiService.new({ id: "group-pending", model: "group", url: "group/"+$routeParams.id+"/users_pending", method: "list", param: "sort=name" });
	let memberList  = apiService.new({ id: "group-member" , model: "group", url: "group/"+$routeParams.id+"/users", method: "list", param: "sort=name"});

	subpage.onload("member",function()
	{
		pendingList.load();
		memberList.load();
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


});