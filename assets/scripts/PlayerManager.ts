import {
  _decorator,
  Component,
  Node,
  Camera,
  Prefab,
  instantiate,
  Vec3
} from "cc";
import { PlayerData, UserInfo } from "./UserInfo";
import SocketUtil from "./SocketUtil";
import { PlayerController } from "./PlayerController";
import { PlayerCamera } from "./PlayerCamera";
const { ccclass, property } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends Component {
  // [1]
  // dummy = '';

  // [2]
  @property({ type: Prefab })
  private playerPrfb: Prefab | null = null;

  @property({ type: Camera })
  private camera: Camera | null = null;

  @property({ type: Node })
  private otherPlayers: Node | null = null;

  @property({ type: Node })
  private controlPlayer: Node | null = null;

  private players: { [key: string]: Node } = {};

  start() {
    let myself = this;

    // 自プレイヤー追加
    this.addControlPlayer();

    // 他プレイヤー更新情報
    SocketUtil.Instance.on("player info", function (msg: string) {
      let data: PlayerData = JSON.parse(msg);
      myself.updatePlayer(data);
    });

    // 全プレイヤー情報
    SocketUtil.Instance.on(
      "get players",
      function (msg: { [key: string]: string }) {
        Object.keys(msg).map((key) => {
          let data: PlayerData = JSON.parse(msg[key]);
          myself.updatePlayer(data);
        });
      }
    );

    // 他プレイヤー切断情報
    SocketUtil.Instance.on("player disconnect", function (msg: string) {
      if (myself.players[msg]) {
        myself.players[msg].destroy();
        delete myself.players[msg];
      }
    });

    // 自身の情報送信
    SocketUtil.Instance.emit("player info", UserInfo.Instance.getJsonData());
    // 全プレイヤー情報リクエスト
    SocketUtil.Instance.emit("get players");
  }

  // 自プレイヤー追加
  addControlPlayer() {
    if (!this.playerPrfb || !this.camera || !this.controlPlayer) {
      console.log("addControlPlayer:初期化エラー1");
      return;
    }
    let player = instantiate(this.playerPrfb);
    let playerController = player.getComponent(PlayerController);
    if (playerController) {
      playerController.setCameraNode(this.camera.node);
      playerController.setName(UserInfo.Instance.userName);
      playerController.setContorl();
    } else {
      console.log("addControlPlayer:初期化エラー2");
    }
    let playerCamera = this.camera.getComponent(PlayerCamera);
    if (playerCamera) {
      playerCamera.setTarget(player);
    } else {
      console.log("addControlPlayer:初期化エラー3");
    }
    this.players[UserInfo.Instance.connectId] = player;
    this.controlPlayer.addChild(player);
  }

  // 他プレイヤー追加
  updatePlayer(data: PlayerData) {
    if (data._connectId == UserInfo.Instance.connectId) {
      // 自分は追加しない
      return;
    }

    if (!this.players[data._connectId] && this.playerPrfb) {
      this.players[data._connectId] = instantiate(this.playerPrfb);
      //   this.node.addChild(this.players[data._connectId]);
      this.otherPlayers?.addChild(this.players[data._connectId]);
    }
    let playerController =
      this.players[data._connectId].getComponent(PlayerController);

    if (playerController) {
      playerController.setPlayerData(data);
    } else {
      console.error("updatePlayer error2");
    }
  }

  update(deltaTime: number) {
    let playerController =
      this.players[UserInfo.Instance.connectId].getComponent(PlayerController);
    if (playerController?.isUpdate()) {
      SocketUtil.Instance.emit("player info", UserInfo.Instance.getJsonData());
    }
    // let myself = this;
    // Object.keys(myself.players).map((key) => {
    //   if (myself.players[key]) {
    //   }
    // });
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
