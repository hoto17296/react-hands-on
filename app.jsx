var App = React.createClass({
  getInitialState: function() {
    return {
      // こういう感じのデータ構造
      // todoList: [ { id: 123, item: 'とぅーどぅー', checked: false } ],
      todoList: [],
    };
  },

  render: function() {
    return (
      <div>
        <Form addTodo={this.addTodo} />
        <ul>
          {
            this.state.todoList.map(function(todo) {
              return (
                <li key={todo.id}>
                  <Todo {...todo}
                    toggleCheck={this.toggleCheck}
                    changeItem={this.changeItem}
                    removeTodo={this.removeTodo}
                  />
                </li>
              );
            }, this)
          }
        </ul>
      </div>
    );
  },

  // タスクを追加するやーつ
  addTodo: function(item) {
    var todo = {
      id: Date.now(),
      item: item,
      checked: false,
    };
    this.setState({
      todoList: this.state.todoList.concat(todo),
    });
  },

  // 指定したタスクの check を反転させるやーつ
  toggleCheck: function(id) {
    var todoList = this.state.todoList.map(function(todo) {
      if ( todo.id === id ) {
        todo.checked = ! todo.checked;
      }
      return todo;
    });
    this.setState({ todoList: todoList });
  },

  // 指定したタスクのタスク名を変更するやーつ
  changeItem: function(id, item) {
    var todoList = this.state.todoList.map(function(todo) {
      if ( todo.id === id ) {
        todo.item = item;
      }
      return todo;
    });
    this.setState({ todoList: todoList });
  },

  // 指定したタスクを削除するやーつ
  removeTodo: function(id) {
    var todoList = this.state.todoList.filter(function(todo) {
      return todo.id !== id;
    });
    this.setState({ todoList: todoList });
  },

});

var Form = React.createClass({
  propTypes: {
    addTodo: React.PropTypes.func.isRequired,
  },

  render: function() {
    return (
      <form onSubmit={this.onSubmit}>
        <input type='text' name='todo' />
        <input type='submit' value='追加' />
      </form>
    );
  },

  onSubmit: function(event) {
    event.preventDefault();
    var input = event.target.todo;
    this.props.addTodo( input.value );
    input.value = '';
  },
});

var Todo = React.createClass({
  getInitialState: function() {
    return {
      editing: false,
    };
  },

  propTypes: {
    id: React.PropTypes.number.isRequired,
    item: React.PropTypes.string.isRequired,
    checked: React.PropTypes.bool.isRequired,
    toggleCheck: React.PropTypes.func.isRequired,
    changeItem: React.PropTypes.func.isRequired,
    removeTodo: React.PropTypes.func.isRequired,
  },

  render: function() {
    var style = {
      textDecoration: this.props.checked ? 'line-through' : 'none',
    };
    if ( this.state.editing ) {
      var text = (
        <input
          type='text'
          defaultValue={this.props.item}
          onBlur={this.onBlur}
        />
      );
    } else {
      var text = (
        <span onDoubleClick={this.onDoubleClick}>
          {this.props.item}
        </span>
      );
    }
    return (
      <div style={style}>
        <input
          type='checkbox'
          checked={this.props.checked}
          onChange={this.onChange}
        />
        {text}
        <button type='button' onClick={this.onRemove}>
          ×
        </button>
      </div>
    );
  },

  // チェックボックスを変更したとき
  onChange: function() {
    this.props.toggleCheck( this.props.id );
  },

  // タスクを編集するとき
  onDoubleClick: function() {
    this.setState({ editing: true });
  },

  // タスクの編集を完了するとき
  onBlur: function(event) {
    this.setState({ editing: false });
    var item = event.target.value;
    this.props.changeItem(this.props.id, item);
  },

  // タスクを削除するとき
  onRemove: function() {
    this.props.removeTodo( this.props.id );
  },
});

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
