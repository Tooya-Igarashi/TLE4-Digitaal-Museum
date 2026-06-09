import { Platform } from "react-native";

let _cachedHost = null;

async function detectHost() {
  if (
    typeof global !== "undefined" &&
    typeof global.__API_BASE__ === "string"
  ) {
    return global.__API_BASE__;
  }

  // Prefer explicit environment / Expo config values when provided
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const Constants = require("expo-constants").default;
    const extra = Constants.manifest?.extra || {};
    if (extra.API_BASE || extra.apiBase) return extra.API_BASE || extra.apiBase;
  } catch (e) {
    // ignore
  }

  // Also allow bundler/runtime env vars (web or EAS)
  if (typeof process !== "undefined") {
    if (process.env.EXPO_PUBLIC_API_BASE)
      return process.env.EXPO_PUBLIC_API_BASE;
    if (process.env.API_BASE) return process.env.API_BASE;
  }

  // Try Expo debugger host first
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const Constants = require("expo-constants").default;
    const dbg = Constants.manifest?.debuggerHost || Constants.debuggerHost;
    if (dbg) {
      const host = dbg.split(":")[0];
      // port preference from Expo config or env
      let port = 8000;
      try {
        // eslint-disable-next-line global-require, import/no-extraneous-dependencies
        const Constants = require("expo-constants").default;
        const extra = Constants.manifest?.extra || {};
        if (extra.EXPRESS_PORT || extra.expressPort)
          port = extra.EXPRESS_PORT || extra.expressPort;
      } catch (e) {}
      if (typeof process !== "undefined") {
        if (process.env.EXPRESS_PORT) port = process.env.EXPRESS_PORT;
      }
      return `http://${host}:${port}`;
    }
  } catch (e) {
    // ignore
  }

  // Try expo-network to resolve device ip (physical device)
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const Network = require("expo-network");
    if (Network && Network.getIpAddressAsync) {
      const ip = await Network.getIpAddressAsync();
      if (ip) {
        let port = 8000;
        try {
          // eslint-disable-next-line global-require, import/no-extraneous-dependencies
          const Constants = require("expo-constants").default;
          const extra = Constants.manifest?.extra || {};
          if (extra.EXPRESS_PORT || extra.expressPort)
            port = extra.EXPRESS_PORT || extra.expressPort;
        } catch (e) {}
        if (typeof process !== "undefined") {
          if (process.env.EXPRESS_PORT) port = process.env.EXPRESS_PORT;
        }
        return `http://${ip}:${port}`;
      }
    }
  } catch (e) {
    // ignore
  }

  // final fallbacks: respect env or expo config port if present
  let port = 8000;
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const Constants = require("expo-constants").default;
    const extra = Constants.manifest?.extra || {};
    if (extra.EXPRESS_PORT || extra.expressPort)
      port = extra.EXPRESS_PORT || extra.expressPort;
  } catch (e) {}
  if (typeof process !== "undefined" && process.env.EXPRESS_PORT)
    port = process.env.EXPRESS_PORT;

  if (Platform.OS === "android") return `http://10.0.2.2:${port}`;
  // iOS simulator can reach the host machine via 145.24.237.81
  if (Platform.OS === "ios") return `http://145.24.237.81:${port}`;
  return `http://145.24.237.81:${port}`;
}

async function getBase() {
  if (_cachedHost) return _cachedHost;
  _cachedHost = await detectHost();
  try {
    // eslint-disable-next-line no-console
    console.log("Resolved API base:", _cachedHost);
  } catch (e) {}
  return _cachedHost;
}

async function safeJson(res) {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function getUsers() {
  const base = await getBase();
  try {
    const url = `${base}/users`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    return safeJson(res);
  } catch (e) {
    throw new Error(`Network error fetching users from ${base}: ${e.message}`);
  }
}

export async function getWalls() {
  const base = await getBase();
  try {
    const url = `${base}/walls`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    return safeJson(res);
  } catch (e) {
    throw new Error(`Network error fetching walls from ${base}: ${e.message}`);
  }
}

export async function getPieces() {
  const base = await getBase();
  try {
    const url = `${base}/pieces`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    return safeJson(res);
  } catch (e) {
    throw new Error(`Network error fetching pieces from ${base}: ${e.message}`);
  }
}

export async function toAbsolute(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = await getBase();
  return `${base}${path}`;
}

export default { getUsers, getWalls, getPieces, toAbsolute, getBase };
