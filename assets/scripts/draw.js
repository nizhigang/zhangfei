/**
 * 画板
 * 扶梯和英雄任务所在区域
 */
cc.Class({
    extends: cc.Component,

    properties: {
        
        ladderPutong: {
            default: null,
            type:cc.Prefab,
            tooltip: "普通梯子",
        },

        ladderSpeed: {
            default: 100,
            tooltip: "梯子滚动速度",
        },
        ladderInterval:{
            default: 200,
            tooltip: "梯子之间的间隔",
        },
        ladderRecovery:{
            default:null,
            type: cc.Node,
            tooltip: "梯子回收器",
        },
    },
    
    onLoad () {
        this.touchNodeWidth=this.node.getParent().width;
        this.ladderRecovery.getComponent("ladder_recovery").game=this;
        //创建几个node池
        this.currentLadderY=0;
        this.ladder_putongPool=new cc.NodePool();
        for(var i = 0; i < 8; i++){
            this.ladder_putongPool.put(cc.instantiate(this.ladderPutong));
        }
        this.newLadder(true);
        for(var i=0;i<7;i++){
            this.newLadder();
        }

    },
    
    //新的梯子
    newLadder(isFIrst){
        cc.log("nzg===>pool中个数"+this.ladder_putongPool.size());
        this.currentLadderY-=this.ladderInterval;
        var ladder;
        if(this.ladder_putongPool.size()>0){
            ladder=this.ladder_putongPool.get();
        }else{
            ladder=cc.instantiate(this.ladderPutong);
        }
        this.node.addChild(ladder);
        var stairX = 0;
        if(!isFIrst){
            stairX = Math.random()*this.touchNodeWidth -this.touchNodeWidth/2;
            if(stairX<0){
                stairX+=ladder.width/2;
            }else{
                stairX-=ladder.width/2;
            }
        }
        
        var stairY = this.currentLadderY;
        ladder.setPosition(stairX, stairY);

    },
    start () {

    },

   
    update (dt) {
        this.node.y+=dt*this.ladderSpeed;
    },
});
