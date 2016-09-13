import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import classnames from 'classnames'

// Task Component -- represents a single todo item
export default class Task extends Component {

  toggleChecked() {
    /******************
    * Uses Meteors call method to separate database concerns to server. (imports/ui/tasks.js called in server/main.js)
    * @param (str) method defined in server for checking off tasks
    * @param ({}._id) indentifies a subset of collection to update
    * @param (obj) calls $set to toggle current value
    *******************/
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked)
  }

  deleteThisTask() {
    /******************
    * Uses Meteors call method to separate database concerns to server. (imports/ui/tasks.js called in server/main.js)
    * @param (str) method defined in server for removing tasks
    * @param ({}._id) indentifies a subset of collection to remove
    *******************/
    Meteor.call('tasks.remove', this.props.task._id)
  }

  togglePrivate() {
    /******************
    * Uses Meteors call method to separate database concerns to server. (imports/ui/tasks.js called in server/main.js)
    * @param (str) method defined in server for removing tasks
    * @param ({}._id) indentifies a subset of collection to update
    * @param (obj) calls $set to toggle current value
    *******************/
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private)
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them differently.
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });


    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />

      { this.props.showPrivateButton ? (
        <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
          { this.props.task.private ? 'Private' : 'Public' }
        </button>
      ) : ''}

      <span className="text">
        <strong>{this.props.task.username}</strong>: {this.props.task.text}
      </span>
      </li>
    );
  }
}

Task.propTypes = {
   // This component gets the task to display through a React prop.
   // We can use propTypes to indicate it is required
   task: PropTypes.object.isRequired,
   showPrivateButton: React.PropTypes.bool.isRequired,
 };
