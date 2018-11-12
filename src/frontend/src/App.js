import React from "react";
import { render } from "react-dom";
import Nav from "./Nav";
import ProductTable from "./ProductTable";
import Timings from "./Timings";
import SqlInfo from "./SqlInfo";

const instrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
if (instrumentationKey) {
  import("./app-insights");
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productsTiming: -1,
      inventoryTiming: -1
    };

    this.setTiming = this.setTiming.bind(this);
  }
  setTiming(productsTiming, inventoryTiming) {
    if (!document.URL.includes("timings")) {
      return;
    }

    const newState = {};

    if (productsTiming) {
      newState.productsTiming = productsTiming;
    }

    if (inventoryTiming) {
      newState.inventoryTiming = inventoryTiming;
    }

    this.setState(newState);
  }
  render() {
    return (
      <div>
        <Nav />
        <ProductTable setTiming={this.setTiming} />
        <SqlInfo />
        <Timings
          productsTiming={this.state.productsTiming}
          inventoryTiming={this.state.inventoryTiming}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
