app.service('codeService', function(session,$http,$timeout) 
{
	class Editor
	{
		constructor($scope,id = "text-editor")
		{
			this.$scope = $scope;
			this.id = id;
			this.active = false;
			this.content = "";
			this.codemirror  = null;
		}

		init( _id = "text-editor")
		{
			this.id = _id;
			let textarea = document.getElementById(this.id);
			let editor_ = this;
			this.codemirror =CodeMirror.fromTextArea(textarea, {
			    lineNumbers: true,
			    keyMap: "sublime",
			    theme: "monokai",
			    mode: "python",
			    autoRefresh: true
			  });
			this.codemirror.on('change', editor =>
			{
				$timeout(()=>
				{
					editor_.$scope.editor.content = editor_.codemirror.getValue();
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
			this.active = !this.active
			if(this.active) this.focus();
		}

		focus()
		{
			$timeout(function()
			{
				this.codemirror.focus()
			},1);
		}
	}

	this.create = function($scope,div_id)
	{
		return new Editor($scope,div_id);
	}
});


