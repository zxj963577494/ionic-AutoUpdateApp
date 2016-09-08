// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

  .run(['$ionicPlatform', function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  }])

  .controller('myCtrl', ['$timeout', '$rootScope', '$scope', '$cordovaAppVersion', '$cordovaNetwork', '$ionicPopup', '$ionicLoading', '$cordovaFileTransfer', '$cordovaFileOpener2', function ($timeout, $rootScope, $scope, $cordovaAppVersion, $cordovaNetwork, $ionicPopup, $ionicLoading, $cordovaFileTransfer, $cordovaFileOpener2) {

    $scope.update = function () {
      checkUpdate();
    }

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
  }])