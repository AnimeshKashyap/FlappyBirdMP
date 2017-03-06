var canvas=document.getElementById("canvas");
var ctx=canvas.getContext('2d');
var initialMsec=new Date().getMilliseconds();
/*var birdIMG=  
var skyIMG=  //276x109
var landIMG=  //336x112*/
var raf;
var started=false;


function initGame(){
	windowSize=document.getElementById("windowSize");
	if(windowSize.offsetHeight<500){
		canvas.classList.toggle("hide");
		document.getElementById("notSupported").classList.toggle("hide");
	}
	else{
		// WebSocketTest();
		canvas.height=windowSize.offsetHeight;
		canvas.width=windowSize.offsetWidth;
		birdIMG=document.getElementById("birdIMG"+(Math.floor(Math.random()*4)+1));
		skyIMG=document.getElementById("skyIMG");
		landIMG=document.getElementById("landIMG");
		bird.x=Math.round(canvas.width/8);
		bird.y=Math.round(canvas.height/2-birdIMG.height);
		bird.width=Math.floor(canvas.width/2);
		bird.height=birdIMG.height/(birdIMG.width/Math.floor(canvas.width/2));
		if(bird.width>birdIMG.width){
			bird.width=birdIMG.width;
			bird.height=birdIMG.height;
		}
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
	totalFrames:3,
	vx:0,
	vy:0,
	width:0,
	height:0,
	draw:function(){
		ctx.save();
		var sineOffset=0;
		// console.log(this.height);
		var msec=new Date().getMilliseconds();
		if(!started){
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
		ctx.translate(this.width/(2*this.totalFrames),this.height/2);
		ctx.rotate(((Math.PI/2)/25)*this.vy);
		// ctx.strokeRect(0,0+sineOffset,this.width/this.totalFrames,this.height);
		ctx.drawImage(birdIMG,0+(birdIMG.width/this.totalFrames)*Math.floor(this.frame/4),0,birdIMG.width/this.totalFrames,birdIMG.height,-this.width/(this.totalFrames*2),-this.height/2+sineOffset,this.width/this.totalFrames,this.height);
		this.frame+=1;
		this.frame%=this.totalFrames*4;
		ctx.restore();
		/*ctx.fillStyle='black';
		ctx.fillRect(0,0,200,200);*/
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
var land={
	x:0,
	y:0,//canvas.height-landIMG.height,
	vx:-3,//-3,
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
	sky.x+=sky.vx;
	if(sky.x<-skyIMG.width+1)
		sky.x=0;
	land.draw();
	land.x+=land.vx;
	if(land.x<-landIMG.width+1)
		land.x=0;
	bird.draw();
	if(started){
		bird.y+=bird.vy;
		bird.vy*=0.99;
		bird.vy+=0.5;
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
canvas.onmousedown=function(){
	// console.log('clicked');
	started=true;
	// ws.send("TAP");
	bird.vy=-12;
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