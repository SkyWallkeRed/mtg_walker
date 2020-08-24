import { Injectable } from '@angular/core';

const {createWorker, createScheduler} = require('tesseract.js');
import { Subject } from 'rxjs';

@Injectable()
export class TesseractService {
	worker;

	scheduler;
	worker1;
	worker2;
	rectangle = {left: 0, top: 0, width: 800, height: 400};
	workerProcess$: Subject<any> = new Subject<any>();
	workerProcessXL$: Subject<any> = new Subject<any>();
	active$: Subject<any> = new Subject<any>();

	constructor() {
	}

	setTextCoords(coords: { x: number, y: number }) {
		this.rectangle.top = coords.y;
		this.rectangle.left = coords.x;
		console.log('this.rectangle', this.rectangle);
	}

	async buildWorker() {
		this.worker = createWorker({
			logger: m => {
				console.log(m);
				this.workerProcess$.next(m);
			}
		});
	}

	async buildWorkerXL() {
		this.worker1 = createWorker({
			logger: m => {
				console.log(m);
				this.workerProcess$.next(m);
			}
		});

		this.worker2 = createWorker({
			logger: m => {
				console.log(m);
				this.workerProcess$.next(m);
			}
		});
	}

	async buildScheduler() {
		this.scheduler = createScheduler();
	}

	async extractData(base64: string) {
		this.active$.next(true);
		await this.buildWorker();
		const fileUrl = 'https://tesseract.projectnaptha.com/img/eng_bw.png';

		console.log('base64', base64);

		await this.worker.load();
		await this.worker.loadLanguage('eng');
		await this.worker.initialize('eng');
		await this.worker.setParameters({
			tessedit_char_whitelist: 'AaBbCcDdEeFfGgHhIiJjKkMmNnLlOoPpQqRrSsTtUuVvWwXxYyZz '
		});
		const {data: {text}} = await this.worker.recognize(base64, {rectangle: this.rectangle});
		// const {data: {text}} = await this.worker.recognize(base64);

		await this.worker.terminate();

		this.active$.next(false);
		return text;
	}

	async extractDataXL(base64: string) {
		this.active$.next(true);
		await this.buildWorkerXL();
		await this.buildScheduler();

		await this.worker1.load();
		await this.worker2.load();
		await this.worker1.loadLanguage('eng');
		await this.worker2.loadLanguage('eng');
		await this.worker1.initialize('eng');
		await this.worker2.initialize('eng');
		this.scheduler.addWorker(this.worker1);
		this.scheduler.addWorker(this.worker2);
		/** Add 10 recognition jobs */
		const results = await Promise.all(Array(10).fill(0).map(() => (
				this.scheduler.addJob('recognize', base64)
		)));
		console.log(results);
		await this.scheduler.terminate(); // It also terminates all workers.
		this.active$.next(false);
		return results;
	}

	async extractFromCtx(ctx) {

		await this.worker.load();
		await this.worker.loadLanguage('eng');
		await this.worker.initialize('eng');
		const {data: {text}} = await this.worker.recognize(ctx);
		console.log(text);
		await this.worker.terminate();

	}
}


// import Tesseract from 'tesseract.js';
//
// Tesseract.recognize(
// 		'https://tesseract.projectnaptha.com/img/eng_bw.png',
// 		'eng',
// 		{logger: m => console.log(m)}
// ).then(({data: {text}}) => {
// 	console.log(text);
// });
//

//
