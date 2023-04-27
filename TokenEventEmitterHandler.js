const control = require('./controllers/auth.controller');
const chalk = require('chalk')
const EventEmitter = require('events');
class TokenEventEmitterHandler {
    constructor() {
        this.emitter = new EventEmitter();
    }
    onCreation(){
        this.emitter.on("token_creation", async(args)=>{
            console.log(chalk.red.inverse("creation start"));
            await control.signin(args.req,args.res);
            console.log(chalk.red.inverse("creation end"));
        });
    }
    emitCreation(req, res){
        this.emitter.emit("token_creation",{req:req, res:res});
    }
    onRefresh(){
        this.emitter.on("token_refresh", async (arg)=>{
            console.log(chalk.blue.inverse("refreshing start"));
            const refreshed = await control.refreshToken(arg.req, arg.res);
            console.log(chalk.blue.inverse("refreshing end"));
            console.log("The refreshed token : "+refreshed);
        })
    }
    emitRefresh(req, res){
        this.emitter.emit("token_refresh", {req:req, res:res})
    }
}