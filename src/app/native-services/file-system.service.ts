import { Injectable } from '@angular/core';
import { DirectoryEntry, File } from '@ionic-native/file/ngx';

@Injectable()
export class FileSystemService {

	constructor(private file: File) {
		setTimeout(async () => {
			await this.file.checkDir(this.file.dataDirectory, 'mtg-walker').then((_) => console.log('Directory exists')).catch(async (err) => {
				console.log('Directory doesnt exist');
				if (err) {
					await this.file.createDir(this.file.dataDirectory, 'mtg-walker', false);
				}
			});
		}, 0);
	}


	async saveFile(tempImage) {

		console.log('tempImage', tempImage);
		// Extract just the filename. Result example: cdv_photo_003.jpg
		const tempFilename = tempImage.substr(tempImage.lastIndexOf('/') + 1);

// Now, the opposite. Extract the full path, minus filename.
// Result example: file:///var/mobile/Containers/Data/Application
// /E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/tmp/
		const tempBaseFilesystemPath = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);

// Get the Data directory on the device.
// Result example: file:///var/mobile/Containers/Data/Application
// /E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/Library/NoCloud/
		const newBaseFilesystemPath = this.file.dataDirectory;

		await this.file.copyFile(tempBaseFilesystemPath, tempFilename,
				newBaseFilesystemPath, tempFilename);

// Result example: file:///var/mobile/Containers/Data/Application
// /E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/Library/NoCloud/cdv_photo_003.jpg
		const storedPhoto = newBaseFilesystemPath + tempFilename;
		console.log('storedPhoto', storedPhoto);
		return {
			path: storedPhoto,
			tmpName: tempFilename
		};
	}

	async fileToHttpRenderableUrl(tempImage): Promise<{ path: string, tmpName: string }> {

		const tempFilename = tempImage.substr(tempImage.lastIndexOf('/') + 1);
		const tempBaseFilesystemPath = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);

		const newBaseFilesystemPath = this.file.dataDirectory;

		await this.file.copyFile(tempBaseFilesystemPath, tempFilename,
				newBaseFilesystemPath, tempFilename);

		return {
			path: newBaseFilesystemPath + tempFilename,
			tmpName: tempFilename
		};
	}

	async fileLocalUrlToBuffer(filename: string): Promise<ArrayBuffer> {
		const buffer = await this.file.readAsArrayBuffer(this.file.dataDirectory, filename);
		console.log(buffer);
		return buffer;
	}

	async filePathToBase64(filename: string) {
		return await this.file.readAsDataURL(this.file.dataDirectory, filename);
	}
}
