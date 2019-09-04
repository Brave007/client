
import TableManagerRequest from '../../../../api/table-manager/TableManagerRequest';
import EntityScanProperties from './EntityScanProperties';

/**
 * 默认不显示数据，支持双重扫描数据，即2个文本查找条件进行查找。
 *  根据第一个条件是查找数据库输几局，第二个条件就是查找数据数据库以及判断是否在表格中。 有则标记成scanned
 *  
 */
export default class EntityDoubleScanProperties extends EntityScanProperties {
  
    static displayName = 'EntityDoubleScanProperties';

    nextQueryNodeFocus = () => {
      if (this.form.state.queryFields[1]) {
        this.form.state.queryFields[1].node.focus();
      }
    }
    
    /**
     * 第二个条件查询之后，检索表格数据中是否含有该数据，如果没有，则提示。有则标志为scanned
     */
    afterSecondQuery = (queryDatas) => {
      let {rowKey,tableData, selectedRowKeys, selectedRows} = this.state;
      if (queryDatas && queryDatas.length > 0) {
        let queryData = queryDatas[0];
        let dataIndex = -1;
        tableData.map((d, index) => {
            if (d[rowKey] === queryData[rowKey]) {
                dataIndex = index;
            }
        });
        if (dataIndex > -1) {
            queryData.scaned = true;
            tableData.splice(dataIndex, 1, queryData);
            if (selectedRowKeys.indexOf(queryData[rowKey]) < 0) {
              selectedRowKeys.push(queryData[rowKey]);
              selectedRows.push(queryData);
            }
            this.setState({ 
              selectedRowKeys: selectedRowKeys,
              selectedRows: selectedRows,
              tableData: tableData,
              resetFlag:false,
              loading: false
            });
        } else {
          this.showDataNotFound();
        }
        this.nextQueryNodeFocus();
        this.form.resetFormFileds();
      } else {
        this.showDataNotFound();
      }
    }

    getTableData = () => {
      const self = this;
      let requestObject = {
        tableRrn: this.state.tableRrn,
        success: function(responseBody) {
          self.setState({
            table: responseBody.table,
            loading: false
          }); 
        }
      }
      TableManagerRequest.sendGetByRrnRequest(requestObject);
    }

    queryData = (whereClause) => {
      const self = this;
      let reloadTableData = false;
      let firstQueryField = self.form.state.queryFields[0];
      // 如果查询条件中包含了第一个的查询条件，则进行重新查找
      if (whereClause.indexOf(firstQueryField.name) != -1) {
          reloadTableData = true;
      }
      let requestObject = {
        tableRrn: this.state.tableRrn,
        whereClause: whereClause,
        success: function(responseBody) {
          let queryDatas = responseBody.dataList;
          if (reloadTableData) {
              if (queryDatas && queryDatas.length > 0) {
                  self.setState({ 
                    tableData: queryDatas,
                    loading: false
                  });
                  self.nextQueryNodeFocus();
                  self.form.resetFormFileds();
              } else {
                  self.resetData();
                  self.showDataNotFound();
              }
          } else {
              // 扫描表格数据，判断是否包含此数据，查找数据，只会返回一笔，查找第一笔即可
              self.afterSecondQuery(queryDatas);
          }
        }
      }
      TableManagerRequest.sendGetDataByRrnRequest(requestObject);
    }
}
