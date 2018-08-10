
### script
```
<script src="//pv.sohu.com/cityjson?ie=utf-8"></script>
<script src="//lib04.xesimg.com/lib/jQuery/1.11.1/jquery.min.js"></script>
<script src="//activity.xueersi.com/topic/growth/weblog/pc/xes.md5.min.js"></script>
<script src="//activity.xueersi.com/topic/growth/weblog/pc/xes.weblog.event.min.js"></script>
```

## 公共字段
```
this.publicLogData = 'eventid=live_platformtest&userid='+ urlpar.stuId + '&liveid=' + urlpar.liveId +'&classid=' + urlpar.classId + '&teamid=' + urlpar.teamId + '&isplayback=' + urlpar.isPlayBack + '&os='+ os+ '&'

console.log('日志公共字段', this.publicLogData)
&pageuid=middletestanswer
```

##### 函数
```
// 日志公共字段生成函数
    productionLogAttr: function () {
      let urlpar = this.urlParameter
      let UserAgent = window.navigator.userAgent.toLowerCase()
      let os = ''
      // os判断
      if (UserAgent.match(/xescef/i)) {
        os = 'win'
      } else if (UserAgent.match(/xesmac/i)) {
        os = 'mac'
      } else if (UserAgent.match(/iphone/i)) {
        os = 'iphone'
      } else if (UserAgent.match(/ipad/i)) {
        os = 'ipad'
      } else if (UserAgent.match(/android/i)) {
        os = 'android'
      } else {
        os = 'other'
      }
      this.publicLogData = 'eventid=live_platformtest&pageuid=middletestanswer&userid='+ urlpar.stuId + '&liveid=' + urlpar.liveId +'&classid=' + urlpar.classId + '&teamid=' + urlpar.teamId + '&isplayback=' + urlpar.isPlayBack + '&os='+ os+ '&'
      console.log('日志公共字段', this.publicLogData)
      if (urlpar.nonce && urlpar.nonce.length > 1) {
        this.nonce = urlpar.nonce
      }
    },
```

## sno=4
```
// 交互日志，点击事件 稳定性，展现日志 sno=4
            let logData = _this.publicLogData +'sno=4&logtype=openPlatformtest&stable=1&nonce=' + _this.nonce + '&testids=' + _this.testIds
            console.log('log', logData)
            window.xesWeb_eventLog.xesEventLog('pageLoad', logData)
```


## sno=5
```
// sno=5 交卷前
      let nonce = '' + _this.urlParameter.stuId + new Date().getTime() + _this.urlParameter.packageId
      let logParam = _this.publicLogData +'sno=5&logtype=closePlatformtest&stable=1&nonce=' + nonce + '&testids=' + _this.testIds + '&clickid=confirmsubmit&isforce=' + _this.isforce
      var logData = {
        'elem': this.confirmsubmitbtn||this.$refs.submit,
        'params': logParam
      }
      console.log('log', logData)
      window.xesWeb_eventLog.xesEventLog('click', logData)
```

## sno = 6
```
// sno=6 成功提交
            _this.nonce ='' + _this.urlParameter.stuId + new Date().getTime() + _this.urlParameter.packageId
            let logData = _this.publicLogData +'sno=6&logtype=endPlatformtest&stable=1&nonce=' + _this.nonce + '&testids=' + _this.testIds
            console.log('log', logData)
            var systemData = {
              'newLogid': ''+new Date().getTime()+ _this.urlParameter.stuId,
              'systemError': 'error',
              'systemParams': logData
            }
            window.xesWeb_eventLog.xesEventLog('systemLog', systemData)
```

## sno= 7 结果页的日志
```
let logData = _this.publicLogData +'sno=7&logtype=platformtestEnd&stable=1&eventid=live_platformtest&nonce=' + _this.nonce + '&testids=' + _this.testIds +'&pageuid=XXXXX'
console.log('log', logData)
window.xesWeb_eventLog.xesEventLog('pageLoad', logData)
```


## subsno = 1
```
// 日志 一个题目加载时间 开始 subsno = 1 展现日志
          let time = new Date().getTime()
          let nonce = '' + this.urlParameter.stuId + time + testInfos[item].testId
          let logData = this.publicLogData + 'subsno=1&logtype=loadOnePlatformtest&testid=' + testInfos[item].testId + '&nonce='+nonce + '&time='+ time
          console.log('log', logData)
          window.xesWeb_eventLog.xesEventLog('pageLoad', logData)
```

## subsno = 2
```
// subsno=2
          let time = new Date().getTime()
          let nonce = '' + this.urlParameter.stuId + time + testInfos[item].testId
          let logData = this.publicLogData + 'subsno=2&logtype=loadOnePlatformtestOk&testid=' + testInfos[item].testId + '&nonce='+nonce + '&time='+ time
          console.log('log', logData)
          window.xesWeb_eventLog.xesEventLog('pageLoad', logData)
```

## 点击
### 继续作答按钮
```
let logParam = this.publicLogData + 'clickid=confirmcontinue'
      let logData = {
        'elem': this.$refs.confirmcontinue,
        'params': logParam
      }
      console.log('log', logData)
      window.xesWeb_eventLog.xesEventLog('click', logData)
```
### 提交答案
```
let logParam = _this.publicLogData + 'clickid=confirmsubmit'
      let logData = {
        'elem': _this.$refs.confirmsubmit,
        'params': logParam
      }
      console.log('log', logData)
      window.xesWeb_eventLog.xesEventLog('click', logData)
```

### 取消按钮
```
let logParam = this.publicLogData + 'clickid=cancelsubmit'
      let logData = {
        'elem': this.$refs.cancelsubmit,
        'params': logParam
      }
      console.log('log', logData)
      window.xesWeb_eventLog.xesEventLog('click', logData)
```

### 交卷按钮
```
// 点击日志
      let logParam = this.publicLogData + 'clickid=submit'
      let logData = {
        'elem': this.$refs.submit,
        'params': logParam
      }
      console.log('log', logData)
      window.xesWeb_eventLog.xesEventLog('click', logData)

```

### 下一题按钮
```
// 点击日志
      let logParam = this.publicLogData + 'clickid=nextqst'
      let logData = {
        'elem': this.$refs.nextqst,
        'params': logParam
      }
      console.log('log', logData)
      window.xesWeb_eventLog.xesEventLog('click', logData)
```

### 上一题按钮
```
// 点击日志
      let logParam = this.publicLogData + 'clickid=preqst'
      let logData = {
        'elem': this.$refs.preqst,
        'params': logParam
      }
      console.log('log', logData)
      window.xesWeb_eventLog.xesEventLog('click', logData)
```