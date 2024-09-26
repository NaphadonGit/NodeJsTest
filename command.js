const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Member } = require('./models/member'); // assuming models are in a separate file

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Create a new member*
app.post('/members', async (req, res) => {
  const { title, name, lastName, age } = req.body;
  await Member.create({ title, name, lastName, age });
  res.redirect('/members');
});

// Update member data
app.put('/members/:id', async (req, res) => {
  const { id } = req.params;
  const { title, name, lastName, age } = req.body;
  await Member.update({ title, name, lastName, age }, { where: { id } });
  res.redirect(`/members/${id}`);
});

// Search for members
app.get('/members/search', async (req, res) => {
  const { name, lastName, ageMin, ageMax } = req.query;
  const members = await Member.findAll({
    where: {
      name: { [Op.like]: `%${name}%` },
      lastName: { [Op.like]: `%${lastName}%` },
      age: { [Op.between]: [ageMin, ageMax] }
    }
  });
  res.render('members', { members });
});

// List all members
app.get('/members', async (req, res) => {
  const members = await Member.findAll();
  res.render('members', { members });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
