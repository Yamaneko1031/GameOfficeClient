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
  view,
  sys,
  game,
  Camera
} from "cc";
import { PlayerData, UserInfo } from "./UserInfo";
const { ccclass, property } = _decorator;

const WALK_SPEED = 6; // 歩き速度
const JUMP_POW = 18; // ジャンプ力

const enum CHARA_DIRECTION {
  LEFT,
  RIGHT
}

const enum USE_KEY_KIND {
  LEFT,
  RIGHT,
  UP,
  DOWN,
  SPACE,
  Z,
  X,
  LEN
}

const enum USE_KEY_STATE {
  NON,
  TRG,
  KEEP
}

interface UseKeyState {
  state: number;
  counter: number;
}

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
  private _isUpdate = false;
  private _isEmotion = false;
  private _isJumpAble = false;
  private _moveV = 0; // 垂直移動力
  private _moveH = 0; // 水平移動力

  private _direction = CHARA_DIRECTION.LEFT;
  private _animation: string = "";
  private _cameraNode: Node | null = null;
  private _useKeyState: Array<UseKeyState> = [];

  @property(Label)
  private nameLabel: Label | null = null;

  @property(Node)
  private imageNode: Node | null = null;

  start() {
    for (let i = 0; i < USE_KEY_KIND.LEN; i++) {
      this._useKeyState.push({ state: 0, counter: 0 });
    }
  }

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

  emotionEnd(value: number) {
    this._isEmotion = false;
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

  setDirection(direction: CHARA_DIRECTION) {
    if (!this.imageNode) {
      console.log("setDirection error");
      return;
    }
    if (this._direction != direction) {
      let scale = new Vec3(this.node.getScale());
      if (direction == CHARA_DIRECTION.LEFT) {
        scale.x = Math.abs(scale.x);
      } else if (direction == CHARA_DIRECTION.RIGHT) {
        scale.x = -Math.abs(scale.x);
      }
      this.imageNode.setScale(scale);
      this._direction = direction;
      if (this._isControl) {
        this._isUpdate = true;
      }
    }
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
      console.log(camera);
      // console.log(sys);
      console.log(document.body.scrollWidth);
      console.log(document.documentElement.scrollHeight);

      if (camera) {
        let rateX = 960 / camera.camera.width;
        let rateY = 480 / camera.camera.height;
        // console.log(rateX + ":" + rateY);

        console.log(this.node.getPosition());
        console.log(event.getLocation());
        console.log(camera.camera.width + ":" + camera.camera.height);
        console.log(view);
        console.log(sys);
        console.log(game);

        // camera.camera.setFixedSize(100,100);
        rateX = view.getFrameSize().x / view.getVisibleSizeInPixel().x;
        rateY = view.getFrameSize().y / view.getVisibleSizeInPixel().y;
        // console.log(rateX + ":" + rateY);

        let pos = new Vec3(
          this._cameraNode.position.x + event.getLocation().x * rateX,
          this._cameraNode.position.y + event.getLocation().y * rateY,
          0
        );
        const uiTransform = this.node.parent?.getComponent(UITransform);
        if (uiTransform) {
          // this.node.setPosition(uiTransform.convertToNodeSpaceAR(pos));
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

  useKeyStateOn(kind: USE_KEY_KIND) {
    if (this._useKeyState[kind].state == USE_KEY_STATE.NON) {
      this._useKeyState[kind].state = USE_KEY_STATE.TRG;
    }
    this._useKeyState[kind].counter = 30;
  }

  useKeyStateRelease(kind: USE_KEY_KIND) {
    this._useKeyState[kind].state = USE_KEY_STATE.NON;
    this._useKeyState[kind].counter = 0;
  }

  useKeyStateUpdate() {
    for (let kind = 0; kind < USE_KEY_KIND.LEN; kind++) {
      if (this._useKeyState[kind].state == USE_KEY_STATE.TRG) {
        this._useKeyState[kind].state = USE_KEY_STATE.KEEP;
      }
      // else if (this._useKeyState[kind].counter) {
      //   this._useKeyState[kind].state = USE_KEY_STATE.KEEP;
      //   this._useKeyState[kind].counter--;
      //   if (this._useKeyState[kind].counter == 0) {
      //     this._useKeyState[kind].state = USE_KEY_STATE.NON;
      //   }
      // }
    }
  }

  isUseKeyTrg(kind: USE_KEY_KIND): boolean {
    if (this._useKeyState[kind].state == USE_KEY_STATE.TRG) {
      return true;
    }
    return false;
  }

  isUseKeyOn(kind: USE_KEY_KIND): boolean {
    if (this._useKeyState[kind].state != USE_KEY_STATE.NON) {
      return true;
    }
    return false;
  }

  onKeyDown(event: EventKeyboard) {
    // console.log(this._useKeyState[USE_KEY_KIND.LEFT].state);
    // キーを押した時の処理
    switch (
      event.keyCode // 押されたキーの種類で分岐
    ) {
      case macro.KEY.right: // 『→』キーの場合
        this.useKeyStateOn(USE_KEY_KIND.RIGHT);
        break;
      case macro.KEY.left: //  『←』キーの場合
        this.useKeyStateOn(USE_KEY_KIND.LEFT);
        break;
      case macro.KEY.up: // 『↑』キーの場合
        this.useKeyStateOn(USE_KEY_KIND.UP);
        break;
      case macro.KEY.down: // 『↓』キーの場合
        this.useKeyStateOn(USE_KEY_KIND.DOWN);
        break;
      case macro.KEY.space: // 『スペース』キーの場合
        this.useKeyStateOn(USE_KEY_KIND.SPACE);
        break;
      case macro.KEY.z: // 『z』キーの場合
        this.useKeyStateOn(USE_KEY_KIND.Z);
        break;
      case macro.KEY.x: // 『x』キーの場合
        this.useKeyStateOn(USE_KEY_KIND.X);
        break;
    }
  }

  // this._isMoving = false;
  // this._isMoveSpeed = 0;

  onKeyUp(event: EventKeyboard) {
    // キーを離した時の処理
    switch (
      event.keyCode // 押されたキーの種類で分岐
    ) {
      case macro.KEY.right: // 『→』キーの場合
        this.useKeyStateRelease(USE_KEY_KIND.RIGHT);
        break;
      case macro.KEY.left: //  『←』キーの場合
        this.useKeyStateRelease(USE_KEY_KIND.LEFT);
        break;
      case macro.KEY.up: // 『↑』キーの場合
        this.useKeyStateRelease(USE_KEY_KIND.UP);
        break;
      case macro.KEY.down: // 『↑』キーの場合
        this.useKeyStateRelease(USE_KEY_KIND.DOWN);
        break;
      case macro.KEY.space: // 『スペース』キーの場合
        this.useKeyStateRelease(USE_KEY_KIND.SPACE);
        break;
      case macro.KEY.z: // 『z』キーの場合
        this.useKeyStateRelease(USE_KEY_KIND.Z);
        break;
      case macro.KEY.x: // 『x』キーの場合
        this.useKeyStateRelease(USE_KEY_KIND.X);
        break;
    }
  }

  lateUpdate(deltaTime: number) {
    this.useKeyStateUpdate();
  }

  update(deltaTime: number) {
    if (!this._isControl) {
      return;
    }
    this._isUpdate = false;

    if (this.isUseKeyOn(USE_KEY_KIND.LEFT)) {
      this._moveH = -WALK_SPEED;
    }
    if (this.isUseKeyOn(USE_KEY_KIND.RIGHT)) {
      this._moveH = WALK_SPEED;
    }
    if (this.isUseKeyTrg(USE_KEY_KIND.Z)) {
      if (this._isJumpAble) {
        this.setAnimation("zombieEmotion1");
        this._isEmotion = true;
      }
    }
    if (this.isUseKeyTrg(USE_KEY_KIND.X)) {
      if (this._isJumpAble) {
        this.setAnimation("zombieEmotion2");
        this._isEmotion = true;
      }
    }
    if (this.isUseKeyTrg(USE_KEY_KIND.SPACE)) {
      console.log(this._isJumpAble);
      if (this._isJumpAble) {
        this._moveV = JUMP_POW;
        this._isEmotion = false;
        this._isJumpAble = false;
        this.setAnimation("zombieIdle");
      }
    }

    if (this._moveH != 0) {
      this._isEmotion = false;
      if (this._isJumpAble) {
        // 歩きセット
        this.setAnimation("zombieWalk");
      }
      // 向き更新
      if (this._moveH < 0) {
        this.setDirection(CHARA_DIRECTION.LEFT);
      } else if (this._moveH > 0) {
        this.setDirection(CHARA_DIRECTION.RIGHT);
      }
    }

    // 横移動無し&ジャンプ可ならidle状態にする
    if (this._moveH == 0 && this._isJumpAble && !this._isEmotion) {
      this.setAnimation("zombieIdle");
    }

    // 移動処理
    let nextPos: Vec3 = this.node.getPosition();
    // const nowPos: Vec3 = this.node.getPosition();
    if (!this.node.parent) {
      return;
    }
    const uiTransform = this.node.parent.getComponent(UITransform);
    if (!uiTransform) {
      return;
    }
    let nextPosWorld = uiTransform?.convertToWorldSpaceAR(
      new Vec3(nextPos.x, nextPos.y, 0)
    );

    nextPosWorld.x += this._moveH;
    nextPosWorld.y += this._moveV;
    // if (nextPos.y < 0) {
    if (nextPosWorld.y + this._moveV < 0) {
      nextPosWorld.y = 0;
      this._moveV = 0;
      this._isJumpAble = true;
    } else {
      this._isJumpAble = false;
    }
    nextPos = uiTransform.convertToNodeSpaceAR(nextPosWorld);

    if (!Vec3.equals(this.node.position, nextPos)) {
      this.node.setPosition(new Vec3(nextPos));
      this._isUpdate = true;
    }

    // 移動力更新
    this._moveH = 0;
    this._moveV--;

    // 情報セット
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
