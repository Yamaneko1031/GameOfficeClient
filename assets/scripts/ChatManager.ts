import {
  _decorator,
  Component,
  Node,
  Button,
  ScrollView,
  EditBox,
  Prefab,
  instantiate
} from "cc";
import SocketUtil from "./SocketUtil";
import { UserInfo } from "./UserInfo";
import { ChatOneMessage } from "./ChatOneMessage";

const { ccclass, property } = _decorator;

export interface ChatData {
  _name: string;
  _text: string;
  _time: string;
}

@ccclass("ChatManager")
export class ChatManager extends Component {
  // [1]

  // [2]
  @property(Button)
  button: Button | null = null;

  @property(ScrollView)
  chatLog: ScrollView | null = null;

  @property(EditBox)
  editBox: EditBox | null = null;

  @property(Prefab)
  chatTextPrefab: Prefab | null = null;

  private date = new Date();
  private isPreScroll: boolean = false;

  start() {
    let myself = this;

    if (myself.button) {
      myself.button.node.on(
        Button.EventType.CLICK,
        myself.messageEnter,
        myself
      );
    }

    SocketUtil.Instance.on("chat message", function (msg: string) {
      let data: ChatData = JSON.parse(msg);
      myself.addOneMessage(data._name, data._text, data._time);
    });
  }

  // チャットログにメッセージを追加
  addOneMessage(name: string, text: string, time: string) {
    if (this.chatLog && this.chatTextPrefab) {
      let chatText: Node = instantiate(this.chatTextPrefab);
      let chatOneMessage = chatText.getComponent(ChatOneMessage);
      if (chatOneMessage) {
        chatOneMessage.setText(name, text, time);
      } else {
        console.error("addOneMessage error1");
      }
      if (this.chatLog.content) {
        this.chatLog.content.addChild(chatText);
        this.isPreScroll = true;
      } else {
        console.error("addOneMessage error2");
      }
    }
  }

  // メッセージ送信ボタン押下時のコールバック関数
  messageEnter(button: Button) {
    if (this.editBox) {
      let data: ChatData = {
        _name: UserInfo.Instance.userName,
        _text: this.editBox.string,
        _time:
          this.date.getHours().toString() +
          ":" +
          this.date.getMinutes().toString()
      };
      this.addOneMessage(data._name, data._text, data._time);
      SocketUtil.Instance.emit("chat message", JSON.stringify(data));
      this.editBox.string = "";
    } else {
      console.error("messageEnter error1");
    }
  }

  update(deltaTime: number) {
    // [4]
  }

  lateUpdate() {
    if (this.isPreScroll && this.chatLog) {
      this.chatLog.scrollToBottom(0);
      this.isPreScroll = false;
    }
  }
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
