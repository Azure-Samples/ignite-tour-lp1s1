import React from "react";
import { Column, Table, AutoSizer } from "react-virtualized";

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
      .then(({ items }) => {
        this.setState({ rows: items });
      });
  }
  render() {
    return (
      <div className="table-container">
        <AutoSizer>
          {({ height, width }) => (
            <Table
              width={height}
              height={width}
              headerHeight={20}
              rowHeight={60}
              rowCount={this.state.rows.length}
              rowGetter={({ index }) => this.state.rows[index]}
            >
              <Column width={80} label="ID" dataKey="id" />
              <Column width={300} label="Name" dataKey="name" />
              <Column width={300} label="SKU" dataKey="sku" />
              <Column width={100} label="Price" dataKey="price" />
              <Column width={200} label="Supplier" dataKey="supplierName" />
              <Column
                width={200}
                label="Inventory"
                dataKey={"lol"}
                cellDataGetter={() => 1}
              />
            </Table>
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default ProductTable;
