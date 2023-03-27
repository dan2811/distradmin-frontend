import * as React from 'react';
import { Admin, fetchUtils, Resource } from 'react-admin';
import { EventCreate } from './Components/Events/create';
import { EventList } from './Components/Events/list';
import { EventShow } from './Components/Events/show';
import { MusicianList } from './Components/Musicians/list';
import { DataProvider } from './DataProvider/index';
import { SetShow } from './Components/Sets/show.js';
import { MusicianCreate } from './Components/Musicians/create.js';
import { MusicianEdit } from './Components/Musicians/edit.js';
import { InstrumentsList } from './Components/Instruments/list';
import { InstrumentCreate } from './Components/Instruments/create';
import { MusicianShow } from './Components/Musicians/show';
import { InstrumentEdit } from './Components/Instruments/edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import PianoIcon from '@mui/icons-material/Piano';
import FestivalIcon from '@mui/icons-material/Festival';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CustomLoginPage from './Auth/CustomLoginPage';
import { EventEdit } from './Components/Events/edit';
import PackagesList from './Components/Packages/list';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { PackageShow } from './Components/Packages/show';
import { PackageCreate } from './Components/Packages/create';
import { AuthProvider } from './Auth/AuthProvider';
import { JobCreate } from './Components/Jobs/create';
import UsersList from './Components/Users/list';
import { UserCreate } from './Components/Users/create';
import { UserEdit } from './Components/Users/edit';
import { PackageEdit } from './Components/Packages/edit';
import EventTypesList from './Components/Event-types/list';
import { EventTypeShow } from './Components/Event-types/show';
import { EventTypeCreate } from './Components/Event-types/create';
import { EventTypeEdit } from './Components/Event-types/edit';
import { ClientList } from './Components/Clients/list';
import { ClientCreate } from './Components/Clients/create';
import { ClientShow } from './Components/Clients/show';
import { ClientEdit } from './Components/Clients/edit';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const token = localStorage.getItem('token');
  options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

const dataProvider = DataProvider(
  `${process.env.REACT_APP_BACKEND_URL}/api`,
  httpClient
);

const App = () => {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={AuthProvider}
      loginPage={CustomLoginPage}
    >
      <Resource
        name='events'
        edit={EventEdit}
        list={EventList}
        show={EventShow}
        create={EventCreate}
        icon={CalendarMonthIcon}
        recordRepresentation={(record) =>
          `${new Date(record.date).toLocaleDateString()} - ${record.location}`
        }
      />
      <Resource
        name='clients'
        list={ClientList}
        show={ClientShow}
        edit={ClientEdit}
        create={ClientCreate}
        icon={EmojiPeopleIcon}
      />
      <Resource
        name='musicians'
        list={MusicianList}
        create={MusicianCreate}
        edit={MusicianEdit}
        show={MusicianShow}
        icon={GroupsIcon}
      />
      <Resource name='jobs' create={JobCreate} />
      <Resource name='sets' show={SetShow} />
      <Resource name='songs' />
      <Resource
        name='instruments'
        list={InstrumentsList}
        create={InstrumentCreate}
        edit={InstrumentEdit}
        icon={PianoIcon}
        recordRepresentation='name'
      />
      <Resource
        name='packages'
        icon={NightlifeIcon}
        list={PackagesList}
        show={PackageShow}
        create={PackageCreate}
        edit={PackageEdit}
        recordRepresentation='name'
      />
      <Resource
        name='types'
        icon={FestivalIcon}
        list={EventTypesList}
        show={EventTypeShow}
        create={EventTypeCreate}
        edit={EventTypeEdit}
        recordRepresentation='name'
      />
      <Resource
        name='admins'
        icon={AdminPanelSettingsIcon}
        list={UsersList}
        edit={UserEdit}
        create={UserCreate}
        recordRepresentation='name'
      />
    </Admin>
  );
};
export default App;
