const fs = require("fs");
const control = require('./controllers/auth.controller');
const chalk = require('chalk')
const EventEmitter = require('events');
// TODO
class EventEmitterHandler {
    constructor() {
        this.emitter = new EventEmitter();
    }
    onCreation(){
        this.emitter.on("token_creation", async(arg)=>{
            console.log(chalk.red.inverse("creation start"));
            let dataRes = await control.signin(arg);
            console.log(chalk.red.inverse("creation end"));
            console.log(dataRes);
        });
    }
    emitCreation(data){
        this.emitter.emit("token_creation",{data:data});
    }
    onRefresh(){
        this.emitter.on("token_refresh", async (arg)=>{
            console.log(chalk.blue.inverse("refreshing start"));
            const refreshed = await control.refreshToken(arg);
            console.log(chalk.blue.inverse("refreshing end"));
            console.log("The refreshed token : "+refreshed);
        })
    }
    emitRefresh(data){
        this.emitter.emit("token_refresh", {data:data})
    }
}

module.exports = EventEmitterHandler;
