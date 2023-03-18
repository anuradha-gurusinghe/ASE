import { useEffect, useState } from 'react';
import {
  getAllData,
  addData,
  updateData,
  deleteData
} from '../../../../http/http-requests';

import Button from '@mui/material/Button';
import InputComponent from '../../../../components/InputComponent';
import SpaceBoxComponent from '../../../../components/SpaceBoxComponent';
import ModalComponent from '../../../../components/Modal';
import CardComponent from '../../../../components/card';
import CircularIndeterminate from '../../../../components/progress';
import DropDown from 'src/components/dropdown';
import FilterComponent from 'src/components/filter';
import axios from 'axios';

const requestStatus = [
  'PENDING',
  'APPROVED',
  'FAILED',
  'CANCELED',
  'ASK_FOR_TIME_CHANGE'
];

const FailedTokans = () => {
  const [requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stations, setStations] = useState([]);
  const [station, setStation] = useState('');
  const [user, setUser] = useState('');
  const [search, setSearch] = useState('');
  const [failedStattion, setfailedStattion] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataUpdateToggle, setDataUpdateToggle] = useState(false);

  const identifyUser = (index) => {
    const specificUser = requests.find((user) => user.id === index);
    setUser(specificUser);
  };

  useEffect(() => {
    getUserData();
    getStationData();
  }, [dataUpdateToggle]);

  useEffect(() => {
    if (allUsers.length > 0) {
      if (station === 'All') {
        setRequests(allUsers);
        return;
      }
      const allReqs = allUsers;
      const allStation = [...stations];
      const filteredReqs = allReqs.filter((req) => req.station === station);

      setRequests((_: any) => filteredReqs);
    }
  }, [station]);

  console.log(failedStattion);

  useEffect(() => {
    if (search) {
      const searchedUsers = allUsers.filter((user) =>
        user?.name?.toLowerCase().includes(search.toLowerCase())
      );
      setRequests(() => [...searchedUsers]);
    } else {
      setRequests(allUsers);
    }
  }, [search]);

  const getUserData = async () => {
    setIsLoading(true);
    const response = await getAllData('requests');
    setIsLoading(false);
    const { status, data } = response;
    if (status) {
      for (const d of data) {
        if (d.reqStatus === 'APPROVED' && new Date(d.date) < new Date()) {
          setRequests((prev) => [...prev, d]);
          setAllUsers((prev) => [...prev, d]);
        }
      }
    }
  };

  const getStationData = async () => {
    setIsLoading(true);
    const response = await getAllData('stations');
    setIsLoading(false);
    const { status, data } = response;
    if (status) {
      data.push({ name: 'All' });
      setStations(data);
    }
  };

  if (isLoading) {
    return <CircularIndeterminate />;
  }

  return (
    <div style={{ width: '95%', margin: '1rem auto' }}>
      <FilterComponent
        arr={stations}
        value={station}
        setValue={setStation}
        label="Select Fuel Station"
      />
      <ModalComponent setItem={setUser} open={open} setOpen={setOpen} name="">
        <CreateAndUpdateSection
          dataUpdateToggle={dataUpdateToggle}
          setDataUpdateToggle={setDataUpdateToggle}
          user={user}
          setOpen={setOpen}
          setUser={setUser}
          stations={stations}
        />
      </ModalComponent>

      {/* list of users */}
      <ListSection
        users={requests}
        setOpen={setOpen}
        identifyUser={identifyUser}
      />
    </div>
  );
};

const CreateAndUpdateSection = (props) => {
  const {
    setUser,
    setOpen,
    user: fuReqs,
    dataUpdateToggle,
    setDataUpdateToggle,
    stations
  } = props;

  const [name, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');
  const [stocks, setStocks] = useState('');
  const [time, setTime] = useState('');
  const [unit, setUnit] = useState('');
  const [correctSt, setcorrectSt] = useState<any>('');
  const [isNeedChange, setNeedChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fuReqs) {
      const { station, stocks, reqStatus, date, time, units } = fuReqs;
      setTitle(station);
      setStatus(reqStatus);
      setStocks(stocks);
      setDate(date);
      setTime(time);
      setUnit(units);

      const allSt = [...stations];
      const findSt = allSt.find((s) => s.name === station);
      setcorrectSt(findSt);
    }
  }, [fuReqs]);

  console.log(correctSt);

  const sendStockToStation = async () => {
    // update the station units

    setIsLoading(true);
    const doc = {
      name,
      stocks,
      reqStatus: 'RE-STOCKS',
      date,
      time
    };
    Object.keys(doc).forEach((k) => doc[k] == null && delete doc[k]);
    // await updateData('requests', fuReqs.id, doc);

    // update the request status
    await updateData('stations', correctSt.id, {
      ...correctSt,
      stocks: +correctSt.stocks + +unit
    });

    // send the email
    try {
      const response = await axios.post(
        'http://localhost:4200/api/send-email',
        { email: 'user.email', status, user: '' }
      );
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
    setDataUpdateToggle(!dataUpdateToggle);
    setOpen(false);
    setUser(null);
  };

  return (
    <div>
      <DropDown
        label="Request status"
        select={'FAILED'}
        setSelect={setStatus}
        items={['FAILED']}
        disabled={true}
      />

      <InputComponent
        label="Date"
        value={date}
        setValue={setDate}
        disabled={status === 'ASK_FOR_TIME_CHANGE' ? false : true}
      />
      <InputComponent
        label="Time"
        value={time}
        setValue={setTime}
        disabled={status === 'ASK_FOR_TIME_CHANGE' ? false : true}
      />
      <InputComponent
        label="Station Name!"
        value={name}
        setValue={setTitle}
        disabled={true}
      />

      <InputComponent
        type="number"
        label="Fuel units"
        value={unit}
        setValue={setUnit}
        disabled={true}
      />

      <SpaceBoxComponent>
        {isLoading ? (
          <CircularIndeterminate />
        ) : (
          <Button variant="contained" onClick={sendStockToStation}>
            {'SEND FUEL UNITS TO STATION'}
          </Button>
        )}
      </SpaceBoxComponent>
    </div>
  );
};

const ListSection = (props) => {
  const { users: items, setOpen, identifyUser } = props;
  const editHandler = (index) => {
    identifyUser(index);
    setOpen(true);
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-start',
        gap: '1rem',
        flexWrap: 'wrap'
      }}
    >
      {items.map((item) => (
        <CardComponent
          mainHeader={item.name}
          dis={`Stocks - ${item.stocks}`}
          editHandler={editHandler}
          key={item.id}
          {...item}
        />
      ))}
    </div>
  );
};

export default FailedTokans;
