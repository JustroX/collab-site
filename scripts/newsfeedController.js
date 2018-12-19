var comment_editor;
app.controller("newsfeedController", function($scope,$location,$http,$sanitize)
{
	$scope.is_editor_active = false;

	var post_form = { content: "" };
	var previous_content = "";
	var user = 
	{
		obj : null,
		following : [],
		following_posts : {},
		//{ page: 1, contents: [] }
	};



	$scope.loading = false;
	$scope.post_form = post_form;
	$scope.user = user;
	$scope.posts = [];

	$http.get('/api/user/self').then((res)=>
	{
		res = res.data;
		user.obj = res;

		user.following.push(user.obj._id);
		user.following_posts[user.obj._id] = { page: 0 , contents: []}

		for(i in user.obj.following)
		{
			user.following.push(user.obj.following[i]);
			user.following_posts[user.obj.following[i]] = { page: 0 , contents: []}
		}


		fetch_post();
	});


	$scope.post = () =>
	{
		if($scope.loading)
			return;

		post_form.content = $sanitize(quill.root.innerHTML);
		if(post_form.content == previous_content)
		{
			UIkit.notification( "You've already posted that.", {status:'danger',pos:'bottom-center'});
			return;
		}
		post_form.group = $scope.group;
		$scope.loading = true;

		$http.post("/api/post",post_form).then((res)=>
		{	
			$scope.loading = false;
			res = res.data;
			if(res.err)
			{
				console.log(res.err);
				UIkit.notification(res.err, {status:'danger',pos:'bottom-center'});
			}
			else
			{
				previous_content = post_form.content;
				post_form.content = "";
				quill.setText('');
				UIkit.notification("Post was published.", {status:'success',pos:'bottom-center'});
			}
		});
	}

	$scope.logout = function()
	{
		$http.get('/auth/logout').then((res)=>
		{
			$location.path('/');
		});
	}


	$scope.view_details = function()
	{
		var toolbarOptions = [
		  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		  ['bold', 'italic', 'underline', 'link'],        // toggled buttons
		  ['blockquote', 'code-block'],

		  [{ 'list': 'ordered'}, { 'list': 'bullet' }],


		  ['clean']                                         // remove formatting button
		];
		
		UIkit.modal('#modal-post-details').show();
		if(!comment_editor)
		comment_editor = new Quill('#editor-comment', {
			 modules: {
			    syntax: true,              // Include syntax module
			    toolbar: toolbarOptions  // Include button in toolbar
			  },
			theme: 'snow',
		});
	
	}


	let refresh_posts = function()
	{
		let arr = []
		let merge = (a,b)=>
		{
			let r = [...a,...b];
			r.sort((a,b)=> new Date(b.date) - new Date(a.date))
			return r
		}
		for(let u of user.following)
		{
			arr = merge(arr,user.following_posts[u].contents);
			arr = arr.slice(0,10);
		}
		$scope.posts = arr;
	}

	let fetch_post = function()
	{
		let i = 0;
		let get = function()
		{
			let u = user.following[i];
			fetch_post_user(u,user.following_posts[u].page,function()
			{
				i+=1;
				if(i<user.following.length)
				{
					get();
				}
			});
		}
		get();
	}

	let fetch_post_user = function(u,p,n)
	{
		$http.get("/api/post?author="+u+"&limit=10&offset="+p).then((res)=>
		{
			res = res.data;
			if(res.err)
				UIkit.notification( res.err,  {status:'danger',pos:'bottom-center'});
			user.following_posts[u].contents = res;
			user.following_posts[u].page += 1;
			refresh_posts();
			n();
		});
	}

});