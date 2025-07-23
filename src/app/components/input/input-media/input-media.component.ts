import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResponsiveMobileService } from 'src/app/services/ResponsiveMobile/responsive-mobile.service';
import { AlertService } from '../../alert/alertservice';
import { IconModule } from '../../icon/icon.module';
import { FilePicker } from '@capawesome/capacitor-file-picker';


interface UploadProgress {
    file: File;
    progress: number;
    base64: string;
    size: string;
}

export type InputImageEmpty = {
	title: string;
	description: string;
};

@Component({
    selector: 'app-input-media',
    templateUrl: './input-media.component.html',
    styleUrls: ['./input-media.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IconModule
    ],
})
export class InputMediaComponent implements OnInit {
    @Input()
    sourceImage: string[] = [];
    @Output()
    setImage = new EventEmitter<string[]>();
  
    @Input()
	label: string = '';
  
	@Input()
	labelInfo: string = '';
  
	@Input()
	labelOptional: string = '';

    @Input()
	helper: string = '';

	@Input()
	helperInfo: string = '';

	@Input()
	error: boolean = false;
	
    @Input()
	shortMedia: boolean = false;

    @Input()
    bgWhite: boolean = false;

    @Input()
    bgGrey: boolean = false;

    @Input()
    isDisabled: boolean = false;

    @Input()
	empty: InputImageEmpty = {
		title: '',
		description: '',
	};


    @Input() maxImages = 5;
    @Input() maxFileSize = 2 * 1024 * 1024;

    uploadQueue: UploadProgress[] = [];
    completedUpload: number = 0;

    get totalUploads(): number {
        return this.uploadQueue.length;
    }

    get uploadProgress(): string {
        return `${this.completedUpload} dari ${this.totalUploads} file berhasil diunggah`;
    }

    constructor(
        public responsiveNativeSrs: ResponsiveMobileService,
        private toastSrs: AlertService
    ) {}

    ngOnInit() {}

    //#region NATIVE FN
    async pickNativeMultipleImages() {
        try {
            const result = await FilePicker.pickImages({
                readData: true,
                limit: 0,
            });
    
            // Check if adding new files would exceed the limit
            if (this.sourceImage.length + result.files.length > this.maxImages) {
                this.toastSrs.show({
                    color: 'error',
                    variant: 'simple',
                    duration: 4000,
                    position: 'top-right',
                    title: 'Total Images Exceeded',
                    message:
                    `Cannot add more than ${this.maxImages} images`, // required for secondary
                })
                return;
            }
    
            // Process each selected image
            for (const image of result.files) {
                // Validate file size
                if (image.size && image.size > this.maxFileSize) {
                    this.toastSrs.show({
                        color: 'error',
                        variant: 'simple',
                        duration: 4000,
                        position: 'top-right',
                        title: 'Maximal Size Exceeded',
                        message:
                        `File ${image.name} exceeds size limit of ${this.formatFileSize(this.maxFileSize)}`, // required for secondary
                    })
                    continue;
                }
    
                // Create File object from base64
                const byteString = atob(image.data!);
                const arrayBuffer = new ArrayBuffer(byteString.length);
                const int8Array = new Uint8Array(arrayBuffer);
                for (let i = 0; i < byteString.length; i++) {
                    int8Array[i] = byteString.charCodeAt(i);
                }
                const file = new File([int8Array], image.name, { type: image.mimeType });
    
                // Check for duplicates
                const base64Data = `data:${image.mimeType};base64,${image.data}`;
                const isDuplicate = this.sourceImage.some(existingImage => existingImage === base64Data);
                const isDuplicateByMeta = this.uploadQueue.some(upload => 
                    upload.file.name === image.name && 
                    upload.file.size === image.size
                );
    
                if (!isDuplicate && !isDuplicateByMeta) {
                    // Add to upload queue
                    const upload: UploadProgress = {
                        file,
                        progress: 0,
                        base64: base64Data,
                        size: this.formatFileSize(file.size)
                    };
                    this.uploadQueue.push(upload);
                } else {
                    this.toastSrs.show({
                        color: 'info',
                        variant: 'simple',
                        duration: 4000,
                        position: 'top-right',
                        title: `Duplicate image`,
                        message:
                        `Duplicate image "${image.name}" skipped`, // required for secondary
                    })
                }
            }
    
            // Process the upload queue
            if (this.uploadQueue.length > 0) this.processNativeNextImage();

        } catch (error) {
            this.toastSrs.show({
                color: 'error',
                variant: 'simple',
                duration: 4000,
                position: 'top-right',
                title: 'Input Image',
                message:
                `Inputing Image error`, // required for secondary
            })
        }
    }

