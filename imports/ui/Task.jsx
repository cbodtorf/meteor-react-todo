import React, { Component, PropTypes } from 'react'

import { Tasks } from '../api/tasks.js'

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
    * @param (int) indentifies a subset of collection to remove
    *******************/
    Meteor.call('tasks.remove', this.props.task._id)
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them differently.
    const taskClassName = this.props.task.checked ? 'checked' : '';


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

      <span className="text">
        <strong>{this.props.task.username}</strong>: {this.props.task.text}
      </span>
      </li>
    );
  }
}
