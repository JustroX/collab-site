app.controller("dashboardController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$route,$routeParams)
{

	apiService.free();
	modelService.free();

	const subpage=subpageService.Page();
	const modal_subpage = subpageService.Page();
	const models = schemaService.getModels();
	let feed_editor;

	$scope.subpage  = subpage;
	$scope.modal_subpage  = modal_subpage;
	$scope.moment = moment;

	$scope.$on('ready',function()
	{
		subpage.goto($routeParams.subpage);
	});

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





	let postNew  = apiService.new({ id: "post-new", model: "post", method: "post", incomplete_default: "Can't post empty content." });
	let postList = apiService.new({ id: "post-list", model: "post", method: "list", param: "sort=-date," });
	postNew.on("success",function()
	{
		postList.load();
		$scope.feed_editor_toggle();
	});
	subpage.onload("feed",function()
	{
		$("#feed-editor-container").fadeIn();
		$("#feed-editor").fadeIn();
		postList.load();
	});


	let groupNew  = apiService.new({ id: "group-new", model: "group", method: "post", incomplete_default: "Please fill up all necessary information." });
	let groupList = apiService.new({ id: "group-list-own", model: "group", method: "list" });
	let groupListExplore = apiService.new({ id: "group-list-not-own", model: "group", method: "list" });

	let groupView = apiService.new({ id: "group-view", model: "group", method: "get" });

	groupNew.on("success",function(res)
	{
		UIkit.modal("#modal-new-group").hide();
		$timeout(function()
		{
			$location.path("/group/"+res._id+"/member");
		},10);
	});
	groupListExplore.on("selected",function(i)
	{
		groupView.config.target = i._id;
		groupView.load();

		UIkit.modal("#modal-group-viewer").show();
		modal_subpage.goto("badge");
	});
	groupList.on("selected",function(i)
	{
		$location.path("/group/"+i._id+'/feed');
	});

	subpage.onload("group",function()
	{
		 groupList.config.param ="users.user="+session.getUser()._id;
		 groupListExplore.config.param ="users.user=ne_"+session.getUser()._id;
		 groupList.load();
		 groupListExplore.load();
	});


});