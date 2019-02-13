var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }));
//twilio stuff
const accountSid = 'x';
const authToken = 'x';
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;


app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, './public/dist')))


app.get("/test", function(request, response){
  let d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();

  

  response.send("<h1>Sending Message....</h1><a href = '/'>back</a>")
})

app.get("/", (request, response)=>{
  response.send("<h1>hello!</h1>")
})

app.post("/sms", (request,response)=>{
  let city = request.body.FromCity
  

  twiml.message("your phone number is from: "+ city)

  response.writeHead(200, { 'Content-Type': 'text/xml' });
  response.end(twiml.toString());
})
var todo_list = [];
app.post("/todo", (request,response)=>{
  let body_words = request.body.Body.split(" ")
  
  let action = body_words[0]
  action = action.toLowerCase()

  let twiml = new MessagingResponse()

  if (action === "add") {

    body_words.shift()
    todo_list.push(body_words.join(" "))
    
    twiml.message("added.")
      
    response.writeHead(200, { 'Content-Type': 'text/xml' });
    response.end(twiml.toString());
  }else if(action === "list"){
    if(todo_list.length < 1){
      twiml.message("list is empty!")
      response.writeHead(200, { 'Content-Type': 'text/xml' });
      response.end(twiml.toString());
    }else{
      let message_list = []
      todo_list.forEach((value, index)=>{
        message_list.push((index+1).toString())
        message_list.push(". ")
        message_list.push(value)
        message_list.push("\n")
      })

      twiml.message(message_list.join("")) 
      response.writeHead(200, { 'Content-Type': 'text/xml' });
      response.end(twiml.toString());
    }
    
  }
  else if(action === "remove"){
    let item_num = body_words[1]

    if(typeof parseInt(body_words) != 'number'){
      twiml.message("error.")
      response.writeHead(200, { 'Content-Type': 'text/xml' });
      response.end(twiml.toString());
    }else{
      twiml.message("removed: "+todo_list.splice(parseInt(item_num))[0])
      response.writeHead(200, { 'Content-Type': 'text/xml' });
      response.end(twiml.toString());
    }
    
  }

  else{
    twiml.message("valid actions are: \n \n add [item] \n \n list (shows all items in list) \n \n remove [number] (removes the given item number)")
    response.writeHead(200, { 'Content-Type': 'text/xml' });
    response.end(twiml.toString());
  }
  
      

      // 
      // 
      
  

})

app.listen(8000, ()=>{
  console.log('listening on port 8000')
})