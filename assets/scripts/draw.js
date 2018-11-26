/**
 * 画板
 * 扶梯和英雄任务所在区域
 */
var difficultyConfig=require("difficultyConfig");
var tagConfig=require("tagConfig");
var gameConfig=require("gameConfig");
cc.Class({
    extends: cc.Component,

    properties: {

        ladderPutong: {
            default: null,
            type:cc.Prefab,
            tooltip: "普通梯子",
        },
        ladderCi: {
            default: null,
            type:cc.Prefab,
            tooltip: "长刺的梯子",
        },
        ladderMu: {
            default: null,
            type:cc.Prefab,
            tooltip: "木头梯子",
        },
        ladderZuogundong: {
            default: null,
            type:cc.Prefab,
            tooltip: "左滚动梯子",
        },
        ladderYougundong: {
            default: null,
            type:cc.Prefab,
            tooltip: "右滚动梯子",
        },
        ladderTiao: {
            default: null,
            type:cc.Prefab,
            tooltip: "让人跳的梯子",
        },

        ladderSpeed: {
            default: 100,
            tooltip: "梯子滚动速度",
        },
        jiaSpeed: {
            default: 0.05,
            tooltip: "梯子向上滚动加速度",
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
        top:{
            default:null,
            type: cc.Node,
            tooltip: "头部容器",
        },
    },
    
    onLoad () {
        
        this.cengshu=0;
        this.touchNodeWidth=this.node.getParent().width;
        this.ladderRecovery.getComponent("ladder_recovery").game=this;
        //创建几个node池
        this.currentLadderY=0;
        this.ladder_putongPool=new cc.NodePool();
        this.ladder_ciPool=new cc.NodePool();
        this.ladder_muPool=new cc.NodePool();
        this.ladder_zuogundongPool=new cc.NodePool();
        this.ladder_yougundongPool=new cc.NodePool();
        this.ladder_tiaoPool=new cc.NodePool();

        for(var i = 0; i < 8; i++){
            this.ladder_putongPool.put(cc.instantiate(this.ladderPutong));
        }
        for(var i = 0; i < 2; i++){
            this.ladder_ciPool.put(cc.instantiate(this.ladderCi));
        }
        for(var i = 0; i < 2; i++){
            this.ladder_muPool.put(cc.instantiate(this.ladderMu));
        }
        for(var i = 0; i < 2; i++){
            this.ladder_zuogundongPool.put(cc.instantiate(this.ladderZuogundong));
        }
        for(var i = 0; i < 2; i++){
            this.ladder_yougundongPool.put(cc.instantiate(this.ladderYougundong));
        }
        for(var i = 0; i < 2; i++){
            this.ladder_tiaoPool.put(cc.instantiate(this.ladderTiao));
        }
 
        this.newLadder(true);
        for(var i=0;i<7;i++){
            this.newLadder();
        }

    },
    
    //新的梯子
    newLadder(isFIrst){
        //cc.log("nzg===>pool中个数"+this.ladder_putongPool.size());
        this.currentLadderY-=this.ladderInterval;
        for(var i=0;i<gameConfig.difficultyLevel;i++){
            if(i<(gameConfig.difficultyLevel-1)){
                //层数小于配置的层数时
                if(difficultyConfig[i].nums>this.cengshu){              
                    this.ladderConfig=difficultyConfig[i];
                    break;
                }
            }else{
                this.ladderConfig=difficultyConfig[i];
            }
            
        }
        
        var ladder;
        var n=8-this.ladder_putongPool.size();          //屏幕上有的梯子个数
        if(n<this.ladderConfig.putong){
            ladder=this.getLadder(tagConfig.ladder_putong);
        }else{
            var arr=[];
            if((8-this.ladder_putongPool.size())<this.ladderConfig.putong){
                arr.push(tagConfig.ladder_putong);
            }
            if((2-this.ladder_ciPool.size())<this.ladderConfig.ci){
                arr.push(tagConfig.ladder_ci);
            }
            if((2-this.ladder_muPool.size())<this.ladderConfig.mu){
                arr.push(tagConfig.ladder_mu);
            }
            if((2-this.ladder_zuogundongPool.size())<this.ladderConfig.zuogundong){
                arr.push(tagConfig.ladder_zuogundong);
            }
            if((2-this.ladder_yougundongPool.size())<this.ladderConfig.yougundong){
                arr.push(tagConfig.ladder_yougundong);
            }
            if((2-this.ladder_tiaoPool.size())<this.ladderConfig.tiao){
                arr.push(tagConfig.ladder_tiao);
            }
            //从剩下的梯子中随机一个
            var n=Math.random()*arr.length*1000;
            n=Math.floor(n/1000);
            ladder=this.getLadder(arr[n]);
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

    //获取梯子
    getLadder(id){
        var ladder;
        switch(id){
            case tagConfig.ladder_putong:
                ladder=this.ladder_putongPool.get();
                break;
            case tagConfig.ladder_mu:
                ladder=this.ladder_muPool.get();
                break;
            case tagConfig.ladder_ci:
                ladder=this.ladder_ciPool.get();
                break;
            case tagConfig.ladder_tiao:
                ladder=this.ladder_tiaoPool.get();
                break;
            case tagConfig.ladder_zuogundong:
                ladder=this.ladder_zuogundongPool.get();
                break;
            case tagConfig.ladder_yougundong:
                ladder=this.ladder_yougundongPool.get();
                break;
        }
        return ladder;
    },
    update (dt) {
        this.ladderSpeed+=this.jiaSpeed*dt
        this.node.y+=dt*this.ladderSpeed;
    },
});
