const io = (window as any).io || {};

export default class SocketUtil {
  public static readonly Instance: SocketUtil = new SocketUtil();
  //   private SocketUtil() {}
  private socket: any = null;
  private connected: boolean = false;

  init() {
    console.log("SocketUtil init()");
    // this.socket = io("http://localhost:8080", {
    // this.socket = io("https://sockettest-dot-gameoffice.an.r.appspot.com", {
    this.socket = io("https://gameoffice.an.r.appspot.com", {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      },
      transports: ["websocket", "polling", "flashsocket"]
    });

    this.socket.on("connected", () => {
      console.log("connected");
      this.connected = true;
      console.log(this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("disconnect");
      this.connected = false;
    });
  }

  getId() {
    return this.socket.id;
  }

  close() {
    console.log("close");
    if (this.socket && this.connected) {
      this.connected = false;
      this.socket.disconnect();
    }
    this.socket = null;
  }

  on(event: string, cb: any) {
    this.socket.on(event, cb);
  }

  emit(event: string, data?: any) {
    if (data) {
      this.socket.emit(event, data);
      return;
    }
    this.socket.emit(event);
  }
}
