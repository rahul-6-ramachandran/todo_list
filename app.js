const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express()


const workItems = []

app.use(bodyParser.urlencoded({extended:true}))


app.set('view engine','ejs')
app.use(express.static('public'))

mongoose.Promise = global.Promise
mongoose.connect('mongodb://0.0.0.0:27017/todolistdb',{
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.once('open', () => console.log('db connected'));

const itemSchema = mongoose.Schema({
    name : String
})

const Activity = mongoose.model("Activity",itemSchema)

const Activity1 = new Activity({
    name:"Breakfast"
})
const Activity2 = new Activity({
    name:"Coding"
})

const Activity3 = new Activity({
    name:"Football"
})

const dataActivites = [Activity1,Activity2,Activity3]


const listSchema = {
    name : String,
    item : [itemSchema]
}

const list = mongoose.model('List',listSchema)


app.get('/',function(req,res){
    Activity.find({}).then(function (foundItems) {
        
        if(foundItems.length === 0){
            Activity.insertMany(dataActivites).then(function () {
                console.log("Successfully saved defult items to DB");
              }).catch(function (err) {
                console.log(err);
              });
              res.redirect('/')
        }else{
            res.render('list',{
                listTitle : "Today",
                newListItems : foundItems
            })
        }
        
       
      }).catch(function (err) {
        console.log(err);
      });
})

app.get('/:category',function(req,res){
    
    var category = _.capitalize(req.params.category) 
    list.findOne({name:category}).then(function(foundList){
        if(foundList){
            res.render('list',{
                listTitle : foundList.name,
                newListItems : foundList.item
            })
        }else{
            const List = new list({
                name : category,
                items : dataActivites
            })
            List.save()
            res.redirect('/'+ category)
        }
    })
   
})

app.post('/',function(req,res){

    const activity = req.body.newList
    const listName = req.body.list
    
   
    const newActivity = new Activity({
        name : activity
    })

    if (listName === "Today"){
        newActivity.save()
        res.redirect('/')   
    }else{
        list.findOne({name:listName}).then(function(foundList){
            // console.log(foundList)
            foundList.item.push(newActivity)
            foundList.save()
            res.redirect('/' + listName) 
        })
    }
    
    
})

// For Work activites


app.post('/work',(req,res)=>{
    var item = req.body.newList
    workItems.push(item)
    res.redirect('/work')
})

app.post('/delete',(req,res)=>{
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName

    if(listName === "Today"){

        Activity.findByIdAndRemove(checkedItemId).then(function(err){
            if(err){
                console.log(err)
            }else{
                console.log("Deleted Successfully")
            }
            res.redirect('/')
          
        })

    }else{

        list.findOneAndUpdate({name:listName},{$pull: {item : {_id: checkedItemId}} }).then(function(foundItems){
            res.redirect('/' + listName)
        })
    }
    
})




app.listen('3000',function(){
    console.log('successfully Connected to the Server')
})