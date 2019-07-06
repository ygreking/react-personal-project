// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';
import Star from '../../theme/assets/Star';
import { async } from 'q';
import cx from 'classnames';

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
        this.props._removeTaskAsync(this.props.id);
    };

    _setTaskEditingState = (state) => {
        this.setState(
            {
                isTaskEditing: state,
            },
            () => {
                if (state) {
                    this.taskInput.current.focus();
                }
            }
        );
    };

    _cancelUpdatingTaskMessage = () => {
        this.setState({
            newMessage:    this.props.message,
            isTaskEditing: false,
        });
    };

    _toggleTaskFavoriteState = () => {};

    _updateTask = () => {
        this._setTaskEditingState(false);
        if (this.state.newMessage === this.props.message) {
            return null;
        }

        this.props._updateTaskAsync(
            this._getTaskShape({ message: this.state.newMessage })
        );
    };

    _updateNewTaskMessage = (event) => {
        this.setState({ newMessage: event.target.value });
    };

    _updateTaskMessageOnClick = (event) => {
        if (this.state.isTaskEditing) {
            this._updateTask();

            return null;
        }
        this._setTaskEditingState(true);
    };

    _updateTaskMessageOnKeyDown = (event) => {
        if (this.state.newMessage === '') {
            return null;
        }
        if (event.key === 'Enter') {
            this._updateTask();
        } else if (event.key === 'Escape') {
            this._cancelUpdatingTaskMessage();
        }
    };

    _toggleTaskCompletedState = () => {
        this.props._updateTaskAsync(
            this._getTaskShape({ completed: !this.props.completed })
        );
    };

    _toggleTaskFavoriteState = () => {
        this.props._updateTaskAsync(
            this._getTaskShape({ favorite: !this.props.favorite })
        );
    };

    _getTaskStyles = () => {
        return cx(Styles.task, {
            [Styles.completed]: this.props.completed,
        });
    };

    render () {
        const taskStyles = this._getTaskStyles();

        return (
            <li className = { taskStyles }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { this.props.completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        inlineBlock
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !this.state.isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { this.state.newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        checked = { this.props.favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        checked = { false }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
