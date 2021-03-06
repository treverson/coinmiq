import React, { Component } from 'react';

import { Card, CardText, CardBody, CardTitle } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Events, animateScroll as scroll, scrollSpy } from 'react-scroll';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import HorizontalCustomLabels from './HorizontalCustomLabels';

import './css/App.css';

class PowLink extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      encoded: null,
      wallet: '',
      name: '',
      note: '',
      hashes: 500,
      copied: false
    };
    this.loadExample = this.loadExample.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleHashesChange = this.handleHashesChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(prevProps) {
    window.scrollTo(0, 0);

    Events.scrollEvent.register('begin', function(to, element) {
      console.log('begin', arguments);
    });

    Events.scrollEvent.register('end', function(to, element) {
      console.log('end', arguments);
    });

    scrollSpy.update();
  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }
  scrollToTop() {
    scroll.scrollToTop();
  }
  scrollToBottom() {
    scroll.scrollToBottom();
  }

  loadExample = value => {
    this.setState({
      wallet: 'NQ04 3F73 CHG5 RCBH CDMM MR5C RNJV 0N6J CXJR'
    });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleHashesChange = value => {
    this.setState({
      hashes: value
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.wallet === '') {
      alert('Wallet address is required');
    } else if (this.state.name === '') {
      alert('Name is required');
    } else if (this.state.note === '') {
      alert('Note is required');
    } else {
      let to = {
        wallet: this.state.wallet,
        name: this.state.name,
        note: this.state.note,
        hashes: this.state.hashes * 1000
      };
      let encoded = btoa(JSON.stringify(to));
      this.setState({
        encoded: encoded
      });
      this.scrollToBottom();
    }
  }

  render() {
    let url = '/mine/' + this.state.encoded;
    let shareUrl = 'http://' + window.location.host + url;
    let toShow = null;

    if (this.state.encoded) {
      toShow = (
        <div>
          <CardTitle className="PowLink">
            Your Powlink has been generated and can be found below.
          </CardTitle>
          <CardText className="Sharable">
            <Link to={url} id="myLink">
              {shareUrl}
            </Link>
            {this.state.copied ? (
              <span style={{ color: 'gray' }}>&nbsp;&nbsp;&nbsp;(Copied)</span>
            ) : null}
            <br />
            <br />
            <CopyToClipboard
              text={shareUrl}
              onCopy={() => this.setState({ copied: true })}
            >
              <Button color="info" size="sm">
                Copy to clipboard
              </Button>
            </CopyToClipboard>
          </CardText>
        </div>
      );
    }

    return (
      <div className="PowLink">
        <Card>
          <div>
            <CardTitle className="PowLink">Create a Powlink</CardTitle>
            <CardText className="PowLink">
              This screen lets you create a Proof-of-Work (PoW) link [<a href="http://coinmiq.com/mine/eyJ3YWxsZXQiOiJOUTA0IDNGNzMgQ0hHNSBSQ0JIIENETU0gTVI1QyBSTkpWIDBONkogQ1hKUiIsIm5hbWUiOiJwb3JrYWNodSIsIm5vdGUiOiJJIHdpc2ggeW91IGFsbCB0aGUgYmVzdCBpbiBtZWV0aW5nIHRoZSBjcm93ZGZ1bmRpbmcgdGFyZ2V0LiBMb29raW5nIGZvcndhcmQgdG8gaXQuIEhvcGVmdWxseSBteSBoYXNocmF0ZSBjYW4gaGVscC4iLCJoYXNoZXMiOjUwMDAwMH0=">
                example
              </a>]. Powlinks are sharable hyperlinks that you can send through
              emails, messaging apps or embed in your website. By clicking on
              the link and giving their consent, recipients of the link can mine
              for you. By default, sharable links will mine to <a href="https://sushipool.com">SushiPool</a>.
            </CardText>
            <hr />
            <Form onSubmit={this.handleSubmit} className="PowLink">
              <FormGroup>
                <Label for="wallet">Wallet Address</Label>&nbsp;
                <Input
                  type="wallet"
                  name="wallet"
                  id="wallet"
                  placeholder="e.g. NQ04 3F73 CHG5 RCBH CDMM MR5C RNJV 0N6J CXJR"
                  value={this.state.wallet}
                  onChange={this.handleInputChange}
                />
                <Button
                  outline
                  color="primary"
                  size="sm"
                  onClick={this.loadExample}
                >
                  example address
                </Button>
                &nbsp;<small>
                  <a
                    href="https://nimiq.com"
                    target="_blank"
                    className="float-right"
                  >
                    create a new wallet
                  </a>
                </small>&nbsp;
              </FormGroup>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="name"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="note">Note</Label>
                <Input
                  type="note"
                  name="note"
                  id="note"
                  placeholder="Enter note for recipient"
                  value={this.state.note}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Target Hashes</Label>
                <HorizontalCustomLabels
                  value={this.state.hashes}
                  onInputChange={this.handleHashesChange}
                />
              </FormGroup>
              <Button color="primary" size="lg" block>
                Create Powlink
              </Button>
            </Form>
            <br />
            <hr />
            <CardBody className="PowLink">{toShow}</CardBody>
          </div>
        </Card>
        <br />
      </div>
    );
  }
}

export default PowLink;
