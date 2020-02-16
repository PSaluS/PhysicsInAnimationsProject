let wind;

const GAMELOOP_TIME = 16; //FPS DELTA
const UP_KEY = 119; //W
const DOWN_KEY = 115; //S
const SHOOT_KEY = 32;  //SPACE
const POWER_UP_KEY = 101;  //E
const POWER_DOWN_KEY = 113;  //Q

function randomWind() {
  min = Math.ceil(0);
  max = Math.floor(10);
  wind = ((Math.floor(Math.random() * (max - min + 1)) + min)-5)/10;
}
class Target {
  constructor(c) {
    this.c = c;
    this.x = this.randPozition();
  }

  randPozition() {
    min = Math.ceil(500);
    max = Math.floor(1300);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  draw() {
    this.c.beginPath();
    this.c.strokestyle = '#000000';
    this.c.moveTo(this.x,400);
    this.c.lineTo(this.x,350);
    this.c.stroke();
    this.c.fillStyle = '#ff0000';
    this.c.fillRect(this.x,350,30,20);
    this.c.fillStyle = '#000000';
  }
}

class CannonBall {
	constructor(c,x,y,dx,dy) {
		this.c = c;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
	}
	move() {
		if (this.y < document.getElementById("screen").offsetHeight && this.x < document.getElementById("screen").offsetWidth) {
      //x motion
      this.dx = this.dx*0.995;
			this.x+=this.dx+wind;
      //y motion
      this.dy = this.dy*0.995;
      this.y-=this.dy;
      if(this.dy > -9.8)
			this.dy-=0.05;
		}
	}
	draw() {
		this.c.beginPath();
    this.c.arc(this.x,this.y,4,0,2*Math.PI);
    this.c.fill();
    this.c.stroke();
	}
}

class Cannon  { //NOTE: angle is in radians
		constructor(c,rLength,angle, power = 1) {
			this.c = c;
			this.rLength = rLength;
			this.angle= angle;
      this.dAngle = .05;
      this.power = power;
			this.cbCollection = [];
		}
		getXVector() {
			return this.rLength*Math.cos(this.angle);
		}
		getYVector() {
			return 400-this.rLength*Math.sin(this.angle);
		}
		increaseAngle() {
			if (this.angle < (Math.PI/2)) {
				this.angle+=this.dAngle;
			}
		}
		decreaseAngle() {
			if (this.angle > 0) {
				this.angle-=this.dAngle;
			}
    }
    increasePower() {
      if(this.power < 3) {
        this.power+=0.2;
      }
    }
    decreasePower() {
      if(this.power > 1) {
        this.power-=0.2;
      }
    }
		changeY() {
			this.cbCollection.forEach(function(element) {
				element.dy+=0.5;
			});
		}
		shoot() {
      this.cbCollection.push(new CannonBall(
        this.c,this.getXVector(),
        this.getYVector(),
        ((this.rLength*Math.cos(this.angle)/15)*this.power),
        ((this.rLength*Math.sin(this.angle)/15)*this.power)));
		}
		draw() {
      this.c.lineWidth = 10;
      this.c.beginPath();
			this.c.moveTo(0,400);
			this.c.lineTo(this.getXVector(),this.getYVector());
      this.c.stroke();
      this.c.lineWidth = 1;
			this.cbCollection.forEach(function(element) {
				element.move();
				element.draw();
			});
		}
}

window.onload = function() {
	var canvas = document.getElementById('screen');
  var ctx = canvas.getContext('2d');
  this.randomWind();
  var cannon = new Cannon(ctx,70,Math.PI/4);
  var target = new Target(ctx);
	var counter = 0;
	window.onkeypress = function(e) {
		if (e.keyCode == UP_KEY) {
			cannon.increaseAngle();
		}
		else if (e.keyCode == DOWN_KEY) {
			cannon.decreaseAngle();
		}
		else if (e.keyCode == SHOOT_KEY) {
			cannon.shoot();
    }
    else if (e.keyCode == POWER_UP_KEY) {
			cannon.increasePower();
    }
    else if (e.keyCode == POWER_DOWN_KEY) {
			cannon.decreasePower();
    }
  };
	setInterval(function() {
		ctx.clearRect(0,0,canvas.width,canvas.height);
    cannon.draw();
    target.draw();
    cannon.cbCollection.forEach(function(element) {
      if(element.y >= 398) {
        if(element.x >= target.x - 20 && element.x <= target.x + 20) {
          // WIN
          document.location.reload();
        }
      }
    })
		counter++;
	}, GAMELOOP_TIME);
};