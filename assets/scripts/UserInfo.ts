import { Vec3 } from "cc";

const io = (window as any).io || {};

enum ImageKind {
  Zonbie
}

export interface PlayerData {
  _connectId: string;
  _userName: string;
  _imageKind: number;
  _position: Vec3;
  _direction: number;
  _animation: string;
}

export class UserInfo {
  public static readonly Instance: UserInfo = new UserInfo();
  private data: PlayerData = {
    _connectId: "",
    _userName: "",
    _imageKind: ImageKind.Zonbie,
    _position: new Vec3(0, 0, 0),
    _direction: 0,
    _animation: ""
  };

  // private _connectId: string = "aaaaa";
  // private _userName: string = "noName";
  // private _imageKind: ImageKind = ImageKind.Zonbie;
  // private _position: Vec3 = new Vec3(0,0,0);
  // private _animation: string = "";

  init() {
    console.log("UserInfo init()");
  }

  set userName(value: string) {
    this.data._userName = value;
  }
  get userName() {
    return this.data._userName;
  }

  set imageKind(value: ImageKind) {
    this.data._imageKind = value;
  }
  get imageKind() {
    return this.data._imageKind;
  }

  set connectId(value: string) {
    this.data._connectId = value;
  }
  get connectId() {
    return this.data._connectId;
  }

  set position(value: Vec3) {
    this.data._position = new Vec3(value);
  }
  get position() {
    return this.data._position;
  }

  set animation(value: string) {
    this.data._animation = value;
  }
  get animation() {
    return this.data._animation;
  }

  set direction(value: number) {
    this.data._direction = value;
  }
  get direction() {
    return this.data._direction;
  }

  getJsonData() {
    return JSON.stringify(this.data);
  }
  setJsonData(json: string) {
    this.data = JSON.parse(json);
  }
}
