var MainLayer=cc.Layer.extend({
    timeLabel:null,
    timeCount:10,
    hand:null,
    hbArr:[],
    score:0,
    ctor:function(){
        this._super();
        var size=cc.winSize;
        //添加背景
        this.addBg(size);
        //倒计时
        this.addCountDown(size);
        //开启计时器
        this.schedule(this.countDownFun,1);
        //手动帧动画
        this.addHand(size);
        //添加点击滑动
        this.addTouchListener();
        //红包数组
        this.addHongBao(size);
        //
        this.scheduleUpdate(this.update);
        return true;
    },

    addBg:function(size){
        var bg=new cc.Sprite(res.Bg_jpg);
        bg.setPosition(size.width*0.5,size.height*0.5);
        this.addChild(bg);
    },
    addCountDown:function(size){
        //倒计时图标
        var countDown=new cc.Sprite(res.CountDown_png);
        countDown.setPosition(size.width*0.7,size.height-countDown.getBoundingBox().height)
        this.addChild(countDown);

        //倒计时内容值
        this.timeLabel=new cc.LabelTTF("","",size.width*0.1);
        this.timeLabel.setPosition(countDown.x+countDown.getBoundingBox().width*0.8,countDown.y);
        this.timeLabel.setString(10);
        this.timeLabel.setColor(cc.color(200,100,100));
        this.addChild(this.timeLabel);

    },

    countDownFun:function () {
        if(this.timeCount<1){
            cc.sys.localStorage.setItem("currentScore",this.score);
            cc.director.runScene(new OverScene());
        }else{
            this.timeCount-=1;
            this.timeLabel.setString(this.timeCount);
        }
    },
    addHand:function (size) {
        this.hand=new cc.Sprite(res.Hand_1_png);
        this.hand.setPosition(size.width*0.5,this.hand.getBoundingBox().height);
        this.addChild(this.hand);

        var animation=new cc.Animation();
        for(var i=1;i<=2;i++){
            var frameName=res["Hand_"+i+"_png"];
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(0.2);
        animation.setRestoreOriginalFrame(true);
        var animate=new cc.Animate(animation);
        this.hand.runAction(animate.repeatForever());
    },
    addTouchListener:function () {
        var that=this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function (touch,event) {
                // var location=touch.getLocation();
                return true;
            },
            onTouchMoved:function (touch,event) {
                var delta=touch.getDelta();
                that.hand.setPositionX(that.hand.x+delta.x);
                if(that.hand.x<that.hand.getBoundingBox().width*0.5){
                    that.hand.x=that.hand.getBoundingBox().width*0.5;
                }
            }
        },this);
    },
    addHongBao:function (size) {
        for(var i=0;i<100;i++){
            var hb=new cc.Sprite(res.Hongbao_png);
            hb.setPosition(Math.random()*size.width,size.height*(cc.random0To1()*i+1));
            hb.runAction(cc.repeatForever(cc.rotateBy(cc.random0To1()*5,360)));
            this.addChild(hb);
            this.hbArr.push(hb);
        }

    },
    update:function () {
       for(var k in this.hbArr){
           this.hbArr[k].y-=10;
       }
       for(var i=0;i<this.hbArr.length;i++){
           if(cc.rectContainsPoint(this.hbArr[i].getBoundingBox(),this.hand.getPosition())){
               this.hbArr[i].removeFromParent();
               // this.addScoreAnimation(this.hbArr[i].getPosition());
               this.hbArr.splice(i,1);
               this.score++;
           }
       }
    }

});


var MainScene= cc.Scene.extend({
    ctor:function () {
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});