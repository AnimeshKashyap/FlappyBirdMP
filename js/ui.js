var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

function initUI(){
	windowSize=document.getElementById("windowSize");
	canvas.height=windowSize.offsetHeight;
	canvas.width=windowSize.offsetWidth;
	// ctx.fillRect
	if(!isMobile){
		createTextWithBG(uniqueCode,canvas.width/2,canvas.height/2,60,'rgb(255,255,255)',1);
		console.log("uniqueCode");
	}
}
function createTextWithBG(text,posX,posY,fontSize,textColor,fontCode){
	// ctx.save();
	// FONT CODES: 0-> sans-serif 1-> Flappy-Bird-Regular
	var tWidth,rectStartPosX,rectStartPosY,rectWidth,rectHeight;
	if(fontCode){
		ctx.font=fontSize+"px Flappy-Bird-Regular";
		tWidth=ctx.measureText(text).width;
		rectStartPosX=posX-tWidth/2-fontSize/5-fontSize/6;
		rectStartPosY=posY-fontSize-fontSize/4.5;
		rectWidth=tWidth+fontSize/2;
		rectHeight=fontSize+fontSize/2;
		rectHeight=0.8*rectHeight;
	}
	else{
		fontSize=Math.round(fontSize/1.35);
		ctx.font="bold "+fontSize+"px serif";
		tWidth=ctx.measureText(text).width;
		// tWidth=0.733*tWidth;
		rectStartPosX=posX-tWidth/2-fontSize/5-fontSize/6;
		rectStartPosY=posY-fontSize-fontSize/4-fontSize/6;
		rectWidth=tWidth+fontSize/2;
		rectHeight=fontSize+fontSize/2;
	}
	// console.log(tWidth);
	// console.log(ctx.font);
	ctx.fillStyle="rgb(83,48,0)";
	ctx.fillRect(rectStartPosX+5,rectStartPosY-5,rectWidth+5,rectHeight);
	ctx.fillStyle="rgb(255,255,255)";
	ctx.fillRect(rectStartPosX+10,rectStartPosY,rectWidth-5,rectHeight-10)
	ctx.fillStyle="rgb(232,97,1)";
	ctx.fillRect(rectStartPosX+15,rectStartPosY+5,rectWidth-15,rectHeight-20)
	ctx.fillStyle=textColor;
	ctx.fillText(text,posX-tWidth/2,posY-fontSize/2.4);
	// ctx.restore();
}


/*
Dont allow fear a failure  nd depractiveness to play safe in life to draw u in
you cant everyday wen u wake up, u got two options, u can look at d clock nd hit dat snooze button nd boom, hit d snooze button nd go back to bed, thats right, nd do what, dream.. thats right, go back to sleep nd u can dream about what you wanna have, right there with ur comfortable pillow, just dream about what you wanna be.. or .. u can look at d snooze button.. kick dat clock nd get up, nd go pursue ur dreams

*/