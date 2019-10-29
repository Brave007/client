
const ActionType = {
    AsyncSo : "AsyncSo",
    AsyncMaterialOutOrder : "AsyncMaterialOutOrder",
    AsyncMaterial : "AsyncMaterial",
    AsyncMesProduct: "AsyncProduct"
}
export default class AsyncManagerRequestBody {

    actionType;

    constructor(actionType){
        this.actionType = actionType;
    }
    
    static buildAsync(actionType) {
        return new AsyncManagerRequestBody(actionType);
    }

}

export {ActionType};

