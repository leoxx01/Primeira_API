let express = require("express")
let router = express.Router()
let fs = require("fs")

let acc = "accounts.json"

router.post('/',(req,res)=>{
    let account = req.body //Pegando tudo que vem no body no caso dois parametros name e balance
    fs.readFile(acc,"utf-8",(err,data) =>{//Lendo o arquivo accounts.json e pegando seu conteudo com o data
        try{
            if(err) throw err //o throw manda para o catch outra forma de fazer um try catch
            let datajson = JSON.parse(data) //converto o data para json
            const {name,balance} = account
            account = {id:datajson.nextid,name,balance} //Setando o id e pegando o name e balance e setando em um objeto

            datajson.accounts.push(account)//Colocando esse objeto dentro do array accounts que esta presente no arquivo accounts.json

            datajson.nextid++ //Aumentando o ID

            fs.writeFile(acc, JSON.stringify(datajson),(err)=>{ //Reescrevendo o arquivo accounts.json com o novo valor no array
                if(!err){//Se n tiver erro eu retorno 200
                    res.status(201).send("Conta criada")
                }else{
                    res.status(400).send("Erro na escrita")  
                }
            })
                
        }catch(err){
                res.status(400).send("Erro no parseamento"+err)
            }
    })
})

router.get("/",(req,res)=>{
    try{fs.readFile(acc,"utf8",(err,data)=>{
        if(!err){
            let datajson = JSON.parse(data)//Atribuindo ao datajson para n modificar o data
            delete datajson.nextid //Removendo o next id de aparecer na tela
            res.status(200).send(datajson)
        }else{
            res.status(400).send({error: err.message})
        }
    })
    }catch(err){
        res.status(400).send({error: err.message})
    }
})

router.get("/:id",(req,res)=>{
    try{let accountFilter = null;
        fs.readFile(acc,"utf8",(err,data)=>{
            if(!err){
                let datajson = JSON.parse(data)     
                accountFilter = datajson.accounts.filter((account)=>{
                   return account.id === parseInt(req.params.id)
                })
                if(accountFilter !== []){
                    res.status(200).send(accountFilter)
                }else{
                    res.end()
                }
                
            }else{
                res.status(400).send({error: err.message})
            }
        })
    }catch(err){
        res.status(400).send({error: err.message})
    }
    
})

router.delete("/:id",(req,res)=>{
    let accountDelete = null;
    fs.readFile(acc,"utf8",(err,data)=>{
        if(!err){
            let datajson = JSON.parse(data)     
            accountDelete = datajson.accounts.filter(account=> account.id !== parseInt(req.params.id))//filtrando o vetor accounts
            //Porque reatribuir ao data accounts pois se não reatribuir ele perde a estrutura padrão
            datajson.accounts = accountDelete //Reatribuindo o valor ao campo accounts
            fs.writeFile(acc,JSON.stringify(datajson),err => { //rescrevendo o arquivo json
                if(err){
                    res.status(400).send({error: err.message})
                }else{
                    res.end()
                }
            })
            res.status(200)
        }else{
            res.status(400).send({error: err.message})
        }
    })
})

router.put('/',(req,res)=>{
    let accountReqBody = req.body
    let accountUpdateIndex = null
    try{
        fs.readFile(acc,"utf-8",(err,data) =>{
            let datajson = JSON.parse(data)
            accountUpdateIndex = datajson.accounts.findIndex(account=>{
                return account.id === accountReqBody.id
            })
            const {name,balance} = accountReqBody
            datajson.accounts[accountUpdateIndex].name = name
            datajson.accounts[accountUpdateIndex].balance = balance
            fs.writeFile(acc, JSON.stringify(datajson),err=>{
                if(err){
                    res.status(400).send({error: err.message})
                }else{
                    res.status(200)
                    res.end()
                }
            })
    })
    }catch (err){
        res.status(400).send({error: err.message})
    }
})

//deposito

router.post('/deposit',(req,res)=>{
    let accountReqBodyParams = req.body
    let accountIndex = null
    try{
        fs.readFile(acc,"utf-8",(err,data) =>{
            let datajson = JSON.parse(data)
            accountIndex = datajson.accounts.findIndex(account=>{
                return account.id === accountReqBodyParams.id
            })
            const {value} = accountReqBodyParams
            datajson.accounts[accountIndex].balance += value
            fs.writeFile(acc, JSON.stringify(datajson),err=>{
                if(err){
                    res.status(400).send({error: err.message})
                }else{
                    res.status(200)
                    res.end()
                }
            })
    })
    }catch (err){
        res.status(400).send({error: err.message})
    }
})

//Saque

router.post('/saque',(req,res)=>{
    let accountReqBodyParams = req.body
    let accountIndex = null
    try{
        fs.readFile(acc,"utf-8",(err,data) =>{
            let datajson = JSON.parse(data)
            accountIndex = datajson.accounts.findIndex(account=>{
                return account.id === accountReqBodyParams.id
            })
            const {value} = accountReqBodyParams
            let saldo  = datajson.accounts[accountIndex].balance - value
            if(saldo < 0 || value <= 0){
                res.send(`Você não tem saldo o suficiente, seu saldo atual é ${datajson.accounts[accountIndex].balance}`)
            }else{
                datajson.accounts[accountIndex].balance -= value
                res.end()
            }
            fs.writeFile(acc, JSON.stringify(datajson),err=>{
                if(err){
                    res.status(400).send({error: err.message})
                }else{
                    //Poderia retornar o objeto da pessoa no res para ele ver 
                    res.status(200)
                }
            })
            
            
    })
    }catch (err){
        res.status(400).send({error: err.message})
    }
})

//saldo

router.get('/saldo/:id',(req,res)=>{
    let param = req.params.id
    let checkSaldo = null
    try{
        fs.readFile(acc,"utf8",(err,data)=>{
            if(err) throw err
            let datajson = JSON.parse(data)
            checkSaldo = datajson.accounts.find(account=>{
                return account.id === parseInt(param)
            })
            res.send(`O saldo da conte é ${checkSaldo.balance}`)
        })
    }catch(err){

    }
})

//Só por diverção fazer tranferencia de dinheiro para outra conta que exista

module.exports = router //exportando o router