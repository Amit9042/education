export interface ParentClasses {
    parent_class_id: number;
    provider_id: number;
    class_name: string;
    grade_id: number;
    grade_master: GradeMaster;
    is_active: boolean;
}
interface GradeMaster {
    name: string;
    alias: string;
}
