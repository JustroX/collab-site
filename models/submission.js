var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var Judge = require('../judge/judge.js');

var SubmissionSchema = mongoose.Schema({
	content : String,
   challenge: { type: Schema.Types.ObjectId, ref: "Challenge"},
   date: Date,
   language: String,
   author : { type: Schema.Types.ObjectId, ref: "User"},
   verdict: { testcases: [ Object ]  }
});

SubmissionSchema.methods.get_verdict = function(res,challenge,cb)
{
	if(challenge.output_type==0)
	{
		let data = 
		{
			content: this.content,
			language: this.language,
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
			this.verdict.testcases = results;
			cb();
		});
	}
	else
	{
		this.verdict.status = ( this.content == challenge.answer );
		cb();
	}

}
module.exports = mongoose.model('Submission', SubmissionSchema);