    private processNativeNextImage() {
        const currentUpload = this.uploadQueue.find(u => u.progress === 0);
        if (!currentUpload) return;
    
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            currentUpload.progress = progress;
    
            if (progress >= 100) {
                clearInterval(interval);
                // Add to sourceImage when upload is complete
                if (!this.sourceImage.includes(currentUpload.base64)) {
                    this.sourceImage.push(currentUpload.base64);
                    this.setImage.emit(this.sourceImage);
                }
                this.completedUpload++;
    
                // Process next image if any
                const nextUnprocessed = this.uploadQueue.find(u => u.progress === 0);
                if (nextUnprocessed) {
                    setTimeout(() => {
                        this.processNativeNextImage();
                    }, 500);
                }
            }
        }, 100); // Adjust timing as needed
    }
    //#endregion



    //#region DRAG AND DROP FN
    handleInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target && target.files) this.handleFiles(target.files);
    }

    private handleFiles(files: FileList | null) {
        if (!files) return;

        // Check if adding new files would exceed the limit
        if (this.sourceImage.length + files.length > this.maxImages) {
          
            this.toastSrs.show({
                color: 'error',
                variant: 'simple',
                duration: 4000,
                position: 'top-right',
                title: 'Total Size Exceeded',
                message:
                `Cannot add more than ${this.maxImages} images`, // required for secondary
            })
            return;
        }
    
        // Convert FileList to array and filter for unique files
        const newFiles = Array.from(files).filter(file => {
            // Check file size
            if (file.size > this.maxFileSize) {
                this.toastSrs.show({
                    color: 'error',
                    variant: 'simple',
                    duration: 4000,
                    position: 'top-right',
                    title: 'Maximal Size Exceeded',
                    message:
                    `File ${file.name} exceeds size limit of ${this.formatFileSize(this.maxFileSize)}`, // required for secondary
                })
                return false;
            }
            
            // Check for duplicates
            return !this.uploadQueue.some(upload => 
                upload.file.name === file.name && 
                upload.file.size === file.size
            );
        })
    
        newFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                const upload: UploadProgress = {
                    file,
                    progress: 0,
                    base64: '',
                    size: this.formatFileSize(file.size)
                };
                this.uploadQueue.push(upload);
            }
        });
    
        // Only start processing if not already processing
        if (this.uploadQueue.some(u => u.progress === 0)) this.processNextImage();
    }

    // Add getter for max file size in readable format
    get maxFileSizeFormatted(): string {
        return this.formatFileSize(this.maxFileSize);
    }

    // Add getter for remaining slots
    get remainingSlots(): number {
        return this.maxImages - this.sourceImage.length;
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    private processNextImage() {
        const currentUpload = this.uploadQueue.find(u => u.progress === 0);
        if (!currentUpload) return;

        const reader = new FileReader();

        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                const progress = Math.round((e.loaded / e.total) * 100);
                currentUpload.progress = progress;
            }
        };

        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
                currentUpload.base64 = result;
                currentUpload.progress = 100;
            
            // Only add to sourceImage if it's not already there
            if (!this.sourceImage.includes(result)) {
                this.sourceImage.push(result);
                this.setImage.emit(this.sourceImage);
            }

            this.completedUpload++;

            // Find next unprocessed image
            const nextUnprocessed = this.uploadQueue.find(u => u.progress === 0);

            if (nextUnprocessed) {
                setTimeout(() => {
                    this.processNextImage();
                }, 500);
            }
            }
        };

        reader.readAsDataURL(currentUpload.file);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer?.files;

        if (files) this.handleFiles(files);

      
        
    }
    //#endregion

    
    writeValue(value: string[] | null): void {
        if (value === null) {
            this.sourceImage = [];
        } else if (Array.isArray(value)) {
            
            this.sourceImage = value;
            
            this.setImage.emit(this.sourceImage);
        }
        // this.onChange(this.sourceImage);
    }

    removeImg(index: number) {
        this.sourceImage.splice(index, 1);
        this.uploadQueue.splice(index, 1);
        this.completedUpload--;
        this.writeValue(this.sourceImage);
    }

	remove(index?: number): void {
        if (typeof index === 'number') {
            // Remove specific image
            const newImages = this.sourceImage.filter((_, i) => i !== index);
            this.writeValue(newImages);
        } else {
            // Remove all images
            this.writeValue([]);
        }
    }
}
