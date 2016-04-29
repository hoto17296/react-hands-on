class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // こういう感じのデータ構造
      // todoList: [ { id: 123, item: 'とぅーどぅー', checked: false } ],
      todoList: [],
    };
  }

  render() {
    return (
      <div>
        <Form addTodo={this.addTodo.bind(this)} />
        <ul>
          {
            this.state.todoList.map((todo) => (
              <li key={todo.id}>
                <Todo {...todo}
                  toggleCheck={this.toggleCheck.bind(this)}
                  changeItem={this.changeItem.bind(this)}
                  removeTodo={this.removeTodo.bind(this)}
                />
              </li>
            ))
          }
        </ul>
      </div>
    );
  }

  // タスクを追加するやーつ
  addTodo(item) {
    var todo = {
      id: Date.now(),
      item: item,
      checked: false,
    };
    this.setState({
      todoList: this.state.todoList.concat(todo),
    });
  }

  // 指定したタスクの check を反転させるやーつ
  toggleCheck(id) {
    var todoList = this.state.todoList.map((todo) => {
      if ( todo.id === id ) {
        todo.checked = ! todo.checked;
      }
      return todo;
    });
    this.setState({ todoList });
  }

  // 指定したタスクのタスク名を変更するやーつ
  changeItem(id, item) {
    var todoList = this.state.todoList.map((todo) => {
      if ( todo.id === id ) {
        todo.item = item;
      }
      return todo;
    });
    this.setState({ todoList });
  }

  // 指定したタスクを削除するやーつ
  removeTodo(id) {
    var todoList = this.state.todoList.filter(todo => todo.id !== id);
    this.setState({ todoList });
  }
}

class Form extends React.Component {
  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <input type='text' name='todo' />
        <input type='submit' value='追加' />
      </form>
    );
  }

  onSubmit(event) {
    event.preventDefault();
    var input = event.target.todo;
    this.props.addTodo( input.value );
    input.value = '';
  }
}

Form.propTypes = {
  addTodo: React.PropTypes.func.isRequired,
};

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  render() {
    var style = {
      textDecoration: this.props.checked ? 'line-through' : 'none',
    };
    if ( this.state.editing ) {
      var text = (
        <input
          type='text'
          defaultValue={this.props.item}
          onBlur={this.onBlur.bind(this)}
        />
      );
    } else {
      var text = (
        <span onDoubleClick={this.onDoubleClick.bind(this)}>
          {this.props.item}
        </span>
      );
    }
    return (
      <div style={style}>
        <input
          type='checkbox'
          checked={this.props.checked}
          onChange={this.onChange.bind(this)}
        />
        {text}
        <button type='button' onClick={this.onRemove.bind(this)}>
          ×
        </button>
      </div>
    );
  }

  // チェックボックスを変更したとき
  onChange() {
    this.props.toggleCheck( this.props.id );
  }

  // タスクを編集するとき
  onDoubleClick() {
    this.setState({ editing: true });
  }

  // タスクの編集を完了するとき
  onBlur(event) {
    this.setState({ editing: false });
    var item = event.target.value;
    this.props.changeItem(this.props.id, item);
  }

  // タスクを削除するとき
  onRemove() {
    this.props.removeTodo( this.props.id );
  }
}

Todo.propTypes = {
  id: React.PropTypes.number.isRequired,
  item: React.PropTypes.string.isRequired,
  checked: React.PropTypes.bool.isRequired,
  toggleCheck: React.PropTypes.func.isRequired,
  changeItem: React.PropTypes.func.isRequired,
  removeTodo: React.PropTypes.func.isRequired,
};

ReactDOM.render(<App />, document.getElementById('container'));
