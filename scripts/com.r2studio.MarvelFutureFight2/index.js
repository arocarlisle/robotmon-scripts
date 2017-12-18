function RBM(t){void 0==t&&(t=DEFAULT_CONFIG),this.appName=t.appName||DEFAULT_CONFIG.appName,this.oriScreenWidth=t.oriScreenWidth||DEFAULT_CONFIG.oriScreenWidth,this.oriScreenHeight=t.oriScreenHeight||DEFAULT_CONFIG.oriScreenHeight,this.oriVirtualButtonHeight=t.oriVirtualButtonHeight||DEFAULT_CONFIG.oriVirtualButtonHeight,this.oriAppWidth=this.oriScreenWidth,this.oriAppHeight=this.oriScreenHeight-this.oriVirtualButtonHeight,this.oriResizeFactor=t.oriResizeFactor||DEFAULT_CONFIG.oriResizeFactor,this.resizeFactor=t.resizeFactor||DEFAULT_CONFIG.resizeFactor,this.imageThreshold=t.imageThreshold||DEFAULT_CONFIG.imageThreshold,this.imageQuality=t.imageQuality||DEFAULT_CONFIG.imageQuality,this.screenWidth=0,this.screenHeight=0,this.resizeScreenWidth=0,this.resizeScreenHeight=0,this.appWidth=0,this.appHeight=0,this.appMinRatio=1,this.appMaxRatio=1,this.researchTimes=5,this.virtualButtonHeight=0,this.ip="",this.during=t.eventDelay||DEFAULT_CONFIG.eventDelay,this.running=!0,this.isPartial=!1,this.partialOffsetXY={x:0,y:0},this._screenshotImg=0}var DEFAULT_CONFIG={appName:"testApp",oriScreenWidth:1080,oriScreenHeight:1920,oriVirtualButtonHeight:0,oriResizeFactor:.4,eventDelay:200,imageThreshold:.85,imageQuality:80,resizeFactor:.4};RBM.prototype.init=function(){var t=getScreenSize();this.screenWidth=t.width,this.screenHeight=t.height,this.virtualButtonHeight=getVirtualButtonHeight(),this.appWidth=this.screenWidth,0!==this.oriVirtualButtonHeight?this.appHeight=this.screenHeight-this.virtualButtonHeight:this.appHeight=this.screenHeight,this.resizeAppWidth=this.appWidth*this.resizeFactor,this.resizeAppHeight=this.appHeight*this.resizeFactor;var i=this.appWidth/this.oriAppWidth,e=this.appHeight/this.oriAppHeight;this.appMinRatio=Math.min(i,e),this.appMaxRatio=Math.max(i,e)},RBM.prototype.log=function(){sleep(10);for(var t=0;t<arguments.length;t++)"object"==typeof arguments[t]&&(arguments[t]=JSON.stringify(arguments[t]));console.log.apply(console,arguments)},RBM.prototype.mappingImageWHs=function(t){var i=[];if(this.appMinRatio===this.appMaxRatio)i.push({width:t.width*this.appMinRatio,height:t.height*this.appMinRatio});else for(var e=(this.appMaxRatio-this.appMinRatio)/this.researchTimes,h=this.appMinRatio;h<=this.appMaxRatio;h+=e)i.push({width:t.width*h,height:t.height*h});return i},RBM.prototype.mappingXY=function(t){var i=Math.round(t.x*this.appWidth/this.oriAppWidth),e=Math.round(t.y*this.appHeight/this.oriAppHeight);return{x:i,y:e}},RBM.prototype.getImagePath=function(){return getStoragePath()+"/scripts/"+this.appName+"/images"},RBM.prototype.startApp=function(t,i){void 0===i?execute("monkey -p "+t+" -c android.intent.category.LAUNCHER 1"):execute("am start -n "+t+"/"+i)},RBM.prototype.stopApp=function(t){execute("am force-stop "+t)},RBM.prototype.currentApp=function(){var t=execute("dumpsys activity activities").split("mFocusedActivity")[1].split(" ")[3].split("/"),i=t[0],e=t[1];return{packageName:i,activityName:e}},RBM.prototype.click=function(t){t=this.mappingXY(t),tap(t.x,t.y,this.during)},RBM.prototype.tapDown=function(t){t=this.mappingXY(t),tapDown(t.x,t.y,this.during)},RBM.prototype.moveTo=function(t){t=this.mappingXY(t),moveTo(t.x,t.y,this.during)},RBM.prototype.tapUp=function(t){t=this.mappingXY(t),tapUp(t.x,t.y,this.during)},RBM.prototype.swipe=function(t,i,e){void 0===e&&(e=5),t=this.mappingXY(t),i=this.mappingXY(i);var h=this.during/(e+2),s=(i.x-t.x)/e,a=(i.y-t.y)/e;tapDown(t.x,t.y,h);for(var r=0;e>=r;r++)moveTo(t.x+r*s,t.y+r*a,h);tapUp(i.x,i.y,h)},RBM.prototype.screenshot=function(t){var i=this.getImagePath()+"/"+t,e=getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality);saveImage(e,i),releaseImage(e)},RBM.prototype.oriScreencrop=function(t,i,e,h,s){var a=this.getImagePath()+"/"+t,r=Math.abs(h-i),o=Math.abs(s-e),p=getScreenshotModify(Math.min(i,h),Math.min(e,s),r,o,r*this.oriResizeFactor,o*this.oriResizeFactor,this.imageQuality);saveImage(p,a),releaseImage(p)},RBM.prototype.screencrop=function(t,i,e,h,s){var a=this.getImagePath()+"/"+t,r=this.mappingXY({x:i,y:e}),o=this.mappingXY({x:h,y:s}),p=Math.abs(o.x-r.x),n=Math.abs(o.y-r.y),g=getScreenshotModify(Math.min(r.x,o.x),Math.min(r.y,o.y),p,n,p*this.resizeFactor,n*this.resizeFactor,this.imageQuality);saveImage(g,a),releaseImage(g)},RBM.prototype.findImage=function(t,i){void 0===i&&(i=this.imageThreshold);var e=0;e=0!=this._screenshotImg?this._screenshotImg:getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality);var h=this.getImagePath()+"/"+t,s=openImage(h);if(0===s)return this.log("Image is not found: ",h),void(e!=this._screenshotImg&&releaseImage(e));var a=getImageSize(s);a.width*=this.resizeFactor/this.oriResizeFactor,a.height*=this.resizeFactor/this.oriResizeFactor;for(var r=this.mappingImageWHs(a),o=void 0,p=0;p<r.length;p++){var n=r[p],g=resizeImage(s,n.width,n.height);if(o=findImage(e,g),o.width=n.width,o.height=n.height,releaseImage(g),o.score>=i)break;o=void 0}return releaseImage(s),e!=this._screenshotImg&&releaseImage(e),void 0!==o&&(o.x=this.partialOffsetXY.x+o.x*(this.appWidth/this.resizeAppWidth),o.y=this.partialOffsetXY.y+o.y*(this.appHeight/this.resizeAppHeight),o.width*=this.appWidth/this.resizeAppWidth,o.height*=this.appWidth/this.resizeAppWidth),o},RBM.prototype.findImages=function(t,i,e,h,s){void 0===i&&(i=this.imageThreshold);var a=0;a=0!=this._screenshotImg?this._screenshotImg:getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality);var r=this.getImagePath()+"/"+t,o=openImage(r);if(0===o)return this.log("Image is not found: ",r),a!=this._screenshotImg&&releaseImage(a),[];var p=getImageSize(o);p.width*=this.resizeFactor/this.oriResizeFactor,p.height*=this.resizeFactor/this.oriResizeFactor;for(var n=this.mappingImageWHs(p),g=[],c=0;c<n.length;c++){var m=n[c],d=resizeImage(o,m.width,m.height),u=findImages(a,d,i,e,!h);releaseImage(d);for(var y in u)g.push({x:u[y].x,y:u[y].y,width:m.width,height:m.height,score:u[y].score});if(g.length>=e)break;if(!s&&g.length>0)break}releaseImage(o),a!=this._screenshotImg&&releaseImage(a);for(var c in g)g[c].x=this.partialOffsetXY.x+g[c].x*(this.appWidth/this.resizeAppWidth),g[c].y=this.partialOffsetXY.y+g[c].y*(this.appHeight/this.resizeAppHeight),g[c].width*=this.appWidth/this.resizeAppWidth,g[c].height*=this.appWidth/this.resizeAppWidth;return g},RBM.prototype.imageExists=function(t,i){var e=this.findImage(t,i);return void 0===e?!1:!0},RBM.prototype.imageClick=function(t,i){var e=this.findImage(t,i);if(void 0===e)return!1;var h=e.x+e.width/2,s=e.y+e.height/2;return tap(h,s,this.during),!0},RBM.prototype.imageWaitClick=function(t,i,e){void 0===i&&(i=1e4);for(var h=Date.now();this.running;){var s=this.findImage(t,e);if(void 0!==s){var a=s.x+s.width/2,r=s.y+s.height/2;return tap(a,r,this.during),!0}if(sleep(3*this.during),Date.now()-h>i)return!1}},RBM.prototype.imageWaitShow=function(t,i,e){void 0===i&&(i=1e4);for(var h=Date.now();this.running;){var s=this.findImage(t,e);if(void 0!==s)break;if(sleep(3*this.during),Date.now()-h>i)break}},RBM.prototype.imageWaitGone=function(t,i,e){void 0===i&&(i=1e4);for(var h=Date.now();this.running;){var s=this.findImage(t,e);if(void 0===s)break;if(sleep(3*this.during),Date.now()-h>i)break}},RBM.prototype.keepScreenshot=function(){0!=this._screenshotImg&&(releaseImage(this._screenshotImg),this._screenshotImg=0),this._screenshotImg=getScreenshotModify(0,0,this.appWidth,this.appHeight,this.resizeAppWidth,this.resizeAppHeight,this.imageQuality)},RBM.prototype.keepScreenshotPartial=function(t,i,e,h){0!=this._screenshotImg&&(releaseImage(this._screenshotImg),this._screenshotImg=0);var s=this.mappingXY({x:t,y:i}),a=this.mappingXY({x:e,y:h}),r=Math.abs(a.x-s.x),o=Math.abs(a.y-s.y);this._screenshotImg=getScreenshotModify(Math.min(s.x,a.x),Math.min(s.y,a.y),r,o,r*this.resizeFactor,o*this.resizeFactor,this.imageQuality),this.isPartial=!0,this.partialOffsetXY={x:Math.min(s.x,a.x),y:Math.min(s.y,a.y)}},RBM.prototype.releaseScreenshot=function(){0!=this._screenshotImg&&(releaseImage(this._screenshotImg),this._screenshotImg=0),this.isPartial=!1,this.partialOffsetXY={x:0,y:0}},RBM.prototype.typing=function(t){typing(t,this.during)},RBM.prototype.keycode=function(t){keycode(t,this.during)},RBM.prototype.sleep=function(){sleep(this.during)};
function Task(f) { this.isRunning = false; this.f = f; }
Task.prototype.start = function() { this.isRunning = true; this.f(this); }
Task.prototype.stop = function() { this.isRunning = false; }
function log(message) { console.log(tag + " " + message); }
function bindLog(result, message, successMsg) { log(message); if (result) log(successMsg ? successMsg : "### success ###"); return result; }

