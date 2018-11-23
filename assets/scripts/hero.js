var HEROSTATE=require("HEROSTATE");

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
        touchNode:{
            default: null,
            type:cc.Node,
            tooltip: "触摸板，触摸此节点，触发触摸事件",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.state=HEROSTATE.DOWN;
        this.drawComponent=this.draw.getComponent("draw");
        this.drawSpeed= this.drawComponent.ladderSpeed;
        this.touchNodeWidthHalf=this.touchNode.width/2;

        this.leftDirection=false;
        this.rightDirection=false;
        
        this.touchNode.on('touchstart', function (event) {
            let drawX=event.getLocationX()-this.touchNodeWidthHalf;
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
        
        this.state=HEROSTATE.NORMAL;
    },
    //碰撞结束
    onCollisionExit: function (other, self) {
       
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
            if((this.node.x-this.node.width/2)<-this.touchNodeWidthHalf){
                this.speedX =0;
            }
        }else if(!this.leftDirection && this.rightDirection){
            this.speedX = this.moveSpeed;
            if((this.node.x+this.node.width/2)>this.touchNodeWidthHalf){
                this.speedX =0;
            }
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
