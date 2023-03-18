import { useEffect, useState } from 'react';
import { getAllData } from '../../../../http/http-requests';

import InputComponent from '../../../../components/InputComponent';
import ModalComponent from '../../../../components/Modal';
import CardComponent from '../../../../components/card';
import CircularIndeterminate from '../../../../components/progress';
import DropDown from 'src/components/dropdown';
import FilterComponent from 'src/components/filter';

const RestockesTokans = () => {
  const [requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stations, setStations] = useState([]);
  const [station, setStation] = useState('');
  const [user, setUser] = useState('');
  const [search, setSearch] = useState('');
  const [amount, setAmount] = useState<any>('');
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
      let am = 0;
      for (const d of data) {
        if (d.reqStatus === 'RE-STOCKS') {
          setRequests((prev) => [...prev, d]);
          setAllUsers((prev) => [...prev, d]);
          am += +d.units;
        }
      }

      setAmount(am);
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
      <h1> All Re Stocked Amount - {amount} </h1>
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
  const { user: fuReqs, stations } = props;

  const [name, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [stocks, setStocks] = useState('');
  const [time, setTime] = useState('');
  const [unit, setUnit] = useState('');

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
    }
  }, [fuReqs]);

  return (
    <div>
      <DropDown
        label="Request status"
        select={'RE-STOCKS'}
        setSelect={setStatus}
        items={['RE-STOCKS']}
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

export default RestockesTokans;
