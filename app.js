const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://0.0.0.0:27017/RestAPI").then(()=>{
    console.log("Successfully connected to database");
}).catch((e)=>{
    console.log(e);
})

const articleSchema= new mongoose.Schema({
    Title: String,
    Body: String
});

const Article=mongoose.model("Article",articleSchema);

app.route("/articles")
    .get((req,res)=>{
        Article.find().then((found)=>{
            res.send(found);
        }).catch((e)=>{
            res.send(e);
        })
    })  
    .post((req,res)=>{
        const article= new Article({
            Title: req.body.Title,
            Body: req.body.Body
        });
        article.save().then(()=>{
            res.send("Successfully added the article");
        }).catch((e)=>{
            res.send(e);
        })
    })
    .delete((req,res)=>{
        Article.deleteMany().then(()=>{
            res.send("Successfully deleted all articles");
        }).catch((e)=>{
            res.send(e);
        })
    });

app.route("/articles/:articleTitle")
    .get((req,res)=>{
        Article.findOne({Title: req.params.articleTitle}).then((found)=>{
            res.send(found);
        }).catch((e)=>{
            res.send(e);
        })
    })  
    .put((req,res)=>{
        Article.updateOne(
            {Title: req.params.articleTitle},
            {$set: {Title: req.body.Title, Body: req.body.Body}},
            {overwrite: true}).then(()=>{
                res.send("Successfully updated the corressponding article")
            }).catch((e)=>{
                res.send(e);
            })
    })
    .patch((req,res)=>{
        Article.updateOne(
            {Title: req.params.articleTitle},
            {$set: req.body}).then(()=>{
                res.send("Successfully updated the corressponding article")
            }).catch((e)=>{
                res.send(e);
            })
    })
    .delete((req,res)=>{
        Article.deleteOne({Title: req.params.articleTitle}).then(()=>{
            res.send("Successfully deleted the corressponding article");
        }).catch((e)=>{
            res.send(e);
        })
    });



app.listen(3000,()=>{
    console.log("Server has started");
})