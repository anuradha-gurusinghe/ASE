import { useEffect, useState } from 'react';
import {
  getAllData,
  addData,
  updateData,
  deleteData
} from 'src/http/http-requests';

import Button from '@mui/material/Button';
import InputComponent from 'src/components/InputComponent';
import SpaceBoxComponent from 'src/components/SpaceBoxComponent';
import ModalComponent from 'src/components/Modal';
import CardComponent from 'src/components/card';
import CircularIndeterminate from 'src/components/progress';
import DropDown from 'src/components/dropdown';
import FilterComponent from 'src/components/filter';
import axios from 'axios';
import { useNavigate } from 'react-router';

const requestStatus = [
  'PENDING',
  'APPROVED',
  'CANCELED',
  'ASK_FOR_TIME_CHANGE'
];

const StationList = () => {
  const [requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stations, setStations] = useState([]);
  const [station, setStation] = useState('');
  const [user, setUser] = useState('');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataUpdateToggle, setDataUpdateToggle] = useState(false);

  const identifyUser = (index) => {
    const specificUser = requests.find((user) => user.id === index);
    setUser(specificUser);
  };

  useEffect(() => {
    getRequestData();
    getStationData();
  }, [dataUpdateToggle]);

  useEffect(() => {
    if (allUsers.length > 0) {
      if (station === 'All') {
        setRequests(allUsers);
        return;
      }
      const allReqs = requests;
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
      setRequests(() => [...allUsers]);
    }
  }, [search]);

  const getRequestData = async () => {
    setIsLoading(true);
    setRequests([]);
    setAllUsers([]);
    const response = await getAllData('requests');
    setIsLoading(false);
    const { status, data } = response;
    if (status) {
      for (const d of data) {
        if (
          (d.reqStatus === 'APPROVED' && new Date(d.date) < new Date()) ||
          d.reqStatus === 'RE-STOCKS'
        ) {
          continue;
        }
        setRequests((prev) => [...prev, d]);
        setAllUsers((prev) => [...prev, d]);
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
    user: fuStation,
    dataUpdateToggle,
    setDataUpdateToggle
  } = props;

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [stocks, setStocks] = useState('');
  const [time, setTime] = useState('');
  const [pic, setUrl] = useState('');
  const [isNeedChange, setNeedChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fuStation) {
      const { station, fualAmount, reqStatus, date, time, email } = fuStation;

      setEmail(email);
      setName(station);
      setStatus(reqStatus);
      setStocks(fualAmount);
      setDate(date);
      setTime(time);
    }
  }, [fuStation]);

  const addOrUpdateUser = async () => {
    setIsLoading(true);
    const doc = {
      name,
      stocks,
      reqStatus: status,
      date,
      time
    };
    Object.keys(doc).forEach((k) => doc[k] == null && delete doc[k]);

    if (!fuStation) {
      await addData('requests', doc);
    } else {
      await updateData('requests', fuStation.id, doc);
    }

    // send the email
    try {
      const response = await axios.post(
        'http://localhost:4200/api/send-email',
        { email, status: doc.reqStatus, date, station: name }
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
        select={status}
        setSelect={setStatus}
        items={requestStatus}
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
        label="Station Name"
        value={name}
        setValue={setName}
        disabled={true}
      />

      <InputComponent
        label="Available Stocks"
        value={stocks}
        setValue={setStocks}
        disabled={true}
      />

      <SpaceBoxComponent>
        {isLoading ? (
          <CircularIndeterminate />
        ) : (
          <Button
            disabled={status === 'PENDING'}
            variant="contained"
            onClick={addOrUpdateUser}
          >
            {status === 'FAILED' ? 'SEND FOR FAILED LIST' : status}
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

  console.log(items);

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
          mainHeader=""
          status={`${item.reqStatus}`}
          station={`${item.station}`}
          date={`${item.date}`}
          editHandler={editHandler}
          key={item.id}
          {...item}
        />
      ))}
    </div>
  );
};

export default StationList;
