import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
    ElementRef,
    ViewChild,
    OnChanges,
    AfterViewInit,
    DoCheck
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormBaseComponent } from '../../form-base/form-base.component';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends FormBaseComponent
    implements OnInit, AfterViewInit, DoCheck {
    // Angular variables
    @ViewChild('scrollMe', { static: true })
    private myScrollContainer: ElementRef;

    // Form Group Variable
    chatFormGroup: FormGroup;

    // Data variables
    @Input() messagesArray = [];

    oldMsgLength = 0;
    // Angular variables
    @Output() clickEvent = new EventEmitter<boolean>();
    @Output() sendMsg = new EventEmitter<string>();

    constructor(fb: FormBuilder) {
        super(fb);
    }

    ngOnInit(): void {
        this.createResetPassworForm();
        this.oldMsgLength = this.messagesArray.length;
    }

    ngAfterViewInit() {
        this.scrollToBottom();
    }

    ngDoCheck(): void {
        if (this.oldMsgLength < this.messagesArray.length) {
            this.oldMsgLength = this.messagesArray.length;
            setTimeout(() => {
                this.scrollToBottom();
            }, 100);
        }
    }

    createResetPassworForm = () => {
        this.chatFormGroup = this.createForm({
            msg: ['', Validators.required]
        });
    };

    onSendMsg = (form: FormGroup) => {
        let msg = form.value.msg;
        msg = msg.replace(/^\s+|\s+$/g, '');

        if (this.onSubmit(form) && msg) {
            this.sendMsg.emit(msg);
            this.createResetPassworForm();
            this.scrollToBottom();
        }
    };

    onCloseChat() {
        this.clickEvent.emit(true);
    }

    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scroll({
            top: this.myScrollContainer.nativeElement.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }
}
