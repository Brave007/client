import EntityProperties from "./entityProperties/EntityProperties";
import TableManagerRequest from "../../../api/table-manager/TableManagerRequest";
import GcReservedStockOutOrderMLotProperties from "./GcReservedStockOutOrderMLotProperties";
import ReservedOrderTable from "../../../components/Table/gc/ReservedOrderTable";

/**
 * 真空包备货
 */
export default class GcOrderReservedProperties extends EntityProperties{

    static displayName = 'GcOrderReservedProperties';
    
     /**
     * 当表格里数据做完操作之后，务必调用下此方法把扫描添加进去的state数据清零。不然会把上一次的扫描结果一起带到下一次中去
     */
    resetData = () => {
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
          tableData: [],
          loading: false,
          resetFlag: true
        });
    }

    getTableData = () => {
        const self = this;
        let requestObject = {
          tableRrn: this.state.tableRrn,
          success: function(responseBody) {
            self.setState({
              tableData: responseBody.dataList,
              table: responseBody.table,
              loading: false
            }); 
            self.form.handleSearch();
          }
        }
        TableManagerRequest.sendGetDataByRrnRequest(requestObject);
    }
    
    buildTable = () => {
        return <ReservedOrderTable scrollY={200} pagination={false} ref={(orderTable) => { this.orderTable = orderTable }} 
                                    table={this.state.table} data={this.state.tableData} loading={this.state.loading} 
                                    reservedLotTable={this.reservedLotTable}/>
    }

    buildOtherComponent = () => {
        return <GcReservedStockOutOrderMLotProperties 
                  ref={(reservedLotTable) => { this.reservedLotTable = reservedLotTable }} 
                  orderTable={this.orderTable} 
                  tableRrn={9751} 
                  resetFlag={this.state.resetFlag}>

                  </GcReservedStockOutOrderMLotProperties>
    }

}