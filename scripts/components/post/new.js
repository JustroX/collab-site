app.controller("postNewController",function($scope,$http,$location,$timeout)
{
	let editor =
	{
		id: "text-editor",
		active: false,
		content: "",
		quill : null,
		content: "",
		init: function( _id = "text-editor", group = '5c226f60a51750466819b85f' )
		{
			editor.id = _id;
			post.group = group;

			let toolbarOptions = [
			  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			  ['bold', 'italic', 'underline', 'link'],
			  ['blockquote', 'code-block'],
			  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
			  ['clean']
			];
			editor.quill = new Quill('#'+editor.id, {
				 modules: {
				    syntax: true,
				    toolbar: toolbarOptions
				  },
				theme: 'snow',
			});
			editor.quill.on('text-change',()=>
			{
				$timeout(()=>
				{
					$scope.editor.content = editor.quill.root.innerHTML;
					$scope.post.content = editor.quill.root.innerHTML;
				},1);
			});
		},
		toggle: function()
		{
			editor.active = !editor.active
			if(editor.active) editor.focus();
		},
		focus: function()
		{
			$timeout(function()
			{
				editor.quill.blur()
				editor.quill.focus()
			},1);
		},
	}

	let post = 
	{
		content: '',
		group: null,
	};


	let api = 
	{
		loading: false,
		error: '',
		submit: function()
		{
			if(!api.validate())
			{
				api.error = "Can't post an empty content.";
				return;
			}	
			api.error = '';
			api.loading = true;
			$http.post('/api/post',post).then((res)=>
			{
				res = res.data;


				post.content = '';
				editor.quill.setText('');


				api.loading = false;
				if(res.err)
					return api.err(res.err);
				api.success(res)
			});
		},
		err: function(mes)
		{
			api.error = mes;
			console.log("API ERROR: "+mes);
		},
		validate: function()
		{
			return post.content !='<p><br></p>';
		},
		success: function(res)
		{
			if($scope.parent_api)
				$scope.parent_api.new.success(res);
		}
	}


	$scope.editor = editor;
	$scope.post   = post;
	$scope.api    = api;

	// $timeout(editor.init , 1);
});