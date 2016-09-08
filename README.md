## 使用步骤

1.  npm install
2.  ionic state restore
3.  ionic platform add android
4.  ionic build

## Cordova 插件

*   cordova plugin add cordova-plugin-device
*   cordova plugin add cordova-plugin-console
*   cordova plugin add cordova-plugin-whitelist
*   cordova plugin add cordova-plugin-splashscreen
*   cordova plugin add cordova-plugin-statusbar
*   cordova plugin add ionic-plugin-keyboard
*   cordova plugin add cordova-plugin-app-version
*   cordova plugin add cordova-plugin-file
*   cordova plugin add cordova-plugin-file-transfer
*   cordova plugin add cordova-plugin-file-opener2
*   cordova plugin add cordova-plugin-network-information

## AngularJS Cordova插件

### [ngCordova](http://ngcordova.com/)

## 相关代码，app.js
``` javascript
    // Android升级
    function checkUpdate() {
      document.addEventListener("deviceready", function () {

        var type = $cordovaNetwork.getNetwork();

        // 1.0.0 => 10000
        var AppVersionCode = '10000';  // 获取的服务器版本

        //获取本地APP版本
        $cordovaAppVersion.getVersionNumber().then(function (version) {
          // 0.0.1 => 00001 => 1
          var nowVersionNum = parseInt(version.toString().replace(new RegExp(/(\.)/g), '0'));
          // 10000
          var newVersionNum = parseInt(AppVersionCode);

          if (newVersionNum > nowVersionNum) {
            if (type === 'wifi') {
              $ionicPopup.confirm({
                title: '版本升级',
                template: '版本升级详细内容,你现在下载的是QQ',
                cancelText: '取消',
                okText: '升级'
              }).then(function (res) {
                if (res) {
                  UpdateForAndroid();
                }
              });
            } else {
              $ionicPopup.confirm({
                title: '建议您在WIFI条件下进行升级，是否确认升级？',
                template: '版本升级详细内容,你现在下载的是QQ',
                cancelText: '取消',
                okText: '升级'
              }).then(function (res) {
                if (res) {
                  UpdateForAndroid();
                }
              });
            }
          }
        });

        // 无网络时
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {

          $ionicLoading.show({
            template: '网络异常，不能连接到服务器！'
          });

          $timeout(function () {
            $ionicLoading.hide()
          }, 2000);
        })
      }, false);
    }

    function UpdateForAndroid() {
      $ionicLoading.show({
        template: "已经下载：0%"
      });
      var url = 'https://qd.myapp.com/myapp/qqteam/AndroidQQ/mobileqq_android.apk'; // 下载地址
      var targetPath = "/sdcard/Download/ionic.apk";
      var trustHosts = true;
      var options = {};
      $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
        $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
        ).then(function () {
          // 成功
        }, function (err) {
          console.log(err);
        });
        $ionicLoading.hide();
      }, function (err) {
        $ionicLoading.show({
          template: "下载失败"
        });
        $ionicLoading.hide();
      }, function (progress) {
        $timeout(function () {
          var downloadProgress = (progress.loaded / progress.total) * 100;
          $ionicLoading.show({
            template: "已经下载：" + Math.floor(downloadProgress) + "%"
          });
          if (downloadProgress > 99) {
            $ionicLoading.hide();
          }
        });
      });
    }
```
上面是一个简单实现方式，可以优化代码，一些数据都在这里写死了，你可以将一些数据从服务端获取，比如最新版本号，最新版的下载路径，这里提供一个思路。