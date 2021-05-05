import ReactTimeAgo from 'react-time-ago';

export default function List(props) {
    return (
        <div className="list">
            <table>
                <thead>
                    <tr>
                        <td>City</td>
                        <td align="center">Current AQI</td>
                        <td align="center">Last updated</td>
                    </tr>
                </thead>
                <tbody>
                    {props.cities.length > 0 ?
                        props.cities.map((item, index) => {
                            return (<tr 
                                key ={index} 
                                onClick={() => props.handleRowClick(item, index)}>
                                <td>{item.city}</td>
                                <td align="center"
                                className={
                                    item.aqi.toFixed(2) < 51 ? 'bgcolor__1' : 
                                    item.aqi.toFixed(2) < 101 ? 'bgcolor__2' : 
                                    item.aqi.toFixed(2) < 201 ? 'bgcolor__3' : 
                                    item.aqi.toFixed(2) < 301 ? 'bgcolor__4' : 
                                    item.aqi.toFixed(2) < 401 ? 'bgcolor__5' : 
                                    item.aqi.toFixed(2) < 501 ? 'bgcolor__6' : 'bgcolor__6' 
                                }>{item.aqi.toFixed(2)}</td>
                                <td align="center"><ReactTimeAgo date={item.time} locale="en-US"/></td>
                            </tr>)
                        })
                    : 
                    <tr><td colSpan="3"><p align="center">No Data Found</p></td></tr>}
                </tbody>
            </table>
        </div>
    );
}