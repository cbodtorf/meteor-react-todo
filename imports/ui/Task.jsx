import React, { Component, PropTypes } from 'react'

import { Tasks } from '../api/tasks.js'

// Task Component -- represents a single todo item
export default class Task extends Component {

  toggleChecked() {
    /******************
    * Tasks.update
    * @param ({}._id) indentifies a subset of collection to update
    * @param (obj) calls $set to toggle current value
    *******************/
    Tasks.update(this.props.task._id, {
      $set: { checked: !this.props.task.checked },
    });
  }

  deleteThisTask() {
    /******************
    * Tasks.remove
    * @param (int) indentifies a subset of collection to remove
    *******************/
    Tasks.remove(this.props.task._id)
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

      <span className="text">{this.props.task.text}</span>
      </li>
    );
  }
}
