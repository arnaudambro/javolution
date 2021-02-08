import React from 'react';
import FunnelChart from './funnel-chart';
import pyramid2018 from '../data/pyramide-2018.json';
import pyramid2019 from '../data/pyramide-2019.json';
import pyramid2020 from '../data/pyramide-2020.json';
import pyramid2021 from '../data/pyramide-2021.json';
import Input, { InputContainer } from '../../components/Input';
import Toggle from '../../components/Toggle';

const getPercent = (oldValue, newValue) => (1000 - Math.round((newValue * 1000) / oldValue)) / 10;

class FunnelPyramid extends React.Component {
  state = {
    year: 2021 - 84,
    age: 84,
    data: null,
    dataCovid: null,
    period: '2018',
  };

  componentDidMount() {
    this.getData();
  }

  onChangeAge = e => {
    if (!e.target.value) return this.setState({ age: '' });
    const age = parseInt(e.target.value, 10);
    clearTimeout(this.ageTimeout);
    if (!age) return this.setState({ age });
    this.setState({ age }, function() {
      this.ageTimeout = setTimeout(() => {
        const newYear = 2021 - age;
        this.setState({ year: newYear }, this.getData);
      }, 250);
    });
  };

  onChangeYear = e => {
    const year = parseInt(e.target.value, 10);
    if (e.target.value.length < 4) return this.setState({ year });
    this.setState({ year, age: 2021 - year }, this.getData);
  };

  onChangePeriod = e => {
    const period = e.target.checked ? '2019' : '2018';
    this.setState({ period }, this.getData);
  };

  getData = () => {
    const { year, period } = this.state;
    clearTimeout(this.waitForItTimeout);
    // if (!age || !year) return;
    // if (age < 4) {
    //   this.waitForItTimeout = setTimeout(() => {
    //     alert('Choisissez un âge entre 4 et 96 ans');
    //     return this.setState({ age: 4, year: 2021 - 4 }, this.getData);
    //   }, 2500);
    //   return;
    // }
    // if (age > 95) {
    //   alert('Choisissez un âge entre 4 et 96 ans');
    //   return this.setState({ age: 96, year: 2021 - 96 }, this.getData);
    // }
    if (!year) return;
    const populationIn2018 = pyramid2018.perYear[year];
    const populationIn2019 = pyramid2019.perYear[year];
    const populationIn2020 = pyramid2020.perYear[year];
    const setLeft = period === '2018' ? populationIn2018 : populationIn2019;
    const setRight = period === '2018' ? populationIn2019 : populationIn2020;
    const age = parseInt(period, 10) - 1 - year;
    const deaths = setLeft - setRight;
    // covid year
    const deathsForSameAgeInNormalYear =
      period === '2018'
        ? pyramid2018.perYear[year - 3] - pyramid2019.perYear[year - 2]
        : pyramid2019.perYear[year - 2] - pyramid2020.perYear[year - 1];
    const populationIn2021 = pyramid2021.perYear[year];
    const covidYearDeath = populationIn2020 - populationIn2021;
    const covidDeath = Math.max(covidYearDeath - deathsForSameAgeInNormalYear, 0);
    this.setState({
      percent: Math.max(0, getPercent(setLeft, setRight)),
      percentCovid: Math.max(0, getPercent(populationIn2020, populationIn2021)),
      morePeople: deaths < 0,
      morePeopleCovid: covidYearDeath < 0,
      data: {
        color: ['orange', 'red'],
        data: {
          labels: [
            `${age} ans fin ${parseInt(period, 10) - 1}`,
            `${age + 1} ans fin ${parseInt(period, 10)}`,
          ],
          colors: ['#fdae7c'],
          values: [setLeft, setRight],
        },
        displayPercent: true,
      },
      dataCovid: {
        color: ['orange', 'red'],
        data: {
          labels: [`${age} ans fin 2019`, `${age + 1} ans fin 2020`],
          subLabels: ['Morts "naturelles"', 'Morts "COVID"'],
          colors: ['#fdae7c', 'blue'],
          values: [
            [populationIn2020, 0],
            [populationIn2021 - covidDeath, covidDeath],
          ],
        },
        displayPercent: true,
      },
    });
  };

  renderInputs() {
    const { age, year } = this.state;
    return (
      <InputContainer>
        {/* <Input label="Âge" name="age" value={age} onChange={this.onChangeAge} type="number" /> */}
        <Input
          label="Année de naissance"
          name="year"
          value={year}
          onChange={this.onChangeYear}
          type="number"
        />
      </InputContainer>
    );
  }

  render() {
    const { data, dataCovid, percent, period, year, morePeople, morePeopleCovid } = this.state;
    const age = parseInt(period, 10) - year;
    return (
      <>
        <p>
          Voici un funnel tiré de la pyramide des âges : il montre l'évolution d'une génération sur
          2 ans.
        </p>
        {this.renderInputs()}
        <InputContainer>
          <span>De fin 2017 à fin 2018</span>
          <Toggle checked={period === '2019'} onChange={this.onChangePeriod} />
          <span>De fin 2018 à fin 2019</span>
        </InputContainer>
        <FunnelChart
          key={`${JSON.stringify(data)}-data-pyramid`}
          container="funnel-pyramid-2018-2019-2020"
          data={data}
        />
        <p>
          {percent > 0
            ? `Interprétation possible : ${percent}% de ceux qui ont eu ${age} ans en ${period} sont morts dans l'année`
            : `Interprétation possible : Très peu de personnes de ${age} ans meurent dans l'année. `}
          {Boolean(morePeople) &&
            `Vous voyez qu'il y a plus de personnes de ${year} en ${period}. Ce n'est pas logique, mais je crois que ça s'explique si la pyramide des âges inclut aussi les naturalisations. Si vous en voyez d'autres, dites-moi !`}
        </p>
        <p>
          On peut comparer cette évolution en période normale à l'évolution en 2020, année COVID
          dans laquelle il y a eu plus de décès. Je mets en bleu le surplus de décès par rapport à
          l'année normale {period} au même âge.
        </p>
        {this.renderInputs()}
        <FunnelChart
          key={JSON.stringify(dataCovid)}
          key={`${JSON.stringify(dataCovid)}-data-covid`}
          container="funnel-pyramid-2019-2020-2021"
          data={dataCovid}
        />
        {Boolean(morePeopleCovid) &&
          `Vous voyez qu'il y a plus de personnes de ${year} en ${period}. Ce n'est pas logique, mais je crois que ça s'explique si la pyramide des âges inclut aussi les naturalisations. Si vous en voyez d'autres, dites-moi !`}
      </>
    );
  }
}

export default FunnelPyramid;
