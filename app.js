const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
require('dotenv').config();
const initDatabase = require('./config/database');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended:true }));
initDatabase();

app.use(methodOverride('_method'));
app.use(expressSanitizer());

let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});
let Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//   title: 'Test Blog',
//   image: 'https://images.unsplash.com/photo-1496517343266-e95a6e214de7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1100&q=60',
//   body: 'Lorem ipsum dolor'
// }, function(err, res) {
//   if(err) {
//     console.log('Error occured while creating a blog');
//     console.log(err);
//   } else {
//     console.log('Successfully created a blog.')
//   }
// });

app.get('/blogs', function(req, res) {
  Blog.find({}, function(err, blogs) {
    if(err) {
      console.log('Cannot find: '+ err);
    } else { 
      res.render('index', {
        blogs: blogs
      });  
    }
  })
});

app.get('/blogs/new', function(req, res){
  res.render('new');
});

app.post('/blogs', function(req, res) {
  let title =  req.body.title;
  let image = req.body.image;
  let body = req.body.body;
  let newBlog = { title:title, image:image, body: body}
  Blog.create(newBlog, function(err, result) {
    if(err) {
      console.log('Cannot save the new blog' + err);
    } else {
      console.log('Blog posted successfully');
    }
  });
  res.redirect('/blogs');
});

app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, blogMore ) {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.render('show', {
        blogMore: blogMore
      })
    }
  })
});



app.get('/blogs/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', {
        blog: foundBlog
      });
    }
  });
});

//update route

app.put('/blogs/:id', function(req,res) {
  Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err, updatedBlog) {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/'+ req.params.id);
    }
  })
})

app.delete('/blogs/:id', function(req, res) {
  Blog.findByIdAndRemove(req,params.id, function(err) {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  })
})

app.get('/', function(req, res) {
  res.redirect('/blogs');
})

app.listen('3020', function(err, res) {
  if(err) {
    console.log('Cannot connect to server.');
  } else {
    console.log('Server connected on port 3020');
  }
});