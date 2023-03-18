import { useEffect, useState } from 'react';
import {
  getAllData,
  addData,
  updateData,
  deleteData
} from 'src/http/http-requests';

import InputComponent from 'src/components/InputComponent';
import ModalComponent from 'src/components/Modal';
import CardComponent from 'src/components/card';
import CircularIndeterminate from 'src/components/progress';

const VehicleList = () => {
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
    getUserData();
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
      setRequests(allUsers);
    }
  }, [search]);

  const getUserData = async () => {
    setIsLoading(true);
    const response = await getAllData('Vehicle');

    setIsLoading(false);
    const { status, data } = response;

    if (status) {
      setRequests(data);
      setAllUsers(data);
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
    user: vehicle,
    dataUpdateToggle,
    setDataUpdateToggle
  } = props;

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [chassiNumber, setChassiNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (vehicle) {
      const { chassiNumber, id, ownerID, status, vehicleNumber, vehicleType } =
        vehicle;
      setVehicleNumber(vehicleNumber);
      setVehicleType(vehicleType);
      setChassiNumber(chassiNumber);
      setOwnerId(ownerID);
      setStatus(status);
    }
  }, [vehicle]);

  return (
    <div>
      <InputComponent
        label="Vehicle Number"
        value={vehicleNumber}
        setValue={setVehicleNumber}
        disabled={true}
      />
      <InputComponent
        label="Vehicle Type"
        value={vehicleType}
        setValue={setVehicleType}
        disabled={true}
      />

      <InputComponent
        label="Owner Id"
        value={ownerId}
        setValue={setOwnerId}
        disabled={true}
      />

      <InputComponent
        label="Status"
        value={status}
        setValue={setStatus}
        disabled={true}
      />

      <InputComponent
        label="Chassi Number"
        value={chassiNumber}
        setValue={setChassiNumber}
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
          dis={`Vehicle Number - ${item.vehicleNumber}`}
          editHandler={editHandler}
          key={item.id}
          {...item}
        />
      ))}
    </div>
  );
};

export default VehicleList;
