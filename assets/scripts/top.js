// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        hero_head:{
            default:null,
            type:cc.Sprite
        },
        probar:{
            default:null,
            type:cc.ProgressBar
        },
        cur_ladder:{default:null,type:cc.Label},
        max_ladder:{default:null,type:cc.Label},
        iconNums:3,
    },

    onLoad () {
        this.leaveIcon=this.iconNums;
    },

    start () {

    },

    //设置当前层数
    setCengshu(num){
        this.cur_ladder.string=num;
    },

    //设置进度条
    setProBar(leaveIcon){
        this.probar.progress=leaveIcon/this.iconNums;
    },
    // update (dt) {},
});
