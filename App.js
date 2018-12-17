import React from 'react'
import {
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Button
} from 'react-native'

import { SQLite } from 'expo'
import Items from './Items'

const db = SQLite.openDatabase('todo.db')

export default class App extends React.Component {
  state = {
    text: null,
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists items (id integer primary key not null, done int, value text);'
      )
    })
  }

  render() {
    return <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.todoText}
        value={this.state.text} onChangeText={text => this.setState(
                { text }
              )} />
          <Items done={false} ref={done => (this.done = done)} onPressItem={id => db.transaction(tx => {
                  tx.executeSql(`delete from items where id = ?;`, [id])
                }, null, this.update)} />
      <FlatList
        data={this.state.items}
        style={styles.list}
        renderItem={({ item }) => this._listItemrenderer(item)}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title={'Add Todo'} onPress={() => {
        this.add(this.state.text)
        this.setState({ text: null })
      }}/>
      </SafeAreaView>
  }

  add(text) {
    db.transaction(
      tx => {
        tx.executeSql('insert into items (done, value) values (0, ?)', [text])
        tx.executeSql('select * from items', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        )
      },
      null,
      this.update
    )
  }

  update = () => {
    this.todo && this.todo.update()
    this.done && this.done.update()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoText: {
    width: '90%',
    marginTop: 16,
    marginBottom: 16,
    borderBottomWidth: 2,
    fontSize: 18,
    justifyContent: 'center',
  },
  list: {
    width: '100%',
    flex: 1,
  },
  listItem: {
    backgroundColor: '#4286f4',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: 'white',
  },
})
