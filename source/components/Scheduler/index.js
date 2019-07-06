// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Checkbox from '../../theme/assets/Checkbox';
import Spinner from '../../components/Spinner';
import Task from '../../components/Task';

export default class Scheduler extends Component {
    state = {
        tasks:           [],
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _updateTasksFilter = (event) => {
        this.setState({
            tasksFilter: event.target.value.toLowerCase(),
        });
    };

    _getAllCompleted = () => {
        return this.state.tasks.every((task) => task.completed);
    };

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);

        try {
            const tasks = await api.fetchTasks({
                page:   1,
                size:   10,
                search: '',
            });

            this.setState({
                tasks,
            });
            this._setTasksFetchingState(false);
        } catch (error) {
            throw new Error(error);
        }
    };

    _createTaskAsync = async (event) => {
        if (this.state.newTaskMessage === '') {
            return null;
        }

        event.preventDefault();
        this._setTasksFetchingState(true);

        try {
            const task = await api.createTask(this.state.newTaskMessage);

            this.setState(({ tasks }) => ({
                tasks:          [task, ...tasks],
                newTaskMessage: '',
            }));
            this._setTasksFetchingState(false);
        } catch (error) {
            throw new Error(error);
        }
    };

    _updateTaskAsync = async (taskUpdateData) => {
        this._setTasksFetchingState(true);

        try {
            let updatedTask = await api.updateTask(taskUpdateData);

            updatedTask = Array.isArray(updatedTask)
                ? updatedTask[0]
                : updatedTask;

            this.setState(({ tasks }) => ({
                tasks: tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                ),
            }));
            this._setTasksFetchingState(false);
        } catch (error) {
            throw new Error(error);
        }
    };

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);
        try {
            await api.removeTask(id);
            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));

            this._setTasksFetchingState(false);
        } catch (error) {
            throw new Error(error);
        }
    };

    _completeAllTasksAsync = async () => {
        if (!this._getAllCompleted()) {
            try {
                this._setTasksFetchingState(true);
                await api.completeAllTasks(this.state.tasks);

                this.setState(({ tasks }) => ({
                    tasks: tasks.map((task) => {
                        return { ...task, ...{ completed: true }};
                    }),
                }));
                this._setTasksFetchingState(false);
            } catch (error) {
                throw new Error(error);
            }
        } else {
            return null;
        }
    };

    _sortTasks = (tasks) => {
        return [...tasks]
            .sort((next, prev) => {
                return next.created < prev.created
                    ? 1
                    : next.created === prev.created
                        ? 0
                        : -1;
            })
            .sort((next, prev) => {
                return next.favorite < prev.favorite
                    ? 1
                    : next.favorite === prev.favorite
                        ? 0
                        : -1;
            })
            .sort((next, prev) => {
                return next.completed > prev.completed
                    ? 1
                    : next.completed === prev.completed
                        ? 0
                        : -1;
            });
    };

    render () {
        const { tasks, isTasksFetching, newTaskMessage } = this.state;

        const tasksJSX = this._sortTasks(tasks).map((task) => {
            if (
                task.message.toLowerCase().indexOf(this.state.tasksFilter) !==
                -1
            ) {
                return (
                    <Task
                        key = { task.id }
                        { ...task }
                        _removeTaskAsync = { this._removeTaskAsync }
                        _updateTaskAsync = { this._updateTaskAsync }
                    />
                );
            }

            return null;
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { this.state.tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = { Styles.createTask }
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = { Styles.overlay }>
                            <ul>
                                <FlipMove duration = { 400 }>{tasksJSX}</FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { false }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
