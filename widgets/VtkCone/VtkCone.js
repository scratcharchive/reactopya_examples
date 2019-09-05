import React, { Component } from 'react';
import { PythonInterface } from 'reactopya';
import Cone from './Cone';
import VtkComponent from './VtkComponent';
const config = require('./VtkCone.json');
import AutoDetermineWidth from '../jscommon/AutoDetermineWidth';

export default class VtkCone extends VtkComponent {
    static title = 'Vtk demo'
    static reactopyaConfig = config
    render() {
        return (
            <AutoDetermineWidth>
                <VtkConeInner
                    {...this.props}
                />
            </AutoDetermineWidth>
        );
    }
}

class VtkConeInner extends VtkComponent {
    constructor(props) {
        super(props);
        this.state = {
            status: '',
            status_message: ''
        }
        this.cone = new Cone();
    }
    componentDidMount() {
        this.pythonInterface = new PythonInterface(this, config);
        this.pythonInterface.start();
    }
    componentDidUpdate() {
        this.pythonInterface.update();
    }
    componentWillUnmount() {
        this.pythonInterface.stop();
    }
    vtkSize(div) {
        let width = this.props.width;
        let height = width;
        height = Math.min(500, height);
        return [width, height];
    }
    vtkRender(div) {
        this.cone.setContainer(div);
    }
}

class RespectStatus extends Component {
    state = {}
    render() {
        switch (this.props.status) {
            case 'running':
                return <div>Running: {this.props.status_message}</div>
            case 'error':
                return <div>Error: {this.props.status_message}</div>
            case 'finished':
                return this.props.children;
            default:
                return <div>Unknown status: {this.props.status}</div>
        }
    }
}