var canvas=document.getElementById("canvas");
var ctx=canvas.getContext('2d');
var initialMsec=new Date().getMilliseconds();
/*var birdIMG=  
var skyIMG=  //276x109
var landIMG=  //336x112*/
var raf;
var gameStatus=0;//0->NotStarted 1->Playing, 2-> GameOver
var speedFactor=10;
var collisionStatus=false;
var debugMode=0; //0->False,1->CollisionV1,2->CollisionV2
var mouseClickable=null;
var score=0;
var added=false;

function initGame(restarted){
	windowSize=document.getElementById("windowSize");
	if(windowSize.offsetHeight<500){
		canvas.classList.toggle("hide");
		document.getElementById("notSupported").classList.toggle("hide");
	}
	else{
		score=0;
		speedFactor=1;
		gameStatus=0;
		added=false;
		if(!restarted)
			WebSocketTest();
		canvas.height=windowSize.offsetHeight;
		canvas.width=windowSize.offsetWidth;
		birdIMG=document.getElementById("birdIMG"+(Math.floor(Math.random()*4)+1));
		skyIMG=document.getElementById("skyIMG");
		landIMG=document.getElementById("landIMG");
        pipeIMG=document.getElementById("pipeIMG");
        gameOverIMG=document.getElementById("gameOverIMG");
		bird.x=Math.round(canvas.width/10);
		bird.y=Math.round(canvas.height/2-birdIMG.height);
		bird.frame=0;
		bird.width=Math.floor(canvas.width/2);
		bird.height=birdIMG.height/(birdIMG.width/Math.floor(bird.width));
		if(bird.width>birdIMG.width){
			bird.width=birdIMG.width;
			bird.height=birdIMG.height;
		}
		pipe.x=Math.round(canvas.width);
		// pipe.width = pipeIMG.width/2;
		pipe.height = pipeIMG.height;
		pipe.width = (canvas.width/2)/2;
		// pipe.height = pipeIMG.height/(pipeIMG.width/Math.floor(pipe.width));
		if(pipe.width>pipeIMG.width/2){
			pipe.width=pipeIMG.width/2;
			pipe.height=pipeIMG.height;
		}
		pipe.y = canvas.height;
		pipe.hgap=Math.floor(bird.x+(bird.width/bird.totalFrames+pipe.width))+10;//400;
		pipe.vgap=pipe.width*1.6;
		pipe.totalPipes=Math.floor(canvas.width/(pipe.width+pipe.hgap))+3;//means 2 extra pipes (off screen for randomisation)
		// console.log(pipe.totalPipes);
		pipe.Case=[canvas.height/4,canvas.height/5,canvas.height/6,canvas.height/7,canvas.height/8,canvas.height/2.6,canvas.height/3];
		sky.y=canvas.height-skyIMG.height-landIMG.height;
		sky.width=skyIMG.width;
		sky.height=skyIMG.height;
		land.y=canvas.height-landIMG.height;
		land.width=landIMG.width;
		land.height=landIMG.height;
		draw();
	}
}


