import React from 'react'
import { SQLite } from 'expo'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

const db = SQLite.openDatabase('todo.db')

class Item extends React.Component {
  state = {
    items: null,
  }

  componentDidMount() {
    this.update()
  }

  render() {
    const { items } = this.state
    if (items === null || items.length === 0) {
      return null
    }

    return (
      <View style={styles.container}>
        {items.map(({ id, done, value }) => (
          <TouchableOpacity
            key={id}
            onPress={() => this.props.onPressItem && this.props.onPressItem(id)}
            style={styles.touchable}
          >
            <Text style={styles.text}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  update() {
    db.transaction(tx => {
      tx.executeSql(
        `select * from items where done = ?;`,
         [this.props.done ? 1 : 0],
        (_, { rows: { _array } }) => this.setState({ items: _array })
      )
    })
  }
}
export default Item

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  touchable: {
    width: '100%',
    backgroundColor: '#4286f4',
    color: 'white',
  },
  text: {
    color: 'white',
  },
})
