let express = require("express")
let fs = require("fs")

let app = express()

let routes = require("./routes/accounts.js")//Importando routes

let acc = "accounts.json"

app.use(express.json())//Informando que iremos utilizar objetos json para tratar as reqs
app.use("/account", routes)


app.listen(3000,()=>{
    //Criando a estruta json para quando não tivermos a file accounts.json, para cria-lo de acordo com oque foi estipulado 
    try{
        fs.readFile(acc,"utf8",(err,data) =>{
            if(err){
                const initialJson = {
                    nextid: 1,
                    accounts:[]
                }
                fs.writeFile(acc, JSON.stringify(initialJson),(err)=>{console.log(err)})
            }
        })
        console.log("Online")
    }catch(err){
        if(err){
            res.status(400).send(err)
        }

    }
})