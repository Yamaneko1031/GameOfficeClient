import { _decorator, Component, Node, UITransform, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerCamera")
export class PlayerCamera extends Component {
  // [1]
  // dummy = '';

  // [2]
  // @property
  // serializableDummy = 0;
//   @property(Node) // Cocos Creatorのエディタに表示する
  private targetPlayer: Node | null = null;

  offset: Vec3 = new Vec3(0, 0, 0); // カメラの中心からプレイヤーをずらす距離
  boundLeft: number = 0; // カメラ座標の左端
  boundRight: number = 0; // カメラ座標の右端
  boundBottom: number = 0; // カメラ座標の下端
  boundTop: number = 0; // カメラ座標の上端

  start() {
    // [3]
    this.offset = new Vec3(0, 200, 1);
    // カメラ座標の範囲（画角の左下隅にカメラの原点があると考える）
    this.boundLeft = 0; // 左端
    this.boundRight = 960; // 右端（親ノード上でのステージの幅 - 画面の幅）
    this.boundBottom = 0; // 下端
    this.boundTop = 640; // 上端（親ノード上でのステージの高さ - 画面の高さ）
  }

  // update (deltaTime: number) {
  //     // [4]
  // }
  setTarget(target: Node) {
    this.targetPlayer = target;
  }

  lateUpdate() {
    // 全てのコンポーネントのupdate()の後の処理
    const uiTransform1 = this.targetPlayer?.getComponent(UITransform);
    let cameraPos = new Vec3(0, 0, 0); // カメラの中心からプレイヤーをずらす距離
    if (uiTransform1) {
      cameraPos = uiTransform1.convertToWorldSpaceAR(Vec3.ZERO); // プレイヤーのワールド座標を取得
    }
    const uiTransform2 = this.targetPlayer?.parent?.getComponent(UITransform);
    if (uiTransform2) {
      cameraPos = uiTransform2.convertToNodeSpaceAR(cameraPos); // // ワールド座標を親ノード（Canvas）の座標に変換する
    }
    cameraPos.add(this.offset);

    // カメラ座標を範囲内にする
    cameraPos.x = Math.max(cameraPos.x, this.boundLeft); // 座標が左端より小さいなら左端にする
    cameraPos.x = Math.min(cameraPos.x, this.boundRight); // 座標が右端より大きいなら右端にする
    cameraPos.y = Math.max(cameraPos.y, this.boundBottom); // 座標が下端より小さいなら左端にする
    cameraPos.y = Math.min(cameraPos.y, this.boundTop); // 座標が上端より大きいなら上端にする

    this.node.position = cameraPos; // カメラの位置を更新する
    // console.log(cameraPos);
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
