import React from 'react';
// import {Line} from 'react-chartjs-2';
import List from './list';
import City from './city';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            isList: true,
            isCity: false,
            isInformation: false,
        }
    }

    ws = new WebSocket('ws://city-ws.herokuapp.com/');

    informationColor() {
        return (
            <table className="standards">
                <thead>
                    <tr>
                        <td>Air Quality Index (AQI)</td>
                        <td>CATEGORY</td>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bgcolor__1"><td>0-50</td><td>Good</td></tr>
                    <tr className="bgcolor__2"><td>51-100</td><td>Satisfactory</td></tr>
                    <tr className="bgcolor__3"><td>101-200</td><td>Moderate</td></tr>
                    <tr className="bgcolor__4"><td>201-300</td><td>Poor</td></tr>
                    <tr className="bgcolor__5"><td>301-400</td><td>Very Poor</td></tr>
                    <tr className="bgcolor__6"><td>401-500</td><td>Severe</td></tr>
                </tbody>
            </table>
        );
    }

    handleRoute = (route) => {
        this.setState({
            isList: route === 'list' ? true : false,
            isCity: route === 'city' ? true : false,
            isInformation: route === 'info' ? true : false
        })
    }

    componentDidMount() {
        this.ws.onmessage = evt => {
            // listen to data sent from the websocket server
            const data = JSON.parse(evt.data);
            let newArray = this.state.cities; 
            for (let i = 0; i < data.length; i++){
                const hasElement = newArray.findIndex(item => data[i].city === item.city);
                if (hasElement > -1) {
                    newArray[hasElement].aqi = data[i].aqi;
                    newArray[hasElement].time = new Date().getTime();
                } else {
                    const obj = {
                        ...data[i],
                        time: new Date().getTime()
                    }
                    newArray.push(obj);
                }
            }
            this.setState({ cities: newArray });
        }
    }

    handleRowClick = (item, index) => {
        const city = {
            city: item.city,
            aqi: item.aqi.toFixed(2),
            index: index
        }
        this.setState({ city }, () => {
            this.handleRoute('city');
        });
    }

    render() {   
        return (
            <div className="wrap">
                <div className="header">
                    {!this.state.isList && <span className="btn left" onClick={() => this.handleRoute('list')}>Back</span>}
                    <h2>Air Quality Monitor</h2>
                    {this.state.isList && <span className="btn right" onClick={() => this.handleRoute('info')}>Check Standards</span>}
                </div>
                {this.state.isList && <List cities={this.state.cities} handleRowClick={this.handleRowClick} />}
                {this.state.isInformation && this.informationColor()}
                {this.state.isCity && <City cities={this.state.cities} city={this.state.city}/>}
            </div>
        );
    }
}