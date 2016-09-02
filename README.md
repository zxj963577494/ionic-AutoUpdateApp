## 准备工作
### Cordova插件：
#### cordova plugin add https://github.com/whiteoctober/cordova-plugin-app-version.git  // 获取APP版本
#### cordova plugin add org.apache.cordova.file // 文件系统
#### cordova plugin add org.apache.cordova.file-transfer //文件传输系统
####cordova plugin add https://github.com/pwlin/cordova-plugin-file-opener2 //文件打开系统

## AngularJS Cordova插件
####ngCordova

## 相关代码，app.js
``` javascript
.run(['$ionicPlatform', '$rootScope','$ionicActionSheet', '$timeout','$cordovaAppVersion', '$ionicPopup', '$ionicLoading','$cordovaFileTransfer', '$cordovaFile', '$cordovaFileOpener2', function ($ionicPlatform, $rootScope,$ionicActionSheet, $timeout,  $cordovaAppVersion, $ionicPopup, $ionicLoading, $cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2) {
        $ionicPlatform.ready(function ($rootScope) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            //检测更新
            checkUpdate();

            document.addEventListener("menubutton", onHardwareMenuKeyDown, false);
        });


        // 菜单键
        function onHardwareMenuKeyDown() {
            $ionicActionSheet.show({
                titleText: '检查更新',
                buttons: [
                    { text: '关于' }
                ],
                destructiveText: '检查更新',
                cancelText: '取消',
                cancel: function () {
                    // add cancel code..
                },
                destructiveButtonClicked: function () {
                    //检查更新
                    checkUpdate();
                },
                buttonClicked: function (index) {

                }
            });
            $timeout(function () {
                hideSheet();
            }, 2000);
        };

        // 检查更新
        function checkUpdate() {
            var serverAppVersion = "1.0.0"; //从服务端获取最新版本
            //获取版本
            $cordovaAppVersion.getAppVersion().then(function (version) {
                //如果本地于服务端的APP版本不符合
                if (version != serverAppVersion) {
                    showUpdateConfirm();
                }
            });
        }

        // 显示是否更新对话框
        function showUpdateConfirm() {
            var confirmPopup = $ionicPopup.confirm({
                title: '版本升级',
                template: '1.xxxx;</br>2.xxxxxx;</br>3.xxxxxx;</br>4.xxxxxx', //从服务端获取更新的内容
                cancelText: '取消',
                okText: '升级'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $ionicLoading.show({
                        template: "已经下载：0%"
                    });
                    var url = "http://192.168.1.50/1.apk"; //可以从服务端获取更新APP的路径
                    var targetPath = "file:///storage/sdcard0/Download/1.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
                    var trustHosts = true
                    var options = {};
                    $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                        // 打开下载下来的APP
                        $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                        ).then(function () {
                                // 成功
                            }, function (err) {
                                // 错误
                            });
                        $ionicLoading.hide();
                    }, function (err) {
                        alert('下载失败');
                    }, function (progress) {
                        //进度，这里使用文字显示下载百分比
                        $timeout(function () {
                            var downloadProgress = (progress.loaded / progress.total) * 100;
                            $ionicLoading.show({
                                template: "已经下载：" + Math.floor(downloadProgress) + "%"
                            });
                            if (downloadProgress > 99) {
                                $ionicLoading.hide();
                            }
                        })
                    });
                } else {
                    // 取消更新
                }
            });
        }
    }])  
```
上面是一个简单实现方式，可以优化代码，一些数据都在这里写死了，你可以将一些数据从服务端获取，比如最新版本号，最新版的下载路径，这里提供一个思路。
