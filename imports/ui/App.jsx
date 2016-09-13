import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'

import { Tasks } from '../api/tasks.js'

import Task from './Task.jsx'
import AccountsUIWrapper from './AccountsUIWrapper.jsx'

// App Component -- represents the whole App
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    }
  }

  /******************
  * handleSubmit
  * @param click event [auto on form submission]
  *******************/
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    /******************
    * Uses Meteors call method to separate database concerns to server. (imports/ui/tasks.js called in server/main.js)
    * @param (str) method defined in server for inserting tasks
    * @param (str) text variable grabs string from task input field
    *******************/
    Meteor.call('tasks.insert', text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = ''
  }

  // toggle whether to hide/show completed items
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    })
  }

  /******************
  * renderTasks
  * function to render from Task.jsx
  * @returns JSX object with task data
  *******************/
  renderTasks() {
    let filteredTasks = this.props.tasks
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked)
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id
      const showPrivateButton = task.owner === currentUserId

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
          />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo Lisp ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
          Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

          { this.props.currentUser ?
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
              />
          </form> : ''
        }
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }

//end component
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

// createContainer wraps App component and gives it access
// to Meteor Data Collection.
export default createContainer(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, {sort: {createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
