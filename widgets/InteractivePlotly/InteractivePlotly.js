import React, { Component } from 'react';
import { PythonInterface } from 'reactopya';
import { Plot } from '../jscommon/PlotlyLight';
import InputSlider from './InputSlider';
import AutoDetermineWidth from '../jscommon/AutoDetermineWidth';
import Sync from '../jscommon/sync'
const config = require('./InteractivePlotly.json');

export default class InteractivePlotly extends Component {
    static title = 'Interactive plotly example'
    static reactopyaConfig = config
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <AutoDetermineWidth width={this.props.plot_width || this.props.width || undefined}>
                <InteractivePlotlyInner {...this.props} />
            </AutoDetermineWidth>
        )
    }
}

class InteractivePlotlyInner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noise_level: 1,
            num_points: 40,
            series: null
        }
    }
    componentDidMount() {
        this.pythonInterface = new PythonInterface(this, config);
        this.pythonInterface.start();
        this.sync = new Sync(this, this.props.sync);
        this.sync.start();
    }
    componentDidUpdate() {
        this.pythonInterface.update();
        this.sync.update();
    }
    componentWillUnmount() {
        this.pythonInterface.stop();
        this.sync.stop();
    }
    render() {
        const { series } = this.state;
        if (!series) {
            return <div>Loading...</div>;
        }
        let data = [];
        let all_amplitudes = [];
        for (let i = 0; i < series.length; i++) {
            let S = series[i];
            let x = [];
            let y = [];
            let color = 'green';
            for (let j = 0; j < S.times.length; j++) {
                x.push(S.times[j]);
                y.push(S.amplitudes[j]);
                all_amplitudes.push(S.amplitudes[j]);
            }
            data.push({
                x: x, y: y,
                color: color,
                type: 'scatter',
                mode: 'lines+markers',
                hoverinfo: 'none'
            })
        }

        let width = this.props.width || 400;
        let height = Math.min(700, width);

        // let yrange = [Math.min(...all_amplitudes), Math.max(...all_amplitudes)];
        // yrange = [Math.min(yrange[0], 0), Math.max(yrange[1], 0)];
        let yrange = [-50, 150];

        return (
            <div>
                <InputSlider
                    label={'Noise level'}
                    min={0} max={20}
                    value={this.state.noise_level}
                    step={1}
                    onChange={(val) => {this.setState({noise_level: val})}}
                />
                <InputSlider
                    label={'Num. points'}
                    min={1} max={400}
                    value={this.state.num_points}
                    step={1}
                    onChange={(val) => {this.setState({num_points: val})}}
                />
                <Plot
                    data={data}
                    layout={{
                        width: width,
                        height: height,
                        title: '',
                        showlegend: false,
                        xaxis: {
                            autorange: true,
                            // range: [0, numTimepoints - 1],
                            showgrid: false,
                            zeroline: false,
                            showline: false,
                            ticks: '',
                            showticklabels: false
                        },
                        yaxis: {
                            autorange: false,
                            range: yrange,
                            showgrid: true,
                            zeroline: true,
                            showline: false,
                            // ticks: '',
                            showticklabels: true
                        },
                        margin: {
                            l: 50, r: 50, b: 50, t: 50
                        }
                    }}
                    config={(
                        {
                            displayModeBar: false,
                            responsive: true
                        }
                    )}
                />
            </div>
        )
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