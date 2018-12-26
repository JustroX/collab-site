app.controller("articleNewController",function($scope,$http,$location,$timeout)
{
	let editor =
	{
		id: "text-editor",
		active: false,
		content: "",
		quill : null,
		content: "",
		init: function( _id = "text-editor")
		{
			editor.id = _id;

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
					$scope.article.content = editor.quill.root.innerHTML;
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

	let article = 
	{
		title: '',
		content: '',
		module: null,
		authors: [],
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
			$http.post('/api/article',article).then((res)=>
			{
				res = res.data;

				api.loaded(res);

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
		loaded: function(res)
		{
			article.content = '';
			article.title = '';
		},
		validate: function()
		{
			return article.content !='<p><br></p>' && article.title!='';
		},
		success: function(res)
		{
			if($scope.parent_api)
				$scope.parent_api.new.success(res);
		}
	}


	$scope.editor = editor;
	$scope.article   = article;
	$scope.api    = api;

	// $timeout(editor.init , 1);
});