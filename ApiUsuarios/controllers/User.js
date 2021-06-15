let Users = require('../models/UserModel')

class User{

    //Criação de novo Usuario validando email.
    async create(req,res){

       let {email, name, password} = req.body;

        if( email == undefined){
            res.status(400);
            res.json({err: "O e-mail é inválido!"})
            return;
        }

        //Validação de email, caso exista cadastrado.
        let emailExists = await Users.findEmail(email)

        if(emailExists){
            res.status(406);
            res.json({ err: "Email já esta cadastrado!"})
            return;
        }

        await Users.new(email,password,name);
        res.status(200);
        res.send("Usuario Criado!")
            
    }

}

module.exports = new User();