
var HEROSTATE = cc.Enum({
    NORMAL: 0,
    DOWN:1,
    DEAD: 2,
});
cc.Class({
    extends: cc.Component,

    properties: {
        
        moveSpeed: {
            default: 0,
            tooltip: "水平移动速度",
        },
        downSpeed: {
            default: 0,
            tooltip: "下落速度",
        },
        gravitySpeed:{
            default: 0,
            tooltip: "重力加速度系数",
        },
        draw:{
            default: null,
            type:cc.Node,
            tooltip: "画板组件",
        },
        draw:{
            default: null,
            type:cc.Node,
            tooltip: "画板组件",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.state=HEROSTATE.DOWN;
        this.drawComponent=this.draw.getComponent("draw");
        this.drawSpeed= this.drawComponent.ladderSpeed;
        this.drawWidthHalf=this.draw.width/2;

        this.leftDirection=false;
        this.rightDirection=false;
        this.draw.on('touchstart', function (event) {
            let drawX=event.getLocationX();
            if(this.node.x>drawX){
                this.leftDirection=true;
                this.rightDirection=false;
            }else{
                this.leftDirection=false;
                this.rightDirection=true;
            }
        }, this);
    },
    //开始碰撞
    onCollisionEnter: function (other, self) {
        cc.log("hero hit");
        this.state=HEROSTATE.NORMAL;
    },
    //碰撞结束
    onCollisionExit: function (other, self) {
        console.log('on collision exit');
        this.state=HEROSTATE.DOWN;
    },

    start () {

    },

    update (dt) {
        if(!this.leftDirection && !this.rightDirection){
            this.speedX = 0;
        }else if(this.leftDirection && this.rightDirection){
            this.speedX = 0;
        }else if(this.leftDirection && !this.rightDirection){
            this.speedX = -this.moveSpeed;
        }else if(!this.leftDirection && this.rightDirection){
            this.speedX = this.moveSpeed;
        }

        if((Math.abs(this.node.x)+this.node.width/2)>this.drawWidthHalf){
            this.node.x =this.drawWidthHalf;
        }
        
        this.node.x += this.speedX * dt;                    //左右移动
        
        if(this.state==HEROSTATE.DOWN){                     //降落
            this.downSpeed+=this.gravitySpeed*dt
            this.node.y-=this.downSpeed*dt;
        }else if(this.state==HEROSTATE.NORMAL){             //梯子上
            this.node.y+=this.drawSpeed*dt;
        }
    },
});
