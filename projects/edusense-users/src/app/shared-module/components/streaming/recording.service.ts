import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as CanvasRecorder from 'recordrtc';
import { saveFile } from '@sharedModule/functions';

@Injectable({
    providedIn: 'root'
})
export class RecordingService {
    private recorder;
    private stream;

    startRecording() {
        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true
            })
            .then(async (stream) => {
                this.stream = stream;
                this.recorder = RecordRTC(stream, {
                    type: 'video'
                });
                this.recorder.startRecording();
            });
    }

    stopRecording() {
        this.recorder.stopRecording(() => {
            this.stream.getTracks().forEach((track) => track.stop());
            const blob = this.recorder.getBlob();
            const fileName = `${new Date().toLocaleString()}_recording.mp4`;
            saveFile(blob, fileName);
        });
    }

    startCanvasRecording() {
        const htmlElement = document.getElementById('streaming_container');
        this.recorder = new CanvasRecorder(htmlElement, {
            disableLogs: true,
            useWhammyRecorder: true
        });
        this.recorder.record();
    }

    stopCanvasRecording() {
        this.recorder.stop((blob) => {});
    }
}
