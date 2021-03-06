import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { getChangellyTransactionStatus, getChangellyRippleTransactionId } from '../../actions';
import Promise from 'bluebird';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  RefreshControl
} from 'react-native';

class ChangellyTransactionView extends React.Component {
  constructor(props){
    super(props);
    this.setChangellyStatus = this.setChangellyStatus.bind(this);
    this.setTransactionId = this.setTransactionId.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.state = {
      status: 'please wait...',
      rippleTxnId: 'please wait...',
      refreshing: false
    };
  }

  // Maybe store the transaction id in a shift transaction model to prevent this action.
  componentDidMount(){
    this.getTransactionStats();
  }

  getTransactionStats() {
    const { changellyTxnId, refundAddress, refundDestTag } = this.props;
    let transactionStatPromises = [];    
    if (this.props.from.fromCoin === "XRP") {
      transactionStatPromises.push(this.props.getChangellyRippleTransactionId(changellyTxnId, refundAddress, refundDestTag, this.setTransactionId));
    }
    else {
      transactionStatPromises.push(this.setTransactionId('Non-XRP deposit. Check other wallet.'));
    }

    transactionStatPromises.push(this.props.getChangellyTransactionStatus(changellyTxnId, this.setChangellyStatus));
    Promise.all(transactionStatPromises).then(() => {
      return this.setState({refreshing: false});
    });
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.getTransactionStats();
  }

  setChangellyStatus(status) {
    return this.setState({ status: status });
  }

  setTransactionId(rippleTxnId) {
    return this.setState({ rippleTxnId });
  }

  render(){
    let date = new Date(this.props.date);
    let { from, to} = this.props;
    let { fromAmount, fromCoin } = from;
    let { toAmount, toCoin } = to;
    return (
      <ScrollView 
        style={styles.infoContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh} 
          />
        }
        automaticallyAdjustContentInsets={false}
      >
          <Text style={styles.infoText}>{fromCoin === "XRP" ? "send" : "deposit"} {fromAmount} {fromCoin} as {toAmount} {toCoin}</Text>
          <Text style={styles.infoText}>status:  {this.state.status}</Text>
          <Text style={styles.infoText}>send to address: {this.props.otherParty}</Text>
          <Text style={styles.infoText}>send to destination tag: {this.props.toDestTag}</Text>
          <Text style={styles.infoText}>{`${date.toLocaleString("en-us", { month: "short" })} ${date.getDate()}, ${date.getFullYear()} ${this.props.time}`}</Text>
          {/* {this.state.status.error ? <Text style={styles.infoText}>Error:  {this.state.status.error}</Text> : null} */}
          <Text style={styles.infoText}>changelly transaction Id:  {this.props.changellyTxnId}</Text>
          <Text style={styles.infoText}>Ripple ledger transaction id:  {this.state.rippleTxnId}</Text>
          <Text style={styles.infoText}>changelly deposit address:  {this.props.changellyAddress}</Text>
          <Text style={styles.infoText}>changelly deposit destination tag:  {this.props.changellyDestTag}</Text>
          <Text style={styles.infoText}>refund address:  {this.props.refundAddress || 'Not Entered'}</Text>
          <Text style={styles.infoText}>refund destination tag:  {this.props.refundDestTag || 'Not Relevant'}</Text>
      </ScrollView>
    );
  }
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  infoContainer: {
    width: width,
    marginBottom: height/12,
    height: height/1.6
  },
  infoText: {
    fontSize: 13,
    borderWidth: .5,
    borderColor: '#d3d3d3',
    padding: 20,
    fontWeight: "500"
  }
});

const mapDispatchToProps = dispatch => ({
  getChangellyRippleTransactionId: (changellyTxnId, refundAddress, refundDestTag, setTransactionId) => dispatch(getChangellyRippleTransactionId(changellyTxnId, refundAddress, refundDestTag, setTransactionId)),
  getChangellyTransactionStatus: (changellyTxnId, setTransactionStatus) => dispatch(getChangellyTransactionStatus(changellyTxnId, setTransactionStatus))
});

export default connect(
  null,
  mapDispatchToProps
)(ChangellyTransactionView);