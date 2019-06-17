import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
// animate
import { StyleSheet, css } from 'aphrodite';
import { spaceInLeft, spaceOutRight } from 'react-magic';


// import BigNumber from 'bignumber.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

// const abi = [
// 	{
// 		"constant": true,
// 		"inputs": [
// 			{
// 				"name": "random",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "getRandomWord",
// 		"outputs": [
// 			{
// 				"name": "",
// 				"type": "uint256"
// 			},
// 			{
// 				"name": "",
// 				"type": "string"
// 			},
// 			{
// 				"name": "",
// 				"type": "address"
// 			},
// 			{
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"payable": false,
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"constant": true,
// 		"inputs": [],
// 		"name": "getMessageCount",
// 		"outputs": [
// 			{
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"payable": false,
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"constant": false,
// 		"inputs": [
// 			{
// 				"name": "s",
// 				"type": "string"
// 			},
// 			{
// 				"name": "t",
// 				"type": "string"
// 			}
// 		],
// 		"name": "setWord",
// 		"outputs": [],
// 		"payable": false,
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	}
// ]

// let mycontract;

// animate style
const styles = StyleSheet.create({
	in: {
		animationName: spaceInLeft,
		animationDuration: '6s'
	},
	out: {
		animationName: spaceOutRight,
		animationDuration: '6s'
	}
});

const contractAddress = "0x95e22f0f683f42bfbba37746b300e41d3ff6d083" // 合约地址
var simpleStorageInstance // 合约实例


class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			word: null,
			lastTenWords: [],
			from: null,
			timestamp: null,
			random: 0,
			count: 0,
			countOld: 0,
			input: '',
			web3: null,
			emptyTip: "还没有留言，快来创建全世界第一条留言吧~",
			firstTimeLoad: true,
			loading: false,
			loadingTip: "留言写入所需时间不等（10s~5min），请耐心等待~",
			waitingTip: "留言写入所需时间不等（10s~5min），请耐心等待~",
			successTip: "留言成功",
			animate: css(styles.out),
			in: css(styles.in),
			out: css(styles.out),
			dataList: '',
			stamp: false,
		}
	}

	componentWillMount () {
		getWeb3
			.then(results => {
				this.setState({
					web3: results.web3
				})
				//使用原生api构造合约实例
				// console.log('provider :', this.state.web3.currentProvider);
				// mycontract = new results.web3.eth.Contract(abi, contractAddress);
				this.instantiateContract()
			})
			.catch(() => {
				console.log('Error finding web3.')
			})
	}

	// 循环从区块上随机读取留言
	randerWord () {
		setInterval(() => {
			// console.log('time')
			// console.log(this.state.count, this.state.countOld)
			if (this.state.count === this.state.countOld) {
				let random_num = Math.random() * (this.state.count ? this.state.count : 0)
				// console.log(random_num)
				this.setState({
					random: parseInt(random_num, 10)
				})
			} else {
				this.setState({
					random: this.state.count - 1,
					countOld: this.state.count
				})
			}
			// let messageCount = await mycontract.methods.getMessageCount().call();
			// console.log('message count :', messageCount);
			simpleStorageInstance.getRandomWord(this.state.random)
				.then(result => {
					console.log(result)
					if (result[1] !== this.state.word) {
						this.setState({
							animate: this.state.out
						})
						setTimeout(() => {
							// console.log(result[1].indexOf('&%^') )
							if (result[1].indexOf('&%^') > -1) {
								this.setState({
									stamp: false,
									count: result[0].c[0],
									word: result[1],
									from: result[2],
									timestamp: result[3],
									animate: this.state.in,
								})
								setTimeout(() => {
									this.setState({
										stamp: true
									})
								}, 10000)
							}
						}, 2000)
					}
				})
		}, 20000)
	}

	instantiateContract () {
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
					console.log("读取成功", result)
					result[1] = '区块链誓言读取中...'
					if (result[1] !== this.state.word) {
						// 修改默认的 -- 你好
						this.setState({
							animate: this.state.out
						})
						setTimeout(() => {
							this.setState({
								count: result[0].c[0],
								countOld: 0,
								// word: result[1],
								word: '区块链誓言读取中...',
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
					this.randerWord()
				})

		})
	}

	toNonExponential (num) {
		var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
		return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
	}



	// startAudio () {
	// 	console.log('music')
	// 	let audio = document.getElementById('show-audio');
	// 	if (audio.paused) {
	// 		audio.load()
	// 		// audio.play();
	// 	} 
	// }
	componentDidMount () {
		// setTimeout(() => {
		// 	var audio = document.getElementById('background-audio')
		// 	audio.play()
		// }, 1000);
		// document.addEventListener('click', function () {
		// 	console.log('click')
		// 	function audioAutoPlay () {
		// 		var audio = document.getElementById('background-audio');
		// 		audio.play();
		// 	}
		// 	audioAutoPlay();
		// });

		/**video.play()返回一个promise，未禁止则resolve，禁止则reject**/
		// let audio = document.getElementById("background-audio");
		// let audioPlay = audio.play();

		// audioPlay.then(() => {
		// 	console.log('可以自动播放');
		// }).catch((err) => {
		// 	console.log(err);
		// 	console.log("不允许自动播放");
		// 	//音频元素只在用户交互后调用.play(),
		// 	// ...
		// });
	}

	render () {
		return (
			<div className="container">
				{/* <audio src={require('../public/loading/bg_audio.mp3')} controls autoPlay="autoplay" loop="loop" ></audio> */}
				{/* <audio src={require('../public/loading/bg_audio.mp3')} loop="loop" id="background-audio" autoPlay="autoplay"></audio> */}
				<main>
					<div className="main-container">
						<div className="title-logo">
							<img alt="" src={require("../public/loading/logo.png")} />
						</div>
					</div>
				</main>
				<div className={this.state.loading ? "loading show" : "loading"}>
					<img alt="" src={require("../public/loading/loading-bubbles.svg")} width="128" height="128" />
					{/* <p>Matemask 钱包确认支付后开始写入留言</p>
                    <p>{this.state.loadingTip}</p> */}
				</div>
				<div className={this.state.animate} style={{ color: '#fff', width: '100%', height: '100%', position: 'absolute' }}>
					<div className="userInputWrap userInputWrapH">
						<div className="userNameWrap userNameWrapH">
							<div className="userNameText userNameTextH">{this.state.word && (this.state.word.split('&%^')[0])}</div>
							<div className="txHash txHashH">{this.state.word && this.state.word.split('&%^')[3]}</div>
							<div className="blockNum">{this.state.word && this.state.word.split('&%^')[4]}</div>
							<div className="vowWrap vowWrapH">
								<div className="vowText vowTextH">
									{this.state.word && this.state.word.split('&%^')[1]}
								</div>
								<div className="vowDate vowDateH">{this.state.word && this.state.word.split('&%^')[2]}</div>
								{this.state.stamp ? <img alt="" className="stampPic stampPicH" src={require("../public/loading/group1.gif")} /> : null}
							</div>
						</div>
					</div>
				</div>
				{/* <audio autoPlay="autoplay" loop="loop">
					<source src={require('../public/loading/yx.mp3')} />
				</audio> */}
			</div>
		);
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

export default App
