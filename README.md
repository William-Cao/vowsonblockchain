# vowsonblockchain

[vowsonblockchain](http://vowsonblockchain.xyz/app)

本项目基于[blockChainWords](https://github.com/flute/blockChainWords)开发

## 说明

基于以太坊区块链上的永存的留言DAPP

* 使用solidity开发
* 基于truffle框架
* 使用 `truffle unbox react` 脚手架
* 部署在以太坊测试网络 `Ropoetn Test Network`

## 使用

1. 浏览安装 matemask 钱包的扩展程序，创建钱包
2. 切换至 `Ropoetn Test Network` 测试网络，没有币的[点这里申请eth](https://faucet.metamask.io/)
3. 账户中有代币后，输入留言，点击确认后等待写入即可

## 本地安装使用

环境： nodejs、truffle

1. 下载至本地
2. 执行 `npm i` 安装依赖
3. 部署合约，不部署也可以使用（使用我已经部署的合约），不部署合约直接跳至第5步
4. 终端当前目录下，`truffle compile`编译合约，接着部署合约，自行选择部署方式
5. 合约部署完成后，得到合约地址，修改`src/App.js`中的合约地址`contractAddress`
6. 终端当前目录下`npm start`启动前端
7. 浏览器`localhost:3000`端口即可查看

### 可能存在的问题

在`linux`下运行项目，如果报错`react-magic`及`aphrodite`未找到，安装即可：

`npm i react-magic aphrodite`

请勿使用 `cnpm || yarn` 安装依赖
请勿修改 `package-lock.json`
