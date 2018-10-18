import React from "react";
import { Column, Table } from "react-virtualized";

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: []
    };
  }
  componentDidMount() {
    fetch("http://localhost:8000/api/products")
      .then(data => data.json())
      .then(msg => {
        this.setState({ rows: msg.items });
      });
  }
  render() {
    return (
      <div className="table-container">
        <Table
          width={800}
          height={1000}
          headerHeight={20}
          rowHeight={60}
          rowCount={this.state.rows.length}
          rowGetter={({ index }) => this.state.rows[index]}
        >
          <Column label="Name" dataKey="name" width={200} />
          <Column width={600} label="SKU" dataKey="sku" />
        </Table>
      </div>
    );
  }
}

export default ProductTable;
