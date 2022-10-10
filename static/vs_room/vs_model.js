var app;
//app.stage.children[1].internalModel.motionManager.startMotion('TapBody',0,2)
function dododo(URL){
	console.log(URL);
	// PixiJS
	var {
		Application, live2d: { Live2DModel }
	} = PIXI;

	// Kalidokit
	var {
		Face, Vector: { lerp }, Utils: { clamp }
	} = Kalidokit;
	var motion = {
		"t0": [
			{ "file": "/static/zunko/motions/motion_01_MOJIMOJI_ZUNKO.mtn", "fade_out": 0 }
		],
	};
	// 1, Live2Dモデルへのパスを指定する
	var modelUrl1 = "/static/Hiyori/Hiyori.model3.json";
	var modelUrl = URL;
	var guideCanvas = document.getElementById("my-guides");
	let currentModel, facemesh;
	
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
		if(URL == "/static/Rice/Rice.model3.json"){
		currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
		currentModel.scale.set(0.8);
		currentModel.interactive = true;
		currentModel.anchor.set(0.6, 0.5);
		currentModel.position.set(window.innerWidth * 0.5, window.innerHeight * 1.0);
		}else if(URL == "/static/Hiyori/Hiyori.model3.json"){
			currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
			currentModel.scale.set(0.7);
			currentModel.interactive = true;
			currentModel.anchor.set(0.5, 0.5);
			currentModel.position.set(window.innerWidth * 0.75, window.innerHeight * 1.45);
		}
		// 4, Live2Dモデルをドラッグ可能にする
		// 4, Live2Dモデルをドラッグ可能にする
		currentModel.on("pointerdown", e => {
			currentModel.offsetX = e.data.global.x - currentModel.position.x;
			currentModel.offsetY = e.data.global.y - currentModel.position.y;
			currentModel.dragging = true;
		});
		currentModel.on("pointerup", e => {
			currentModel.dragging = false;
			var updateFn = currentModel.internalModel.motionManager.update;
			var coreModel = currentModel.internalModel.coreModel;
			//console.log(currentModel.internalModel.motionManager);
			//console.log(currentModel.internalModel.motionManager.update);
			//console.log(currentModel.internalModel.motionManager.startMotion('TapBody', 0,2));

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

		let hayachi = PIXI.Sprite.fromImage('/static/image/zunda.jpg');
		hayachi.anchor.set(0.5);
		hayachi.x = app.screen.width / 2;
		hayachi.y = app.screen.height / 2;
		hayachi.height = app.screen.height;
		hayachi.width = app.screen.width;
		app.stage.addChild(hayachi);
		// 6, Live2Dモデルを配置する
		app.stage.addChild(currentModel);

	})();

};