var bird={ //276x64 -> 3frames
	x:0,//Math.round(canvas.width/8),
	y:0,//Math.round(canvas.height/2-birdIMG.height),
	frame:0,
	totalFrames:4,
	vx:0,
	vy:0,
	width:0,
	height:0,
	heightForCollision:0,
	widthForCollision:0,
	draw:function(){
		ctx.save();
		var sineOffset=0;
		// console.log(this.height);
		if(!gameStatus||isMobile){
			var msec=new Date().getMilliseconds();
			sineOffset=(-1*Math.sin(((2*Math.PI)/1000)*findY(msec,initialMsec))*20);
		}
		// console.log("BIRD");
		ctx.translate(this.x,this.y);
		/*ctx.save();
		ctx.fillStyle='black';
		ctx.moveTo(1,0);
		ctx.beginPath();
		ctx.arc(0,0,1,0,2*Math.PI);
		ctx.fill();
		ctx.restore();*/
		ctx.translate(this.width/(3*this.totalFrames),2*this.height/3);
		// var angle=((Math.PI/2)/25)*Math.floor(this.vy);
		var angle=((Math.PI/2)/30)*this.vy;
		// ROTATION ANGLE IN DEGREES -> console.log(((180/2)/25)*this.vy);
		// ROTATION ANGLE IN RADIANS -> console.log(((Math.PI/2)/25)*this.vy);
		// console.log(bird.vy);
		if(bird.vy<0){
			// GOING UP -> ANGLE IS NEGATIVE -> BOTTOM HALF 90 - ANGLE -> TOP HALF 
			// console.log(  bird.width*Math.cos(((Math.PI/2)/25)*this.vy)/bird.totalFrames  +  bird.height*Math.cos(((Math.PI/2)/25)*this.vy)/bird.totalFrames  );
			this.heightForCollision=Math.floor((bird.width/bird.totalFrames)*Math.sin(-angle)+bird.height*Math.cos(-angle));
			this.widthForCollision=Math.floor((bird.width/bird.totalFrames)*Math.cos(-angle)+bird.height*Math.sin(-angle));
		}
		else{
			// GOING DOWN -> ANGLE IS POSITIVE
			// console.log(  bird.width*Math.cos(((Math.PI/2)/25)*this.vy)/bird.totalFrames  +  bird.height*Math.cos(((Math.PI/2)/25)*this.vy)/bird.totalFrames  );
			this.heightForCollision=Math.floor(bird.height*Math.cos(angle)+(bird.width/bird.totalFrames)*Math.sin(angle));
			this.widthForCollision=Math.floor(bird.height*Math.sin(angle)+(bird.width/bird.totalFrames)*Math.cos(angle));
		}
		//RECTANGLE FOR COLLISION SQUARE
		if(debugMode==1){
			ctx.strokeStyle="#000000";
			ctx.strokeRect(-(bird.width/bird.totalFrames)/3+bird.width/(2*bird.totalFrames)-bird.widthForCollision/2,-(2*bird.height)/3+bird.height/2-bird.heightForCollision/2,bird.widthForCollision,bird.heightForCollision);
			ctx.strokeStyle="#FF0000";
			ctx.strokeRect(-(bird.width/bird.totalFrames)/3,-(2*bird.height)/3,2,2);
		}

		ctx.rotate(angle);
		
		if(debugMode==2){
			ctx.beginPath();
			ctx.ellipse(-(bird.width/bird.totalFrames)/3+(bird.width/bird.totalFrames)/2,-2*bird.height/3+bird.height/2,bird.width/(2*bird.totalFrames),bird.height/2,0,0,2*Math.PI);
			ctx.stroke();
			ctx.strokeStyle="#FF0000";
			ctx.strokeRect(-(bird.width/bird.totalFrames)/3,-(2*bird.height)/3,2,2);
		}

		// console.log("ANGLE: "+Math.floor((angle*180)/Math.PI)+" WIDTH: "+this.widthForCollision+" HEIGHT: "+this.heightForCollision);
		// ctx.strokeRect(0,0+sineOffset,this.width/this.totalFrames,this.height);
		ctx.drawImage(birdIMG,(birdIMG.width/this.totalFrames)*Math.floor(this.frame/4),0,birdIMG.width/this.totalFrames,birdIMG.height,-this.width/(this.totalFrames*3),-2*this.height/3+sineOffset,this.width/this.totalFrames,this.height);
		if(debugMode==1){
			ctx.strokeStyle="#000000";
			ctx.strokeRect(-(bird.width/bird.totalFrames)/3,-(2*bird.height)/3,bird.width/bird.totalFrames,bird.height);
		}
		if(speedFactor){
			this.frame+=1;
			this.frame%=(this.totalFrames-1)*4;
		}
		ctx.restore();
		/*ctx.fillStyle='black';
		ctx.fillRect(0,0,200,200);*/
		return angle;
	}
}
var sky={
	x:0,
	y:0,//canvas.height-skyIMG.height-landIMG.height,
	vx:-2,//-2,
	vy:0,
	width:0,//skyIMG.width,
	height:0,//skyIMG.height,
	draw:function(){
		ctx.fillStyle='#4EC0CA';
		ctx.fillRect(0,0,canvas.width,canvas.height-landIMG.height-skyIMG.height);
		for(var i=0;i<Math.floor(canvas.width/skyIMG.width)+2;i++){
			ctx.drawImage(skyIMG,this.x+i*this.width,this.y,this.width,this.height);
		}
	}
}

