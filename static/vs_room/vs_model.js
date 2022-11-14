var app;
//app.stage.children[1].internalModel.motionManager.startMotion('TapBody',0,2)
function dododo(chara1,chara2){
	// PixiJS
	var {
		Application, live2d: { Live2DModel }
	} = PIXI;

	// Kalidokit
	var {
		Face, Vector: { lerp }, Utils: { clamp }
	} = Kalidokit;
	
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
		var URL1 = "/static/"+chara1+"/"+chara1+".model3.json";
		currentModel = await Live2DModel.from(URL1, { autoInteract: false });
		currentModel.scale.set(0.8);
		currentModel.interactive = true;
		currentModel.anchor.set(0.6, 0.5);
		currentModel.position.set(window.innerWidth * 0.9, window.innerHeight * 1.0);

		// 3, Live2Dモデルをロードする
		var URL2 = "/static/"+chara2+"/"+chara2+".model3.json";
		currentModel2 = await Live2DModel.from(URL2, { autoInteract: false });
		currentModel2.scale.set(0.8);
		currentModel2.interactive = true;
		currentModel2.anchor.set(0.6, 0.5);
		currentModel2.position.set(window.innerWidth * 0.2, window.innerHeight * 1.0);


		let hayachi = PIXI.Sprite.fromImage('/static/image/background4.png');
		hayachi.anchor.set(0.5);
		hayachi.x = app.screen.width / 2;
		hayachi.y = app.screen.height / 2;
		hayachi.height = app.screen.height;
		hayachi.width = app.screen.width;
		app.stage.addChild(hayachi);
		// 6, Live2Dモデルを配置する
		app.stage.addChild(currentModel);
		app.stage.addChild(currentModel2);
	})();

};