var Config = {
  appName: 'com.r2studio.MarvelFutureFight2',
  oriScreenWidth: 1920,
  oriScreenHeight: 1080,
  oriResizeFactor: 1,
  resizeFactor: 1,
  imageThreshold: 0.95,
};

function MarvelFutureFight() {}

MarvelFutureFight.prototype.runAutoMission = function(task) {
  tag = "[MMFS][Mission]";
  log("start task");

  while (task.isRunning) {
    log("keep screen");
    rbm.keepScreenshot();

    // try replay
    if (!rbm.imageClick("replay.1920x1080.png", "try to replay")) {
      // still available?
      if (rbm.imageExists("not_available.1920x1080.png", "check biomatric", "not available")) {
        sleep(30000);
      }
      // mission start
      else if (rbm.imageClick("start.1920x1080.png", "try to start")) {
        sleep(2000);
        log("free screen");
        rbm.releaseScreenshot();
        log("keep screen");
        rbm.keepScreenshot();
        rbm.imageClick("yes_green.1920x1080.png", "click green yes");
        sleep(60000);
      }
      // timeline start
      else if (rbm.imageClick("fight.1920x1080.png", "try to fight timeline")) {
        sleep(90000);
      }
    }
    // wait and play again
    log("free screen");
    rbm.releaseScreenshot();
    sleep(5000);
  }
  log("stop task");
}

