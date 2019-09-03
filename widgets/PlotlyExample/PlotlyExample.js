import React, { Component } from 'react';
import { PythonInterface } from 'reactopya';
import AutoDetermineWidth from '../jscommon/AutoDetermineWidth';
import { Plot } from '../jscommon/PlotlyLight';
const config = require('./PlotlyExample.json');

export default class PlotlyExample extends Component {
    static title = 'Interactive plotly example'
    static reactopyaConfig = config
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <AutoDetermineWidth width={this.props.plot_width || this.props.width || undefined}>
                <PlotlyExampleInner {...this.props} />
            </AutoDetermineWidth>
        )
    }
}

class PlotlyExampleInner extends Component {
    static title = 'Plotly example'
    static reactopyaConfig = config
    constructor(props) {
        super(props);
        this.state = {
            series: null,
            dummy: 4
        }
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
    render() {
        console.log('plotly render', this.state);
        const { series } = this.state;
        if (!series) {
            return <div>Loading...</div>;
        }
        let data = [];
        let all_y = [];
        for (let i = 0; i < series.length; i++) {
            let S = series[i];
            let x = [];
            let y = [];
            let color = colorArr[i % colorArr.length];
            for (let j = 0; j < S.x.length; j++) {
                x.push(S.x[j]);
                y.push(S.y[j]);
                all_y.push(S.y[j]);
            }
            data.push({
                x: x, y: y,
                type: 'scatter',
                mode: 'line',
                hoverinfo: 'skip',
                line: {
                    color: color,
                    width: 2
                }
            });
        }

        let width = this.props.width || 400;
        let height = Math.min(700, width);

        let yrange = [Math.min(...all_y), Math.max(...all_y)];
        yrange = [Math.min(yrange[0], 0), Math.max(yrange[1], 0)];

        return <Plot
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
                    responsive: false
                }
            )}
        />
    }
}

const colorArr = [
    "#3cb44b",
    "#42d4f4",
    "#bfef45",
    "#4363d8",
    "#911eb4",
    "#f032e6",
    "#ffe119",
    "#19e64B"
];