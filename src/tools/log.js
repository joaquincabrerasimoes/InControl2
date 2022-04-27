const fs = require('fs');
const path = require('path');

class Log{
    static startTime;
    static startDateTime;
    static errorCount;
    static commandCount;
    static isInit = false;

    static second = 1000;
    static minute = 1000 * 60;
    static hour = 1000 * 60 * 60;
    static day = 1000 * 60 * 60 * 24;

    static initStartTime(){
        this.isInit = true;
        const now = new Date();
        this.startTime = now.getTime();
        this.startDateTime = now;
        this.errorCount = 0;
        this.commandCount = 0;
    }
    static setStartTime(newStartTime){
        this.startTime = newStartTime;
    }
    static getStartTime(){
        return this.startTime;
    }
    static getStartDateTime(){
        return this.startDateTime;
    }
    static getStartTimeAsDate(){
        return new Date(this.startTime);
    }
    static getStartTimeString(){
        var d = new Date(this.startTime);

        var year = this.toFullLength(d.getFullYear(),4);
        var month = this.toFullLength(d.getMonth()+1,2);
        var day = this.toFullLength(d.getDate(),2);
        var hour = this.toFullLength(d.getHours(),2);
        var minute = this.toFullLength(d.getMinutes(),2);
        var second = this.toFullLength(d.getSeconds(),2);

        var toReturn = year + "-" + month + "-" + day + "-" + hour + "-" + minute + "-" + second;
        return toReturn;
    }
    static getNowString(){
        var d = new Date();

        var year = toFullLength(d.getFullYear(),4);
        var month = toFullLength(d.getMonth()+1,2);
        var day = toFullLength(d.getDate(),2);
        var hour = toFullLength(d.getHours(),2);
        var minute = toFullLength(d.getMinutes(),2);
        var second = toFullLength(d.getSeconds(),2);
        var milliseconds = toFullLength(d.getSeconds(),3);

        var toReturn = year + "." + month + "." + day + "." + hour + "." + minute + "." + second + "." + milliseconds;
        return toReturn;
    }
    static getErrorCount(){
        return this.errorCount;
    }
    static increaseErrorCount(){
        this.errorCount = this.errorCount + 1;
    }
    static getCommandCount(){
        return this.commandCount;
    }
    static increaseCommandCount(){
        this.commandCount = this.commandCount + 1;
    }
    static getTimeRunning(){
        const now = new Date();
        var currentTimeRunning = now.getTime() - this.startTime;
        return currentTimeRunning;
    }
    static toFullLength(value, fullLength){

        var toText = "" + value;
        var textLength = toText.length;
        
        if(fullLength == textLength){
            return value;
        }else{
            var fullValue = "";
            for(var i = 0 ; i < (fullLength - textLength); i++){
                fullValue = fullValue + "0";
            }
            fullValue = fullValue + toText;
            return fullValue;
        }
    
    }
    static getInitDateTime(){
        var startTime = this.getStartDateTime();
        return `${toFullLength(startTime.getDate(),2)}/${toFullLength(startTime.getMonth()+1,2)}/${toFullLength(startTime.getFullYear(),4)}-${toFullLength(startTime.getHours(),2)}:${toFullLength(startTime.getMinutes(),2)}:${toFullLength(startTime.getSeconds(),2)}`
    }
    static getRunningTime(){
        var timeRunning = this.getTimeRunning();
    
        var days = toFullLength(Math.floor(timeRunning / day),4);
        var hours = toFullLength(Math.floor((timeRunning - (days * day)) / hour),2);
        var minutes = toFullLength(Math.floor((timeRunning - (days * day) - (hours * hour)) / minute),2);
        var seconds = toFullLength(Math.floor((timeRunning - (days * day) - (hours * hour) - (minutes * minute)) / second),2);
        var milliseconds = toFullLength(timeRunning - (days * day) - (hours * hour) - (minutes * minute) - (seconds * second),3);
    
        return `${days}:${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    static log(message){
        //var timmingText="[dd/mm/yy-HH:mm:ss][000:00:00:00.000]";
    
        if(!this.isInit){
            this.initStartTime();
            this.folderCheck(`../logs`);
            this.folderCheck(`../logs/${this.getStartTimeString()}`);
        }
    
        var currentTime = new Date();
        var timeRunning = this.getTimeRunning();
    
        var days = this.toFullLength(Math.floor(timeRunning / this.day),4);
        var hours = this.toFullLength(Math.floor((timeRunning - (days * this.day)) / this.hour),2);
        var minutes = this.toFullLength(Math.floor((timeRunning - (days * this.day) - (hours * this.hour)) / this.minute),2);
        var seconds = this.toFullLength(Math.floor((timeRunning - (days * this.day) - (hours * this.hour) - (minutes * this.minute)) / this.second),2);
        var milliseconds = this.toFullLength(timeRunning - (days * this.day) - (hours * this.hour) - (minutes * this.minute) - (seconds * this.second),3);
    
        var timmingText = `[${this.toFullLength(currentTime.getDate(),2)}/${this.toFullLength(currentTime.getMonth()+1,2)}/${this.toFullLength(currentTime.getFullYear(),4)}-${this.toFullLength(currentTime.getHours(),2)}:${this.toFullLength(currentTime.getMinutes(),2)}:${this.toFullLength(currentTime.getSeconds(),2)}]`;
        timmingText = timmingText + `[${days}:${hours}:${minutes}:${seconds}.${milliseconds}]`;
    
        var toPrint = timmingText + " - " + message;
    
        console.log(toPrint);
        this.writeFile(toPrint, `../logs/${this.getStartTimeString()}/log.txt`);
    
    }
    static saveError(err, filename, line){
        this.increaseErrorCount();
        
        var toWrite = "Error:\n";
        toWrite += "File: " + filename + "\n";
        toWrite += "Line: " + line + "\n";
        toWrite += "Error Title: " + err + "\n";
        toWrite += "Error Stack: " + err.stack + "\n\n\n";
    
        save(toWrite);
    }
    static saveMessageStoreError(err, query, filename, line){
        this.increaseErrorCount();
    
        var toWrite = "Error:\n";
        toWrite += "File: " + filename + "\n";
        toWrite += "Line: " + line + "\n";
        toWrite += "Query: " + query + "\n";
        toWrite += "Error Title: " + err + "\n";
        toWrite += "Error Stack: " + err.stack + "\n\n\n";
        
        save(toWrite);
    }
    static save(toWrite){
        var file = `../logs/${this.getStartTimeString()}/ERROR ${this.getNowString()}.txt`
        this.writeFile(toWrite, file);
    }
    static folderCheck(folder){
        if(!fs.existsSync(__dirname + "/../" +folder)){
            fs.mkdirSync(__dirname + "/../" +folder);
        }
    }
    static writeFile(toWrite, file){

        fs.appendFileSync(__dirname + "/../" + file, toWrite + "\n", function (err) {
            if(err != null){
                console.log(err);
            }
        });
    
    }

}

module.exports = { Log };