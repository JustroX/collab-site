app.service('judgeService', function($http,$timeout) 
{

	function get_language_id(l)
	{
		return {
			"python2" : 36,
			"python3" : 34,
			"cpp" : 15,
			"c" : 9,
		}[l];
	}

	function get_time_limit(l)
	{
		return {
			"python2" : 10.0,
			"python3" : 10.0,
			"cpp" : 2.0,
			"c" : 2.0,
		}[l];
	}

	function post_to_judge(body,cb)
	{
		$http.post('https://api.judge0.com/submissions/?base64_encoded=true&wait=true',body).then(cb,function(err)
			{
				console.log(err);
			});
	}

	this.judge =function(data,cb)
	{
		let body = {};
		body.source_code = data.content;
		body.language_id = get_language_id(data.language);
		body.cpu_time_limit = get_time_limit(data.language);


		let i = 0;

		let results = [];

		let iteration = function()
		{
			body.expected_output = data.outputs[i];
			body.stdin = data.inputs[i];
			post_to_judge(body,function(res)
			{
				let body_output = res.data;
				body_output._id = data._ids[i];

				if(body_output.stderr)
				body_output.stderr = atob(body_output.stderr);

				if(body_output.compile_output)
				body_output.compile_output = atob(body_output.compile_output);

				if(body_output.status.id < 6)
					body_output.stdout = atob(body_output.stdout);

				results.push(body_output);
				i +=1;
				if( i < data.outputs.length)
					iteration();
				else
					cb(results);
			});
		}
		iteration();
	}
});


