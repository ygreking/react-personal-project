// Core
import React, { PureComponent } from "react";

// Instruments
import Styles from "./styles.m.css";
import Checkbox from "../../theme/assets/Checkbox";
import Edit from "../../theme/assets/Edit";
import Remove from "../../theme/assets/Remove";
import Star from "../../theme/assets/Star";

export default class Task extends PureComponent {
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

    render () {
        const { id, completed, favorite, message } = this.props;

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
                    <input
                        maxLength = { 50 }
                        type = 'text'
                        disabled
                        value = { message }
                    />
                </div>
                <div className = { Styles.actions }>
                    <div className = { Styles.toggleTaskFavoriteState }>
                        <Star />
                    </div>
                    <div className = { Styles.updateTaskMessageOnClick }>
                        <Edit />
                    </div>
                    <div className = { Styles.removeTask }>
                        <Remove />
                    </div>
                </div>
            </li>
        );
    }
}
