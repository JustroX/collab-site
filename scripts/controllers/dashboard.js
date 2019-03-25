app.controller("dashboardController",function($scope,$http,$location,$timeout,$rootScope,apiService,schemaService,modelService,utilService,subpageService,session,$sanitize,$route,$routeParams)
{

	apiService.free();
	modelService.free();

	$scope.HASH  = Math.random().toString(36).substring(7);

	const subpage=subpageService.Page();
	const modal_subpage = subpageService.Page();
	const models = schemaService.getModels();
	let feed_editor;

	$scope.subpage  = subpage;
	$scope.modal_subpage  = modal_subpage;
	$scope.moment = moment;

	$scope.$on('ready',function()
	{
		$http.get('/auth/login').then((res)=>
		{
			if(!res.data)
				$location.path('/');
			else
			subpage.goto($routeParams.subpage);
		});


		UIkit.util.on("#reply-modal-"+$scope.HASH,'beforehide',function()
		{
			console.log("closing");
			if($scope.feed_editor_active)
			{
				$("#reply-editor-block-"+$scope.HASH).hide();
				$("#reply-editor-"+$scope.HASH).hide();
			}
		});


		//tour
		if($scope.tour) 
		{
			console.log(duplicate);
			return;
		}


		let tour = new Tour({
		  storage: false,
		  steps: 
		  [
		  {
		    orphan: true,
		    delay: 2000,
		    title: "",
		    backdrop: true,
		    content: `<h3>Welcome to the Guild!</h3><p style='padding: 10px'> Hello `+$scope.SESSION_USER.name.first+`, <br> To introduce you with the website's features and capabilities, here's a quick tour. </p>`
		  },
		  {
		  	element: "#dashboard-feed-tour",
		  	backdrop: true,
		  	title: "Feed",
		  	placement: 'auto right',
		  	content: `Here is the feed where you can see the latest updates and posts of all people and events you follow.`
		  },
		  {
		  	element: "#feed-editor-container",
		  	// backdrop: true,
		  	title: "Post",
		  	placement: 'auto right',
		  	content: `<p>Here is the content editor where you can post your ideas / inquiries or anything you want.</p> <p> To check that everything is working, go ahead and share something about yourself. </p> <pre style='padding: 5px;'>Hello, I am `+$scope.SESSION_USER.name.first+` and I like ... </pre> <p>Please click next if you've already posted.</p> `
		  },
		  {
		  	element: '#dashboard-navigation-tour',
		  	backdrop: true,
		  	title: "Navigation",
		  	placement: 'auto right',
		  	content: `Here is the main navigation.`
		  },
		  {
		  	element: '#dashboard-navigation-feed-tour',
		  	backdrop: true,
		  	title: "Feed Navigation",
		  	placement: 'auto right',
		  	content: `You can check out your main feed by clicking this.`
		  },
		  {
		  	element: '#dashboard-navigation-group-tour',
		  	backdrop: true,
		  	title: "Group Navigation",
		  	placement: 'auto right',
		  	content: `Join or View your groups by clicking here.`
		  },
		  {
		  	element: '#dashboard-navigation-discover-tour',
		  	backdrop: true,
		  	title: "Discover Navigation",
		  	placement: 'auto right',
		  	content: `And discover latest events and contests by clicking here.`
		  },
		  {
		  	element: '#dashboard-navigation-group-tour',
		  	// backdrop: true,
		  	title: "View groups",
		  	placement: 'auto right',
		  	content: `Now, let's go to the groups. Click the <b><i class="fas fa-campground"></i> Groups</b> text`,
	  		template: `<div class='popover tour'>
					  <div class='arrow'></div>
					  <h3 class='popover-title'></h3>
					  <div class='popover-content'></div>
					  <div class='popover-navigation'>
					    </div>
					</div>`
		  	// duration: 4500,
		  },
		  {
		  	orphan: true,
		  	backdrop: true,
		  	delay: 2000,
		  	title: "Groups",
		  	// placement: 'auto right',
		  	content: `<p> Groups are the integral part of Bicol Programmer's Guild. It is where most of the action is happening. </p>
		  			<p> Groups contain <b>modules</b>, <b> field-specific community </b> and connection opportunities.  </p>`
		  },
		  {
		  	element : "#dashboard-group-not-own-tour",
		  	backdrop: true,
		  	title: "Discover Groups",
		  	content: "Here you can see the list of groups available to you. "
		  },
		  {
		  	element : "#dashboard-group-not-own-tour",
		  	// backdrop: true,
		  	placement: "right",
		  	title: "Join Group",
		  	content: "Go ahead and join the Beginner's Hub. ",
		  	template: `<div class='popover tour'>
						  <div class='arrow'></div>
						  <h3 class='popover-title'></h3>
						  <div class='popover-content'></div>
						  <div class='popover-navigation'>
						    <button class='btn btn-default' data-role='end'>End tour</button>
						  </div>
						</div>`
		  },

		],

		onEnd: function()
			{
				console.log("I am called.");
				$http.get('/api/user/tour?path=dashboard').then((res)=>
				{
					if(!$scope.SESSION_USER.tour) $scope.SESSION_USER.tour = {};
					$scope.SESSION_USER.tour.dashboard = true;
				})
			}
		});


		// Start the tour
		if(!($scope.SESSION_USER.tour && $scope.SESSION_USER.tour.dashboard))
		{
			// Initialize the tour
			tour.init();
			$scope.tour = tour;
			tour.start();
		}

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
		if($("#reply-editor-"+$scope.HASH).is(":visible"))
			$("#reply-editor-"+$scope.HASH).fadeToggle(500,function(){
				$("#reply-editor-block-"+$scope.HASH).fadeToggle(500);
				feed_editor.focus();
			});
		else
			$("#reply-editor-block-"+$scope.HASH).fadeToggle(500,function(){
				$("#reply-editor-"+$scope.HASH).fadeToggle(500);
			});
	}


	$scope.on_feed_editor = function(quill)
	{
        feed_editor = quill;
	}





	let postNew  = apiService.new({ id: "post-new", model: "post", method: "post", incomplete_default: "Can't post empty content." });
	let postList = apiService.new({ id: "post-list", model: "post", method: "list", url: "post/feed", param: "sort=-date&group=$n_null&parent=$n_null" , limit: 10000000000000000 });
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

	let user =  modelService.new({ id: "settings" , model: "user", dates: ["birthday"] });

	user.on("loaded",function()
	{
		var preview = document.getElementById('image-preview');
		preview.src  = user.value.model.profile_pic || "https://abs.twimg.com/sticky/default_profile_images/default_profile.png";

	});

	subpage.onload("settings",function()
	{
		user.load($scope.SESSION_USER._id);
	});
	$scope.temp = {};
	$scope.image_change = function()
	{
		var preview = document.getElementById('image-preview');
	    var file    = document.getElementById('image-input').files[0];
	    var reader  = new FileReader();
  
  	    reader.addEventListener("load", function () {
  	      preview.src = reader.result;
  	      let img = new Image();
  	      img.onload = function()
  	      {
	          var canvas = document.createElement('canvas'),
		            max_size = 544,// TODO : pull max size from a site config
		            width = img.width,
		            height = img.height;
		        if (width > height) {
		            if (width > max_size) {
		                height *= max_size / width;
		                width = max_size;
		            }
		        } else {
		            if (height > max_size) {
		                width *= max_size / height;
		                height = max_size;
		            }
		        }
		        canvas.width = width;
		        canvas.height = height;
		        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
		        var dataUrl = canvas.toDataURL('image/jpeg');
			  user.value.model.profile_pic = ""+ dataUrl;
  	      }

  	      img.src = reader.result;

  	    }, false);
  
  	    if (file) {
  	      reader.readAsDataURL(file);
	    }

	}



	//posts


	let replyList = apiService.new({ id: "reply-list", model: "post", method : "list" , limit: 1000000000000000 });

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
		UIkit.modal("#reply-modal-"+$scope.HASH).show();
		post.load(u._id);

		replyList.config.param =  "parent=" + u._id;
		replyList.load();

		$scope.reply.model.group  = u.group;
		$scope.reply.model.parent = u._id;

		$("#reply-editor-container-"+$scope.HASH).fadeIn();
		$("#reply-editor-"+$scope.HASH).fadeIn();
		$("#reply-editor-block-"+$scope.HASH).fadeOut();
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
	let groupJoin  = apiService.new({ id: "group-join", model: "group", method: "post" });

	let groupPending = apiService.new({ id: "group-join-pending", model:"group", method: "post"});


	groupNew.on("success",function(res)
	{
		UIkit.modal("#modal-new-group").hide();
		$timeout(function()
		{
			$location.path("/group/"+res._id+"/member");
		},10);
	});
	let target_group;
	groupListExplore.on("selected",function(i)
	{
		groupView.config.target = i._id;
		groupView.load();

		groupJoin.config.url = "group/"+i._id+"/users/join"; 
		target_group  = i._id;
		
		groupPending.config.url = "group/"+i._id+"/users_pending"; 

		UIkit.modal("#modal-group-viewer").show();
		modal_subpage.goto("badge");
	});

	groupPending.on("success",function(res)
	{
		UIkit.modal("#modal-group-viewer").hide();
		UIkit.notification("Your request has been sent.","success");
	});
	groupList.on("selected",function(i)
	{
		$location.path("/group/"+i._id+'/feed');
	});

	groupJoin.on("success",function(res)
	{
		$location.path("/group/"+target_group+'/feed');
		UIkit.modal("#modal-group-viewer").hide();
	});

	groupJoin.on("error",function(err)
	{
		// $location.path("/group/"+target_group+'/feed');
		UIkit.modal("#modal-group-viewer").hide();
		UIkit.notification(err,'danger');
	});

	subpage.onload("group",function()
	{
		if($scope.tour && $scope.tour.getCurrentStep() ==7 )
		{
			$scope.tour.next();
		}
		 groupList.config.param ="users.user="+session.getUser()._id;
		 groupListExplore.config.param ="users.user=ne_"+session.getUser()._id;
		 groupList.load();
		 groupListExplore.load();
	});

	let postEdit = modelService.new({ id: "post-edit" , model: "post" })
	$scope.post_edit = function(u)
	{
		postEdit.load(u._id);
		UIkit.modal("#editor-modal").show();
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
		UIkit.modal("#editor-modal").hide();
		postList.load();
	});


	postEdit.on("deleted",function(res)
	{
		UIkit.modal("#delete-modal").hide();
		postList.load();
	});


	$scope.post_delete = function(u)
	{
		postEdit.load(u._id);
		UIkit.modal("#delete-modal").show();
	}

	
	$scope.post_owned = function(i)
	{
		if(!i.author) return;
		return i.author._id == session.getUser()._id ;
	}

	// $(window).scroll(function() {
	//    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
	//    	$timeout(function()
	//    	{
	//    		postList.append_next();
	//    	},1);
	//    }
	// });


	///mobile
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
	{
		$scope.ON_MOBILE = true;
	 	UIkit.modal("#modal-device").show();
	}
});
