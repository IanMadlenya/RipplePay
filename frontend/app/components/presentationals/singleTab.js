import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');
const SingleTab = (props) => {
  const topTabContainer = {
    borderColor: '#d3d3d3',
    height: 40,
    flex: 1,
    justifyContent: 'center',
  };
  const topTab = {
    fontSize: 13,
    fontWeight: "600",
    textAlign: 'center',
    color: "red"
  };
  return (
    <View style={styles.SingleTabsContainer}>
      <TouchableOpacity style={topTabContainer}>
        <Text onPress={props.handlePress} style={topTab}>
          {props.text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  SingleTabsContainer: {
    flex: -1,
    flexDirection: 'row'
  },
});

export default SingleTab;
