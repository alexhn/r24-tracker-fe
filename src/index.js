import React from "react";
import ReactDOM from "react-dom";

import Application from "./Application";

const render = (Component) => {
    return ReactDOM.render(
        <Component />,
      document.getElementById("root")
    );
};

const component = function () {
    return <Application />
};

render(component);