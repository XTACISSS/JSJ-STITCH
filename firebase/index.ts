
import {initializeApp, getApp, App} from 'firebase-admin/app';
import {getAuth, Auth} from 'firebase-admin/auth';
import { getFirestore ,Firestore } from "firebase-admin/firestore";
import config from './config'

//credentials
interface FireBaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/**
 * Firebase Instance
 * @class Firebase Service
 * @constructor Initialize the service with a default config if no one was provided.
 * @getAuth return the Auth instance for the default App.
 * @getFirebase return the default App
 * @getFireStore return the FireStore instance for the default App
 * @method  init(config) Initialize the service with the config provided in the constructor
 */
class FirebaseInstance {
  private app: App;

  get Auth(): Auth{
    return getAuth(this.app);
  }

  get Firebase(): App {
    return getApp();
  }
  get FireStore(): Firestore {
    return getFirestore(this.app);
  }

  constructor(config: FireBaseConfig) {
    this.app = this.init(config);
  }

  init(config: FireBaseConfig): App {
    try {
      return getApp();
    } catch (error) {
      console.log(
        `No app running, creating a new instance with the id: ${config.appId}`
      );
      return initializeApp(config);
    }
  }
}

const firebaseApp = new FirebaseInstance(config);
export default firebaseApp;
