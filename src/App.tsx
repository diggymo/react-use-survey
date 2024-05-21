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
  const [count, setCount] = useState(0);

  let myName;
  try {
    myName = use(fetchMyName());
  } catch (err) {
    console.log({ err });
  }

  console.log("DATA FETCHED!");

  return (
    <div>
      <p>{myName}</p>
      <button onClick={() => setCount(count + 1)}>{count}</button>;
    </div>
  );
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
