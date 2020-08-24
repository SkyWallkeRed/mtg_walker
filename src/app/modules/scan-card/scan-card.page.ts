import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TesseractService } from '../../services/tesseract.service';
import { CameraService } from '../../native-services/camera.service';
import { FileSystemService } from '../../native-services/file-system.service';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer } from '@angular/platform-browser';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

@Component({
	selector: 'app-scan-card',
	templateUrl: './scan-card.page.html',
	styleUrls: ['./scan-card.page.scss']
})
export class ScanCardPage implements OnInit, OnDestroy {
	@ViewChild('renderedImg', {static: true}) renderedImgElement;
	subscriptions$: Subscription[] = [];
	displayImage: any;
	imgBase64: string = null;
	resultData: any = null;
	parserData: { progress: any, status: any } = {progress: '', status: ''};
	activeParser: boolean = false;

	nameTopLeftCoords: { x: number, y: number } = {x: 0, y: 0};

	constructor(
			private tesseractService: TesseractService,
			private cameraService: CameraService,
			private fileService: FileSystemService,
			private sanitizer: DomSanitizer,
			private webView: WebView,
			private loaderService: LoaderService
	) {
	}

	ngOnInit() {
		// this.tesseractService.extractData();
		const sub = this.tesseractService.workerProcess$.subscribe(data => {
			console.log(data);
			this.parserData = data;
		});
		this.subscriptions$.push(sub);

		const sub2 = this.tesseractService.active$.subscribe(status => {
			this.activeParser = status;
		});
		this.subscriptions$.push(sub2);
	}

	async getCoords(event) {
		this.nameTopLeftCoords.x = event.pageX;
		this.nameTopLeftCoords.y = event.pageY;
		this.tesseractService.setTextCoords(this.nameTopLeftCoords);

		await this.exstractData();
	}


	async scanImg() {
		this.resultData = null;
		const imgTmpData = await this.cameraService.takePicture();
		// const fileLocalUrl = await this.fileService.saveFile(imgTmpData);
		const fileLocal: { path: string, tmpName: string } = await this.fileService.fileToHttpRenderableUrl(imgTmpData);

		await this.renderImg(fileLocal.path);

		// const fileBuffer = await this.fileService.fileLocalUrlToBuffer(fileLocal.tmpName);
		this.imgBase64 = await this.fileService.filePathToBase64(fileLocal.tmpName);
		// const exstractedData = await this.tesseractService.extractData(this.imgBase64);
		// const exstractedData = await this.tesseractService.extractDataXL(this.imgBase64);
		// console.log('exstractedData', exstractedData);


		// this.resultData = exstractedData;
		this.tesseractService.workerProcess$.next({status: 'Click on top left of text'});
	}

	async exstractData() {
		await this.loaderService.presentLoading('Working ...');
		this.resultData = await this.tesseractService.extractData(this.imgBase64);
		await this.loaderService.dismissAll();
		this.tesseractService.workerProcess$.next({status: 'DONE'});
	}


	async renderImg(storedPhoto) {

		// const unSafeImg = await Capacitor.convertFileSrc(storedPhoto);
		const unSafeImg = await this.webView.convertFileSrc(storedPhoto);
		console.log('unSafeImg', unSafeImg);
		const safeImg: any = await this.sanitizer.bypassSecurityTrustUrl(unSafeImg);
		console.log('safeImg', safeImg);
		this.displayImage = safeImg.changingThisBreaksApplicationSecurity;
	}

	async resetPage() {
		this.resultData = null;
		this.imgBase64 = null;
		this.displayImage = null;
	}

	ngOnDestroy(): void {
		this.subscriptions$.forEach(sub => sub.unsubscribe());
	}

}
