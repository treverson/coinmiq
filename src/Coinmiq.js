import React, { Component } from 'react';
import './App.css';

import ToggleButton from 'react-toggle-button'
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import { Form, Text, TextArea } from 'react-form';

class HashRate extends React.Component {
  render() {
    let textStyle = {
      fontSize: 48,
      fontFamily: "sans-serif",
      color: "#333",
      fontWeight: "bold"
    };

    return (
      <div style={textStyle}>
        {this.props.display} H/s
      </div>
    );
  }
}

class MsgBox extends React.Component {
    render() {
        let textStyle = {
          fontSize: 14,
          fontFamily: "sans-serif",
          color: "#333",
          fontWeight: "bold"
        };

        return (
          <div>
              <div style={textStyle}>
                <a href={"https://nimiq.watch/#" + this.props.display}></a>
                {this.props.display}
              </div>
          </div>
        );
    }
}

class ThreadCountBox extends React.Component {
    render() {
        let textStyle = {
          fontSize: 14,
          fontFamily: "sans-serif",
          color: "#333",
          fontWeight: "bold"
        };

        let ts = "threads";
        if (this.props.display === 1) {
            ts = "thread"
        }
        return (
          <div>
              <div style={textStyle}>
              {this.props.total} Hashes, {this.props.time} s, {this.props.display} {ts}
              </div>
          </div>
        );
    }
}

class BasicForm extends Component {

   constructor( props ) {
     super( props );
     this.state = {};
   }

   render() {
     return (
       <div>
         <Form onSubmit={submittedValues => this.setState( { submittedValues } )}>
           { formApi => (
             <form onSubmit={formApi.submitForm} id="form2">

               <label htmlFor="firstName">Wallet Address </label>
               <Text field="firstName" id="firstName" />
               <br /><br />

               <label htmlFor="lastName">Name </label>
               <Text field="lastName" id="lastName" />
               <br /><br />

               <label htmlFor="bio">Message </label>
               <TextArea field="bio" id="bio" />
               <br /><br />

               <button type="submit" className="mb-4 btn btn-primary">Submit</button>
               <br /><br />

             </form>
           )}
         </Form>
       </div>
     );
   }
 }

