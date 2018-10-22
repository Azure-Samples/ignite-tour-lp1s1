import React from "react";
import { Column, Table, AutoSizer } from "react-virtualized";
import Modal from "./Modal";
import ProductDetails from "./ProductDetails";

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      start: 1,
      stop: 10,
      selectedRow: null
    };

    this.modRowsShowing = this.modRowsShowing.bind(this);
    this.getInventory = this.getInventory.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  componentDidMount() {
    fetch("http://localhost:8000/api/products")
      .then(data => data.json())
      .then(({ items }) => {
        this.setState({ rows: items });
        this.interval = Date.now() + 2000;
        requestAnimationFrame(this.getInventory);
      });
  }
  getInventory() {
    if (this.interval > Date.now()) {
      requestAnimationFrame(this.getInventory);
      return;
    }

    const nums = Array.from({ length: this.state.stop - this.state.start })
      .map((_, index) => index + this.state.start + 1)
      .join(",");
    fetch(`http://localhost:5000/api/inventory?skus=${nums}`)
      .then(data => data.json())
      .then(skus => {
        for (let i = 0; i < skus.length; i++) {
          // cloning a list of 100,000 is bad
          this.state.rows[+skus[i].sku - 1].inventory = skus[i].quantity; // eslint-disable-line
        }

        this.forceUpdate();
        this.interval = Date.now() + 5000;
        requestAnimationFrame(this.getInventory);
      }, console.error);
  }
  modRowsShowing({ overscanStartIndex, overscanStopIndex }) {
    this.setState({
      start: overscanStartIndex,
      stop: overscanStopIndex
    });
  }
  handleRowClick(rowEvent) {
    this.setState({ selectedRow: rowEvent.rowData });
  }
  handleModalClick(e) {
    if (e.target.id === "modal-interior") {
      this.closeModal();
    }
  }
  closeModal() {
    this.setState({ selectedRow: null });
  }
  render() {
    return (
      <div className="table-container">
        <AutoSizer>
          {({ height, width }) => (
            <Table
              width={height}
              height={width}
              headerHeight={60}
              rowHeight={60}
              rowCount={this.state.rows.length}
              rowGetter={({ index }) => this.state.rows[index]}
              onRowsRendered={this.modRowsShowing}
              rowClassName={({ index }) => (index % 2 ? "row-even" : "row-odd")}
              headerClassName="row-header"
              onRowClick={this.handleRowClick}
            >
              <Column width={80} label="ID" dataKey="id" />
              <Column width={300} label="Name" dataKey="name" />
              <Column width={300} label="SKU" dataKey="sku" />
              <Column width={100} label="Price" dataKey="price" />
              <Column width={200} label="Supplier" dataKey="supplierName" />
              <Column width={200} label="Inventory" dataKey="inventory" />
            </Table>
          )}
        </AutoSizer>
        {!this.state.selectedRow ? null : (
          <Modal>
            <div
              role="none"
              onClick={this.handleModalClick}
              id="modal-interior"
            >
              <div>
                <ProductDetails {...this.state.selectedRow} />
                <div className="buttons">
                  <button className="exit-button" onClick={this.closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default ProductTable;
