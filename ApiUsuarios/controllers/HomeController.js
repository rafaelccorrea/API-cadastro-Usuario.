class HomeController{

    async index(req, res){
        res.send("API CADASTRO DE USUARIOS");
    }

}

module.exports = new HomeController();