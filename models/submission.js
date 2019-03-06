var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var Judge = require('../judge/judge.js');


module.exports = 
{
	schema:
	{
		content : String,
	    challenge: { type: Schema.Types.ObjectId, ref: "Challenge"},
	    date: Date,
	    language: String,
	    author : { type: Schema.Types.ObjectId, ref: "User"},
	    verdict: { testcases: [ Object ]  }
	},
  	required:
  	{

  	},
	config:
	{
		toObject : { virtuals: true },
		toJSON : { virtuals: true },
	},
	virtual:
	{

	},
	populate:
	{
		author: "name fullname username",
	},
	permissions:
	{
		_id: 1,
		content : 3,
	    challenge: 3,
	    date: 1,
	    language: 3,
	    author : 1,
	    verdict: 1
	},
	methods:
	{
		get_verdict : function(res,challenge_id,cb)
		{
			var Challenge = require('./model_divider.js').model("Challenge");
			let _sub = this;
		
			Challenge.findById(challenge_id,function(err,challenge)
			{
				if(err) return res.send({ code: 500, err: "Database Error"});

				if(challenge.output_type==0)
				{
					let data = 
					{
						content: _sub.content,
						language: _sub.language,
						inputs: [],
						outputs: [],
						_ids: [],
						scores: [],
					};

					for(let i in challenge.testcases)
					{
						if( isNaN(+i) )
							continue;
						data.inputs.push(Buffer.from(challenge.testcases[i].input).toString('base64') );
						data.outputs.push(Buffer.from(challenge.testcases[i].output).toString('base64') );
						data._ids.push(challenge.testcases[i]._id);
						data.scores.push(challenge.testcases[i].points);
					}
					Judge.judge(res,data,function(result)
					{
						_sub.verdict.testcases = result;
						cb();
					});
				}
				else
				{
					//depends on the kind
					let verdict;
					//integer
					if( challenge.settings.data_type == "integer" )
						verdict = ( parseInt(_sub.content) == parseInt(challenge.answer) );
					else
					if( challenge.settings.data_type == "string" )
						verdict = ( _sub.content == challenge.answer );
					else
						verdict = ( Math.abs( parseFloat(_sub.content) - parseFloat(challenge.answer) ) <= challenge.settings.precision );
					
					//string
					_sub.verdict.status = verdict;
					cb();
				}
			});

		}
	},
	endpoints:
	{

	},
	default:
	{
		permission: 15,
	}
}