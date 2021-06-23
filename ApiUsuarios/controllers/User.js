let Users = require('../models/UserModel')
const Passwordtk = require('../models/passwordtk');


class User{

    //Retornando Usuario pelo Id
    async id(req, res){
        let id = req.params.id
        let user = await Users.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200);
            res.json(user);
        }
    }

    //Retornando Todos os Usuarios
    async index(req, res){
        let usuarios = await Users.findAll();
        res.json(usuarios);
    }

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


    //Edição de usuario.
    async edit (req, res){
        let {id, name, email, role} = req.body;
        let result = await Users.update(id,name,email,role);

        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo Ok")
            }else{
                res.status(406);
                res.send(result.err);
            }
        }else{
            res.status( 406 );
            res.send("Ocorreu um erro no servidor!")
        }
    }

    //Deletando Usuario
    async remove(req, res){
        let id = req.params.id

        let result = await Users.delete(id);

        if(result.status){
            res.status(200);
            res.send("Tudo Ok!");
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    //Recuperar Senha
    async recoverPassword(req,res){

    let email = req.body.email;
    let result = await Passwordtk.created(email);

    if(result.status){
        res.send(" " + result.token)
        res.status(200);
    }else{
        res.status(406);
        res.send(result.err);
    }

    }

    //Alteração de senha
    async changePassword(req, res) {
        let token = req.body.token;
        let password = req.body.password;

        let isTokenValid =  await Passwordtk.validate(token);

        if(isTokenValid.status){   

           await Users.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
           res.status(200);
           res.send("Senha alterada!")

        }else{
            res.status(406)
            res.send("Token Inválido!")
        }
    }

}

module.exports = new User();