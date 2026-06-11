import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./components/BottomTabNavigator";

// Try to auto-set API base for development environments so physical devices
// and emulators can reach the backend without manual overrides.
(function initApiBase() {
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const Constants = require("expo-constants").default;
    const dbg = Constants.manifest?.debuggerHost || Constants.debuggerHost;
    if (dbg && typeof global !== "undefined") {
      const host = dbg.split(":")[0];
      global.__API_BASE__ = `http://${host}:8000`;
      console.log("Dev: set global.__API_BASE__ to", global.__API_BASE__);
      return;
    }
  } catch (e) {
    // ignore if expo-constants not present
  }

  try {
    // Try to get device IP asynchronously (best-effort)
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const Network = require("expo-network");
    if (Network && Network.getIpAddressAsync) {
      Network.getIpAddressAsync()
        .then((ip) => {
          if (ip && typeof global !== "undefined") {
            global.__API_BASE__ = `http://${ip}:8000`;
            console.log("Dev: set global.__API_BASE__ to", global.__API_BASE__);
          }
        })
        .catch(() => {});
    }
  } catch (e) {
    // ignore
  }
})();

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
