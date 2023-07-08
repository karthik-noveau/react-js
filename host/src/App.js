import React, { Suspense } from "react";
 import App1 from "app1/App";
const App2 = React.lazy(() => import("app2/App"));

const App = () => {
  return (
    <div>
      <div style={{
        margin: "10px",
        padding: "10px",
        textAlign: "center",
        backgroundColor: "greenyellow"
      }}>
        <h1>Host</h1>
      </div>
    
        <App1 />
  
      <Suspense fallback={"loading..."}>
        <App2 />
      </Suspense>
    </div>)
}


export default App;
