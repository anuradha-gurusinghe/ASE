import React, { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router';
const districtsList = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Moneragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya'
];
const StationList = () => {
  const [stations, setStations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [user, setUser] = useState('');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataUpdateToggle, setDataUpdateToggle] = useState(false);

  const identifyUser = (index) => {
    const specificUser = stations.find((user) => user.id === index);
    setUser(specificUser);
  };

  useEffect(() => {
    getUserData();
  }, [dataUpdateToggle]);

  useEffect(() => {
    if (search) {
      const searchedUsers = allUsers.filter((user) =>
        user?.name?.toLowerCase().includes(search.toLowerCase())
      );
      setStations(() => [...searchedUsers]);
    } else {
      setStations(allUsers);
    }
  }, [search]);

  const getUserData = async () => {
    setIsLoading(true);
    const response = await getAllData('stations');
    setIsLoading(false);
    const { status, data } = response;
    if (status) {
      console.log(data);
      setStations(data);
      setAllUsers(data);
    }
  };

  if (isLoading) {
    return <CircularIndeterminate />;
  }

  return (
    <div style={{ width: '95%', margin: '1rem auto' }}>
      <ModalComponent
        setItem={setUser}
        open={open}
        setOpen={setOpen}
        name="Add New Station"
      >
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
        users={stations}
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

  const [name, setTitle] = useState('');
  const [bio, setDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [district, setDestrict] = useState('');
  const [stocks, setStocks] = useState('');
  const [lng, setLongitude] = useState('');
  const [pic, setUrl] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fuStation) {
      const { name, stocks, district } = fuStation;
      setTitle(name);
      setDestrict(district);
      setStocks(stocks);
    }
  }, [fuStation]);

  const addOrUpdateUser = async () => {
    setIsLoading(true);
    const doc = {
      name,
      stocks,
      district
    };
    Object.keys(doc).forEach((k) => doc[k] == null && delete doc[k]);

    if (!fuStation) {
      await addData('stations', doc);
    } else {
      await updateData('stations', fuStation.id, doc);
    }
    setIsLoading(false);
    setDataUpdateToggle(!dataUpdateToggle);
    setOpen(false);
    setUser(null);
  };

  const deleteUser = async () => {
    if (fuStation) {
      setIsLoading(true);
      await deleteData('stations', fuStation.id);
      setIsLoading(false);
      setDataUpdateToggle(!dataUpdateToggle);
    }
    setOpen(false);
    setUser('');
  };

  return (
    <div>
      {/* {isLoading && <CircularIndeterminate />} */}

      <InputComponent label="Station Name" value={name} setValue={setTitle} />
      <DropDown
        label="District"
        select={district}
        setSelect={setDestrict}
        items={districtsList}
      />

      <InputComponent
        type="number"
        label="Available Stocks"
        value={stocks}
        setValue={setStocks}
      />

      <SpaceBoxComponent>
        {!isLoading && fuStation && (
          <Button variant="contained" color="error" onClick={deleteUser}>
            {' '}
            Delete Data{' '}
          </Button>
        )}
        {isLoading ? (
          <CircularIndeterminate />
        ) : (
          <Button variant="contained" onClick={addOrUpdateUser}>
            {' '}
            {fuStation ? 'Update Data' : 'Insert Data'}{' '}
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

export default StationList;
