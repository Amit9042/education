import { ClassJoinStat } from '@sharedModule/constants';

export interface ClassChannelModel {
    status: ClassJoinStat;
    channel_name: string;
    reference_id: string;
    meeting_token: string;
    class_uuid: string;
}

export interface ProviderChannelModel {
    channel_name: string;
    meeting_token: string;
    class_uuid: string;
}
