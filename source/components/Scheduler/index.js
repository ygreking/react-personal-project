// Core
import React, { Component } from "react";

// Instruments
import Styles from "./styles.m.css";
import { api } from "../../REST"; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Spinner from "../../components/Spinner";
import Task from "../../components/Task";

export default class Scheduler extends Component {
    state = {
        tasks: [
            {
                id:        1,
                completed: false,
                favorite:  false,
                message:   "test task",
            },
            {
                id:        2,
                completed: false,
                favorite:  false,
                message:   "another test task",
            }
        ],
        isTaskFetching: false,
    };
    _setTaskFetchingState = (state) => {
        this.setState({
            isTaskFetching: state,
        });
    }
    _updateTasksFilter = () => {}
    _getAllCompleted = () => {}
    _fetchTasksAsync = () => {}
    _createTaskAsync = () => {}
    _updateTaskAsync = () => {}
    _removeTaskAsync = () => {}

    render () {
        const { tasks, isTaskFetching } = this.state;

        const tasksJSX = tasks.map((task) => {
            return <Task key = { task.id } { ...task } />;
        });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isTaskFetching } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'search' />
                    </header>
                    <section>
                        <form>
                            <input
                                maxLength = '50'
                                placeholder = 'Описание новой задачи'
                                type = 'text'
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>{tasksJSX}</ul>
                        </div>
                    </section>
                    <footer>
                        <div />
                        <span className = { Styles.completeAllTasks } />
                    </footer>
                </main>
            </section>
        );
    }
}
