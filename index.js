const express = require('express');
const app = express ();
const Joi = require('joi');
//Without using express,json we will not be able to send json bodies to and from the server, this is necessary because
app.use(express.json());


const points = [
	{ id : 1 , points :'PointOne'},
	{ id : 2 , points :'PointTwo'},
	{ id :3, points :'PointThree'},
	{ id : 4 , points :'PointFour'}
];

// THe GET MEthods we have created all get or show the data from the server technically
app.get('/', (req, res) =>
{
	res.send('Hello World Big place small place'); 
});

app.get('/points', (req, res) =>{
	res.send(points);
});

app.get('/points/:id', (req, res) =>{
	let point = points.find(p => p.id === parseFloat(req.params.id));
	if(!point) res.status(404).send('No course id of the point was provided');
	res.send(point);
});


//THe Post Method we have creates will handle posting or sending the methods to the server and we can later get them as we like.
app.post('/points',(req, res) => {
	//THis is how you implement a schema using joi

	const schema = {
		points: Joi.string().min(3).required()
	}

	const result = Joi.validate(req.body,schema);
	if(result.error) {
		res.status(404).send(result.error.details[0].message);
		return;
	}

	const point = {
		id : points.length + 1,
		points : req.body.points
	};
	points.push(point);
	res.send(point);
});


app.put('/points/:id', (req, res) => {
	const point = points.find(p => p.id === parseInt(req.params.id));
	if(!point) res.status(404).send('This point does not exist');

	const requestPoint = validatePoints(req.body);
	//to show if the body or point name that we send was valid or not
	if(requestPoint.error){
		res.send(requestPoint.error.details[0].message);
	}

	point.points = req.body.points;
	res.send(points)
});

app.delete('/points/:id', (req, res) => {
	const point = points.find(c => c.id === parseInt(req.params.id));
	if (!point) return res.status(404).send('The point with the given ID was not found.');
  
	const index = points.indexOf(point);
	points.splice(index, 1);
	point.points = req.body.points;
	res.send(points);
  });


function validatePoints(point){
	const schema = Joi.object({
		points : Joi.string().min(3).required()
	});
	return schema.validate(point);
	// return result;
}


const port = process. env. PORT ||3000;
app.listen(port,() => console.log(`Listening on ports ${port}...`));