var pipe={
	x:0,
	y:0,
	vx:-3,
	vy:0,
	width:0,
	height:0,
	hgap:0,//canvas.width/4,
	vgap:0,// multiplying factor = 1.6
	Case:0,
	CaseUsed:[],
	totalPipes:0,
	draw: function() {
		// console.log(tmpCase);
        for(var i=0;i<this.totalPipes;i++) {
            // NUMBER OF PIPES -> console.log(Math.floor(canvas.width/(this.width+this.hgap))+3);
            // console.log(this.hgap);
            // console.log(this.y);
			this.y=land.y-this.Case[this.CaseUsed[i]];
            ctx.drawImage(pipeIMG, 0, 0, pipeIMG.width/2, pipeIMG.height, this.x+this.hgap*i, this.y, this.width, this.height);
            ctx.drawImage(pipeIMG, pipeIMG.width/2, 0, pipeIMG.width/2, pipeIMG.height, this.x+this.hgap*i, this.y-pipe.vgap, this.width, -this.height);
            // RECTANGLE FOR COLLISION BOUNDARIES
            if(debugMode){
				ctx.strokeStyle="#FF0000";
				ctx.strokeRect(this.x+this.hgap*i,this.y,this.width,this.height);
				ctx.strokeRect(this.x+this.hgap*i,this.y-this.vgap-this.height,this.width,this.height);
			}
        }
        this.y=land.y-this.Case[this.CaseUsed[0]];
    }
}

