import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanCardPageRoutingModule } from './scan-card-routing.module';

import { ScanCardPage } from './scan-card.page';
import { TesseractService } from '../../services/tesseract.service';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { CameraService } from '../../native-services/camera.service';
import { FileSystemService } from '../../native-services/file-system.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { LoaderService } from '../../services/loader.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ScanCardPageRoutingModule
	],
	providers: [
		WebView,
		TesseractService,
		Camera,
		CameraService,
		File,
		FileSystemService,
		LoaderService
	],
	declarations: [ScanCardPage]
})
export class ScanCardPageModule {
}
