app.controller("profileController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$route,$routeParams)
{

	apiService.free();
	modelService.free();

	const subpage=subpageService.Page();
	const modal_subpage = subpageService.Page();
	const models = schemaService.getModels();

	$scope.subpage  = subpage;
	$scope.modal_subpage  = modal_subpage;
	$scope.moment = moment;

	let profile = modelService.new({ model: "user", method: "get", id: "profile" });

	let postList = apiService.new({ id: "post-list-profile", model: "post", method: "list", param: "group=$n_null&sort=-date&parent=$n_null&author="+$routeParams.id });


	$scope.$on('ready',function()
	{
		profile.load($routeParams.id);
		postList.load();
	});



	let replyList = apiService.new({ id: "reply-list", model: "post", method : "list" });

	let postLikeNew    = apiService.new({ id: "post-like-new"   , model: "post", method: "post" });
	let postLikeDelete = apiService.new({ id: "post-like-delete", model: "post", method: "delete" });

	let postShareNew    = apiService.new({ id: "post-share-new"   , model: "post", method: "post" });
	let postShareDelete = apiService.new({ id: "post-share-delete", model: "post", method: "delete" });

	let postEdit = modelService.new({ id: "post-edit" , model: "post" })
	$scope.post_edit = function(u)
	{
		postEdit.load(u._id);
		UIkit.modal("#profile-editor-modal").show();
	}
	let edit_editor;
	$scope.on_edit_editor  = function(q){ edit_editor = q; };
	postEdit.on("loaded",function(res)
	{
		if(edit_editor)
		edit_editor.setContents(JSON.parse( postEdit.value.model.content ));
	});
	postEdit.on("saved",function(res)
	{
		UIkit.modal("#profile-editor-modal").hide();
		postList.load();
	});


	postEdit.on("deleted",function(res)
	{
		UIkit.modal("#profile-delete-modal").hide();
		postList.load();
	});


	$scope.post_delete = function(u)
	{
		postEdit.load(u._id);
		UIkit.modal("#profile-delete-modal").show();
	}

	
	$scope.post_owned = function(i)
	{
		if(!i.author) return;
		return i.author._id == session.getUser()._id ;
	}


	let replyNew = apiService.new({ id: "reply-new", model: "post",  incomplete_default: "Can't post empty content." , method: "post"})
	let reply_editor;
	$scope.on_reply_editor_reply = function(quill)
	{
        reply_editor = quill;
	}
	replyNew.on("success",function()
	{
		$scope.reply_editor_toggle();
		replyList.load();
	});

	let postUtil = {};
	$scope.reply  = {model: {}};

	postUtil.reply = function(u)
	{
		UIkit.modal("#profile-reply-modal").show();
		post.load(u._id);

		replyList.config.param =  "parent=" + u._id;
		replyList.load();

		$scope.reply.model.group  = u.group;
		$scope.reply.model.parent = u._id;

		$("#profile-reply-editor-container").fadeIn();
		$("#profile-reply-editor").fadeIn();
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

	$scope.reply_editor_toggle = function()
	{
		if($("#profile-reply-editor").is(":visible"))
			$("#profile-reply-editor").fadeToggle(500,function(){
				$("#profile-reply-editor-block").fadeToggle(500);
				reply_editor.focus();
			});
		else
			$("#profile-reply-editor-block").fadeToggle(500,function(){
				$("#profile-reply-editor").fadeToggle(500);
			});
	}


	let followNew = apiService.new({ model: "user", method: "post", id: "follow-new" });
	let followDelete = apiService.new({ model: "user", method: "delete", id: "follow-delete" });

	$scope.is_following =  function(u)
	{
		for(let i in u.followed_by)
			if(u.followed_by[i].user == $scope.SESSION_USER._id)
				return true;
		return false;
	}

	$scope.follow = function(u)
	{
		followNew.config.url = "user/"+u._id+"/followed_by";
		followNew.load( null, null, function(res)
		{
			u.followed_by.push(res);
		} );
	}
	$scope.unfollow = function(u)
	{
		let target;
		for(let i in u.followed_by)
		{
			if(u.followed_by[i].user == $scope.SESSION_USER._id)
			{
				target  =i; break;
			}
		}
		if(!target) return;

		followDelete.config.url = "user/"+u._id+"/followed_by/" + u.followed_by[target]._id;
		followDelete.load( null, null, function(res)
		{
			if(res.code == 200)
			{
				u.followed_by.splice(target,1);
			}
		} );
	}

});