import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class LoaderService {
	constructor(private loadingController: LoadingController) {
	}

	async presentLoading(text: string) {
		const loading = await this.loadingController.create({
			cssClass: 'my-custom-class',
			message: text
		});
		await loading.present();
	}

	async dismissAll() {
		await this.loadingController.dismiss();
	}

	async presentLoadingWithOptions() {
		const loading = await this.loadingController.create({
			cssClass: 'my-custom-class',
			spinner: null,
			duration: 5000,
			message: 'Click the backdrop to dismiss early...',
			translucent: true,
			// cssClass: 'custom-class custom-loading',
			backdropDismiss: true
		});
		await loading.present();

		const {role, data} = await loading.onDidDismiss();
		console.log('Loading dismissed with role:', role);
	}
}
