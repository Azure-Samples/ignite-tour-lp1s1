import React from "react";
import { Column, Table, AutoSizer } from "react-virtualized";

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      start: 1,
      stop: 10
    };

    this.interval = null;

    this.modRowsShowing = this.modRowsShowing.bind(this);
    this.getInventory = this.getInventory.bind(this);
  }
  componentDidMount() {
    fetch("http://localhost:8000/api/products")
      .then(data => data.json())
      .then(({ items }) => {
        this.setState({ rows: items });
        this.interval = setInterval(this.getInventory, 5000);
      });
  }
  getInventory() {
    const nums = Array.from({ length: this.state.stop - this.state.start })
      .map((_, index) => index + this.state.start)
      .join(",");
    fetch(`http://localhost:5000/api/inventory?skus=${nums}`)
      .then(data => data.json())
      .then(skus => {
        let newRows = Array.from(this.state.rows);
        skus.forEach(sku => {
          newRows[sku.sku - 1].inventory = sku.quantity;
        });

        this.setState({ rows: newRows });
      });
  }
  modRowsShowing({ overscanStartIndex, overscanStopIndex }) {
    this.setState({
      start: overscanStartIndex,
      stop: overscanStopIndex
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
              onRowsRendered={this.modRowsShowing}
            >
              <Column width={80} label="ID" dataKey="id" />
              <Column width={300} label="Name" dataKey="name" />
              <Column width={300} label="SKU" dataKey="sku" />
              <Column width={100} label="Price" dataKey="price" />
              <Column width={200} label="Supplier" dataKey="supplierName" />
              <Column width={200} label="Inventory" dataKey={"inventory"} />
            </Table>
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default ProductTable;
