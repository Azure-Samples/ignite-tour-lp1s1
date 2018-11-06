import React from "react";

class SqlInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {}
    };
  }

  componentDidMount() {
    this.fetchInfo();
  }

  fetchInfo() {
    return fetch(
      `${process.env.INVENTORY_SERVICE_BASE_URL}/api/info`
    )
    .then(data => data.json())
    .then(info => this.setState({ info: info }));
  }
  
  render() {
    return (process.env.DISPLAY_SQL_INFO) ?
      <div class="sql-info">{this.state.info.dataSource} | {this.state.info.databaseEdition}</div> :
      <div></div>;
  }
}

export default SqlInfo;