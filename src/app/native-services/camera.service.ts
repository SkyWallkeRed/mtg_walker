import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Injectable()
export class CameraService {
	options: CameraOptions = {
		quality: 100,
		correctOrientation: false,
		destinationType: this.camera.DestinationType.FILE_URI,
		encodingType: this.camera.EncodingType.JPEG,
		mediaType: this.camera.MediaType.PICTURE
	};

	constructor(private camera: Camera) {
	}

	async takePicture() {
		return new Promise((resolve, reject) => {
			this.camera.getPicture(this.options).then((imageData) => {
				// imageData is either a base64 encoded string or a file URI
				// If it's base64 (DATA_URL):
				let base64Image = imageData;
				console.log(base64Image);
				if (!base64Image) {
					reject(null);
				}
				resolve(base64Image);

			}, (err) => {
				// Handle error
			});
		}).catch((err) => {
			console.log(err);
		});
	}

}
