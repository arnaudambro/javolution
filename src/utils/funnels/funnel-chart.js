import React from 'react';
import 'funnel-graph-js/dist/css/main.min.css';
import 'funnel-graph-js/dist/css/theme.min.css';
import FunnelGraph from 'funnel-graph-js';

class FunnelChart extends React.Component {
  componentDidMount() {
    if (this.props.data) this.drawChart();
  }

  drawChart = () => {
    const { container, data } = this.props;
    const graph = new FunnelGraph({
      container: `.${container}`,
      gradientDirection: 'horizontal',
      direction: 'horizontal',
      height: 300,
      ...data,
      // color: ['orange', 'red'],
      // data: {
      //   labels: ['Impressions', 'Add To Cart', 'Buy'],
      //   subLabels: ['Direct', 'Social Media', 'Ads'],
      //   colors: [['#FFB178', '#FF78B1', '#FF3C8E'], '#fdae7c', ['blue']],
      //   values: [
      //     [2000, 4000, 6000],
      //     [3000, 1000, 1700],
      //     [200, 30, 130],
      //   ],
      // },
      // displayPercent: true,
    });

    graph.draw();
  };

  render() {
    return (
      <div
        className={`${this.props.container}-container`}
        style={{
          width: '100%',
          backgroundColor: '#393862',
          paddingTop: 30,
          paddingBottom: 30,
          marginBottom: 30,
          marginTop: 30,
        }}>
        <div className={this.props.container} style={{ width: '100%', paddingTop: 100 }} />
      </div>
    );
  }
}

export default FunnelChart;
