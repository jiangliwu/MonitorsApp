import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import { TrayWindow } from './windows/TrayWindow';
import { SettingWindow } from './windows/SettingWindow';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tray-window" element={<TrayWindow />} />
        <Route path="/setting-window" element={<SettingWindow />} />
      </Routes>
    </Router>
  );
}
