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
	$scope.reply_editor_toggle = function()
	{
		if($("#reply-editor").is(":visible"))
			$("#reply-editor").fadeToggle(500,function(){
				$("#reply-editor-block").fadeToggle(500);
				feed_editor.focus();
			});
		else
			$("#reply-editor-block").fadeToggle(500,function(){
				$("#reply-editor").fadeToggle(500);
			});
	}


	$scope.on_feed_editor = function(quill)
	{
        feed_editor = quill;
	}





	let postNew  = apiService.new({ id: "post-new", model: "post", method: "post", incomplete_default: "Can't post empty content." });
	let postList = apiService.new({ id: "post-list", model: "post", method: "list", param: "sort=-date" });
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

	let replyList = apiService.new({ id: "reply-list", model: "post", method : "list" });

	let postLikeNew    = apiService.new({ id: "post-like-new"   , model: "post", method: "post" });
	let postLikeDelete = apiService.new({ id: "post-like-delete", model: "post", method: "delete" });

	let postShareNew    = apiService.new({ id: "post-share-new"   , model: "post", method: "post" });
	let postShareDelete = apiService.new({ id: "post-share-delete", model: "post", method: "delete" });

	$scope.post_check_like = function(u)
	{
		let field_id;
		//check if posts already liked
		for(let i in u.liked_by)
		if(u.liked_by[i].user == session.getUser()._id )
		{
			field_id = u.liked_by[i]._id;
			break;
		}
		return field_id; 
	}
	$scope.post_check_share = function(u)
	{
		let field_id;
		//check if posts already shared
		for(let i in u.shared_by)
		if(u.shared_by[i].user == session.getUser()._id )
		{
			field_id = u.shared_by[i]._id;
			break;
		}
		return field_id; 
	}

	let postUtil = {};

	$scope.feedback = function(u,type)
	{
		postUtil[type] && postUtil[type](u);
	}

	postList.on("selected",function(u,type)
	{
		postUtil[type] && postUtil[type](u);
	});
	replyList.on("selected",function(u,type)
	{
		postUtil[type] && postUtil[type](u);
	});

	postUtil.like  = function(u)
	{
		let field_id;
		let pos;
	
		for(let i in u.liked_by)
		if(u.liked_by[i].user == session.getUser()._id )
		{
			field_id = u.liked_by[i]._id;
			pos = i;
			break;
		}
		if(field_id) // liked
		{
			if(field_id == 1)
				return;
			postLikeDelete.config.url = 'post/' + u._id + '/liked_by/'+field_id;
			postLikeDelete.load(null,null,function(res)
			{
			});
			u.liked_by.splice(pos,1);
		}
		else
		{
			postLikeNew.config.url = 'post/' + u._id + '/liked_by';
			u.liked_by.push({ user: session.getUser()._id, _id: 1 });

			let ref = u.liked_by.length - 1;

			postLikeNew.load(null,null,function(res)
			{
				u.liked_by[ref] = res;
			});
		}
	}
	postUtil.share  = function(u)
	{
		let field_id;
		let pos;
	
		for(let i in u.shared_by)
		if(u.shared_by[i].user == session.getUser()._id )
		{
			field_id = u.shared_by[i]._id;
			pos = i;
			break;
		}
		if(field_id) // liked
		{
			if(field_id == 1)
				return;
			postShareDelete.config.url = 'post/' + u._id + '/shared_by/'+field_id;
			postShareDelete.load(null,null,function(res){});
			u.shared_by.splice(pos,1);
		}
		else
		{
			postShareNew.config.url = 'post/' + u._id + '/shared_by';
			u.shared_by.push({ user: session.getUser()._id, _id: 1 });
			let ref = u.shared_by.length - 1;
			postShareNew.load(null,null,function(res){
				console.log(res);
				u.shared_by[ref] = res;
			});
		}
	}

	let replyNew = apiService.new({ id: "reply-new", model: "post",  incomplete_default: "Can't post empty content." , method: "post"})
	let reply_editor;
	$scope.on_feed_editor_reply = function(quill)
	{
        reply_editor = quill;
	}
	replyNew.on("success",function()
	{
		$scope.reply_editor_toggle();
		replyList.load();
	});

	$scope.reply  = {model: {}};

	postUtil.reply = function(u)
	{
		UIkit.modal("#reply-modal").show();
		post.load(u._id);

		replyList.config.param =  "parent=" + u._id;
		replyList.load();

		$scope.reply.model.group  = u.group;
		$scope.reply.model.parent = u._id;

		$("#reply-editor-container").fadeIn();
		$("#reply-editor").fadeIn();
	}

	let post = modelService.new({ id: "post-view" , model : "post"  });
	let render;

	$scope.get_render = function(cb)
	{
		render = cb;
	}

	post.on("loaded",function()
	{
		render();
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