var comment_editor;
app.controller("newsfeedController", function($scope,$location,$http,$sanitize)
{
	$scope.is_editor_active = false;

	var post_form = { content: "" };
	var previous_content = "";
	$scope.loading = false;

	$scope.post_form = post_form;

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
});