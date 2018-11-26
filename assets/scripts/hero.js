var HEROSTATE=require("HEROSTATE");
var tagConfig=require("tagConfig");
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
        rightJiaSpeed: {
            default: 0,
            tooltip: "向右速度",
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
        this.top=this.drawComponent.top.getComponent("top");

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

        this.touchNode.on('touchend', function (event) {
            this.leftDirection=false;
            this.rightDirection=false;
        }, this);
        
        
    },
    //开始碰撞
    onCollisionEnter: function (other, self) {
        
        if(other.tag==tagConfig.ladder_putong &&self.tag==tagConfig.hero_bottom){
            this.state=HEROSTATE.NORMAL;
            this.drawComponent.cengshu++;
        }else if(other.tag==tagConfig.ladder_ci){
            this.top.iconNums--;            //硬币数量
            if(this.top.iconNums<0){
                this.state=HEROSTATE.DEAD;
            }else{
                this.top.setProBar(this.top.iconNums);
                this.state=HEROSTATE.DOWN;
            }
        } else if(other.tag==tagConfig.ladder_zuogundong){
            this.rightJiaSpeed=-100;
        }else if(other.tag==tagConfig.ladder_yougundong){
            this.rightJiaSpeed=100;
        }else if(other.tag==tagConfig.ladder_mu){

            other.getComponent(cc.Animation).play()

        }else if(other.tag==tagConfig.ladder_tiao){

        }

        this.top.setCengshu(this.drawComponent.cengshu);
        
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
            this.node.y-=(this.downSpeed+this.drawSpeed)*dt;
        }else if(this.state==HEROSTATE.NORMAL){             //梯子上
            
            //this.node.y+=this.drawSpeed*dt;

        }
    },
});
