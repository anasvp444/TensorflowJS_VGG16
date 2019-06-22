let express = require("express");
let app = express();


app.use((req,res,next)=>{
    console.log(`${new Date()} - ${req.method} request for ${req.url}`);
    next();
});

app.use(express.static("../static"));

app.listen(81,()=>{
    console.log("server running at 81")
})