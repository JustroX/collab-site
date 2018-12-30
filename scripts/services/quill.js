app.service('editorService', function(session,$http,$timeout) 
{
	class Editor
	{
		constructor($scope,id = "text-editor")
		{
			this.$scope = $scope;
			this.id = id;
			this.active = false;
			this.content = "";
			this.quill  = null;
		}

		init( _id = "text-editor")
		{
			this.id = _id;
			let toolbarOptions = [
			  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			  ['bold', 'italic', 'underline', 'link'],
			  ['blockquote', 'code-block'],
			  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
			  ['clean']
			];
			this.quill = new Quill('#'+this.id, {
				 modules: {
				    syntax: true,
				    toolbar: toolbarOptions
				  },
				theme: 'snow',
			});
			this.quill.on('text-change',()=>
			{
				let editor_ = this;
				$timeout(()=>
				{
					this.$scope.editor.content = editor_.quill.root.innerHTML;
					editor_.textchange();
				},1);
			});
		}

		textchange()
		{
			;
		}

		toggle()
		{
			if(this.$scope.parent_editor && this.$scope.parent_editor.ontoggleBreak)
				return this.$scope.parent_editor.ontoggleBreak(this.$scope.editor)
			
			this.active = !this.active
			if(this.active) this.focus();

			if(this.$scope.parent_editor && this.$scope.parent_editor.ontoggle)
				this.$scope.parent_editor.ontoggle(this.active);
		}

		focus()
		{
			let editor_ = this;
			$timeout(function()
			{
				editor_.quill.blur();
				editor_.quill.focus();
			},1);
		}

	}

	this.toHTML= function(inputDelta)
	{
		let tempQuill=new Quill(document.createElement("div"));
	    tempQuill.setContents(inputDelta);
	    return tempQuill.root.innerHTML;
	}

	this.create = function($scope,div_id)
	{
		return new Editor($scope,div_id);
	}
});


