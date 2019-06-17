import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
// animate
import { StyleSheet, css } from 'aphrodite';
import { spaceInLeft, spaceOutRight } from 'react-magic';
// import html2canvas from 'html2canvas'
// import Canvas2Image from 'canvas2image'
import domtoimage from 'dom-to-image';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "random",
        "type": "uint256"
      }
    ],
    "name": "getRandomWord",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getMessageCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "s",
        "type": "string"
      },
      {
        "name": "t",
        "type": "string"
      }
    ],
    "name": "setWord",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
let mycontract;


// animate style
const styles = StyleSheet.create({
  in: {
    animationName: spaceInLeft,
    animationDuration: '13s'
  },
  out: {
    animationName: spaceOutRight,
    animationDuration: '13s'
  }
});

const contractAddress = "0x95e22f0f683f42bfbba37746b300e41d3ff6d083" // 合约地址
var simpleStorageInstance // 合约实例


class Mobile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      word: null,
      lastTenWords: [],
      from: null,
      timestamp: null,
      random: 0,
      count: 0,
      input: '',
      web3: null,
      emptyTip: "还没有留言，快来创建全世界第一条留言吧~",
      firstTimeLoad: true,
      loading: false,
      loadingTip: "留言写入所需时间不等（10s~5min），请耐心等待~",
      waitingTip: "留言写入所需时间不等（10s~5min），请耐心等待~",
      successTip: "留言成功",
      animate: "",
      in: css(styles.in),
      out: css(styles.out),
      textarea: '',
      submitFlag: false,
      myDate: '',
      // blockHash: '',
      transactionHash: '',
      blockNumber: '',
      alertBox: false,
      imgDom: false
    }
  }

  componentWillMount () {
    this.getMyDate()
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })
        //使用原生api构造合约实例
        console.log('provider :', this.state.web3.currentProvider);
        mycontract = new results.web3.eth.Contract(abi, contractAddress);
        console.log('mycontract :', mycontract);

        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContract () {
    const that = this
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.at(contractAddress).then(instance => {
        simpleStorageInstance = instance
        //console.log("合约实例获取成功")
      })
        .then(result => {
          return simpleStorageInstance.getRandomWord(this.state.random)
        })
        .then(result => {
          //console.log("读取成功", result)
          if (result[1] !== this.setState.word) {
            this.setState({
              animate: this.state.out
            })
            setTimeout(() => {
              that.setState({
                count: result[0].c[0],
                word: result[1],
                from: result[2],
                timestamp: result[3],
                animate: this.state.in,
                firstTimeLoad: false
              })
            }, 2000)
          } else {
            this.setState({
              firstTimeLoad: false
            })
          }
          // this.randerWord()
        })

    })
  }

  render () {
    return (
      <div className="mobileContainer" id="mobileContainer">
        <div id="userNameWrap">
          <div className="mobileTitleLogo">
            <img alt="" src={require("../public/loading/logo.png")} />
          </div>
          {
            (!this.state.submitFlag ?
              <div>
                <div className="inputContent">
                  <input placeholder="  请输入您的姓名...Your name..." className="inputWord" type="text" value={this.state.input} onChange={e => this.inputWord(e)} />
                  <textarea placeholder="  请输入您的誓言...Your vow..." className="inputTextArea" value={this.state.textarea} onChange={e => this.inputTextarea(e)}></textarea>
                </div>
                <div onClick={() => this.clickBtn(1)} className="submitBtn">提交Submit</div>
              </div>
              :
              <div className="userInputWrap">
                <div className="userNameWrap">
                  <div className="userNameText">{this.state.input}</div>
                  {/* <div className="txHash">Hash: {this.state.blockHash}</div> */}
                  <div className="txHash">Transaction Hash: {this.state.transactionHash}</div>
                  {/* input 用来复制到剪切板 */}
                  <input id="transactionHash" style={{ display: 'none' }} defaultValue={this.state.transactionHash}></input>
                  <div className="blockNum">Block Number: {this.state.blockNumber}</div>
                  <div className="vowWrap">
                    <div className="vowText">
                      Vow: {this.state.textarea}
                    </div>
                    <div className="vowDate">{this.state.myDate}</div>
                    <img alt="" className="stampPic" src={require("../public/loading/group.png")} />
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <div className={this.state.alertBox ? "loading show" : "loading"}>
          <img alt="" src={require("../public/loading/loading-bubbles.svg")} width="128" height="128" />
          <div className="loading-text">警示：请确认您的誓言，一旦写入永久保存、不可逆、无法篡改。</div>
          <div className="loading-text"> WARN !</div>
          <div className="loading-btn">
            <div onClick={() => this.setWord()} className="submitBtn">确定</div>
            <div onClick={() => this.clickBtn(0)} className="submitBtn">取消</div>
          </div>
        </div>
        <div className={this.state.loading ? "loading show" : "loading"}>
          <img alt="" src={require("../public/loading/loading-bubbles.svg")} width="128" height="128" />
          <div className="loading-text">留言写入区块链时间不等(10s~5min)，请耐心等待区块链写入...</div>
          <div className="loading-text"> Don’t close the page，please waiting…</div>
        </div>

        {
          (!this.state.submitFlag ? null :
            <div>
              <div onClick={() => this.savePic()} className="submitBtn savePicBtn">点击后下拉保存Save</div>
              {/* <div>{this.state.transactionHash}</div> */}
              <div onClick={() => this.jumpSite()} className="submitBtn savePicBtn">点击复制hash值跳转查询交易</div>
            </div>
          )
        }
      </div>

    )
  }
  savePic () {
    this.convert2canvas()
  }

  inputWord (e) {
    this.setState({
      input: e.target.value
    })
  }
  inputTextarea (e) {
    if (e.target.value.length > 200) {
      this.setState({
        textarea: this.state.textarea
      })
    } else {
      this.setState({
        textarea: e.target.value
      })
    }

  }
  jumpSite () {
    console.log(this.state.transactionHash)
    let txt = document.getElementById("transactionHash");
    // 选择对象
    txt.select();
    // 执行浏览器复制命令
    document.execCommand('copy');
    let dada = document.execCommand('copy');
    console.log(dada)
    // return
    window.open('https://ropsten.etherscan.io/')
  }
  clickBtn (type) {
    if (!this.state.input || !this.state.textarea) return
    if (type) {
      this.setState({
        alertBox: true
      })
    } else {
      this.setState({
        alertBox: false
      })
    }
  }

  // 写入区块链
  async setWord () {
    if (!this.state.input || !this.state.textarea) return
    this.setState({
      alertBox: false
    })
    // return
    const that = this
    this.setState({
      loading: true
    })
    let timestamp = new Date().getTime()
    let accounts = await this.state.web3.eth.getAccounts();
    // let account0 = '0x22c57F0537414FD95b9f0f08f1E51d8b96F14029';
    const currentAccount = accounts[0];
    console.log('account 0 :', currentAccount);
    console.log('simpleStorageInstance:', simpleStorageInstance);
    this.setState({
      myDate: this.getMyDate()
    })
    let message = `${this.state.input}&%^${this.state.textarea}&%^${this.state.myDate}`
    console.log('message', message)
    try {
      // let result = await simpleStorageInstance.setWord(this.state.input, String(timestamp), {from: currentAccount})
      let result = await mycontract.methods.setWord(message, String(timestamp)).send({
        from: currentAccount,
        gas: 3000000,
        // gasprice: 500
      });
      console.log('write successfully!', result);
      this.setState({
        loadingTip: that.state.successTip,
        submitFlag: true,
        // blockHash: result.blockHash,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      })
      setTimeout(() => {
        that.setState({
          loading: false,
          // input: '',
          loadingTip: that.state.waitingTip
        })
      }, 1500)

    } catch (e) {
      console.log('set failed!', e);
      // 拒绝支付
      this.setState({
        loading: false
      })
    }

  }
  convert2canvas () {
    let node = document.getElementById('userNameWrap');

    if (this.state.imgDom === true) { return false }
    domtoimage.toPng(node)
      .then(dataUrl => {
        var img = new Image();
        img.src = dataUrl;
        let node = document.getElementById('mobileContainer');
        node.appendChild(img);

        this.setState({
          imgDom: true
        })
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
    // html2canvas(document.body).then(function(canvas) {
    //     document.body.appendChild(canvas);
    // });
    // var shareContent = document.body; 
    // var width = shareContent.offsetWidth; 
    // var height = shareContent.offsetHeight; 
    // var canvas = document.createElement("canvas"); 
    // var scale = 2; 

    // canvas.width = width * scale; 
    // canvas.height = height * scale; 
    // canvas.getContext("2d").scale(scale, scale); 

    // var opts = {
    //     scale: scale, 
    //     canvas: canvas, 
    //     logging: true, 
    //     width: width, 
    //     height: height 
    // };
    // html2canvas(shareContent, opts).then(function (canvas) {
    //     var context = canvas.getContext('2d');

    //     var img = Canvas2Image.convertToImage(canvas, canvas.width, canvas.height);

    //     document.body.appendChild(img);
    //     console.log(333, img)
    //     // $(img).css({
    //     //     "width": canvas.width / 2 + "px",
    //     //     "height": canvas.height / 2 + "px",
    //     // })
    // });
  }

  getMyDate () {
    var date = new Date();
    var seperator1 = ".";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    console.log(currentdate)
    return currentdate
  }

  // 时间戳转义
  formatTime (timestamp) {
    let date = new Date(Number(timestamp))
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let fDate = [year, month, day,].map(this.formatNumber)
    return fDate[0] + '年' + fDate[1] + '月' + fDate[2] + '日 ' + [hour, minute, second].map(this.formatNumber).join(':')
  }

  /** 小于10的数字前面加0 */
  formatNumber (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
}

export default Mobile
