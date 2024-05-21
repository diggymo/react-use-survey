/* eslint-disable @typescript-eslint/no-unused-vars */
import { Suspense, use, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

let cachedPromise: Promise<string> | null = null;

const fetchMyName: () => Promise<string> = () => {
  if (cachedPromise === null) {
    cachedPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve("diggy-mo");
      }, 1000);
    });
    return cachedPromise;
  }

  return cachedPromise;
};
const App = () => {
  console.log("RENDERING!");

  const myName = useCustom(fetchMyName());

  console.log("DATA FETCHED!");

  return <p>{myName}</p>;
};

export const AppContainer = () => {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<div>loading...</div>}>
        <App />
      </Suspense>
    </ErrorBoundary>
  );
};

let cache: Promise<unknown> | null = null;
let resolvedValue:
  | {
      status: "fullfiled";
      value: unknown;
    }
  | {
      status: "rejected";
      error: unknown;
    }
  | null = null;

const useCustom = <T,>(promise: Promise<T>): T => {
  const [, setKey] = useState(0);
  const onForceUpdate = () => {
    setKey((key) => key + 1);
  };

  const isCached = cache !== null;
  console.log({ isResolved: resolvedValue !== null, isCached });
  if (isCached) {
    if (resolvedValue === null) throw cache;
    if (resolvedValue.status === "fullfiled") {
      return resolvedValue.value as T;
    }
    if (resolvedValue !== null && resolvedValue.status === "rejected") {
      throw resolvedValue.error;
    }

    console.warn("不明なステータス", resolvedValue);
  }

  promise
    .then((v) => {
      resolvedValue = { status: "fullfiled", value: v };
      onForceUpdate();
    })
    .catch((error) => {
      resolvedValue = { status: "rejected", error };
      onForceUpdate();
    });

  cache = promise;
  throw promise;
};

const useCustom2 = <T,>(promise: Promise<T>): T => {
  const [, setKey] = useState(0);
  const [finalValue, setFinalValue] = useState<
    | { status: "fullfiled"; value: T }
    | { status: "rejected"; error: unknown }
    | null
  >(null);
  const [savedPromise, setSavedPromise] = useState<Promise<T> | null>(null);

  const onForceUpdate = () => {
    setKey((key) => key + 1);
  };

  const isResolved = finalValue !== null;
  const isCached = savedPromise !== null;
  console.log({ finalValue, savedPromise });
  if (isCached) {
    if (!isResolved) throw savedPromise;
    if (finalValue !== null && finalValue.status === "fullfiled") {
      return finalValue.value as T;
    }
    if (finalValue !== null && finalValue.status === "rejected") {
      throw finalValue.error;
    }

    console.warn("不明なステータス");
  }

  promise
    .then((v) => {
      setFinalValue({ status: "fullfiled", value: v });
      onForceUpdate();
    })
    .catch((error) => {
      setFinalValue({ status: "rejected", error });
      onForceUpdate();
    });

  setSavedPromise(promise);
  throw promise;
};

const registerUser = (email: string) => {
  fetchUserData(email);
};

const fetchUserData = (email: string) => {
  axios.get("/users", {
    email,
  });
};
