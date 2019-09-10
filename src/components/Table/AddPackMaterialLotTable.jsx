
import { Button } from 'antd';
import I18NUtils from '../../api/utils/I18NUtils';
import { i18NCode } from '../../api/const/i18n';
import EntityScanViewTable from './EntityScanViewTable';
import { Notification } from '../notice/Notice';
import MessageUtils from '../../api/utils/MessageUtils';
import UnPackageMaterialLotRequest from '../../api/unpackage-material-lot/UnPackageMaterialLotRequest';
import MaterialLotAction from '../../api/dto/mms/MaterialLotAction';
import AppendPackageMaterialLotRequest from '../../api/append-package-material-lot/AppendPackageMaterialLotRequest';

/**
 * 追加包装
 */
export default class AddPackMaterialLotTable extends EntityScanViewTable {

    static displayName = 'AddPackMaterialLotTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createUnPackageButton());
        return buttons;
    }
    buildOperation = (record) => {
        let operations = [];
        if (record.newFlag) {
            operations.push(this.buildDeletePopConfirm(record));
        }
        return operations;
    }

    getRowClassName = (record, index) => {
        if (record.newFlag) {
            return 'new-row';
        } else {
            if(index % 2 ===0) {
                return 'even-row'; 
            } else {
                return ''; 
            }
        }
    };

    appendPackage = () => {
        const {data} = this.state;
        let self = this;
        if (!data || data.length == 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        // 检验数据
        let waitToPackageLots= [];
        let packedMaterialLotId;
        data.forEach((d) => {
            if (d.newFlag) {
                waitToPackageLots.push(d);
            } else {
                packedMaterialLotId = d.parentMaterialLotId;
            }
        });
        let requestObject = {
            packedMaterialLotId: packedMaterialLotId,
            waitToPackMaterialLots: waitToPackageLots,
            actionCode: "",
            actionReason: "",
            actionComment: "",
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
        }
        AppendPackageMaterialLotRequest.sendAppendPackMaterialLotsRequest(requestObject)
        // UnPackageMaterialLotRequest.sendUnPackMaterialLotsRequest(requestObject)
    }

    createUnPackageButton = () => {
        return <Button key="receive" type="primary" style={styles.tableButton} icon="dropbox" onClick={this.appendPackage}>
                        {I18NUtils.getClientMessage(i18NCode.BtnAppendPackage)}
                    </Button>
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};