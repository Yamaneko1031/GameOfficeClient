import {
  _decorator,
  Component,
  Node,
  Vec3,
  systemEvent,
  SystemEvent,
  EventMouse,
  EventKeyboard,
  macro,
  Animation,
  Label,
  UITransform,
  Camera
} from "cc";
import { PlayerData, UserInfo } from "./UserInfo";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  // [1]
  // dummy = '';

  // [2]
  // @property
  // serializableDummy = 0;
  // private _deltaPos: Vec3 = new Vec3(0, 0, 0);
  // private _targetPos: Vec3 = new Vec3();
  private _isControl = false;
  private _isEmotion = false;
  private _isUpdate = false;
  private _isMoving = false;
  private _isMoveSpeed = 0;
  private _direction = 1;
  private _animation: string = "";
  private _cameraNode: Node | null = null;

  @property(Label)
  private nameLabel: Label | null = null;

  @property(Node)
  private imageNode: Node | null = null;

  start() {}

  setCameraNode(cameraNode: Node) {
    this._cameraNode = cameraNode;
  }

  setName(value: string) {
    if (this.nameLabel) {
      this.nameLabel.string = value;
    }
  }

  setUserInfo() {
    if (this._isUpdate) {
      UserInfo.Instance.position = this.node.getPosition();
      UserInfo.Instance.animation = this._animation;
      UserInfo.Instance.direction = this._direction;
    }
  }

  isUpdate() {
    return this._isUpdate;
  }

  setContorl() {
    this._isControl = true;
    systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
    systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }

  setPlayerData(data: PlayerData) {
    this.setAnimation(data._animation);
    this.setName(data._userName);
    this.node.setPosition(new Vec3(data._position));
    this.setDirection(data._direction);
  }

  setAnimation(value: string) {
    // _animationのセッターメソッド
    if (this._animation != value) {
      // 再生中のアニメーションではない場合
      if (value == "") {
        // クリップ名がない場合
        this.imageNode?.getComponent(Animation)?.stop(); // アニメーションを停止する
      } else {
        // クリップ名がある場合
        this.imageNode?.getComponent(Animation)?.play(value); // アニメーションを再生する
      }
      this._animation = value; // 再生中のクリップ名を更新する
      if (this._isControl) {
        this._isUpdate = true;
      }
    }
  }

  setDirection(value: number) {
    this._direction = value;
    const nowScale: Vec3 = this.node.getScale();
    this.imageNode?.setScale(new Vec3(this._direction, nowScale.y, nowScale.z));
  }

  onMouseUp(event: EventMouse) {
    if (this._cameraNode) {
      // console.log(this._cameraNode.getComponent(Camera));
      // console.log(this.node.getPosition().x);
      // console.log(this.node.getPosition().y);
      // const nowPos: Vec3 = this.node.getPosition();
      // const pos2 = uiTransform?.convertToWorldSpaceAR(new Vec3(nowPos.x, nowPos.y, 0))
      // console.log(pos2?.x);
      // console.log(pos2?.y);
      let camera: Camera | null = this._cameraNode.getComponent(Camera);
      if (camera) {
        console.log(camera);
        let rateX = 960 / camera.camera.width;
        let rateY = 480 / camera.camera.height;
        let pos = new Vec3(
          this._cameraNode.position.x + event.getLocation().x * rateX,
          this._cameraNode.position.y + event.getLocation().y * rateY,
          0
        );
        const uiTransform = this.node.parent?.getComponent(UITransform);
        if (uiTransform) {
          this.node.setPosition(uiTransform.convertToNodeSpaceAR(pos));
        }
      }
      // console.log(this._cameraNode.position.x + event.getLocation().x * 0.8);
      // console.log(this._cameraNode.position.y + event.getLocation().y * 0.6);
      // const nowPos: Vec3 = this.node.getPosition();
      // this.node.setPosition(pos);
    } else {
      console.error("onMouseUp error");
    }
    // const uiTransform = this.node.parent?.getComponent(UITransform);
    // let clickPos = event.getLocation();
    // this..parent.convertToNodeSpaceAR(touchLoc);
    // const pos = uiTransform?.convertToWorldSpaceAR(new Vec3(event.getLocationX(), event.getLocationY(), 0))
    // // const pos = uiTransform?.convertToWorldSpaceAR(new Vec3(event.getLocationX(), event.getLocationY(), 0))
    // console.log(pos?.x);
    // console.log(pos?.y);
    // const nowPos: Vec3 = this.node.getPosition();
    // const pos2 = uiTransform?.convertToWorldSpaceAR(new Vec3(nowPos.x, nowPos.y, 0))
    // console.log(pos2?.x);
    // console.log(pos2?.y);
    // // const nowPos: Vec3 = this.node.getPosition()
    // // // this.node.setPosition(new Vec3(nowPos.x + 1, nowPos.y, nowPos.z))
    // // this.node.setPosition(new Vec3(event.getLocationX(), event.getLocationY(), nowPos.z))
  }

  onKeyDown(event: EventKeyboard) {
    // キーを押した時の処理
    switch (
      event.keyCode // 押されたキーの種類で分岐
    ) {
      case macro.KEY.right: // 『→』キーの場合
        this._isMoving = true;
        this._isMoveSpeed = 2;
        this._direction = -1;
        break;
      case macro.KEY.left: //  『←』キーの場合
        this._isMoving = true;
        this._isMoveSpeed = -2;
        this._direction = 1;
        break;
      case macro.KEY.up: // 『↑』キーの場合
      case macro.KEY.space: // 『スペース』キーの場合
        break;
      case macro.KEY.z: // 『z』キーの場合
        this.setAnimation("zombieEmotion1");
        this._isEmotion = true;
        break;
      case macro.KEY.x: // 『x』キーの場合
        this.setAnimation("zombieEmotion2");
        this._isEmotion = true;
        break;
    }
  }

  onKeyUp(event: EventKeyboard) {
    // キーを離した時の処理
    switch (
      event.keyCode // 押されたキーの種類で分岐
    ) {
      case macro.KEY.right: // 『→』キーの場合
        this._isMoving = false;
        this._isMoveSpeed = 0;
        break;
      case macro.KEY.left: //  『←』キーの場合
        this._isMoving = false;
        this._isMoveSpeed = 0;
        break;
      case macro.KEY.up: // 『↑』キーの場合
        break;
      case macro.KEY.down: // 『↑』キーの場合
        break;
      case macro.KEY.space: // 『スペース』キーの場合
        break;
    }
  }

  update(deltaTime: number) {
    if (!this._isControl) {
      return;
    }
    this._isUpdate = false;
    if (this._isMoving) {
      const nowPos: Vec3 = this.node.getPosition();
      this.node.setPosition(
        new Vec3(nowPos.x + this._isMoveSpeed, nowPos.y, nowPos.z)
      );
      this.setDirection(this._direction);
      this._isUpdate = true;
      this.setAnimation("zombieWalk");
    } else {
      this.setAnimation("zombieIdle");
    }
    this.setUserInfo();
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