var land={
	x:0,
	y:0,//canvas.height-landIMG.height,
	vx:-4,//-3,
	vy:0,
	width:0,//landIMG.width,
	height:0,//landIMG.height,
	draw:function(){
		for(var i=0;i<Math.floor(canvas.width/landIMG.width)+2;i++){
			ctx.drawImage(landIMG,this.x+i*this.width,this.y,this.width,this.height);
		}
	}
}
function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	sky.draw();
	sky.x+=(sky.vx*speedFactor);
    // console.log(pipe.x);
	if(sky.x<-skyIMG.width+1)
		sky.x=0;
	// console.log(-(pipe.hgap+pipe.width));
	if(gameStatus&&!isMobile){
		pipe.draw();
		pipe.x+=(pipe.vx*speedFactor);
		// console.log(speedFactor);
		if(pipe.x<-(pipe.width)){
			pipe.x=pipe.hgap-pipe.width;
			pipe.CaseUsed=pipe.CaseUsed.splice(1);
			added=false;
			// pipe.CaseUsed=tmp.concat(pipe.CaseUsed);
			// console.log(pipe.CaseUsed);
		}
	}
	land.draw();
	land.x+=(land.vx*speedFactor);
	if(land.x<-landIMG.width+1)
		land.x=0;


    if(gameStatus){
    	if(!isMobile){
			var angle=bird.draw();
			bird.y+=bird.vy;
			bird.vy*=0.99;
			bird.vy+=0.5;
			// console.log("if(bird.x("+bird.x+")>pipe.x("+pipe.x+")&&bird.x("+bird.x+")+bird.width("+bird.width+")<pipe.x("+pipe.x+")+pipe.width("+pipe.width+"))")
			// console.log("bird.y("+bird.y+")+bird.heightForCollision("+bird.heightForCollision+")-10>pipe.y("+pipe.y+")");
			/*if( speedFactor&&
				((bird.x+bird.widthForCollision-10>pipe.x&&bird.x+30<pipe.x+pipe.width&&
										(bird.y+bird.heightForCollision-30>pipe.y||bird.y<pipe.y-pipe.vgap))
				||bird.y+bird.height>land.y)
				){
				// console.log("BirdOnPipe");
				// birdIMG=document.getElementById("birdIMG"+(Math.floor(Math.random()*4)+1));
				speedFactor=0;
				bird.frame=4*(bird.totalFrames-1);
				bird.vy=0;
			}*/
			// NEW COLLISION WITH PBP-HHB-SCT USING WIDTH-FOR-COLLISION AND HEIGHT-FOR COLLSIION VALUES FOR BETTER RESULTS!
			if(debugMode==1){
				ctx.strokeStyle="#0000FF";
				ctx.strokeRect(bird.x+bird.width/(2*bird.totalFrames)+bird.widthForCollision/2,bird.y+bird.height/2-bird.heightForCollision/2,2,2);
			}
			if( speedFactor&&
				((bird.x+bird.width/(2*bird.totalFrames)+bird.widthForCollision/2-20>pipe.x&&bird.x+bird.width/(2*bird.totalFrames)-bird.widthForCollision/2+20<pipe.x+pipe.width&&
				(bird.y+bird.height/2+bird.heightForCollision/2-15>pipe.y||bird.y+bird.height/2-bird.heightForCollision/2+15<pipe.y-pipe.vgap))
				||bird.y+bird.height>land.y)
				){
				// console.log("BirdOnPipe");
				// if(speedFactor)
					// console.log("PIPE.X: "+pipe.x+" PIPE.Y: "+pipe.y+" PIPE.VGAP: "+pipe.vgap+"\nBIRD.X: "+bird.x+" BIRD.Y: "+bird.y+" BIRD.WIDTHFORCOLLISION: "+bird.widthForCollision+ " BIRD.HEIGHTFORCOLLISION: "+bird.heightForCollision+"\nCONDITIONS:\n"+(bird.x+bird.width/(2*bird.totalFrames)+bird.widthForCollision/2)+">"+(pipe.x)+"&&"+(bird.x+bird.width/(2*bird.totalFrames)-bird.widthForCollision/2)+"<"+(pipe.x+pipe.width)+"&&"+"("+(bird.y+bird.height/2+bird.heightForCollision/2)+">"+(pipe.y)+"||"+(bird.y+bird.height/2-bird.heightForCollision/2)+"<"+(pipe.y-pipe.vgap)+")");
				// birdIMG=document.getElementById("birdIMG"+(Math.floor(Math.random()*4)+1));
				speedFactor=0;
				bird.frame=4*(bird.totalFrames-1);
				bird.vy=0;
				gameStatus=2;
				ws.send(
					JSON.stringify({
						timestamp: new Date().getTime(),
						event_name: "OUT"
					})
				);
			}
			// COLLISION WITH ELLIPSE SHAPE COLLIDER
			// console.log("STARTING: "+checkCollisionWithEllipse(pipe.x,pipe.y,angle)+" \nENDING: "+checkCollisionWithEllipse(pipe.x,land.y,angle));
			/*if(bird.x+bird.width/bird.totalFrames>pipe.x){
				var tmp=checkCollisionWithEllipse(pipe.x,pipe.y,angle);
				// console.log(tmp);
				var tmp2=checkCollisionWithEllipse(pipe.x,land.y-pipe.y,angle);
				// console.log(tmp2);
				if(tmp<1){
					speedFactor=0;
					console.log(pipe.x,pipe.y,angle);
				}
				else
				if(tmp2<1){
					speedFactor=0;
					console.log(pipe.x,pipe.y,angle);
				}
			}*/

			//CALCULATE SCORE:
			if(bird.x>pipe.x+pipe.width&&!added){
				score+=1;
				ws.send(
					JSON.stringify({
						timestamp: new Date().getTime(),
						event_name: "SCORED"
					})
				);
				// console.log(score);
				added=true
			}
			//WHEN PLAYER IS DOWN
			if(gameStatus==2){
				var startx=canvas.width/2-canvas.width/6;
				var starty=canvas.height/10;
				var tmpWidth=canvas.width/2.5;
				if(tmpWidth>gameOverIMG.width-60){
					tmpWidth=gameOverIMG.width-60;
					// tmpHeight=gameOverIMG.height;
				}
				var tmpHeight=(gameOverIMG.height/gameOverIMG.width)*tmpWidth;
				ctx.drawImage(gameOverIMG,startx,starty,tmpWidth,tmpHeight);//canvas.width/3,(gameOverIMG.height/gameOverIMG.width)*canvas.width/3);
				startx=2*canvas.width/10;
				starty=starty+tmpHeight+45
				ctx.fillStyle="#000000";
				// ctx.fillRect(startx-3,starty-3,(6*canvas.width)/10+6,canvas.height-starty-canvas.height/10);
				ctx.fillStyle="#DFD78F";//"#efc95e";
				// ctx.fillRect(startx,starty,(6*canvas.width)/10,canvas.height-starty-canvas.height/10-6);
				createTextWithoutBG("SCORE: "+score,canvas.width/2,4*canvas.height/8,canvas.height/8,'white',1);
				mouseClickable=createTextWithBG("RESTART",canvas.width/2,3*canvas.height/4,canvas.height/8,'white',1);
				// console.log("calledAgain");
			}
		}
		else{
			bird.draw();
			var fontSize=Math.round(canvas.height/12);
			if(gameStatus==1){
				createTextWithoutBG("SCORE:"+score,canvas.width/2,canvas.height/2,fontSize,'white',1)
			}
			else{
				createTextWithoutBG("SCORE:"+score,canvas.width/2,canvas.height/2,fontSize,'white',1)
				mouseClickable=createTextWithBG("RESTART",canvas.width/2,2*canvas.height/3,fontSize,'white',1)	
			}
		}
	}
	else{
		var fontSize=Math.round(canvas.height/8);
		// console.log(fontSize);
		createTextWithBG("START",canvas.width/2,canvas.height/2,fontSize,'white',1)
		// createTextWithBG("START",(2*canvas.width)/3,canvas.height/2,fontSize,'white',0)
		/*ctx.font="bold "+fontSize+"px FlappyBird";
		var text="START";
		var tWidth=ctx.measureText(text).width;
		var rectStartPosX=canvas.width/2-tWidth/2-fontSize/5;
		var rectStartPosY=canvas.height/2-fontSize-fontSize/5;
		ctx.fillStyle="rgb(83,48,0)";
		ctx.fillRect(rectStartPosX,rectStartPosY-5,tWidth+35,fontSize+15);
		ctx.fillStyle="rgb(255,255,255)";
		ctx.fillRect(rectStartPosX+5,rectStartPosY,tWidth+25,fontSize)
		ctx.fillStyle="rgb(232,97,1)";
		ctx.fillRect(rectStartPosX+10,rectStartPosY+5,tWidth+15,fontSize-10)
		ctx.fillStyle='white';
		// console.log(tWidth);
		ctx.fillText(text,canvas.width/2-tWidth/2,canvas.height/2-30);
		ctx.strokeText(text,canvas.width/2-tWidth/2,canvas.height/2-30);
		*/
	}
	if(bird.y<0&&bird.vy<0){
		bird.vy=0;
	}
	if(bird.y>canvas.height-landIMG.height-bird.height){
		bird.y=canvas.height-landIMG.height-bird.height;
		bird.vy=0;
	}
	/*
	TO KEEP THE BIRD IN THE MIDDLE OF THE SCREEN (FOR MOBILE UI ONLY)
	if(bird.y>canvas.height/2-birdIMG.height){
		bird.y=canvas.height/2-birdIMG.height;
		bird.vy=0;
	}
	*/
	raf=window.requestAnimationFrame(draw);
}
function findY(current,initial){
    var tmp=(((current-initial)<0)?1000+current-initial:current-initial);
    return tmp;
}
canvas.onmousedown=function(evt){
	// console.log('clicked');
	if(gameStatus==2){
		// console.log(evt);
		if(evt.clientX>=mouseClickable[0]&&evt.clientX<=mouseClickable[0]+mouseClickable[2]&&evt.clientY>=mouseClickable[1]&&evt.clientY<=mouseClickable[1]+mouseClickable[3]){
			window.cancelAnimationFrame(raf);
			gameStatus=0;
			initGame(1);
			if(isMobile){
				ws.send(
					JSON.stringify({
						timestamp: new Date().getTime(),
						event_name: "RESTART"
					})
				);
			}
			return;
		}
	}
	if(!isMobile){
		while(pipe.CaseUsed.length<pipe.totalPipes){
			var ran=Math.floor(Math.random()*pipe.totalPipes);
			if(pipe.CaseUsed.indexOf(ran)!=pipe.CaseUsed[pipe.CaseUsed.length-1]){
				pipe.CaseUsed[pipe.CaseUsed.length]=ran%pipe.Case.length;
				// console.log("calledAgain!");
			}
			// console.log(pipe.CaseUsed);
		}
		if(!gameStatus){
			gameStatus=1;
		}
		if(speedFactor)
			jump();//-pipe.vgap/20;//-(bird.height*0.17*speedFactor);
	}
	else{
		if(gameStatus!=2){
			ws.send(
				JSON.stringify({
					timestamp: new Date().getTime(),
					event_name: "TAP"
				})
			);
			gameStatus=1;
		}
	}
}
window.onresize=function(){
	if(windowSize.offsetHeight<500){
		window.cancelAnimationFrame(raf);
		canvas.classList.add("hide");
		document.getElementById("notSupported").classList.remove("hide");
	}
	else{
		window.cancelAnimationFrame(raf);
		canvas.classList.remove("hide");
		document.getElementById("notSupported").classList.add("hide");
		ws.close();
		initGame();
	}
}
/*canvas.onmouseover=function(){
	initialMsec=new Date().getMilliseconds();
	// console.log("enter");
	raf=window.requestAnimationFrame(draw);
}
canvas.onmouseleave=function(){
	// console.log("left");
	// console.log(raf);
	window.cancelAnimationFrame(raf)
}*/
function checkCollisionWithEllipse(startx,starty,angleOfRotation){
	var result=Math.pow(((startx+(2*bird.width)/(3*bird.totalFrames))*Math.cos(angleOfRotation)+(starty+bird.height/3)*Math.sin(angleOfRotation)),2) / Math.pow(bird.width/bird.totalFrames,2)  +  Math.pow(((startx+(2*bird.width)/(3*bird.totalFrames))*Math.cos(angleOfRotation)-(starty+bird.height/3)*Math.sin(angleOfRotation)),2) / Math.pow(bird.height/bird.totalFrames,2);
	return result;
}
function jump(){
	bird.vy=-(pipe.vgap/80)*pipe.vgap/bird.height;	
}