/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

AppRegistry.registerComponent(appName, () => App);