MarvelFutureFight.prototype.runAutoCowork = function(task) {
  tag = "[MMFS][Co-Op]";
  log("start task");
  
  while (task.isRunning) {
    log("keep screen");
    rbm.keepScreenshot();

    // try next
    if (rbm.imageClick("next.1920x1080.png", "try to next")) {
      sleep(10000);
    }
    // enter the lobby
    else if (rbm.imageExists("lobby.1920x1080.png", "check at lobby")) {
      sleep(1000);
      log("free screen");
      rbm.releaseScreenshot();
      // get awards
      if (rbm.imageClick("get_award.1920x1080.png", "try to get awards")) {
        sleep(2000);
        rbm.imageClick("fetch.1920x1080.png", "fetch");
        sleep(10000);
        rbm.imageClick("yes.1920x1080.png", "click blue yes");
      }
      // choose a hero and start
      else {
        log("choose a hero");
        rbm.click({ x: 118, y: 900 });
        sleep(1000);
        rbm.imageClick("match_start.1920x1080.png", "Start to match");
        sleep(30000);
      }
    }
    // wait and play again
    log("free screen");
    rbm.releaseScreenshot();
    sleep(5000);
  }
  log("stop task");
}

var rbm = new RBM(Config);
var mff = new MarvelFutureFight();
var currentTask;

// events
function start(script) {
  var oriImageClick = rbm.imageClick.bind(rbm);
  var oriImageExists = rbm.imageExists.bind(rbm);
  // var oriImageWaitClick = rbm.imageWaitClick.bind(rbm);
  rbm.imageClick = function(filename, message) { return bindLog(oriImageClick(filename), message); }
  rbm.imageExists = function(filename, message) { return bindLog(oriImageExists(filename), message); }
  // rbm.imageWaitClick = function(filename, timeout, message) { return bindLog(oriImageWaitClick(filename, timeout), message); }
  rbm.init();

  tag = "[MMFS]";
  log("START");

  switch (script) {
    case "autoMission":
      currentTask = new Task(mff.runAutoMission.bind(mff));
      break;
    case "autoCowork":
      currentTask = new Task(mff.runAutoCowork.bind(mff));
      break;
  }
  currentTask.start();
};

function stop() {
  tag = "[MMFS]";
  log("STOP");

  rbm.running = false;
  currentTask.stop();
}

// debug
// start("autoMission")
