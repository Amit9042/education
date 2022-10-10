import { Grade } from '@sharedModule/models/grade.model';
import { Timezone } from '@sharedModule/models/timezone.model';

export interface StudentClasses {
    class_id: number;
    created_at: string;
    name: string;
    class_details: {
        name: string;
        provider_id: number;
        start_time: string;
        end_time: string;
        timezone_id: number;
        session_details: {
            session_running_status: number;
        };
        grade: {
            grade_id: number;
            grade_master: {
                name: string;
                alias: string;
            };
        }[];
        timezone: Timezone;
        provider_detail: {
            provider_id: number;
            name: string;
            logo_thumbnail: string;
        };
    };
}
