//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const { redirect } = require("express/lib/response");
const _ = require('lodash');

const homeStartingContent = "";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [], notes = [], questions = [];

app.get("/", function(req, res) {
  res.render("home", {home_content: homeStartingContent, posts: posts});
});

app.get("/about", function(res, res) {
  res.render("about", {about_content: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contact_content: contactContent});
});

app.get("/blogs", function(req, res) {
  res.render("blogs/blogs", {home_content: homeStartingContent, posts: posts});
});

app.get("/blogs/compose", function(req, res) {
  res.render("blogs/compose");
});

app.get("/notes", function(req, res) {
  res.render("notes");
});

app.get("/sign-in", function(req, res) {
  res.sendFile(__dirname + "/views/sign-in.html");
})

app.get("/blogs/posts/:user", function(req, res) {
  const reqestedTitle = req.params.user;
  const lowerCaseReqestedTitle = _.lowerCase(reqestedTitle); 

  posts.forEach(function(post) {
    const storedTitle = post.title; 
    const storedContent = post.content; 
    const lowerCaseStoredTitle = _.lowerCase(storedTitle);

    if(lowerCaseStoredTitle === lowerCaseReqestedTitle) {
      
      res.render("blogs/post", {title: storedTitle, content: storedContent})

    } else {
      
      res.render("blogs/post", {title: "Opps! No match found..", content: "There might be some path issus.. Please recheck the url.."})
    }
  });
});

app.get("/questions/:user", function(req, res) {
  const requestedQuestionTitle = req.params.user;
  const lowerCaseRequestedQuestionTitle = _.lowerCase(requestedQuestionTitle);
  
  questions.forEach(function(question) {
    const storedTitle = question.title; 
    const lowerCaseStoredTitle = _.lowerCase(storedTitle);

    if(lowerCaseStoredTitle === lowerCaseRequestedQuestionTitle) {
      
      res.render("openQuestion", {title: storedTitle, link: question.link, solution: question.solution, impPoints: question.impPoints})

    } else {
      
      res.render("openQuestion", {title: "Opps! No match found.."});
    }
  });
})

app.get("/saved-notes", function(req, res) {
  res.render("savedNotes", {notes: notes});
})

app.get("/questions", function(req, res) {
  res.render("question");
})

app.get("/saved-questions", function(req, res) {
  res.render("savedQuestion", {questions: questions});
})

app.post("/blogs/compose", function(req, res) {
  const newpost = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(newpost);
  res.redirect("/blogs");
});

app.post("/saved-questions", function(req, res) {
  const new_ques = {
    title: req.body.questionTitle,
    link: req.body.questionLink,
    solution: req.body.solution,
    impPoints: req.body.impPoints
  };
  questions.push(new_ques);
  res.redirect("/saved-questions");
})

app.post("/saved-notes", function(req, res) {
  const newNotes = {
    notesTitle: req.body.notesTitle,
    notesContent: req.body.notesContent
  };
  // console.log(newNotes);
  notes.push(newNotes);
  res.redirect("/saved-notes");
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
