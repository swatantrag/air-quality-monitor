import React from 'react';
import { Line } from 'react-chartjs-2';

export default class city extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: this.props.cities,
            index: [this.props.city.aqi]
        }
    }

    render() {
        let graph = this.state.index;
        if (!this.state.index.find(aqi => aqi === this.props.cities[this.props.city.index].aqi.toFixed(2))) {
            graph.push(this.props.cities[this.props.city.index].aqi.toFixed(2));
        }
        const data = {
            labels: Array.from(Array(graph.length + 1).keys()),
            datasets: [
              {
                label: 'Air Quility Report',
                fill: true,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: graph
              }
            ]
        };
        return (
            <div className="list">
                <h4>City: {this.props.city.city}</h4>
                <Line  data={data} options={{scales:{y:{beginAtZero:true}}}} />
            </div>
        );
    }
}