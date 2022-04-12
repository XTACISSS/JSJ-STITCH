import admin,{ServiceAccount} from 'firebase-admin';
import credentials from './credentials.json'


const Config = {
    credential: admin.credential.cert(credentials as ServiceAccount),
    databaseURL: "",
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };
export default Config