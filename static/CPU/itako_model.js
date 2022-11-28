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
const modelUrl = "/static/itako/itako.model3.json";
const guideCanvas = document.getElementById("my-guides");
let currentModel, facemesh;
var app;
// メインの処理開始
(async function main() {

	// 2, PixiJSを準備する
	app = new PIXI.Application({
		view: document.getElementById("my-live2d"),
		autoStart: true,
		backgroundAlpha: 0,
		backgroundColor: 0x0000ff,
		resizeTo: window
	});

	// 3, Live2Dモデルをロードする
	console.log(modelUrl)
	currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
	currentModel.scale.set(1);
	currentModel.interactive = true;
	currentModel.anchor.set(0.5, 0.5);
	currentModel.position.set(window.innerWidth * 0.8, window.innerHeight * 1.2);
    console.log(currentModel.internalModel.coreModel);
	// 4, Live2Dモデルをドラッグ可能にする

	// 4, Live2Dモデルをドラッグ可能にする
	currentModel.on("pointerdown", e => {
		currentModel.offsetX = e.data.global.x - currentModel.position.x;
		currentModel.offsetY = e.data.global.y - currentModel.position.y;
		currentModel.dragging = true;
	});
	currentModel.on("pointerup", e => {
		currentModel.dragging = false;
		const updateFn = currentModel.internalModel.motionManager.update;
		const coreModel = currentModel.internalModel.coreModel;
		console.log(currentModel.internalModel.motionManager);
		console.log(currentModel.internalModel.motionManager.update)
		
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
	document.querySelector("#my-live2d").addEventListener("wheel", e => {
		e.preventDefault();
		currentModel.scale.set(
			clamp(currentModel.scale.x + event.deltaY * -0.001, -0.5, 10)
		);
	});
	
	let hayachi = PIXI.Sprite.fromImage('/static/image/yoru.jpg');
	hayachi.anchor.set(0.5);
	hayachi.x = app.screen.width/2;
	hayachi.y = app.screen.height/2;
	hayachi.height=app.screen.height;
	hayachi.width=app.screen.width;
	app.stage.addChild(hayachi);
	// 6, Live2Dモデルを配置する
	app.stage.addChild(currentModel);

})();






