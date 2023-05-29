class Car{
    constructor(x,y,width,height,controlsType,maxspeed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acc=0.3;
        this.maxspeed=maxspeed;
        this.fric =0.05;
        this.angle = 0;
        this.damaged = false;

        if(controlsType!="DUMMY"){
            this.sensor=new Sensor(this);
        }
        this.controls=new controls(controlsType);
    }

    update(roadBorders, traffic){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged =this.#assessDamaged(roadBorders, traffic);
        }else{
            
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
        }
    }

    #assessDamaged(roadBorders,traffic){
        for(let i =0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }

        for(let i =0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }


    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acc;
        }
        if(this.controls.reverse){
            this.speed-=this.acc;
        }
        if(this.speed>this.maxspeed){
            this.speed=this.maxspeed;
        }
        if(this.speed<-this.maxspeed/2){
            this.speed=-this.maxspeed/2;
        }
        if(this.speed>0){
            this.speed-=this.fric;
        }
        if(this.speed<0){
            this.speed+=this.fric;
        }
        if(Math.abs(this.speed)<this.fric){
            this.speed=0;
        }
        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.right){
                this.angle -= 0.03*flip;
            }
            if(this.controls.left){
                this.angle += 0.03*flip;
            }
        }
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;

        this.y-=this.speed;
    }
    draw(ctx){
        if(this.damaged){
            ctx.fillStyle="Red";
        }else{
            ctx.fillStyle="black";
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i< this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor){
            this.sensor.draw(ctx);
        }
    }
}