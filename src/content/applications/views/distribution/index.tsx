import { useEffect, useState } from 'react';
import { getAllData, updateData } from 'src/http/http-requests';

import Button from '@mui/material/Button';
import InputComponent from 'src/components/InputComponent';
import CircularIndeterminate from 'src/components/progress';
import DropDown from 'src/components/dropdown/dropDown2';
import Chart from 'react-apexcharts';
import { Card, Grid, useTheme } from '@mui/material';
import { ApexOptions } from 'apexcharts';

const FuelDistribution = () => {
  const theme = useTheme();

  const [chartSeries, setChartSeries] = useState([100, 0]);

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    colors: ['#ff9900', '#1c81c2', '#333', '#5c6ac0'],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + '%';
      },
      style: {
        colors: [theme.colors.alpha.trueWhite[100]]
      },
      background: {
        enabled: true,
        foreColor: theme.colors.alpha.trueWhite[100],
        padding: 8,
        borderRadius: 4,
        borderWidth: 0,
        opacity: 0.3,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: theme.colors.alpha.black[70],
          opacity: 0.5
        }
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },
    labels: ['AVAILABLE IN MAIN STOCK', 'AVAILABLE IN STATIONS'],
    legend: {
      labels: {
        colors: theme.colors.alpha.trueWhite[100]
      },
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const [fuel, setFuel] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stations, setStations] = useState([]);
  const [station, setStation] = useState<any>('');
  const [costation, setcoStation] = useState<any>('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataUpdateToggle, setDataUpdateToggle] = useState(false);

  const [lts, setLts] = useState('');
  const [availableLts, setAvailableLts] = useState('');

  useEffect(() => {
    getFuelData();
    getStationData();
  }, [dataUpdateToggle]);

  useEffect(() => {
    if (station) {
      const findStation = stations.find(
        (st) => st.name.replace(' ', '-') === station
      );
      setcoStation(findStation);
      const { stocks } = findStation;

      setAvailableLts(stocks);
    }
  }, [station]);

  useEffect(() => {
    if (allUsers.length > 0) {
      if (station === 'All') {
        setFuel(allUsers);
        return;
      }
      const allReqs = fuel;
      const filteredReqs = allReqs.filter((req) => req.station === station);

      setFuel((_: any) => filteredReqs);
    }
  }, [station]);

  const getFuelData = async () => {
    setIsLoading(true);
    const response = await getAllData('fuel');
    setIsLoading(false);
    const { status, data } = response;
    if (status) {
      const stattionFu = data[0].fuel.stations;
      const mainFu = data[0].fuel.main;
      const count = stattionFu + mainFu;
      const mainP = +((+mainFu / +count) * 100).toFixed(2);
      const statP = +((+stattionFu / +count) * 100).toFixed(2);
      setChartSeries((_: any) => [mainP, statP]);
      setFuel(data);
    }
  };

  const getStationData = async () => {
    setIsLoading(true);
    const response = await getAllData('stations');
    setIsLoading(false);
    const { status, data } = response;
    if (status) {
      setStations(data);
    }
  };

  const distributeHandler = async () => {
    setIsLoading(true);

    await updateData('fuel', fuel[0].id, {
      fuel: {
        main: +fuel[0].fuel.main - +lts,
        stations: +fuel[0].fuel.stations + +lts
      }
    });
    await updateData('stations', costation.id, {
      ...costation,
      stocks: +costation.stocks + +lts
    });

    setIsLoading(false);
    setDataUpdateToggle(!dataUpdateToggle);
    setAvailableLts('');
    setStation('');
    setLts('');
  };

  if (isLoading) {
    return <CircularIndeterminate />;
  }

  return (
    <div style={{ width: '95%', margin: '1rem auto' }}>
      <Grid
        xs={12}
        sm={5}
        item
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Chart
          height={250}
          options={chartOptions}
          series={chartSeries}
          type="donut"
        />
      </Grid>
      <Card>
        <div style={{ width: '95%', margin: '1rem auto' }}>
          <h2> DISTRIBUTE </h2>
          <DropDown
            label="Select Station"
            select={station}
            setSelect={setStation}
            items={stations}
          />
          {availableLts && (
            <InputComponent
              label="Available lts"
              value={availableLts}
              setValue={setAvailableLts}
              disabled={true}
            />
          )}

          <InputComponent label="Fuel lts" value={lts} setValue={setLts} />

          <Button onClick={distributeHandler} variant="outlined">
            {' '}
            Distribute{' '}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FuelDistribution;