class CoinmiqMiner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hashRate: 0,
      // threadCount: Math.ceil(navigator.hardwareConcurrency / 2),
      threadCount: 1,
      doMining: false,
      statusMsg: "Loading.",
      miner: undefined,
      buttonDisabled: true,
      totalHashCount: 0,
      totalElapsed: 0,
      progressPercent: 0,

      // should be input parameters
      address: "NQ27 RC5B 9E5A S09M 95LQ G3N4 LHQ0 U9DX EDKM",
      targetHash: 500000,

    };

    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
    this.handleMiningButtonChange = this.handleMiningButtonChange.bind(this);

  }

  handleMiningButtonChange(doMining) {

    // let doMining = e.target.checked;
    doMining = !doMining;
    let miner = this.state.miner;
    let address = this.state.address;
    miner.on('start', () => _onMinerStarted());
    miner.on('hashrate-changed', () => _onHashRateChanged());
    miner.on('stop', () => _onMinerStopped());

    let newMsg = '';
    let currentComponent = this;

    function _onMinerStarted() {
        currentComponent.setState({
            hashRate: miner.hashrate
        });
    }

    function _onHashRateChanged() {
        let newHashRate = miner.hashrate;
        let currentHashCount = currentComponent.state.totalHashCount;
        let currentElapsed = currentComponent.state.totalElapsed;
        let newHashCount = currentHashCount + miner._lastHashCounts[miner._lastHashCounts.length-1];
        let newElapsed = currentElapsed + parseInt(miner._lastElapsed[miner._lastElapsed.length-1], 10);
        let totalHashCount = parseInt(newHashCount, 10);
        let progressPercent = parseInt(totalHashCount / currentComponent.state.targetHash * 100, 10);
        let buttonDisabled = currentComponent.state.buttonDisabled;
        if (progressPercent > 100) {
            progressPercent = 100;
            doMining = false;
            // e.target.checked = false; // doesn't work
            miner.stopWork();
            buttonDisabled = true;
        }
        currentComponent.setState({
            hashRate: newHashRate,
            totalHashCount: totalHashCount,
            progressPercent: progressPercent,
            totalElapsed: newElapsed,
            buttonDisabled: buttonDisabled
        });
    }

    function _onMinerStopped() {
        currentComponent.setState({
            hashRate: 0
        });
    }

    if (doMining) {
        newMsg = address;
        miner.startWork();
    } else {
        newMsg = address;
        miner.stopWork();
    }
    newMsg = "Mining to " + newMsg + ".";
    this.setState({
        statusMsg: newMsg,
        doMining: doMining,
    });
  }

  increase(e) {
      let newThreadCount = this.state.threadCount;
      let miner = this.state.miner;
      if (newThreadCount < navigator.hardwareConcurrency) {
          newThreadCount += 1;
      }
      this.setState({
          threadCount: newThreadCount
      });
      miner.threads = newThreadCount;
  }

  decrease(e) {
      let newThreadCount = this.state.threadCount;
      let miner = this.state.miner;
      if (newThreadCount > 1) {
          newThreadCount -= 1;
      }
      this.setState({
          threadCount: newThreadCount
      });
      miner.threads = newThreadCount;
  }

  render() {
    let backgroundStyle = {
      borderStyle: "solid",
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      backgroundColor: "#fff",
      width: 240,
      height: 240,
      textAlign: "center",
      boxShadow: 10,
    };

    let incDecStyle = {
      margin: 2,
      fontSize: "1em",
      width: 25,
      height: 25,
      fontFamily: "sans-serif",
      color: "#333",
      fontWeight: "bold",
      lineHeight: "3px",
    };

    let displayToggle = {
        display: "block"
    };
    if (this.state.buttonDisabled) {
        displayToggle = {
            display: "none"
        }
    }

    return (
      <div style={backgroundStyle}>
        <div style={displayToggle}>
            <ToggleButton
              value={this.state.doMining}
              onToggle={this.handleMiningButtonChange}
              />
        </div>
        <br/>
        <HashRate display={this.state.hashRate}/>
        <MsgBox display={this.state.statusMsg}/>
        <br/>
        <Progress percent={this.state.progressPercent} />
        <br/>
        <ThreadCountBox display={this.state.threadCount} total={this.state.totalHashCount} time={this.state.totalElapsed}/>
        <br/>
        <div style={displayToggle}>
            <button onClick={this.decrease} style={incDecStyle} disabled={this.state.buttonDisabled}>-</button>
            <button onClick={this.increase} style={incDecStyle} disabled={this.state.buttonDisabled}>+</button>
        </div>
      </div>
    );
  }

  componentDidMount() {

      let currentComponent = this;
      function updateMsg(newMsg) {
          currentComponent.setState({
              statusMsg: newMsg
          });
      }

      async function initialise() {

          // $ is the Nimiq.Core instance
          const $ = {};
          window.$ = $;

          function _onConsensusEstablished() {
              // const height = $.blockchain.height;
              const address = $.wallet.address.toUserFriendlyAddress();
              updateMsg("Consensus established.");
              currentComponent.setState({
                  miner: $.miner,
                  buttonDisabled: false,
                  address: address
              });
          }

          function _onConsensusLost() {
              updateMsg("Consensus lost.")
              currentComponent.setState({
                  buttonDisabled: true,
                  doMining: false
              });
              let miner = this.state.miner;
              miner.stopWork();
          }

          function _onHeadChanged() {
              const height = $.blockchain.height;
              let newMsg = 'Now at height ' + height;
              updateMsg(newMsg);
          }

          function _onPeersChanged() {
              let newMsg = 'Now connected to ' + $.network.peerCount + ' peers.';
              updateMsg(newMsg);
          }

          let newMsg = 'Establishing consensus.';
          updateMsg(newMsg);

          $.consensus = await window.Nimiq.Consensus.light();
          $.blockchain = $.consensus.blockchain;
          $.mempool = $.consensus.mempool;
          $.network = $.consensus.network;

          // $.wallet = await window.Nimiq.Wallet.getPersistent();
          $.wallet = { address: window.Nimiq.Address.fromUserFriendlyAddress(currentComponent.state.address) };

          let uuid = require("uuid");
          let id = "coinmiq-" + uuid.v4();
          let extraData = window.Nimiq.BufferUtils.fromAscii(id);
          console.log(id);

          $.miner = new window.Nimiq.Miner($.blockchain, $.mempool, $.wallet.address, extraData);
          $.miner.threads = 1;

          $.consensus.on('established', () => _onConsensusEstablished());
          $.consensus.on('lost', () => _onConsensusLost());
          // $.blockchain.on('head-changed', () => _onHeadChanged());
          // $.network.on('peers-changed', () => _onPeersChanged());

          newMsg = 'Connecting.';
          updateMsg(newMsg);
          $.network.connect();

      }

      if (window.Nimiq === undefined) {
          updateMsg("Internet connection is lost.");
      } else {
          window.Nimiq.init(initialise, function(code) {
              switch (code) {
                  case window.Nimiq.ERR_WAIT:
                      updateMsg("Another Nimiq instance already running.");
                      break;
                  case window.Nimiq.ERR_UNSUPPORTED:
                      updateMsg("Browser not supported.");
                      break;
                  case window.Nimiq.Wallet.ERR_INVALID_WALLET_SEED:
                      updateMsg("Invalid wallet seed.");
                      break;
                  default:
                      updateMsg("Nimiq initialisation error.");
                      break;
              }
          });
      }
  }

}

export default CoinmiqMiner;