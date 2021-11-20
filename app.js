const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");

const app = express();


app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});


// create a schema 
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

//create a model

const Article = mongoose.model("Article", articleSchema);



// lets make the api REST by defining all the routes as PUT, PATCH, GET, DELETE, POST 

//config the GET route to fetch all the articles

// app.get("/articles", function(req, res){
//     Article.find({}, function(err, foundArticles){
//         if(!err){
//             res.send(foundArticles);
//         } else {
//             res.send(err);
//         }
//     });
// });

//config the POST req... create a new article and add it to the collection in database
// without creating a form to submit a new article
// we will est our POST functionality of the api by using postman
// in restfull convention tell that post req hould go to the collection of resources rather than a specific article

// app.post("/articles", function(req, res){
    
//     const newArticle = new Article ({
//         title: req.body.title,
//         content: req.body.content
//     });
//     newArticle.save(function(err){
//         if(err){
//             res.send(err)
//         } else {
//             res.send("Successfully added a new article");
//         }
//     });
// });

// config the DELETE req to the api url 
// to del all the articles

// app.delete("/articles", function(req, res){
    // Article.deleteMany({condition}, function(err){});
    // but to delete everything just leave condition 

//     Article.deleteMany(function(err){
//         if(!err){
//             console.log("Successfully deleted all the articles!!");
//         } else {
//             console.log(err);
//         }
//     });
// });

// get a Specific article
// app.get("/articles/:articleTitle", function(req, res){
//     Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
//         if(foundArticle){
//             res.send(foundArticle);
//         } else {
//             res.send("Opps!! no matching article was found");
//         }
//     });
// });

// PUT req to update a specific article
// app.put("/articles/:articleTitle", function(req, res){
    
    // Article.update(
        //condition
        // {title: req.params.articleTitle},
        //update
//         {title: req.body.title, content: req.body.content},
//         {overwrite: true},
//         function(err){
//             if(!err){
//                 res.send("Updated the article sucessfully!!!");
//             } else {
//                 res.send(err);
//             }
//         }
//         )
// });


// but the default mongoose behaviour is that when client give complete details it will overwrite the document
// but if user don't give any field required it will wipe off or completely overwrite the document so we will use PATCH method to address this issue


// PATCH a specific article
//that only update the field that client provided

// app.patch("/articles/:articleTitle", function(req, res){
//     Article.update(
//         {title: req.params.articleTitle},
//         {$set: req.body},
//         function(err){
//             if(!err){
//                 res.send("Successfully updated the aricle!!");
//             } else {
//                 res.send(err)
//             }
//         }
//     )
// });


// we can see above that we are using /articles or /articles:articleTitle route over nd over again when GET POST and DLETE method are trigered
// now express allows us to do the same using simplier method as (when the route location is same)
// we can chain on routes that can target on the same route 
// it will looks smth like this
// app.route("/articles").get().post().delete()


//////////////////////////////// Resquest Targeting all the Articles //////////////////////

app.route("/articles")

.get(function(req, res){
    Article.find({}, function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res){
    
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(err){
            res.send(err)
        } else {
            res.send("Successfully added a new article");
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            console.log("Successfully deleted all the articles!!");
        } else {
            console.log(err);
        }
    });
});


//////////////////////////////// Resquest Targeting a single Article //////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("Opps!! no matching article was found");
        }
    });
})

.put(function(req, res){  
    Article.update(
        //condition
        {title: req.params.articleTitle},
        //update
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Updated the article sucessfully!!!");
            } else {
                res.send(err);
            }
        }
        )
})

.patch(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated the aricle!!");
            } else {
                res.send(err)
            }
        }
    )
});


app.listen(3000, function(){
    console.log("server is running on port 3000");
});