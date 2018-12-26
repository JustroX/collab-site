app.controller("articleEditController",function($scope,$http,$location,$timeout,session)
{

	let article = 
	{
		title: '',
		content: '',
		module: null,
		authors: [],
	};

	let editor =
	{
		id: "text-editor",
		active: false,
		content: "",
		quill : null,
		content: "",
		init: function( _id = "text-editor" )
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

	let api = 
	{
		loading: false,
		error: '',
		submit: function()
		{
			if(!api.validate())
			{
				api.error = "Can't update an empty content.";
				return;
			}	
			api.error = '';
			api.loading = true;
			$http.put('/api/article/'+api.view.target,$scope.article).then((res)=>
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

		},
		validate: function()
		{
			return article.content !='<p><br></p>';
		},
		success: function(res)
		{
			if($scope.parent_api)
				$scope.parent_api.edit.success(res);
		}
	};
	let view =
	{
		loading: false,
		error: '',
		target: '',
		param: '',
		load: function()
		{
			session.onready(function()
			{
				view.loading = true;
				$http.get('/api/article/'+view.target+'?'+view.param).then((res)=>
				{
					view.load_options();
					res = res.data;
					view.loading = false;
					if(res.err)
						return view.err(res.err);
					view.success(res);
				});
			});
		},
		load_options: function()
		{
			$http.get('/api/article?options=true').then((res)=>
			{
				res = res.data;
				view.options = res;
			});
		},
		err: function(mes)
		{
			view.error = mes;
			console.log("API ERROR: "+mes);
		},
		success: function(res)
		{
			$timeout(function()
			{
				$scope.article = res;
				alert(JSON.stringify(res));
				editor.quill.setText(res.content);
			},1);
		},
	}

	api.view =  view;

	$scope.article = article;
	$scope.api = api;
	$scope.editor = editor;



});