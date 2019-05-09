const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PersonModel = require('./model/Person');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




mongoose.connect('mongodb://localhost/Person', { useNewUrlParser: true })
    .then(() => console.log('Connected to Mongodb'))
    .catch(err => console.error('Couldnot connect to Mongodb..', err));


app.get('/', (req, res) => {
    PersonModel.find((err, response) => {
        if (err) {
            console.log(err);
        }
        res.json(response);
    });
});

app.get('/get-id/:id', (req, res) => {
    PersonModel.findById(req.params.id, (err, response) => {
        if (!err) {
            res.json(response);
        }
        console.log(err);
    });
});

app.post('/add', (req, res) => {
    const newPerson = new PersonModel({
        name: req.body.name.toString().trim(),
        organization: req.body.organization.toString().trim(),
        designation: req.body.designation.toString().trim()
    });

    newPerson.save()
        .then(person => {
            console.log(person);
            res.json(person)
        })
        .catch(err => {
            res.json(err)
        })
});



app.post('/update/:id', (req, res) => {
    PersonModel.findById(req.params.id, (err, response) => {
        if (err) {
            response.status(400).json({ error: "Id is not found" });
        } else {
            response.name = req.body.name,
                response.organization = req.body.organization,
                response.designation = req.body.designation

            response.save()
                .then(person => {
                    res.status(200).json(person);
                })
                .catch(err => {
                    res.status(400).json({ error: "not updated" })
                })
        }
    });
});



app.delete('/delete/:id', (req, res) => {
    PersonModel.findByIdAndDelete({ _id: req.params.id }, (error, response) => {
        if (error) {
            res.status(400).json("delete failed!");
        }
        res.status(200).json(response);
    });
});

app.post('/search/:name', async (req, res) => {
    console.log(req.params.name);
    let result = await PersonModel.findOne({name: req.params.name.toString().trim()});
    console.log(result);
    if (result) {
        console.log(`Response: ${result}`);
        res.json(result);
    }
    else {
        console.log("This Person is not found");
        res.send("not found");
    }
});



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on ${port}`));
