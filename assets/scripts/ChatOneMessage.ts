import { _decorator, Component, Node, Label, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ChatOneMessage")
export class ChatOneMessage extends Component {
  // [1]
  // dummy = '';

  // [2]
  @property({ type: Label })
  private nameLabel: Label | null = null;

  @property({ type: Label })
  private timeLabel: Label | null = null;

  @property({ type: Label })
  private textLabel: Label | null = null;

  private isPreResize: boolean = false;

  start() {
    // [3]
  }

  setText(name: string, text: string, time: string) {
    if (this.nameLabel) {
      this.nameLabel.string = name;
    }
    if (this.textLabel) {
      this.textLabel.string = text;
    }
    if (this.timeLabel) {
      this.timeLabel.string = time;
    }
    // 自動リサイズ後に高さ計算したいので、ここではフラグだけ立てる
    this.isPreResize = true;
  }

  update(deltaTime: number) {
    // コンテンツの高さを再計算※この高さでチャットエリアのレイアウトをしているので必要
    if (this.isPreResize) {
      let setHeight = 0;
      if (this.textLabel && this.timeLabel) {
        let ui1 = this.textLabel.getComponent(UITransform);
        if (ui1) {
          setHeight += ui1.contentSize.height;
        }
        let ui2 = this.timeLabel.getComponent(UITransform);
        if (ui2) {
          setHeight += ui2.contentSize.height;
        }
      }
      let ui = this.getComponent(UITransform);
      if (ui) {
        ui.setContentSize(ui.contentSize.width, setHeight);
      }
      this.isPreResize = false;
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
