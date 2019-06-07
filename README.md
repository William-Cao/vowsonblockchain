# blockChainMessage

blockChainMessage

## 案例

 本项目基于[blockChainWords](https://github.com/flute/blockChainWords)开发

### 说明

基于以太坊区块链上的永存的留言DAPP

* 使用solidity开发
* 基于truffle框架
* 使用 `truffle unbox react` 脚手架
* 部署在以太坊测试网络 `Ropoetn Test Network` 上（没有部署在主网，不是我看不起诸位，是我没币部署😭 ）

### 使用

1. 浏览安装 matemask 钱包的扩展程序，创建钱包
2. 切换至 `Ropoetn Test Network` 测试网络，没有币的[点这里申请eth](https://faucet.metamask.io/)
3. 账户中有代币后，输入留言，点击确认后等待写入即可。

### 本地安装使用

环境： nodejs、[truffle](https://www.ldsun.com/2018/02/07/solidityhan-shu-lei-xing-ji-truffleshi-yong/)

1. 下载代码至本地
2. 进入工程目录，执行 `npm i` 安装依赖
3. 启动truffle开发环境（需要确保已经安装truffle 0.5.0版本，npm install truffle -g）
   - 启动命令：truffle develop
   - 编译部署合约：migrate --reset

4. 终端当前目录下`npm start`启动前端

5. 浏览器`localhost:3000`端口即可查看
### 线上部署

### 可能存在的问题

在`linux`下运行项目，如果报错`react-magic`及`aphrodite`未找到，安装即可：

`npm i react-magic aphrodite`
