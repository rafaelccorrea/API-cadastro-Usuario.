const knex = require('../database/connection');
let bcrypt = require('bcrypt');
let Passwordtoken = ('./passwordtk');

//Service
class User{

    //Pesquisando todos os usuarios
    async findAll(){
       try{
          let result = await knex.select("id", "name", "email", "role",).table("users");
          return result;
       }catch(err){
            console.log("Error: " + err);
            return [];
       }
    };

    //Pesquisando todos os usuarios pelo ID
    async findById(id){
        try{    
            let result = await knex.select("id", "name", "email", "role",).table("users").where({id: id});

            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }
        }catch(err){
            console.log("Error: " + err)
            return undefined;
        }
    }

    
    ////Pesquisando todos os usuarios pelo Email
    async findByEmail(email){
        try{    
            let result = await knex.select("id", "name", "email", "role",).table("users").where({email: email});

            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }
        }catch(err){
            console.log("Error: " + err)
            return undefined;
        }
    }


    //Criar Usuario
    async new(email, password, name){
      
        try{

            let hash = await bcrypt.hash(password, 10);
            await knex.insert({email, password: hash, name, role: 0}).table("users");

        }catch(err){
            console.log("Error: " + err);
        } 
    }
    
    //Analisar existencia de emails repetidos
    async findEmail(email){
        try{

          let result = await knex.select("*").from("users").where({email: email});
            
          if(result.length > 0){
                return true;
            }else{
                return false;
            }
        }catch(err){
            console.log("Error: " + err)
            return false;
        }
        
     }

     //Edição de usuario.
     async update(id, name, email,  role){
            let user = await this.findById(id);
            if(user != undefined){

                let edit = {};

                if(email != undefined){
                    if(email != user.email){
                      let result = await this.findEmail(email);
                        if(result == false){
                            edit.email = email;
                        }else{
                            return {status: false, err: "O email já existe!"}
                        }
                    }
                }

                if(name != undefined){
                    edit.name = name;
                }

                if(role != undefined){
                    edit.role = role;
                }

                try{
                    await knex.update(edit).where({id: id}).table("users");
                    return {status: true}
                }catch(err){
                    return {status: false, err: err}
                }
                
            }else{
                return {status: false, err: "O usuario não existe!"}
            }
            
         
     }

     //Deletando Usuario
     async delete(id){
        let user = await this.findById(id);
        if(user != undefined){
            try{
                await knex.delete().where({id: id}).table("users");
                return {status: true};
            }catch(err){
                return {status: false, err: "O usuário Não existe!"}
            }
        }else{
            return {status: false, err: "O usuário Não existe!"}
        }
     }

     //Gerar Nova Senha
     async changePassword(password, id, token){
        let hash = await bcrypt.hash(password, 10);
        await knex.update({password: hash}).where({id:id}).table("users");
       //Setar token como usado
        await Passwordtoken(token)
     }

}

module.exports = new User;