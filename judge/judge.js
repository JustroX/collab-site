const request = require('request');

var languages = [
	{"id":1,"name":"Bash (4.4)"},
	{"id":2,"name":"Bash (4.0)"},
	{"id":3,"name":"Basic (fbc 1.05.0)"},
	{"id":4,"name":"C (gcc 7.2.0)"},
	{"id":5,"name":"C (gcc 6.4.0)"},
	{"id":6,"name":"C (gcc 6.3.0)"},
	{"id":7,"name":"C (gcc 5.4.0)"},
	{"id":8,"name":"C (gcc 4.9.4)"},
	{"id":9,"name":"C (gcc 4.8.5)"},
	{"id":10,"name":"C++ (g++ 7.2.0)"},
	{"id":11,"name":"C++ (g++ 6.4.0)"},
	{"id":12,"name":"C++ (g++ 6.3.0)"},
	{"id":13,"name":"C++ (g++ 5.4.0)"},
	{"id":14,"name":"C++ (g++ 4.9.4)"},
	{"id":15,"name":"C++ (g++ 4.8.5)"},
	{"id":16,"name":"C# (mono 5.4.0.167)"},
	{"id":17,"name":"C# (mono 5.2.0.224)"},
	{"id":18,"name":"Clojure (1.8.0)"},
	{"id":19,"name":"Crystal (0.23.1)"},
	{"id":20,"name":"Elixir (1.5.1)"},
	{"id":21,"name":"Erlang (OTP 20.0)"},
	{"id":22,"name":"Go (1.9)"},
	{"id":23,"name":"Haskell (ghc 8.2.1)"},
	{"id":24,"name":"Haskell (ghc 8.0.2)"},
	{"id":25,"name":"Insect (5.0.0)"},
	{"id":26,"name":"Java (OpenJDK 9 with Eclipse OpenJ9)"},
	{"id":27,"name":"Java (OpenJDK 8)"},
	{"id":28,"name":"Java (OpenJDK 7)"},
	{"id":29,"name":"JavaScript (nodejs 8.5.0)"},
	{"id":30,"name":"JavaScript (nodejs 7.10.1)"},
	{"id":31,"name":"OCaml (4.05.0)"},
	{"id":32,"name":"Octave (4.2.0)"},
	{"id":33,"name":"Pascal (fpc 3.0.0)"},
	{"id":34,"name":"Python (3.6.0)"},
	{"id":35,"name":"Python (3.5.3)"},
	{"id":36,"name":"Python (2.7.9)"},
	{"id":37,"name":"Python (2.6.9)"},
	{"id":38,"name":"Ruby (2.4.0)"},
	{"id":39,"name":"Ruby (2.3.3)"},
	{"id":40,"name":"Ruby (2.2.6)"},
	{"id":41,"name":"Ruby (2.1.9)"},
	{"id":42,"name":"Rust (1.20.0)"},
	{"id":43,"name":"Text (plain text)"}];

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

/*
	input
	{
		content: '',
		language: '',
		output
	}
	output
	{
		source_code: '',
		language_id: '',
		stdin: '',
		expected_output: ''
	}


	returns 
	verdict
*/

function post_to_judge(body,cb)
{
	request.post({
	    headers: {'content-type': 'application/json'},
	    url: 'https://api.judge0.com/submissions/?base64_encoded=true&wait=true',
	    form: body
	}, function(error, response, body){
	  	cb(error,response,body);
	});
}

module.exports.judge = function(res,data,cb)
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
		post_to_judge(body,function(err,res,body_output)
		{
			if(err) return res.send({ code: 500, err: "Database Error."});
			body_output = JSON.parse(body_output);
			body_output._id = data._ids[i];
			body_output.points = data.scores[i];
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