console.log("a")
// PixiJS
const {
	Application,
	live2d: { Live2DModel }
} = PIXI;

// Kalidokit
const {
	Face,
	Vector: { lerp },
	Utils: { clamp }
} = Kalidokit;

// 1, Live2Dモデルへのパスを指定する
//const modelUrl = "/static/hiyori/hiyori_pro_t10.model3.json";
const modelUrl = "/static/zunkoA/Zunko_MODEL_FREE_TypeA.model.json";

let currentModel, facemesh;

// メインの処理開始
(async function main() {

	// 2, PixiJSを準備する
	const app = new PIXI.Application({
		view: document.getElementById("my-live2d"),
		autoStart: true,
		backgroundAlpha: 0,
		backgroundColor: 0x0000ff,
		resizeTo: window
	});

	// 3, Live2Dモデルをロードする
	currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
	currentModel.scale.set(0.7);
	currentModel.interactive = true;
	currentModel.anchor.set(0.5, 0.5);
	currentModel.position.set(window.innerWidth * 0.82, window.innerHeight * 0.6);
    console.log(currentModel.internalModel.coreModel);
	// 4, Live2Dモデルをドラッグ可能にする

	currentModel.on("pointerdown", e => {
		console.log("point")
		currentModel.offsetX = e.data.global.x - currentModel.position.x;
		currentModel.offsetY = e.data.global.y - currentModel.position.y;
		currentModel.dragging = true;
	});
	currentModel.on("pointerup", e => {
		currentModel.dragging = true;
	});
	currentModel.on("pointermove", e => {
		if (currentModel.dragging) {
			currentModel.position.set(
				e.data.global.x - currentModel.offsetX,
				e.data.global.y - currentModel.offsetY
			);
		}
	});

	// 5, Live2Dモデルを拡大/縮小可能に(マウスホイール)
	/*document.querySelector("#my-live2d").addEventListener("wheel", e => {
		e.preventDefault();
		currentModel.scale.set(
			clamp(currentModel.scale.x + event.deltaY * -0.001, -0.5, 10)
		);
	});*/
	let hayachi = PIXI.Sprite.fromImage('/static/image/zunda.jpg');
	hayachi.anchor.set(0.5);
	hayachi.x = app.screen.width/2;
	hayachi.y = app.screen.height/2;
	hayachi.height=app.screen.height;
	hayachi.width=app.screen.width;
	app.stage.addChild(hayachi);
	// 6, Live2Dモデルを配置する
	app.stage.addChild(currentModel);

})();






