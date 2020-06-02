var express = require("express")
var fs = require("fs")

var app = express()

app.use(express.json())//Informando que iremos utilizar objetos json para tratar as reqs

app.post('/account',(req,res)=>{
    let account = req.body //Pegando tudo que vem no body no caso dois parametros name e balance
    fs.readFile("accounts.json","utf-8",(err,data) =>{//Lendo o arquivo accounts.json e pegando seu conteudo com o data
        if(!err){//Se ele não der algum erro 
            try{
                let datajson = JSON.parse(data) //converto o data para json

                account = {id:datajson.nextid,...account} //Setando o id e pegando o name e balance e setando em um objeto

                datajson.accounts.push(account)//Colocando esse objeto dentro do array accounts que esta presente no arquivo accounts.json

                datajson.nextid++ //Aumentando o ID

                fs.writeFile("accounts.json", JSON.stringify(datajson),(err)=>{ //Reescrevendo o arquivo accounts.json com o novo valor no array
                    if(!err){//Se n tiver erro eu retorno 200
                        res.status(200).send("Deu certo")
                    }else{
                        res.status(400).send("Erro na escrita")  
                    }
                })
                console.log(datajson)
            }catch(err){
                res.status(400).send("Erro no parseamento"+err)
            }
        }else{//se o bloco try tiver algum erro passa por aqui e printa o erro no console
            res.status(400).send("Erro na leitura"+err)
        }
    })
})

app.get("/account",(req,res)=>{
    fs.readFile("accounts.json","utf8",(err,data)=>{
        if(!err){
            let datajson = JSON.parse(data)//Atribuindo ao datajson para n modificar o data
            delete datajson.nextid //Removendo o next id
            res.status(200).send(datajson)
        }else{
            res.status(400).send({error: err.message})
        }
    })
})

app.listen(3000,()=>{
    //Criando a estruta json para quando não tivermos a file accounts.json, para cria-lo de acordo com oque foi estipulado 
    try{
        fs.readFile("accounts.json","utf8",(err,data) =>{
            if(err){
                const initialJson = {
                    nextid: 1,
                    accounts:[]
                }
                fs.writeFile("accounts.json", JSON.stringify(initialJson),(err)=>{console.log(err)})
            }
        })
        console.log("Online")
    }catch(err){
        if(err){
            res.status(400).send(err)
        }

    }
})