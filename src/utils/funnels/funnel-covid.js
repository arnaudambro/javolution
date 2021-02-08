import React from 'react';
import FunnelChart from './funnel-chart';

const daysAgo = days =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const ageField = 'cl_age90';
const getDataForField = (allData, field) =>
  allData.reduce((dataPerAge, data) => {
    if (!dataPerAge[data[ageField]]) dataPerAge[data[ageField]] = 0;
    dataPerAge[data[ageField]] += Number(data[field]);
    return dataPerAge;
  }, {});

class FunnelPyramid extends React.Component {
  state = {
    date: daysAgo(2),
    overallDeathPerAge: {},
    hospitalisationPerAge: {},
    reanimationPerAge: {},
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    // covid data
    const data = await fetch(
      'https://www.data.gouv.fr/fr/datasets/r/08c18e08-6780-452d-9b8c-ae244ad529b3'
    ).then(res => res.text());
    // console.log(data);
    const arraysData = data.split('\n');
    const fields = arraysData[0].split(';').map(field => field.split('"').join(''));
    console.log(fields);
    arraysData.shift();
    const objectsData = arraysData
      .map(data => data.split(';'))
      .map(data => {
        const dataObject = {};
        for (let [index, value] of Object.entries(data)) {
          dataObject[fields[index]] = value.split('"').join('');
        }
        return dataObject;
      });

    const onlyLastData = objectsData.filter(d => d.jour === this.state.date);

    this.setState({
      overallDeathPerAge: getDataForField(onlyLastData, 'dc'),
      hospitalisationPerAge: getDataForField(onlyLastData, 'hosp'),
      reanimationPerAge: getDataForField(onlyLastData, 'rea'),
      isReady: true,
    });
  };

  render() {
    const { isReady } = this.state;
    return <FunnelChart isReady={isReady} container="funnel-pyramid" />;
  }
}

export default FunnelPyramid;
