let knex = require('../database/connection');
const UserModel = require('./UserModel')

//Gerando Token
class Passwordtoken {

    async created(email){
        var user = await UserModel.findByEmail(email);
        if(user != undefined){
            try{
                var token = Date.now();
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token // UUID
                }).table("passwordtoken");

                return {status: true,token: token}
            }catch(err){
                console.log(err);
                return {status: false, err: err}
            }
        }else{
            return {status: false, err: "O e-mail passado não existe no banco de dados!"}
        }
    }

//Validando Token
    async validate(token){

        try{

            let result = await knex.select().where({token: token}).table("passwordtoken");

            if(result.length > 0){

                let tk = result[0];

                if(tk.used){

                    return {status: false};

                }else{

                    return {status:true, token: tk};

                }
            }else{

                return {status: false};

            }
        }catch(err){
            console.log(err);
            return {status: false};
        }
       
    }
    
    async setUsed(token){
        await knex.update({used: 1}).where({token: token}).table("passwordtoken");
    }

}

module.exports = new Passwordtoken;