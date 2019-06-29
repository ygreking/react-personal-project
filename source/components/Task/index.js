// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';
import Star from '../../theme/assets/Star';
import { async } from 'q';

export default class Task extends PureComponent {
    state = {
        newMessage:    this.props.message,
        isTaskEditing: false,
    };

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    taskInput = React.createRef();

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _setTaskEditingState = async (state) => {
        await this.setState({
            isTaskEditing: state,
        });
        if (state) {
            this._taskInputFocus();
        }
    };

    _taskInputFocus = () => {
        this.taskInput.current.focus();
    };

    _cancelUpdatingTaskMessage = () => {
        this.setState({
            newMessage:    this.props.message,
            isTaskEditing: false,
        });
    };

    _toggleTaskFavoriteState = () => {};

    _updateTask = async () => {
        const { _updateTaskAsync } = this.props;

        if (this.state.newMessage == this.props.message) {
            this._setTaskEditingState(false);

            return null;
        }

        await _updateTaskAsync(
            this._getTaskShape({ message: this.state.newMessage })
        );
        this._setTaskEditingState(false);
    };

    _updateNewTaskMessage = (event) => {
        this.setState({ newMessage: event.target.value });
    };

    _updateTaskMessageOnClick = (event) => {
        event.preventDefault();
        if (
            this.state.isTaskEditing &&
            event.target !== this.taskInput.current
        ) {
            this._updateTask();

            return null;
        }
        this._setTaskEditingState(true);
    };

    _updateTaskMessageOnKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (this.state.newMessage === '') {
                return null;
            }
            this._updateTask();
        } else if (event.key === 'Escape') {
            this._cancelUpdatingTaskMessage();
        }
    };

    _toggleTaskCompletedState = () => {};

    _toggleTaskFavoriteState = () => {};

    render () {
        const { id, completed, favorite, message } = this._getTaskShape(
            this.props
        );

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <div className = { Styles.toggleTaskCompletedState }>
                        <Checkbox
                            checked = { false }
                            color1 = '#3b8ef3'
                            color2 = '#ffffff'
                        />
                    </div>
                    <span onClick = { this._updateTaskMessageOnClick }>
                        <input
                            disabled = { !this.state.isTaskEditing }
                            maxLength = { 50 }
                            ref = { this.taskInput }
                            type = 'text'
                            value = { this.state.newMessage }
                            onChange = { this._updateNewTaskMessage }
                            onKeyDown = { this._updateTaskMessageOnKeyDown }
                        />
                    </span>
                </div>
                <div className = { Styles.actions }>
                    <div className = { Styles.toggleTaskFavoriteState }>
                        <Star onClick = { this._toggleTaskFavoriteState } />
                    </div>
                    <div className = { Styles.updateTaskMessageOnClick }>
                        <Edit onClick = { this._updateTaskMessageOnClick } />
                    </div>
                    <div className = { Styles.removeTask }>
                        <Remove onClick = { this._removeTask } />
                    </div>
                </div>
            </li>
        );
    }
}
