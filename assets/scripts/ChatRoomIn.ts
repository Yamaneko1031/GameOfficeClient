import { _decorator, Component, Node, Button, director, EditBox } from "cc";
import { UserInfo } from "./UserInfo";
import SocketUtil from "./SocketUtil";
const { ccclass, property } = _decorator;

@ccclass("ChatRoomIn")
export class ChatRoomIn extends Component {
  // [1]
  // dummy = '';

  // [2]
  // @property
  // serializableDummy = 0;
  @property(Button)
  button: Button | null = null;

  @property(EditBox)
  editBox: EditBox | null = null;

  start() {
    console.log("ChatRoomIn start()");
    if (this.button) {
      this.button.node.on(Button.EventType.CLICK, this.callback, this);
    }
  }

  callback(button: Button) {
    if (this.editBox && this.editBox.string) {
      UserInfo.Instance.init();
      UserInfo.Instance.connectId = SocketUtil.Instance.getId();
      UserInfo.Instance.userName = this.editBox.string;
      console.log(UserInfo.Instance.getJsonData());
      // director.loadScene("TestRoom");
      director.loadScene("OnlineRoom");
    }
  }

  // update (deltaTime: number) {
  //     // [4]
  // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
