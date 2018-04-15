import React, { Component } from 'react';

import { Card, CardText, CardBody, CardTitle } from 'reactstrap';
import { Button } from 'reactstrap';
import CoinmiqMiner from 'react-coinmiq-miner';
import { Link } from 'react-router-dom';

import './css/App.css';

class PowMine extends Component {
  constructor(props, context) {
    super(props, context);

    let to = props.match.params.to;
    let decoded = null;
    if (to) {
      decoded = JSON.parse(atob(to));
      this.state = {
        decoded: decoded,
        doMining: false
      };
    }

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(event) {
    this.setState({
      doMining: true
    });
  }

  componentDidMount(prevProps) {
    window.scrollTo(0, 0);
  }

  render() {
    // window.Robohash.render('any text here', document.getElementById('robohash'))
    const decoded = this.state.decoded;
    const doMining = this.state.doMining;
    const nimiqWatchUrl =
      'https://nimiq.watch/#' + decoded.wallet.replace(/\s+/g, '+');
    let top = (
      <Card>
        <CardTitle className="PowMine">
          You have received a mining request from {decoded.name}
        </CardTitle>
        <CardBody>
          <CardText>
            <strong>{decoded.name}</strong> has requested you to mine{' '}
            <strong>{decoded.hashes}</strong> Hashes to the following wallet
            address:
          </CardText>
          <div className="Sharable">
            <div id="robohash">
              <img
                src="https://robohash.org/{decoded.wallet}.png?size=100x100"
                alt="robohash"
              />
            </div>
            <CardText>
              <strong>
                <a href={nimiqWatchUrl} target="_blank">
                  {decoded.wallet}
                </a>
              </strong>
            </CardText>
          </div>
          <CardText>
            The following message was included in the request:{' '}
            <em>{decoded.note}</em>.
          </CardText>
          <CardText>
            To begin mining, click the button below. You may leave the miner
            running as long as this page is open. During mining, the wallet
            address of the recipient will be credited with the appropriate
            reward depending on the hashrate and mining duration. To quit this
            process at any time, simply close this page.
          </CardText>
          <CardText>
            To create your own sharable link to request other people to mine for
            you,&nbsp;
            <Link to="/createPowlink">click here</Link>.
          </CardText>
        </CardBody>
      </Card>
    );
    let bottom = (
      <Card>
        <CardBody>
          <p>
            <strong>Important:</strong>{' '}
            <em>
              Note that mining on mobile devices for a long time may drain your
              battery.
            </em>
          </p>
        </CardBody>
      </Card>
    );
    if (decoded) {
      if (doMining) {
        return (
          <div className="PowMine">
            {top}
            <br />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <CoinmiqMiner
                address={decoded.wallet}
                targetHash={decoded.hashes}
                width="auto"
                height="auto"
                autoStart={true}
                border={false}
                displayMode="compact"
              />
            </div>
            <br />
            {bottom}
          </div>
        );
      } else {
        return (
          <div className="PowMine">
            {top}
            <br />
            <Button
              color="primary"
              size="lg"
              block
              onClick={this.handleOnClick}
            >
              I understand. Do it!
            </Button>
            <br />
            {bottom}
          </div>
        );
      }
    } else {
      return (
        <div className="PowMine">
          <Card>
            <CardTitle>Powlink Mining</CardTitle>
            <CardBody>Please return to the above to create a powlink.</CardBody>
          </Card>
          <br />
        </div>
      );
    }
  }
}

export default PowMine;
