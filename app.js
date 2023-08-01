const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const { log } = require('console')
const app = express()
const date = require(__dirname+'/date.js')

const activites = ["Fooding","football","Coding"]
const workItems = []

app.use(bodyParser.urlencoded({extended:true}))


app.set('view engine','ejs')
app.use(express.static('public'))

app.get('/',function(req,res){
    let day = date.getDate()
    res.render('list',{
        listTitle : day,
        newListItem : activites
    })
})
app.post('/',function(req,res){

    let activity = req.body.newList

    if(req.body.list === "Work List"){
        workItems.push(activity)
        res.redirect('/work')   
    }else{
        activites.push(activity)
        res.redirect('/')
    }

    
    
})

// For Work activites
app.get('/work',function(req,res){
    res.render('list',{
        listTitle : "Work List",
        newListItem : workItems
    })
})
app.post('/work',(req,res)=>{
    var item = req.body.newList
    workItems.push(item)
    res.redirect('/work')
})




app.listen('3000',function(){
    console.log('successfully Connected to the Server')
})