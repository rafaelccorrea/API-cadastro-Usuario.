const knex = require('../database/connection');
let bcrypt = require('bcrypt');

//Service
class User{

    //Criando Usuario
    async new(email, password, name){
      
        try{

            let hash = await bcrypt.hash(password, 10);
            await knex.insert({email, password: hash, name, role: 0}).table("users");

        }catch(err){
            console.log("Error: " + err);
        } 
    }
    
    //Analisando se tem emails repetidos
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

}

module.exports = new User;